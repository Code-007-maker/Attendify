import express from "express";
import { adminLogin, addTeacher, addStudent, getTeacherList, getClassList, getTeacher, updateTeacher, updateStudent, deleteStudent, deleteTeacher, addClass, getStudentList, getStudent, addMoreTeacherSubject } from "../controllers/adminController.js";
const router = express.Router();

router.post("/login", adminLogin);
router.post("/add-teacher", addTeacher);
router.post("/add-student" , addStudent);
router.get("/teacher-list" , getTeacherList);
router.get("/class-list" , getClassList);
router.post("/get-teacher" , getTeacher);
router.post("/update/teacher" , updateTeacher);
router.post("/update/student" , updateStudent);
router.post("/delete/student" , deleteStudent);
router.post("/delete/teacher" , deleteTeacher);
router.post("/add-class" , addClass);
router.post("/student-list" , getStudentList);
router.post("/student" , getStudent);
router.post("/add-more-teacher-subject" , addMoreTeacherSubject);
export default router;
