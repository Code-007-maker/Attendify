import express from 'express'
import { getStudentAttendanceSummary, getStudentProfile, studentLogin } from '../controllers/studentController.js';
const router = express.Router();


router.post("/login", studentLogin);
router.post("/student-profile", getStudentProfile);
router.post("/student-summary" , getStudentAttendanceSummary);

export default router;