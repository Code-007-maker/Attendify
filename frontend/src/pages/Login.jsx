import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { setToken } from "../utils/auth";
import Navbar from "../components/Navbar";
import { DialogPass } from "../components/Dialogpass";
import { UserContext } from "../contexts/UserContext";
import { useContext } from "react";
import { Footer } from "../components/Footer";
import { LoaderOneDemo } from "./Loader";

export default function Login() {
  const [userType, setUserType] = useState("student"); // student | teacher | admin
  const [emailOrId, setEmailOrId] = useState("");
  const [passwordOrName, setPasswordOrName] = useState("");
  const [rollNo, setRollNo] = useState("");
  const navigate = useNavigate();
 const { user, setUser } = useContext(UserContext);
 const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    let url = "";
    let body = {};

    if (userType === "admin") {
      url = `${import.meta.env.VITE_URL}/api/admin/login`;
      body = { email: emailOrId, password: passwordOrName };
    } else if (userType === "teacher") {
      url = `${import.meta.env.VITE_URL}/api/teacher/login`;
      body = { email: emailOrId, password: passwordOrName };
    } else {
      url = `${import.meta.env.VITE_URL}/api/student/login`;
      body = { id: parseInt(emailOrId , 10), name: passwordOrName, roll_no: parseInt(rollNo , 10)};
    }

    try {
      setLoading(true)
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json();
      
      if (res.ok) {
        if (data.token) setToken(data.token);
        const val1 = data[userType];
        console.log(data[userType])
        setUser(val1);

        navigate(`/${userType}`);
      } else {
        alert(data.message || "Login failed");
      }
    } catch (error) {
      console.error(error);
      alert("Network error");
    }
    setLoading(false)
  };

  return (
    <>{
      loading ?<LoaderOneDemo/>   :
    <div className="relative w-full h-screen overflow-hidden">
      {/* ✅ Background Image */}
      <img
        src="./bg.jpg"
        alt="Background"
        className="absolute inset-0 w-full h-full object-cover"
      />

      {/* ✅ Overlay for better contrast */}
      <div className="absolute inset-0 bg-black/40"></div>

      {/* ✅ Navbar */}
      <div className="relative z-10">
  <Navbar />
      </div>

      {/* ✅ Page Content */}
      <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between w-full h-full px-10 lg:px-20">
        {/* Left Side Text */}
        <div className="max-w-lg text-white space-y-4 mt-20 lg:mt-0">
          <h2 className="text-4xl font-bold">Smart Attendance System</h2>
          <p className="text-gray-200 leading-relaxed">
            Streamline your institution’s attendance management with our secure,
            automated, and smart solution. Track student presence efficiently
            with AI-powered monitoring and easy role-based access.
          </p>
        </div>

        {/* Right Side Login Box */}
        <div className="bg-white/20 backdrop-blur-md p-8 rounded-3xl shadow-xl w-[340px] mt-10 lg:mt-0">
          <h2 className="text-3xl font-bold text-center mb-6 text-white">
            Login
          </h2>

          {/* Role Switch Buttons */}
          <div className="flex justify-center mb-6 gap-3">
            {["student", "teacher", "admin"].map((type) => (
              <button
                key={type}
                className={`px-4 py-1.5 rounded-xl transition hover:cursor-pointer ${
                  userType === type
                    ? "bg-white text-black shadow-md font-bold"
                    : "bg-white/50 text-gray-800 hover:bg-white/70"
                }`}
                onClick={() => setUserType(type)}
              >
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </button>
            ))}
          </div>

          {/* Conditional Inputs */}
          {userType !== "student" ? (
            <>
              <input
                type="email"
                placeholder="Email"
                value={emailOrId}
                onChange={(e) => setEmailOrId(e.target.value)}
                className="w-full mb-3 p-2 rounded-md bg-white/80 placeholder-gray-600 focus:outline-none"
              />
              <input
                type="password"
                placeholder="Password"
                value={passwordOrName}
                onChange={(e) => setPasswordOrName(e.target.value)}
                className="w-full mb-3 p-2 rounded-md bg-white/80 placeholder-gray-600 focus:outline-none"
              />
              <DialogPass/>
            </>
          ) : (
            <>
              <input
                placeholder="ID"
                value={emailOrId}
                onChange={(e) => setEmailOrId(e.target.value)}
                className="w-full mb-3 p-2 rounded-md bg-white/80 placeholder-gray-600 focus:outline-none"
              />
              <input
                placeholder="Name"
                value={passwordOrName}
                onChange={(e) => setPasswordOrName(e.target.value)}
                className="w-full mb-3 p-2 rounded-md bg-white/80 placeholder-gray-600 focus:outline-none"
              />
              <input
                placeholder="Roll No"
                value={rollNo}
                onChange={(e) => setRollNo(e.target.value)}
                className="w-full mb-3 p-2 rounded-md bg-white/80 placeholder-gray-600 focus:outline-none"
              />
              
            </>
          )}

          {/* Login Button */}
          <button
            onClick={handleLogin}
            className="font-bold w-full bg-white text-black py-2 rounded-xl hover:bg-gray-300 transition cursor-pointer"
          >
            Login
          </button>
        </div>
        
      </div>
      <Footer/>
    </div>
}</>
  );
}
