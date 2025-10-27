import React, { useContext, useEffect, useState } from "react";
import { Sidebar, SidebarBody, SidebarLink } from "./ui/sidebar";
import {
  IconArrowLeft,
  IconBrandTabler,
  IconSettings,
  IconSchool,
  IconUserBolt,
} from "@tabler/icons-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { StudentContext, UserContext } from "../contexts/UserContext";
import { DropdownMenuDemo } from "./dropdown";
import { CometCardDemo } from "./card";
import { AddTeacherCard } from "./addteacherCard";
import { TeacherProfileDialog } from "./TeacherProfileDialog";
import { StudentList } from "./StudentList";
import { AddClassCard } from "./addclassCard";
import { AddStudent } from "./AddStud";
import { Button } from "./ui/button";

const Dashboard = ({ teachers , triggerTeacherRefresh}) => (
  <div className="p-4 bg-gray-900 text-white rounded-lg h-full">
    <h2 className="text-2xl font-bold mb-4">Teachers</h2>
    <p className="text-gray-300 mb-6">Here are our faculty members.</p>

    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-10">
  {teachers.map((teacher) => (
    <TeacherProfileDialog
      key={teacher.id}
      email={teacher.email}
      name={teacher.name}
    >
      <CometCardDemo key1={teacher.id} id={teacher.id} name={teacher.name} email={teacher.email} flag={false} />
    </TeacherProfileDialog>
  ))}

      <AddTeacherCard onSuccess={triggerTeacherRefresh}/>
    </div>
  </div>
);

const Profile = ({students , triggerStudentRefresh}) => (
  <div className="p-4 bg-gray-900 text-white rounded-lg h-full">
    <h2 className="text-2xl font-bold mb-4">Students</h2>
    <p>Here is your student list or related content.</p>
    <StudentList students={students} />
    <Button >{<AddStudent onSuccess={triggerStudentRefresh}/>}</Button>

  </div>
);

const Settings = ({classes , triggerClassRefresh}) => (
  <div className="p-4 bg-gray-900 text-white rounded-lg h-full">
    <h2 className="text-2xl font-bold mb-4">Classes</h2>
    <p className="text-gray-300 mb-6">Here are our Classes.</p>

    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-10">
  {classes.map((class1) => (
       <CometCardDemo key1 ={class1.id} id={class1.name} name={class1.section} count={class1.count_student} flag={true}/>
  ))}
  <AddClassCard onSuccess={triggerClassRefresh}/>
    </div>
  </div>
);

export function SidebarDemo() {
  const { user } = useContext(UserContext);
  const [open, setOpen] = useState(true);
  const [activePage, setActivePage] = useState("Teacher");
  const [teachers, setTeachers] = useState([]);
  const [classes, setClasses] = useState([]);
  const [students, setStudents] = useState([]);
  const [teacherRefresh, setTeacherRefresh] = useState(0);
  const [classRefresh, setClassRefresh] = useState(0);
  const [studentRefresh, setStudentRefresh] = useState(0);

  const triggerTeacherRefresh = () => setTeacherRefresh((prev) => prev + 1);
  const triggerClassRefresh = () => setClassRefresh((prev) => prev + 1);
  const triggerStudentRefresh = () => setStudentRefresh((prev) => prev + 1);

  // ✅ Fetch teacher list
  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_URL}/api/admin/teacher-list`);
        const result = await response.json();
        console.log("Teacher list:", result);
        setTeachers(result);
      } catch (err) {
        console.error("Fetching teacher error:", err);
      }
    };

    fetchTeachers();
  }, [teacherRefresh]);
  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_URL}/api/admin/class-list`);
        const result = await response.json();
        console.log("Class list:", result);
        setClasses(result);
      } catch (err) {
        console.error("Fetching Class error:", err);
      }
    };

    fetchClasses();
  }, [classRefresh]);

  const {selectedStudent , setSelectedStudent} = useContext(StudentContext);

useEffect(() => {
  const fetchStudents = async () => {
    if (!selectedStudent) {
      // if selection cleared, empty student list and do nothing
      setStudents([]);
      return;
    }

    try {
      const res = await fetch(`${import.meta.env.VITE_URL}/api/admin/student-list`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ class_id: selectedStudent }),
      });
      const result = await res.json();
      setStudents(result || []);
      // navigate to Students page only when we have a selection
      setActivePage("Students");
    } catch (err) {
      console.error("Fetching students error:", err);
    }
  };

  fetchStudents();
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, [selectedStudent, studentRefresh]); // only runs when selection changes


  const handleSidebarClick = (label) => {
  if (label === "Students") {
    if (!selectedStudent) {
      alert("Please select a class first.");
      return; // do not navigate
    }
    setActivePage("Students");

    return;
  }

  // If user opens "Classes", clear the selected class so it won't auto-open Students
  if (label === "Classes") {
    setSelectedStudent(null);
  }

  setActivePage(label);
};

  const links = [
    {
      label: "Teachers",
      icon: <IconBrandTabler />,
      component: <Dashboard teachers={teachers} triggerTeacherRefresh = {triggerTeacherRefresh}/>,
    },
    {
      label: "Students",
      icon: <IconUserBolt />,
      component: <Profile students = {students} triggerStudentRefresh={triggerStudentRefresh}/>,
    },
    {
      label: "Classes",
      icon: <IconSchool />,
      component: <Settings classes = {classes} triggerClassRefresh = {triggerClassRefresh}/>,
    }
  ];

  return (
    <div className="flex h-screen bg-gray-900">
      {/* Sidebar */}
      <Sidebar open={open} setOpen={setOpen} animate={false} className="bg-gray-800 w-64">
        <SidebarBody className="flex flex-col justify-between h-full bg-black">
          <div>
            <Logo />

            <div className="mt-8 flex flex-col gap-2 text-white hover:cursor-pointer">
              {links.map((link) => (
  <SidebarLink
    key={link.label}
    link={link}
    onClick={() => handleSidebarClick(link.label)}
    className={cn(activePage === link.label ? "bg-gray-800 font-bold" : "font-bold")}
  />
))}
            </div>
          </div>

          <div className="absolute bottom-0 w-full">
            <DropdownMenuDemo user={user} />
          </div>
        </SidebarBody>
      </Sidebar>

      {/* Main content */}
      <div className="flex-1 p-6 overflow-auto text-white">
        {links.find((link) => link.label === activePage)?.component}
      </div>
    </div>
  );
}

// Logo Component
export const Logo = () => (
  <a href="#" className="flex items-center space-x-2 py-3 px-4 text-white">
    <div className="h-5 w-6 bg-emerald-400 rounded-sm" />
    <motion.span
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="font-bold"
    >
      Attendify
    </motion.span>
  </a>
);
