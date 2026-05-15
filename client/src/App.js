import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import AdminDashboard from "./pages/AdminDashboard";
import ProfessorPage from "./pages/ProfessorPage";
import ProfessorList from "./pages/ProfessorList";
import AdminPanel from "./pages/AdminPanel";
import ProfessorLogin from "./pages/ProfessorLogin";
import ProfessorDashboard from "./pages/ProfessorDashboard";
import AdminLogin from "./pages/AdminLogin";
import ReviewMarks from "./pages/ReviewMarks";
import ExaminerHeadPage from "./pages/ExaminerHeadPage";
import StudentModule from "./pages/StudentModule";
import ReviewApplications from "./pages/ReviewApplications";
import ReportCard from "./pages/ReportCard";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/admin-login" element={<AdminLogin />} />
        <Route path="/professor-login" element={<ProfessorLogin />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/student-module" element={<StudentModule />} />
        <Route path="/subject-module" element={<ProfessorPage />} />
        <Route path="/examination-module" element={<AdminPanel />} />
        <Route path="/controller-exams" element={<AdminDashboard />} />
        <Route path="/head-examiner" element={<ExaminerHeadPage />} />
        <Route path="/examiner-module" element={<ProfessorDashboard />} />
        <Route path="/marks-entry" element={<ReviewMarks />} />
        <Route path="/grade-module" element={<AdminPanel />} />
        <Route path="/review-applications" element={<ReviewApplications />} />
        <Route path="/result-processing" element={<AdminDashboard />} />
        <Route path="/report-card" element={<ReportCard />} />
        <Route path="/analytics" element={<AdminDashboard />} />
        <Route path="/professors" element={<ProfessorPage />} />
        <Route path="/professor-list" element={<ProfessorList />} />
        <Route path="/assign-paper" element={<AdminPanel />} />
        <Route path="/professor-dashboard" element={<ProfessorDashboard />} />
        <Route path="/review-marks" element={<ReviewMarks />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;