import { db } from "../config/db.js";

import jwt from "jsonwebtoken";

export const studentLogin = (req, res) => {
  const { id, name, roll_no } = req.body;

  if (!id || !name || !roll_no)
    return res.status(400).json({ message: "All fields are required" });

  const query = "SELECT * FROM student WHERE id = ?";
  db.query(query, [id], (err, results) => {
    if (err) return res.status(500).json({ message: "Database error" });
    if (results.length === 0) return res.status(404).json({ message: "Student not found" });

    const student = results[0];
    const isMatch = (name === student.name) && (roll_no === student.roll_no);
    if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });

    const secret = process.env.JWT_SECRET || "default_secret";

    const token = jwt.sign(
      { id: student.id, role: "student" },
      secret,
      { expiresIn: "1d" }
    );

    res.json({
      message: "Login successful",
      token,
      student: {
        id: student.id,
        name: student.name,
        roll_no: student.roll_no,
        class_id: student.class_id
      }
    });
  });
};


export const getStudentProfile = (req, res) => {
  const { student_id } = req.body;
  if (!student_id)
    return res.status(400).json({ message: "student_id required" });

  const q = `
    SELECT s.id, s.name, s.roll_no, c.name AS class_name, c.section
    FROM student s
    JOIN class c ON c.id = s.class_id
    WHERE s.id = ?
  `;

  db.query(q, [student_id], (err, result) => {
    if (err)
      return res.status(500).json({ message: "Database error", error: err });

    if (result.length === 0)
      return res.status(404).json({ message: "Student not found" });

    res.json(result[0]);
  });
};

// 2️⃣ Get student attendance for all subjects (summary)
export const getStudentAttendanceSummary = (req, res) => {
  const { student_id } = req.body;
  if (!student_id)
    return res.status(400).json({ message: "student_id required" });

  const q = `
    SELECT subj.name AS subject_name,
           COUNT(a.id) AS total_classes,
           SUM(CASE WHEN a.status='Present' THEN 1 ELSE 0 END) AS present_count,
           ROUND(SUM(CASE WHEN a.status='Present' THEN 1 ELSE 0 END)/COUNT(a.id)*100,2) AS attendance_percentage
    FROM attendance a
    JOIN subject subj ON subj.id = a.subject_id
    WHERE a.student_id = ?
    GROUP BY a.subject_id
  `;

  db.query(q, [student_id], (err, result) => {
    if (err)
      return res.status(500).json({ message: "Database error", error: err });

    res.json(result);
  });
};

