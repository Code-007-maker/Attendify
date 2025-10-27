import express from 'express'
import { getAttendanceSheet, getClassAttendance, markAttendance } from '../controllers/attendanceController.js';
const router = express.Router();


router.post("/mark-attendance", markAttendance);
router.post("/class-attendance", getClassAttendance);
router.post("/attendance-sheet" , getAttendanceSheet);

export default router;