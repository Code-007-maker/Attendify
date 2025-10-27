import React, { useContext, useEffect, useState } from "react";
import { Sidebar, SidebarBody, SidebarLink } from "./ui/sidebar";
import {
  IconUserBolt,
  IconSchool,
} from "@tabler/icons-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { UserContext } from "../contexts/UserContext";
import { DropdownMenuDemo } from "./dropdown";
import { CardSpotlightDemo} from "./StudCard";

// Profile Component
const Profile = ({ profile }) => (
  <div className="p-4 bg-gray-900 text-white rounded-lg h-full w-full">
    <h2 className="text-2xl font-bold mb-4">My Profile</h2>
    <div className="flex justify-center items-center h-full">
    {profile ? (
        <CardSpotlightDemo profile={profile}/>
    ) : (
        <p>Loading profile...</p>
    )}
        </div>
  </div>
);

// Attendance Component
const Settings = ({ attendance }) => (
  <div className="p-4 bg-gray-900 text-white rounded-lg h-full">
    <h2 className="text-2xl font-bold mb-4">Attendance Summary</h2>
    {attendance.length > 0 ? (
      <div className="space-y-4">
        {attendance.map((a) => {
          const isLow = a.attendance_percentage < 75;
          return (
            <div
              key={a.subject_name}
              className={`p-4 rounded-lg border ${
                isLow ? "border-red-500 bg-red-900/30" : "border-gray-700 bg-gray-800"
              }`}
            >
              <p className="font-semibold">{a.subject_name}</p>
              <p>
                Attendance:{" "}
                <span className={isLow ? "text-red-500 font-bold" : "text-green-400 font-bold"}>
                  {a.attendance_percentage}%
                </span>
              </p>
              {isLow && (
                <p className="text-red-400 font-medium mt-1">
                  ⚠️ Your attendance is below 75% in this subject!
                </p>
              )}
            </div>
          );
        })}
      </div>
    ) : (
      <p>No attendance data available.</p>
    )}
  </div>
);

export function StudSidebar() {
  const { user } = useContext(UserContext);
  const [open, setOpen] = useState(true);
  const [activePage, setActivePage] = useState("Profile");
  const [profile, setProfile] = useState(null);
  const [attendance, setAttendance] = useState([]);

  // Fetch profile
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_URL}/api/student/student-profile`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ student_id: user.id }),
        });
        const result = await res.json();
        setProfile(result);
      } catch (err) {
        console.error("Fetching Profile error:", err);
      }
    };
    fetchProfile();
  }, [user.id]);

  // Fetch attendance summary
  useEffect(() => {
    const fetchAttendance = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_URL}/api/student/student-summary`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ student_id: user.id }),
        });
        const result = await res.json();
        setAttendance(result);
      } catch (err) {
        console.error("Fetching Attendance error:", err);
      }
    };
    fetchAttendance();
  }, [user.id]);

  const handleSidebarClick = (label) => setActivePage(label);

  const links = [
    {
      label: "Profile",
      icon: <IconUserBolt />,
      component: <Profile profile={profile} />,
    },
    {
      label: "Attendance",
      icon: <IconSchool />,
      component: <Settings attendance={attendance} />,
    },
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
      <div className="flex-1 overflow-auto text-white w-full h-full">
        <div className="p-6 w-full h-full">
          {links.find((link) => link.label === activePage)?.component}
        </div>
      </div>
    </div>
  );
}

// Logo Component
export const Logo = () => (
  <a href="#" className="flex items-center space-x-2 py-3 px-4 text-white">
    <div className="h-5 w-6 bg-emerald-400 rounded-sm" />
    <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="font-bold">
      Attendify
    </motion.span>
  </a>
);
