import express from 'express'
import { checkPass, getStudent, getStudentList, getTeacherClasses, teacherLogin, updateTeacherPass } from '../controllers/teacherController.js';
const router = express.Router();


router.post("/login", teacherLogin);
router.post("/check-pass", checkPass);
router.post("/update-pass" , updateTeacherPass);
router.post("/teacher-classes" , getTeacherClasses);
router.get("/student-list" , getStudentList);
router.get("/student" , getStudent);

export default router;