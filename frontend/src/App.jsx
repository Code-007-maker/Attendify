import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import AdminDashboard from "./pages/AdminDashboard";
import TeacherDashboard from "./pages/TeacherDashboard";
import StudentDashboard from "./pages/StudentDashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import { StudentContext, SubjectContext, UserContext } from "./contexts/UserContext";
import { useState } from "react";
import { LoaderOneDemo } from "./pages/Loader";
import { useEffect } from "react";

function App() {
   const [user, setUser] = useState(null);
   const [selectedStudent , setSelectedStudent] = useState(null);
   const [selectedSubject , setSelectedSubject] = useState(null);
     const [loading, setLoading] = useState(true); // ✅ New state

  useEffect(() => {
    // simulate loading or token check
    const timer = setTimeout(() => setLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  if (loading) return <LoaderOneDemo />; 
  return (
    <SubjectContext.Provider value={{selectedSubject , setSelectedSubject}}>
    <StudentContext.Provider value={{selectedStudent , setSelectedStudent}}>
     <UserContext.Provider value={{ user, setUser }}>
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminDashboard />
            </ProtectedRoute>
          }
          />

        <Route
          path="/teacher"
          element={
            <ProtectedRoute allowedRoles={["teacher"]}>
              <TeacherDashboard />
            </ProtectedRoute>
          }
          />

        <Route
          path="/student"
          element={
            <ProtectedRoute allowedRoles={["student"]}>
              <StudentDashboard />
            </ProtectedRoute>
          }
          />

        <Route path="*" element={<Login />} />
      </Routes>
    </Router>
    </UserContext.Provider>
    </StudentContext.Provider>
    </SubjectContext.Provider>
  );
}

export default App;
