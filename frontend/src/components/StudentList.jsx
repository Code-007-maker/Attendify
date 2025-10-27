import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { MoreVertical } from "lucide-react";

/**
 * StudentList (full-width, fixed-layout)
 * - pass students array
 * - refreshStudents is optional callback to re-fetch after delete/update
 */
export function StudentList({ students = [], refreshStudents }) {
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [updateDialogOpen, setUpdateDialogOpen] = useState(false);
  const [visitDialogOpen, setVisitDialogOpen] = useState(false);
  const [visitData, setVisitData] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    roll_no: "",
    className: "",
    section: "",
  });

  // delete, visit, update handlers (same logic as before)...
  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this student?")) return;
    try {
      const res = await fetch(`${import.meta.env.VITE_URL}/api/admin/delete/student`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to delete student");
      alert("✅ " + data.message);
      refreshStudents?.();
    } catch (err) {
      alert("❌ " + err.message);
    }
  };

  const handleVisit = async (student) => {
    try {
      setSelectedStudent(student);
      setVisitDialogOpen(true);
      setVisitData(null);
      const res = await fetch(`${import.meta.env.VITE_URL}/api/admin/student`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ student_id: student.id }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to fetch details");
      setVisitData(data);
    } catch (err) {
      alert("❌ " + err.message);
    }
  };

  const handleUpdateClick = (student) => {
    setSelectedStudent(student);
    setFormData({
      name: student.name,
      roll_no: student.roll_no,
      className: student.class_name || "",
      section: student.section || "",
    });
    setUpdateDialogOpen(true);
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${import.meta.env.VITE_URL}/api/admin/update/student`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: selectedStudent.id,
          ...formData,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Update failed");
      alert("✅ " + data.message);
      setUpdateDialogOpen(false);
      refreshStudents?.();
    } catch (err) {
      alert("❌ " + err.message);
    }
  };

  return (
    // outer wrapper: full width and horizontal scroll when needed
    <div className="w-full max-w-full rounded-xl border border-gray-700 bg-gray-900 text-white shadow-md p-4">
      {/* table: table-fixed so columns stretch to fill available width */}
      <Table className="w-full min-w-full table-fixed">
        <TableCaption className="text-gray-400">List of Students</TableCaption>

        <TableHeader>
          <TableRow className="border-gray-700">
            {/* assign explicit widths so the table spreads */}
            <TableHead className="w-[120px] text-gray-300">Roll No</TableHead>
            <TableHead className="text-gray-300">Name</TableHead>
            <TableHead className="text-gray-300 text-right w-[120px]">Actions</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {students.length > 0 ? (
            students.map((student) => (
              <TableRow key={student.id} className="border-gray-800 hover:bg-gray-800 transition">
                <TableCell className="font-medium">{student.roll_no}</TableCell>

                {/* allow name to wrap (override whitespace-nowrap) */}
                <TableCell className="whitespace-normal">{student.name}</TableCell>

                <TableCell className="text-right">
                  <div className="inline-block">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button className="p-1 hover:bg-gray-700 rounded">
                          <MoreVertical className="w-4 h-4" />
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="bg-gray-800 text-white border border-gray-700">
                        <DropdownMenuItem onClick={() => handleVisit(student)}>👁️ Visit</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleUpdateClick(student)}>✏️ Update</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleDelete(student.id)} className="text-red-400">❌ Delete</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={3} className="text-center py-6 text-gray-400">
                No students found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>

        {students.length > 0 && (
          <TableFooter className="border-gray-800">
            <TableRow>
              <TableCell colSpan={2} className="text-gray-300">Total Students</TableCell>
              <TableCell className="text-right font-semibold">{students.length}</TableCell>
            </TableRow>
          </TableFooter>
        )}
      </Table>

      {/* Update Dialog */}
      <Dialog open={updateDialogOpen} onOpenChange={setUpdateDialogOpen}>
        <DialogContent className="sm:max-w-[400px] bg-gray-900 text-white border border-gray-700">
          <DialogHeader>
            <DialogTitle>Update Student</DialogTitle>
            <DialogDescription>Edit details below</DialogDescription>
          </DialogHeader>

          <form onSubmit={handleUpdateSubmit} className="space-y-4 mt-3">
            <div>
              <label className="block mb-1">Name</label>
              <input
                type="text"
                className="w-full p-2 rounded bg-gray-800 border border-gray-700"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="block mb-1">Roll No</label>
              <input
                type="text"
                className="w-full p-2 rounded bg-gray-800 border border-gray-700"
                value={formData.roll_no}
                onChange={(e) => setFormData({ ...formData, roll_no: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="block mb-1">Class Name</label>
              <input
                type="text"
                className="w-full p-2 rounded bg-gray-800 border border-gray-700"
                value={formData.className}
                onChange={(e) => setFormData({ ...formData, className: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="block mb-1">Section</label>
              <input
                type="text"
                className="w-full p-2 rounded bg-gray-800 border border-gray-700"
                value={formData.section}
                onChange={(e) => setFormData({ ...formData, section: e.target.value })}
                required
              />
            </div>

            <DialogFooter className="mt-4">
              <Button type="submit" className="bg-blue-600 hover:bg-blue-700">Save Changes</Button>
              <DialogClose asChild>
                <Button variant="outline" className="bg-white text-black">Cancel</Button>
              </DialogClose>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Visit Dialog */}
      <Dialog open={visitDialogOpen} onOpenChange={setVisitDialogOpen}>
        <DialogContent className="sm:max-w-[600px] bg-gray-900 text-white border border-gray-700">
          <DialogHeader>
            <DialogTitle>Student Attendance</DialogTitle>
            <DialogDescription>Attendance details for {selectedStudent?.name}</DialogDescription>
          </DialogHeader>

          {visitData ? (
            <div className="mt-4">
              <p><strong>Roll No:</strong> {visitData.roll_no}</p>
              <p><strong>Class:</strong> {visitData.class}</p>
              <div className="mt-3">
                <h4 className="font-semibold mb-2">Subjects:</h4>
                <ul className="space-y-1">
                  {visitData.subjects.map((sub, i) => (
                    <li key={i} className="flex justify-between bg-gray-800 px-3 py-2 rounded">
                      <span>{sub.subject}</span>
                      <span>{sub.attendance_percentage}%</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ) : (
            <p className="text-gray-400 mt-4">Loading attendance...</p>
          )}

          <DialogFooter className="mt-6">
            <DialogClose asChild>
              <Button variant="outline" className="bg-white text-black">Close</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
