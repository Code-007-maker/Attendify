import { db } from "../config/db.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { sendTeacherWelcomeEmail } from "../config/email.js";

export const adminLogin = (req, res) => {
  const { email, password  } = req.body;
  const query = "SELECT * FROM admin WHERE email = ?";
  db.query(query, [email], async (err, results) => {
    if (err) return res.status(500).json({ message: "Database error" });
    if (results.length === 0) return res.status(404).json({ message: "Admin not found" });

    const admin = results[0];
    const isMatch = (password === admin.password);
    if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });

    const token = jwt.sign({ id: admin.id, role: "admin" }, process.env.JWT_SECRET, { expiresIn: "1d" });
    res.json({ message: "Login successful",
      token,
      admin: { id: admin.id, name: admin.name, email: admin.email , class_id: admin.class_id},});
  });
};

export const addTeacher = async (req, res) => {
  try {
    const { name, email, subject, className, section } = req.body;

    if (!name || !email || !subject || !className || !section) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const classQuery = "SELECT id FROM class WHERE name = ? AND section = ?";
    db.query(classQuery, [className, section], async (err, classResult) => {
      if (err) return res.status(500).json({ message: "Database error" });
      if (classResult.length === 0)
        return res.status(404).json({ message: "Class not found" });

      const class_id = classResult[0].id;

      const randomPassword = crypto.randomBytes(5).toString("hex");
      const hashedPassword = await bcrypt.hash(randomPassword, 10);

      const insertTeacherQuery =
        "INSERT INTO teacher (name, email, password, subject, class_id) VALUES (?, ?, ?, ?, ?)";
      db.query(
        insertTeacherQuery,
        [name, email, hashedPassword, subject, class_id],
        (insertErr, insertResult) => {
          if (insertErr) {
            console.error(insertErr);
            return res.status(500).json({ message: "Error adding teacher" });
          }

          const teacher_id = insertResult.insertId; 

          const insertSubjectQuery =
            "INSERT INTO subject (name, class_id, teacher_id) VALUES (?, ?, ?)";
          db.query(
            insertSubjectQuery,
            [subject, class_id, teacher_id],
            async (subErr) => {
              if (subErr) {
                console.error(subErr);
                return res
                  .status(500)
                  .json({ message: "Error adding subject entry" });
              }

              try {
                await sendTeacherWelcomeEmail(email, name, randomPassword);
                return res.json({
                  message: "✅ Teacher added successfully and email sent!",
                });
              } catch (mailErr) {
                console.error(mailErr);
                return res.status(200).json({
                  message: "Teacher added, but failed to send email.",
                });
              }
            }
          );
        }
      );
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};
export const addMoreTeacherSubject = async (req, res) => {
  try {
    const { name, email, subject, className, section } = req.body;

    if (!name || !email || !subject || !className || !section) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const classQuery = "SELECT id FROM class WHERE name = ? AND section = ?";
    db.query(classQuery, [className, section], async (err, classResult) => {
      if (err) return res.status(500).json({ message: "Database error" });
      if (classResult.length === 0)
        return res.status(404).json({ message: "Class not found" });

      const class_id = classResult[0].id;

      const randomPassword = crypto.randomBytes(5).toString("hex");
      const hashedPassword = await bcrypt.hash(randomPassword, 10);

      const insertTeacherQuery =
        "INSERT INTO teacher (name, email, password, subject, class_id) VALUES (?, ?, ?, ?, ?)";
      db.query(
        insertTeacherQuery,
        [name, email, hashedPassword, subject, class_id],
        (insertErr, insertResult) => {
          if (insertErr) {
            console.error(insertErr);
            return res.status(500).json({ message: "Error adding teacher" });
          }

          const teacher_id = insertResult.insertId; 

          const insertSubjectQuery =
            "INSERT INTO subject (name, class_id, teacher_id) VALUES (?, ?, ?)";
          db.query(
            insertSubjectQuery,
            [subject, class_id, teacher_id],
            async (subErr) => {
              if (subErr) {
                console.error(subErr);
                return res
                  .status(500)
                  .json({ message: "Error adding subject entry" });
              }
              return res.status(200).json({
                  message: "Teacher added.",
                });
            }
          );
        }
      );
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};

export const addStudent = (req,res)=>{
   const { name, roll_no, class_id } = req.body;
   if(!name && !roll_no && !class_id){
     res.status(400).json({message: "All fields are required"})
   }
  
      const iq = "INSERT INTO student (name , roll_no , class_id) VALUES (? ,? ,? )";
      db.query(iq , [name , roll_no , class_id] , (err , res1)=>{
          if(err) {res.status(500).json({message: "Error in inserting student"})
          console.error(err)}
           res.json({message: "Student added successfully!!"});
      }) 
}

export const getTeacherList = (req,res)=>{
     const q ="SELECT email, ANY_VALUE(name) AS name, MIN(id) AS id FROM teacher GROUP BY email"
     db.query(q , (err , result)=>{
      if(err) res.status(500).json({message: "getTeacherList Error"});
      res.json(result);
     })
}

export const getClassList = (req, res) => {
  const q = `
    SELECT 
      c.id,
      c.name,
      c.section,
      COUNT(s.id) AS count_student
    FROM class c
    LEFT JOIN student s ON s.class_id = c.id
    GROUP BY c.id, c.name, c.section
  `;
  db.query(q, (err, result) => {
    if (err) return res.status(500).json({ message: "getClassList Error" });
    res.json(result);
  });
};

export const getTeacher = (req, res) => {
  const { email } = req.body;

  const q = `
    SELECT t.id, t.name, t.subject,t.email, c.name AS class_name, c.section FROM teacher t JOIN class c ON t.class_id = c.id WHERE t.email = ?
  `;

  db.query(q, [email], (err, result) => {
    if (err) return res.status(500).json({ message: "getTeacher Error" });

    // group by teacher
    if (result.length === 0) return res.json([]);
    const teacher = {
      id: result[0].id,
      name: result[0].name,
      email: result[0].email,
      classes: result.map((r) => ({
        id: r.id,
        subject: r.subject,
        class_name: r.class_name,
        section: r.section,
      })),
    };

    res.json(teacher);
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

    // Format response neatly
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

export const addClass = (req, res) => {
  const { className, section } = req.body;

  if (!className || !section) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const q = "INSERT INTO class (name, section) VALUES (?, ?)";
  db.query(q, [className, section], (err, result) => {
    if (err) {
      console.error("Error inserting class:", err);
      return res.status(500).json({ message: "Error inserting class" });
    }
    res.json({ message: "Class added successfully!" });
  });
};

export const updateStudent = (req, res) => {
  const { id, name, roll_no, className, section } = req.body;

  if (!id || !name || !roll_no || !className || !section) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const q = "SELECT id FROM class WHERE name = ? AND section = ?";
  db.query(q, [className, section], (err, classRes) => {
    if (err) return res.status(500).json({ message: "Database Error" });
    if (classRes.length === 0)
      return res.status(404).json({ message: "Class not found" });

    const class_id = classRes[0].id;
    const iq =
      "UPDATE student SET name = ?, roll_no = ?, class_id = ? WHERE id = ?";
    db.query(iq, [name, roll_no, class_id, id], (err, result) => {
      if (err) {
        console.error("Error updating student:", err);
        return res.status(500).json({ message: "Error updating student" });
      }
      res.json({ message: "Student updated successfully!" });
    });
  });
};

export const updateTeacher = (req, res) => {
  const { id, name, email, subject, className, section } = req.body;

  if (!id || !subject || !className || !section) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const q = "SELECT id FROM class WHERE name = ? AND section = ?";
  db.query(q, [className, section], (err, classRes) => {
    if (err) return res.status(500).json({ message: "Database Error" });
    if (classRes.length === 0)
      return res.status(404).json({ message: "Class not found" });

    const class_id = classRes[0].id;
    const iq =
      "UPDATE teacher SET subject = ?, class_id = ? WHERE id = ?";
    db.query(iq, [subject, class_id, id], (err, result) => {
      if (err) {
        console.error("Error updating teacher:", err);
        return res.status(500).json({ message: "Error updating teacher" });
      }
      res.json({ message: "Teacher updated successfully!" });
    });
  });
};

export const deleteStudent = (req, res) => {
  const { id } = req.body;
  if (!id) return res.status(400).json({ message: "Student ID required" });

  const q = "DELETE FROM student WHERE id = ?";
  db.query(q, [id], (err, result) => {
    if (err) return res.status(500).json({ message: "Database Error" });
    res.json({ message: "Student deleted successfully!" });
  });
};

export const deleteTeacher = (req, res) => {
  const { id } = req.body;
  if (!id) return res.status(400).json({ message: "Teacher ID required" });

  const q1 = "DELETE FROM subject WHERE teacher_id = ?";
  db.query(q1, [id], (err) => {
    if (err) return res.status(500).json({ message: "Error deleting related subjects" });

    const q2 = "DELETE FROM teacher WHERE id = ?";
    db.query(q2, [id], (err2) => {
      if (err2) return res.status(500).json({ message: "Error deleting teacher" });
      res.json({ message: "Teacher and related subjects deleted successfully!" });
    });
  });
};


/**
 * 4️⃣ Get attendance records added by a specific teacher
 * req.body = { teacher_id }
 */
export const getTeacherAttendance = (req, res) => {
  const { teacher_id } = req.body;
  if (!teacher_id) return res.status(400).json({ message: "teacher_id required" });

  const q = `
    SELECT 
      a.date,
      c.name AS class_name,
      c.section,
      subj.name AS subject_name,
      COUNT(a.id) AS total_students,
      SUM(CASE WHEN a.status = 'Present' THEN 1 ELSE 0 END) AS present_count
    FROM attendance a
    JOIN class c ON c.id = a.class_id
    JOIN subject subj ON subj.id = a.subject_id
    WHERE a.teacher_id = ?
    GROUP BY a.date, c.name, c.section, subj.name
    ORDER BY a.date DESC
  `;

  db.query(q, [teacher_id], (err, result) => {
    if (err) return res.status(500).json({ message: "getTeacherAttendance Error", error: err });
    res.json(result);
  });
};