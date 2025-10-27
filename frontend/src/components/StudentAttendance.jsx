import React, { useState, useContext} from "react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TableHeader,
  TableFooter,
} from "@/components/ui/table";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { StudentContext, SubjectContext, UserContext } from "../contexts/UserContext";

/**
 * StudentAttendence
 * props:
 *  - students: array of students for the selected class (from parent)
 *  - classes: array returned by getTeacherClasses (rows per subject/class)
 *
 * Behavior:
 *  - choose class (class_id) -> subject dropdown populated from rows for that class
 *  - choose subject (subject_id)
 *  - mark attendance for students list
 *  - view attendance for a date
 *  - download sheet for date range
 */
export const StudentAttendence = ({ students = [], classes = [] }) => {
  const { selectedStudent,setSelectedStudent } = useContext(StudentContext);
    const { selectedSubject,setSelectedSubject } = useContext(SubjectContext);
  const [selectedClassId, setSelectedClassId] = useState(selectedStudent); // numeric id
  const [selectedSubjectId, setSelectedSubjectId] = useState(selectedSubject); // numeric id
  const [date, setDate] = useState("");
  const [attendance, setAttendance] = useState({}); // { studentId: "Present" | "Absent" }
  const [viewData, setViewData] = useState([]);
  const [pdfStartDate, setPdfStartDate] = useState("");
  const [pdfEndDate, setPdfEndDate] = useState("");
  const { user } = useContext(UserContext);


  // toggle Present/Absent
  const handleStatusChange = (studentId) => {
    setAttendance((prev) => ({
      ...prev,
      [studentId]: prev[studentId] === "Present" ? "Absent" : "Present",
    }));
  };

  // Mark attendance: send attendance array to backend
  const handleMarkAttendance = async () => {
    if (!selectedClassId || !selectedSubjectId || !date) {
      alert("Please select class, subject, and date first!");
      return;
    }

    const attendanceData = (students || []).map((s) => ({
      student_id: s.id,
      status: attendance[s.id] || "Absent",
    }));

    try {
      const res = await fetch(`${import.meta.env.VITE_URL}/api/attendance/mark-attendance`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          class_id: Number(selectedClassId),
          subject_id: Number(selectedSubjectId),
          teacher_id: Number(user?.id),
          date,
          attendance: attendanceData,
        }),
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.message || "Mark attendance failed");
      alert(result.message || "Attendance marked successfully!");
    } catch (err) {
      console.error(err);
      alert("Error while marking attendance: " + err.message);
    }
  };

  // View attendance for class/date
  const handleViewAttendance = async () => {
    if (!selectedClassId || !date) {
      alert("Please select class and date!");
      return;
    }

    try {
      const res = await fetch(`${import.meta.env.VITE_URL}/api/attendance/class-attendance`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ class_id: Number(selectedClassId), date , subject_id : Number(selectedSubjectId)}),
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.message || "Failed to fetch attendance");
      setViewData(result || []);
    } catch (err) {
      console.error(err);
      alert("Error fetching attendance: " + err.message);
    }
  };

  // Download attendance sheet (sheet between dates)
  const handleDownloadPDF = async () => {
    if (!selectedClassId || !selectedSubjectId || !pdfStartDate || !pdfEndDate) {
      alert("Please select class, subject and date range!");
      return;
    }

    try {
      const res = await fetch(`${import.meta.env.VITE_URL}/api/attendance/attendance-sheet`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          class_id: Number(selectedClassId),
          subject_id: Number(selectedSubjectId),
          start_date: pdfStartDate,
          end_date: pdfEndDate,
        }),
      });

      const data = await res.json();
      if (!Array.isArray(data) || data.length === 0) {
        alert("No attendance data found for that range.");
        return;
      }

      const doc = new jsPDF();
      doc.text("Attendance Sheet", 14, 15);

      // columns: Roll, Name, then dates (from first row's attendance keys)
      const columns = ["Roll No", "Name", ...Object.keys(data[0].attendance)];
      const rows = data.map((row) => [row.roll_no, row.student_name, ...Object.values(row.attendance)]);

      autoTable(doc,{
        head: [columns],
        body: rows,
        startY: 25,
        styles: { fontSize: 8 },
      });

      doc.save("attendance_sheet.pdf");
    } catch (err) {
      console.error(err);
      alert("Error generating PDF: " + err.message);
    }
  };

  return (
    <div className="bg-gray-800 p-6 rounded-lg w-full overflow-x-auto">
      <h2 className="text-xl font-semibold mb-4">📘 Student Attendance</h2>

      {/* Selection section */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {/* Class select (unique classes) */}
       

        {/* Date for marking / viewing */}
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="bg-gray-700 p-2 rounded text-white"
        />

        <Button onClick={handleMarkAttendance} className="bg-emerald-500 hover:bg-emerald-600">
          Mark Attendance
        </Button>
      </div>

      {/* Student table (clickable status) */}
      {students.length > 0 ? (
        <div className="w-full overflow-x-auto border border-gray-700 rounded-lg">
          <Table className="min-w-[72vw] w-full border-collapse table-auto">
            <TableHeader>
              <TableRow>
                <TableCell className="font-bold text-white">Roll No</TableCell>
                <TableCell className="font-bold text-white">Name</TableCell>
                <TableCell className="font-bold text-white">Status</TableCell>
              </TableRow>
            </TableHeader>

            <TableBody>
              {students.map((s) => (
                <TableRow key={s.id}>
                  <TableCell>{s.roll_no}</TableCell>
                  <TableCell>{s.name}</TableCell>
                  <TableCell>
                    <Button
                      size="sm"
                      onClick={() => handleStatusChange(s.id)}
                      className={`${attendance[s.id] === "Present" ? "bg-green-600" : "bg-red-600"} hover:opacity-80`}
                    >
                      {attendance[s.id] || "Absent"}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : (
        <p className="text-gray-400">No students loaded for current class. Select a class first.</p>
      )}

      {/* View attendance by date */}
      <div className="mt-8">
        <h3 className="text-lg mb-2 font-semibold">📅 View Attendance by Date</h3>
        <div className="flex gap-2 mb-3">
          <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="bg-gray-700 p-2 rounded text-white" />
          <Button onClick={handleViewAttendance} className="bg-blue-500 hover:bg-blue-600">
            View
          </Button>
        </div>

        {viewData.length > 0 && (
          <div className="w-full overflow-x-auto border border-gray-700 rounded-lg">
            <Table className="min-w-full w-full border-collapse table-auto">
              <TableHeader>
                <TableRow>
                  <TableCell className="font-bold">Name</TableCell>
                  <TableCell className="font-bold">Status</TableCell>
                </TableRow>
              </TableHeader>
              <TableBody>
                {viewData.map((item) => (
                  <TableRow key={item.student_id}>
                    <TableCell>{item.student_name}</TableCell>
                    <TableCell>{item.status}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>

      {/* PDF download range */}
      <div className="mt-8">
        <h3 className="text-lg mb-2 font-semibold">📄 Download Attendance Sheet</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
          <input type="date" value={pdfStartDate} onChange={(e) => setPdfStartDate(e.target.value)} className="bg-gray-700 p-2 rounded text-white" />
          <input type="date" value={pdfEndDate} onChange={(e) => setPdfEndDate(e.target.value)} className="bg-gray-700 p-2 rounded text-white" />
          <Button onClick={handleDownloadPDF} className="bg-purple-500 hover:bg-purple-600 col-span-2">
            Download PDF
          </Button>
        </div>
      </div>
    </div>
  );
};
