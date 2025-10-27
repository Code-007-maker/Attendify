import React, { useState } from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "./ui/dialog";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "./ui/dropdown-menu";
import { MoreVertical } from "lucide-react";
import { AddMoreTeacherSubject } from "./AddMoreTeacherSubject";

export function TeacherProfileDialog({ email, name, children }) {
  const [teacher, setTeacher] = useState(null);
  const [loading, setLoading] = useState(false);
  const [updateDialog, setUpdateDialog] = useState(false);
  const [selectedClass, setSelectedClass] = useState(null);
  const [formData, setFormData] = useState({
    subject: "",
    className: "",
    section: "",
  });

  // Fetch teacher details
  const fetchTeacherDetails = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${import.meta.env.VITE_URL}/api/admin/get-teacher`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to fetch teacher details");
      setTeacher(data);
    } catch (err) {
      console.error(err);
      alert("❌ " + err.message);
    } finally {
      setLoading(false);
    }
  };

  // Delete teacher class mapping
  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this teacher?")) return;
    try {
      const res = await fetch(`${import.meta.env.VITE_URL}/api/admin/delete/teacher`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to delete teacher");
      alert("✅ " + data.message);
      fetchTeacherDetails();
    } catch (err) {
      alert("❌ " + err.message);
    }
  };

  //  Open update form dialog
  const handleUpdateClick = (cls) => {
    setSelectedClass(cls);
    setFormData({
      subject: cls.subject,
      className: cls.class_name,
      section: cls.section,
    });
    setUpdateDialog(true);
  };

  // Submit update request
  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${import.meta.env.VITE_URL}/api/admin/update/teacher`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: selectedClass.id,
          name: teacher.name,
          email: teacher.email,
          ...formData,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to update teacher");
      alert("✅ " + data.message);
      setUpdateDialog(false);
      fetchTeacherDetails();
    } catch (err) {
      alert("❌ " + err.message);
    }
  };

  return (
    <Dialog>
      {/* Teacher card (passed from parent) */}
      <DialogTrigger asChild>
        <div onClick={fetchTeacherDetails}>{children}</div>
      </DialogTrigger>

      {/* Main Teacher Profile Dialog */}
      <DialogContent className="sm:max-w-[500px] bg-gray-900 text-white border border-gray-700">
        {loading ? (
          <p className="text-center py-8">Loading teacher details...</p>
        ) : teacher ? (
          <>
            <DialogHeader>
              <DialogTitle>Teacher Profile</DialogTitle>
              <DialogDescription>
                Detailed information about {teacher.name}
              </DialogDescription>
            </DialogHeader>

            <div className="mt-4 space-y-3">
              <p><span className="font-semibold">Name:</span> {teacher.name}</p>
              <p><span className="font-semibold">Email:</span> {teacher.email}</p>

              <h3 className="text-lg mt-4 font-semibold">Assigned Classes:</h3>
              <div className="space-y-2">
                {teacher.classes && teacher.classes.length > 0 ? (
                  teacher.classes.map((cls, idx) => (
                    <div
                      key={idx}
                      className="relative bg-gray-800 p-3 rounded-lg border border-gray-700"
                    >
                      <div className="absolute top-2 right-2">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <button className="p-1 hover:bg-gray-700 rounded">
                              <MoreVertical className="w-4 h-4" />
                            </button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent className="bg-gray-800 text-white border border-gray-700">
                            <DropdownMenuItem
                              onClick={() => handleUpdateClick(cls)}
                              className="cursor-pointer"
                            >
                              ✏️ Update
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleDelete(cls.id)}
                              className="cursor-pointer text-red-400"
                            >
                              ❌ Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>

                      <p><span className="font-semibold">ID:</span> {cls.id}</p>
                      <p><span className="font-semibold">Class:</span> {cls.class_name}</p>
                      <p><span className="font-semibold">Section:</span> {cls.section}</p>
                      <p><span className="font-semibold">Subject:</span> {cls.subject}</p>
                    </div>
                  ))
                ) : (
                  <p>No assigned classes.</p>
                )}
              </div>
            </div>

            <DialogFooter className="mt-6">
              <DialogClose asChild>
                <Button variant="outline" className="text-black bg-white">
                  Close
                </Button>
              </DialogClose>
              <AddMoreTeacherSubject t_name={name} t_email = {email}/>
            </DialogFooter>
          </>
        ) : (
          <p className="text-center py-8">No details found.</p>
        )}
      </DialogContent>

      {/* Update Dialog */}
      <Dialog open={updateDialog} onOpenChange={setUpdateDialog}>
        <DialogContent className="sm:max-w-[400px] bg-gray-900 text-white border border-gray-700">
          <DialogHeader>
            <DialogTitle>Update Teacher</DialogTitle>
            <DialogDescription>Edit class details below</DialogDescription>
          </DialogHeader>

          <form onSubmit={handleUpdateSubmit} className="space-y-4 mt-3">
            <div>
              <label className="block mb-1">Subject</label>
              <input
                type="text"
                className="w-full p-2 rounded bg-gray-800 border border-gray-700"
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
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
              <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white">
                Save Changes
              </Button>
              <DialogClose asChild>
                <Button variant="outline" className="text-black bg-white">
                  Cancel
                </Button>
              </DialogClose>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </Dialog>
  );
}
