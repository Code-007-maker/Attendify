import { db } from "../config/db.js";

/**
 * 1️⃣ Mark Attendance (called by teacher)
 * req.body = { class_id, subject_id, teacher_id, date, attendance: [{student_id, status}, ...] }
 */
export const markAttendance = (req, res) => {
  const { class_id, subject_id, teacher_id, date, attendance } = req.body;

  if (!class_id || !subject_id || !teacher_id || !date || !attendance) {
    return res.status(400).json({ message: "All fields are required" });
  }

  // Format date to YYYY-MM-DD if needed
  const formattedDate = new Date(date).toISOString().split('T')[0];

  // First, check if attendance already exists for this date
  const checkQuery = `
    SELECT COUNT(*) as count 
    FROM attendance 
    WHERE class_id = ? AND subject_id = ? AND date = ?
  `;

  db.query(checkQuery, [class_id, subject_id, formattedDate], (err, result) => {
    if (err) return res.status(500).json({ message: "Database Error", error: err });

    if (result[0].count > 0) {
      // Update existing attendance
      const updatePromises = attendance.map((a) => {
        return new Promise((resolve, reject) => {
          const updateQuery = `
            UPDATE attendance 
            SET status = ?, teacher_id = ?
            WHERE student_id = ? AND class_id = ? AND subject_id = ? AND date = ?
          `;
          db.query(
            updateQuery,
            [a.status, teacher_id, a.student_id, class_id, subject_id, formattedDate],
            (err, result) => {
              if (err) reject(err);
              else resolve(result);
            }
          );
        });
      });

      Promise.all(updatePromises)
        .then(() => res.json({ message: "Attendance updated successfully!" }))
        .catch((err) => res.status(500).json({ message: "Update Error", error: err }));
    } else {
      // Insert new attendance records
      const insertQuery =
        "INSERT INTO attendance (student_id, teacher_id, class_id, subject_id, date, status) VALUES ?";
      const values = attendance.map((a) => [
        a.student_id,
        teacher_id,
        class_id,
        subject_id,
        formattedDate,
        a.status,
      ]);

      db.query(insertQuery, [values], (err) => {
        if (err) return res.status(500).json({ message: "Database Error", error: err });
        res.json({ message: "Attendance marked successfully!" });
      });
    }
  });
};


export const getClassAttendance = (req, res) => {
  const { class_id, date , subject_id } = req.body;

  if (!class_id || !date || !subject_id)
    return res.status(400).json({ message: "class_id , date and subject_id are required" });

  const q = `
    SELECT 
      s.id AS student_id,
      s.name AS student_name,
      a.status
    FROM attendance a
    JOIN student s ON s.id = a.student_id
    WHERE a.class_id = ? AND a.date = ? AND a.subject_id = ?
  `;

  db.query(q, [class_id, date , subject_id], (err, result) => {
    if (err) return res.status(500).json({ message: "getClassAttendance Error", error: err });
    res.json(result);
  });
};



export const getAttendanceSheet = (req, res) => {
  const { class_id, subject_id, start_date, end_date } = req.body;

  if (!class_id || !subject_id || !start_date || !end_date) {
    return res
      .status(400)
      .json({ message: "class_id, subject_id, start_date, and end_date are required" });
  }

  const q = `
    SELECT 
      s.roll_no,
      s.name AS student_name,
      a.date,
      a.status
    FROM attendance a
    JOIN student s ON s.id = a.student_id
    WHERE a.class_id = ?
      AND a.subject_id = ?
      AND a.date BETWEEN ? AND ?
    ORDER BY s.roll_no, a.date
  `;

  db.query(q, [class_id, subject_id, start_date, end_date], (err, result) => {
    if (err) {
      console.error(err);
      return res
        .status(500)
        .json({ message: "getAttendanceSheet Error", error: err });
    }

    if (result.length === 0)
      return res.status(404).json({ message: "No attendance found for this range" });

    // 🧠 Transform raw rows into a structured table format
    const attendanceMap = {};

    result.forEach((row) => {
      if (!attendanceMap[row.roll_no]) {
        attendanceMap[row.roll_no] = {
          roll_no: row.roll_no,
          student_name: row.student_name,
          attendance: {}
        };
      }
      attendanceMap[row.roll_no].attendance[row.date] = row.status;
    });

    const formattedData = Object.values(attendanceMap);

    res.json(formattedData);
  });
};
