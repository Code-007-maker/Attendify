import React, { useContext, useState } from "react";
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
import { StudentContext } from "../contexts/UserContext";

export function AddStudent() {
  const [name, setName] = useState("");
  const [roll_no, setRoll_no] = useState("");
  const [loading, setLoading] = useState(false);
  
    const {selectedStudent , setSelectedStudent} = useContext(StudentContext);
const [class_id, setClass_id] = useState(selectedStudent);
  const handleAddTeacher = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const addRes = await fetch(`${import.meta.env.VITE_URL}/api/admin/add-student`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, roll_no, class_id }),
      });

      const addData = await addRes.json();
      if (!addRes.ok) throw new Error(addData.message || "Adding Student failed");

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
        <Button className="bg-green-400 text-black mt-5 m- hover:cursor-pointer hover:bg-green-700">Add Student</Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[425px] bg-gray-900 text-white border border-gray-700">
        <form onSubmit={handleAddTeacher}>
          <DialogHeader>
            <DialogTitle>Add Student</DialogTitle>
            <DialogDescription>
              Enter Student details to create a new Student account.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 mt-4">
            <div className="grid gap-3">
              <Label>Name</Label>
              <Input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter name"
                required
              />
            </div>

            <div className="grid gap-3">
              <Label>Roll_no</Label>
              <Input
                type="text"
                value={roll_no}
                onChange={(e) => setRoll_no(e.target.value)}
                placeholder="Enter roll_no"
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
