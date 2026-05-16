import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// 1. PUBLIC & AUTHENTICATION PAGES
import Home from "./pages/Home";
import AdminLogin from "./pages/AdminLogin";
import ProfessorLogin from "./pages/ProfessorLogin";

// 2. SECURE ADMINISTRATION PAGES (Uses Sidebar)
import AdminDashboard from "./pages/AdminDashboard";
import StudentModule from "./pages/StudentModule";
import AdminPanel from "./pages/AdminPanel"; // Acts as Assign Paper & placeholders
import ExaminerHeadPage from "./pages/ExaminerHeadPage";
import ReviewApplications from "./pages/ReviewApplications";
import ReportCard from "./pages/ReportCard";
import ProfessorPage from "./pages/ProfessorPage"; // Acts as Add Professor
import ProfessorList from "./pages/ProfessorList";

// 3. SECURE PROFESSOR PAGES (Uses Sidebar)
import ProfessorDashboard from "./pages/ProfessorDashboard";
import ReviewMarks from "./pages/ReviewMarks"; // No sidebar link, accessed via Dashboard

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* =========================================
            PUBLIC ROUTES
        ========================================= */}
        <Route path="/" element={<Home />} />
        <Route path="/admin-login" element={<AdminLogin />} />
        <Route path="/professor-login" element={<ProfessorLogin />} />

        {/* =========================================
            ADMINISTRATION SIDEBAR ROUTES
        ========================================= */}
        <Route path="/admin" element={<AdminDashboard />} />
        
        {/* Academic Records */}
        <Route path="/student-module" element={<StudentModule />} />
        <Route path="/subject-module" element={<ProfessorPage />} /> {/* Placeholder */}

        {/* Exam Operations */}
        <Route path="/examination-module" element={<AdminPanel />} /> {/* Placeholder */}
        <Route path="/controller-exams" element={<AdminDashboard />} /> {/* Placeholder */}
        <Route path="/head-examiner" element={<ExaminerHeadPage />} />

        {/* Evaluation Hub */}
        <Route path="/examiner-module" element={<ProfessorDashboard />} /> {/* Placeholder */}
        <Route path="/marks-entry" element={<ReviewMarks />} /> {/* Placeholder */}
        <Route path="/grade-module" element={<AdminPanel />} /> {/* Placeholder */}
        <Route path="/review-applications" element={<ReviewApplications />} />
        <Route path="/review-committee" element={<AdminDashboard />} /> {/* Placeholder */}

        {/* Results & Analytics */}
        <Route path="/result-processing" element={<AdminDashboard />} /> {/* Placeholder */}
        <Route path="/report-card" element={<ReportCard />} />
        <Route path="/analytics" element={<AdminDashboard />} /> {/* Placeholder */}

        {/* Professor Hub */}
        <Route path="/professors" element={<ProfessorPage />} />
        <Route path="/professor-list" element={<ProfessorList />} />
        <Route path="/assign-paper" element={<AdminPanel />} />

        {/* =========================================
            PROFESSOR SPECIFIC ROUTES
        ========================================= */}
        <Route path="/professor-dashboard" element={<ProfessorDashboard />} />
        <Route path="/review-marks" element={<ReviewMarks />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;