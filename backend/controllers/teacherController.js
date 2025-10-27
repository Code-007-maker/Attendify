import { db } from "../config/db.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const teacherLogin = (req, res) => {
  const { email, password } = req.body;
  const query = "SELECT * FROM teacher WHERE email = ?";

  db.query(query, [email], async (err, results) => {
    if (err) return res.status(500).json({ message: "Database error" });
    if (results.length === 0)
      return res.status(404).json({ message: "Teacher not found" });

    const teacher = results[0];
    const isMatch = await bcrypt.compare(password, teacher.password);

    if (!isMatch)
      return res.status(401).json({ message: "Invalid credentials" });

    const secret = process.env.JWT_SECRET || "default_secret";
    const token = jwt.sign(
      { id: teacher.id, email: teacher.email, role: "teacher" },
      secret,
      { expiresIn: "1d" }
    );

    return res.json({
      message: "Login successful",
      token,
      teacher: { id: teacher.id, name: teacher.name, email: teacher.email , class_id: teacher.class_id},
    });
  });
};

export const checkPass = (req, res) => {
  const { email, password } = req.body;
  const query = "SELECT * FROM teacher WHERE email = ?";

  db.query(query, [email], async (err, results) => {
    if (err) return res.status(500).json({ message: "Database error" });
    if (results.length === 0)
      return res.status(404).json({ message: "Teacher not found" });

    const teacher = results[0];
    const isMatch = await bcrypt.compare(password, teacher.password);

    if (!isMatch)
      return res.status(401).json({ message: "Invalid credentials" });

    return res.json({ message: "Password is correct" });
  });
};

export const updateTeacherPass = (req, res) => {
  const { email, newPassword } = req.body;
  if (!email || !newPassword)
    return res.status(400).json({ message: "All fields are required" });

  const hashed = bcrypt.hashSync(newPassword, 10);
  const q = "UPDATE teacher SET password = ? WHERE email = ?";

  db.query(q, [hashed, email], (err, result) => {
    if (err)
      return res
        .status(500)
        .json({ message: "Error updating teacher password" });

    return res.json({ message: "Password updated successfully!" });
  });
};

export const getTeacherClasses = (req, res) => {
  const { teacher_email } = req.body;

  if (!teacher_email) {
    return res.status(400).json({ message: "teacher_email is required" });
  }

  const q = `
    SELECT 
  c.id AS class_id,
  c.name AS class_name,
  c.section AS section,
  sub.id AS subject_id,
  sub.name AS subject_name,
  COUNT(st.id) AS total_students
FROM subject sub
INNER JOIN class c ON sub.class_id = c.id
INNER JOIN teacher t ON sub.teacher_id = t.id
LEFT JOIN student st ON st.class_id = c.id
WHERE t.email = ?
GROUP BY c.id, c.name, c.section, sub.id, sub.name
ORDER BY c.name, sub.name
  `;

  db.query(q, [teacher_email], (err, result) => {
    if (err) {
      console.error("getTeacherClasses Error:", err);
      return res.status(500).json({ message: "getTeacherClasses Error", error: err });
    }

    if (result.length === 0) {
      return res.status(404).json({ message: "No classes found for this teacher" });
    }

    res.json(result);
  });
};

export const getStudentList = (req , res)=>{
  const {class_id} = req.body;
  const q = `SELECT id, roll_no , name FROM student WHERE class_id = ?`;
  db.query(q, [class_id], (err, result) => {
    if (err) return res.status(500).json({ message: "getStudentList Error" });
    res.json(result);
  });
}

export const getStudent = (req, res) => {
  const { student_id } = req.body;

  const q = `
    SELECT 
      s.id AS student_id,
      s.name AS student_name,
      s.roll_no,
      c.name AS class_name,
      c.section,
      sub.name AS subject_name,
      ROUND((SUM(a.status = 'Present') / COUNT(a.id)) * 100, 2) AS attendance_percentage
    FROM student s
    JOIN class c ON s.class_id = c.id
    JOIN attendance a ON a.student_id = s.id
    JOIN subject sub ON a.subject_id = sub.id
    WHERE s.id = ?
    GROUP BY s.id, sub.id;
  `;

  db.query(q, [student_id], (err, result) => {
    if (err) return res.status(500).json({ message: "getStudent Error" });

    if (result.length === 0) return res.status(404).json({ message: "Student not found" });

    const studentInfo = {
      student_id: result[0].student_id,
      name: result[0].student_name,
      roll_no: result[0].roll_no,
      class: `${result[0].class_name}-${result[0].section}`,
      subjects: result.map(r => ({
        subject: r.subject_name,
        attendance_percentage: r.attendance_percentage
      }))
    };

    res.json(studentInfo);
  });
};