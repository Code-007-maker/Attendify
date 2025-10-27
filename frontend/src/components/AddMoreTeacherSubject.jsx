import React, { useState } from "react";
import { Button } from "./ui/button";
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
import { Input } from "./ui/input";
import { Label } from "./ui/label";

export function AddMoreTeacherSubject({t_name,t_email}) {
  const [email, setEmail] = useState(t_email);
  const [name, setName] = useState(t_name);
  const [subject, setSubject] = useState("");
  const [section, setSection] = useState("");
  const [className, setClassName] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAddTeacher = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const addRes = await fetch(`${import.meta.env.VITE_URL}/api/admin/add-more-teacher-subject`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, subject, className, section }),
      });

      const addData = await addRes.json();
      if (!addRes.ok) throw new Error(addData.message || "Adding Teacher failed");

      alert("✅ " + addData.message);
    } catch (err) {
      alert(`❌ ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="m- hover:cursor-pointer">Add More Subject</Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[425px] bg-gray-900 text-white border border-gray-700">
        <form onSubmit={handleAddTeacher}>
          <DialogHeader>
            <DialogTitle>Add Teacher</DialogTitle>
            <DialogDescription>
              Enter teacher details to create a new teacher account.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 mt-4">
            <div className="grid gap-3">
              <Label>Subject</Label>
              <Input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Enter subject"
                required
              />
            </div>

            <div className="grid gap-3">
              <Label>Class Name</Label>
              <Input
                type="text"
                value={className}
                onChange={(e) => setClassName(e.target.value)}
                placeholder="Enter class name (e.g. 10)"
                required
              />
            </div>

            <div className="grid gap-3">
              <Label>Section</Label>
              <Input
                type="text"
                value={section}
                onChange={(e) => setSection(e.target.value)}
                placeholder="Enter section"
                required
              />
            </div>
          </div>

          <DialogFooter className="mt-6">
            <DialogClose asChild>
              <Button type="button" variant="outline" className="text-black hover:cursor-pointer">
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit" disabled={loading} className="text-white hover:cursor-pointer">
              {loading ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
