import React, { useState } from "react";
import axios from "axios";
import { FaSearch, FaFilePdf, FaGraduationCap, FaAward, FaUniversity } from "react-icons/fa";
import Sidebar from "../components/Sidebar";

export default function ReportCard() {
    const [searchTerm, setSearchTerm] = useState("");
    const [student, setStudent] = useState(null);
    const [academicRecords, setAcademicRecords] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    // Search for the student and their marks in the database
    const handleSearch = async (e) => {
        e.preventDefault();
        if (!searchTerm) return;

        setLoading(true);
        setError("");
        setStudent(null);
        setAcademicRecords([]);

        try {
            // 1. Fetch Student Details
            const studentRes = await axios.get(`http://localhost:5000/admin/student/search?query=${searchTerm}`);

            if (!studentRes.data || studentRes.data.length === 0) {
                setError("No student found with that Registration Number or ABC ID.");
                setLoading(false);
                return;
            }

            const foundStudent = studentRes.data[0];
            setStudent(foundStudent);

            // 2. Fetch Student's Marks across all semesters
            const marksRes = await axios.get(`http://localhost:5000/admin/student/${foundStudent.exam_roll}/marks`);
            setAcademicRecords(marksRes.data);

        } catch (err) {
            console.error("Error fetching report card data:", err);
            setError("Failed to connect to the database. Ensure the backend server is running.");
        } finally {
            setLoading(false);
        }
    };

    // --- UG Exit Rule Calculation Logic ---

    // Calculate total unique semesters completed by the student
    const semestersCompleted = [...new Set(academicRecords.map(record => record.semester))].length;

    // Determine the eligible certificate based on the new UG rules
    const getEligibleAward = (semesters) => {
        if (semesters >= 8) return "Bachelor's Degree with Honours / Research";
        if (semesters >= 6) return "Bachelor's Degree";
        if (semesters >= 4) return "Undergraduate Diploma";
        if (semesters >= 2) return "Undergraduate Certificate";
        return "Not Eligible for Exit Award Yet (Requires min. 2 Semesters)";
    };

    // Calculate CGPA (Cumulative Grade Point Average)
    const calculateCGPA = () => {
        if (academicRecords.length === 0) return 0;

        let totalCreditPoints = 0;
        let totalCredits = 0;

        academicRecords.forEach((record) => {
            // Assuming your DB joins return `credit_value` from `credit_points` and `grade_point` from `grade_rules`
            const credit = parseFloat(record.credit_value) || 0;
            const gradePoint = parseFloat(record.grade_point) || 0;

            totalCreditPoints += (credit * gradePoint);
            totalCredits += credit;
        });

        if (totalCredits === 0) return 0;
        return (totalCreditPoints / totalCredits).toFixed(2);
    };

    const handlePrint = () => {
        window.print();
    };

    return (
        <>
            <style>{`
        /* Print Styles - Hides UI elements and formats the Report Card nicely for A4 Paper */
        @media print {
          body * { visibility: hidden; }
          .print-area, .print-area * { visibility: visible; }
          .print-area { position: absolute; left: 0; top: 0; width: 100%; padding: 20px; }
          .no-print { display: none !important; }
          .contentArea { margin-left: 0 !important; width: 100% !important; padding: 0 !important; }
          .report-card-container { border: none !important; box-shadow: none !important; }
        }
        
        .btn-hover { transition: all 0.2s ease; }
        .btn-hover:hover { transform: translateY(-2px); box-shadow: 0 6px 15px rgba(0,0,0,0.1); }
      `}</style>

            <div style={styles.container}>
                <div className="no-print">
                    <Sidebar />
                </div>

                <div style={styles.contentArea} className="contentArea">

                    {/* Search Section (Hidden during print) */}
                    <div style={styles.searchSection} className="no-print">
                        <h1 style={styles.pageTitle}><FaAward color="#2563eb" /> Generate Report Card & Exit Certificate</h1>
                        <p style={styles.subText}>Search the database by Registration No. or ABC ID to fetch live academic records.</p>

                        <form onSubmit={handleSearch} style={styles.searchForm}>
                            <div style={styles.searchBox}>
                                <FaSearch style={styles.searchIcon} />
                                <input
                                    type="text"
                                    placeholder="Enter Student Reg No. or ABC ID..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    style={styles.searchInput}
                                    required
                                />
                            </div>
                            <button type="submit" style={styles.searchBtn} className="btn-hover" disabled={loading}>
                                {loading ? "Searching Database..." : "Fetch Records"}
                            </button>
                        </form>

                        {error && <div style={styles.errorBox}>{error}</div>}
                    </div>

                    {/* Actual Report Card Area (Visible during print) */}
                    {student && (
                        <div style={styles.reportCardContainer} className="print-area report-card-container">

                            {/* Institution Header */}
                            <div style={styles.institutionHeader}>
                                <FaUniversity size={40} color="#1e3a8a" style={{ marginBottom: "10px" }} />
                                <h1 style={styles.institutionName}>CALCUTTA INSTITUTE OF TECHNOLOGY</h1>
                                <p style={styles.institutionSub}>Office of the Controller of Examinations</p>
                                <h2 style={styles.documentTitle}>ACADEMIC REPORT CARD</h2>
                            </div>

                            {/* Student Details Grid */}
                            <div style={styles.studentDetailsGrid}>
                                <div style={styles.detailItem}><span>Student Name:</span> <strong>{student.name}</strong></div>
                                <div style={styles.detailItem}><span>Registration No:</span> <strong>{student.reg_no}</strong></div>
                                <div style={styles.detailItem}><span>Examination Roll:</span> <strong>{student.exam_roll}</strong></div>
                                <div style={styles.detailItem}><span>ABC ID:</span> <strong>{student.abcid || "Not Provided"}</strong></div>
                                <div style={styles.detailItem}><span>Stream:</span> <strong>{student.stream}</strong></div>
                                <div style={styles.detailItem}><span>Major Subject:</span> <strong>{student.major}</strong></div>
                            </div>

                            {/* Academic Records Table */}
                            <div style={styles.tableWrapper}>
                                <h3 style={styles.sectionTitle}>Academic Performance Record</h3>
                                {academicRecords.length === 0 ? (
                                    <p style={{ padding: "20px", textAlign: "center", color: "#64748b" }}>
                                        No marks have been entered for this student in the database yet.
                                    </p>
                                ) : (
                                    <table style={styles.table}>
                                        <thead>
                                            <tr>
                                                <th style={styles.th}>Semester</th>
                                                <th style={styles.th}>Subject</th>
                                                <th style={styles.th}>Exam Type</th>
                                                <th style={styles.th}>Marks Obtained</th>
                                                <th style={styles.th}>Grade</th>
                                                <th style={styles.th}>Credit</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {academicRecords.map((record, index) => (
                                                <tr key={index} style={styles.tr}>
                                                    <td style={styles.td}>{record.semester}</td>
                                                    <td style={styles.tdActive}>{record.subject}</td>
                                                    <td style={styles.td}>{record.exam_type}</td>
                                                    <td style={styles.tdBold}>{record.marks}</td>
                                                    <td style={styles.tdGrade}>{record.grade}</td>
                                                    <td style={styles.td}>{record.credit_value}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                )}
                            </div>

                            {/* UG Exit Calculation & CGPA */}
                            {academicRecords.length > 0 && (
                                <div style={styles.calculationSection}>
                                    <div style={styles.calcBox}>
                                        <span style={styles.calcLabel}>Cumulative GPA (CGPA)</span>
                                        <strong style={styles.calcValue}>{calculateCGPA()}</strong>
                                    </div>

                                    <div style={styles.calcBox}>
                                        <span style={styles.calcLabel}>Semesters Completed</span>
                                        <strong style={styles.calcValue}>{semestersCompleted}</strong>
                                    </div>

                                    <div style={styles.awardBox}>
                                        <FaGraduationCap size={24} style={{ marginRight: "10px" }} />
                                        <div>
                                            <span style={styles.calcLabel} style={{ color: "#e0e7ff" }}>Eligible UG Exit Award</span>
                                            <strong style={{ fontSize: "18px", display: "block", marginTop: "4px" }}>
                                                {getEligibleAward(semestersCompleted)}
                                            </strong>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Action Buttons (Hidden during print) */}
                            <div style={styles.actionRow} className="no-print">
                                <button style={styles.printBtn} className="btn-hover" onClick={handlePrint} disabled={academicRecords.length === 0}>
                                    <FaFilePdf /> Download / Print Official Certificate
                                </button>
                            </div>

                        </div>
                    )}

                </div>
            </div>
        </>
    );
}

// ================= STYLES =================
const styles = {
    container: { display: "flex", background: "#f8fafc", minHeight: "100vh", fontFamily: "'Inter', 'Poppins', sans-serif" },
    contentArea: { marginLeft: "280px", width: "calc(100% - 280px)", padding: "40px", boxSizing: "border-box" },

    searchSection: { background: "#ffffff", padding: "30px", borderRadius: "20px", boxShadow: "0 10px 30px rgba(15,23,42,0.03)", border: "1px solid #e2e8f0", marginBottom: "30px" },
    pageTitle: { margin: "0 0 8px 0", fontSize: "24px", fontWeight: "800", color: "#0f172a", display: "flex", alignItems: "center", gap: "10px" },
    subText: { color: "#64748b", fontSize: "14px", margin: "0 0 20px 0" },

    searchForm: { display: "flex", gap: "15px", alignItems: "center" },
    searchBox: { position: "relative", flex: 1 },
    searchIcon: { position: "absolute", left: "16px", top: "50%", transform: "translateY(-50%)", color: "#94a3b8" },
    searchInput: { width: "100%", padding: "14px 14px 14px 45px", borderRadius: "12px", border: "2px solid #e2e8f0", outline: "none", fontSize: "15px", boxSizing: "border-box", transition: "border-color 0.2s" },
    searchBtn: { background: "#2563eb", color: "white", border: "none", padding: "14px 28px", borderRadius: "12px", fontWeight: "700", cursor: "pointer", fontSize: "15px", whiteSpace: "nowrap" },

    errorBox: { marginTop: "20px", padding: "15px", background: "#fef2f2", color: "#b91c1c", borderRadius: "10px", border: "1px solid #fecaca", fontWeight: "500", fontSize: "14px" },

    reportCardContainer: { background: "#ffffff", padding: "50px", borderRadius: "20px", boxShadow: "0 15px 40px rgba(15,23,42,0.06)", border: "1px solid #cbd5e1", position: "relative" },

    institutionHeader: { textAlign: "center", borderBottom: "3px solid #1e3a8a", paddingBottom: "25px", marginBottom: "30px" },
    institutionName: { margin: "0 0 5px 0", fontSize: "28px", fontWeight: "900", color: "#1e3a8a", letterSpacing: "1px" },
    institutionSub: { margin: "0 0 15px 0", fontSize: "14px", color: "#475569", textTransform: "uppercase", letterSpacing: "2px", fontWeight: "600" },
    documentTitle: { margin: 0, fontSize: "20px", fontWeight: "800", color: "#0f172a", background: "#f1f5f9", display: "inline-block", padding: "8px 20px", borderRadius: "8px" },

    studentDetailsGrid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px", background: "#f8fafc", padding: "20px", borderRadius: "12px", border: "1px solid #e2e8f0", marginBottom: "30px" },
    detailItem: { fontSize: "14px", color: "#334155", display: "flex", flexDirection: "column", gap: "4px" },

    tableWrapper: { marginBottom: "30px" },
    sectionTitle: { fontSize: "18px", fontWeight: "800", color: "#1e3a8a", borderBottom: "2px solid #e2e8f0", paddingBottom: "10px", marginBottom: "15px" },
    table: { width: "100%", borderCollapse: "collapse" },
    th: { background: "#f1f5f9", color: "#475569", padding: "12px 15px", fontSize: "13px", fontWeight: "700", textAlign: "left", textTransform: "uppercase" },
    tr: { borderBottom: "1px solid #e2e8f0" },
    td: { padding: "12px 15px", fontSize: "14px", color: "#334155", textAlign: "left" },
    tdActive: { padding: "12px 15px", fontSize: "14px", color: "#0f172a", fontWeight: "600", textAlign: "left" },
    tdBold: { padding: "12px 15px", fontSize: "15px", color: "#1e3a8a", fontWeight: "800", textAlign: "left" },
    tdGrade: { padding: "12px 15px", fontSize: "15px", color: "#10b981", fontWeight: "800", textAlign: "left" },

    calculationSection: { display: "grid", gridTemplateColumns: "1fr 1fr 2fr", gap: "20px", marginTop: "20px", paddingTop: "20px", borderTop: "2px dashed #e2e8f0" },
    calcBox: { background: "#f8fafc", padding: "20px", borderRadius: "12px", border: "1px solid #cbd5e1", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", textAlign: "center" },
    calcLabel: { fontSize: "12px", color: "#64748b", textTransform: "uppercase", fontWeight: "700", letterSpacing: "0.5px", marginBottom: "5px" },
    calcValue: { fontSize: "28px", fontWeight: "900", color: "#0f172a", lineHeight: "1" },

    awardBox: { background: "linear-gradient(135deg, #1e3a8a, #2563eb)", padding: "20px", borderRadius: "12px", color: "white", display: "flex", alignItems: "center", boxShadow: "0 8px 20px rgba(37,99,235,0.2)" },

    actionRow: { display: "flex", justifyContent: "flex-end", marginTop: "40px" },
    printBtn: { background: "#10b981", color: "white", border: "none", padding: "15px 30px", borderRadius: "12px", fontWeight: "700", cursor: "pointer", fontSize: "15px", display: "flex", alignItems: "center", gap: "10px", boxShadow: "0 8px 20px rgba(16,185,129,0.25)" }
};