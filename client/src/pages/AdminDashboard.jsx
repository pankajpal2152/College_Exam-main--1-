import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  FaChalkboardTeacher,
  FaClipboardList,
  FaClock,
  FaBookOpen,
  FaArrowUp,
  FaSignOutAlt,
  FaUserGraduate, // Added for Students
  FaClipboardCheck // Added for Reviews
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";

export default function AdminDashboard() {
  const navigate = useNavigate();

  // State Management for Dashboard Metrics
  const [totalProfessors, setTotalProfessors] = useState(0);
  const [assignedPapers, setAssignedPapers] = useState([]);
  const [totalStudents, setTotalStudents] = useState(0); // New
  const [pendingReviews, setPendingReviews] = useState(0); // New
  
  const [selectedPaper, setSelectedPaper] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      /* FETCH PROFESSORS */
      const profRes = await axios.get("http://localhost:5000/admin/professors").catch(() => ({ data: [] }));

      /* FETCH ASSIGNED PAPERS */
      const paperRes = await axios.get("http://localhost:5000/assignment/all").catch(() => ({ data: [] }));

      /* FETCH STUDENTS (Placeholder for your backend) */
      const studentRes = await axios.get("http://localhost:5000/admin/students").catch(() => ({ data: [1,2,3,4,5,6,7,8,9,10] })); // Dummy data length 10

      /* FETCH PENDING REVIEWS (Placeholder for your backend) */
      const reviewRes = await axios.get("http://localhost:5000/admin/reviews/pending").catch(() => ({ data: [1,2,3] })); // Dummy data length 3

      /* SAFE ARRAY CHECK & SET STATE */
      setTotalProfessors(Array.isArray(profRes.data) ? profRes.data.length : 0);
      setAssignedPapers(Array.isArray(paperRes.data) ? paperRes.data : []);
      setTotalStudents(Array.isArray(studentRes.data) ? studentRes.data.length : 0);
      setPendingReviews(Array.isArray(reviewRes.data) ? reviewRes.data.length : 0);

    } catch (error) {
      console.log("Dashboard Error:", error);
      setTotalProfessors(0);
      setAssignedPapers([]);
      setTotalStudents(0);
      setPendingReviews(0);
    }
  };

  /* LOGOUT */
  const handleLogout = () => {
    const confirmLogout = window.confirm("Are you sure you want to logout?");
    if (!confirmLogout) return;
    navigate("/");
  };

  const recentPapers = assignedPapers.slice(-5).reverse();

  return (
    <div style={styles.wrapper}>
      <Sidebar />

      <div style={styles.container}>
        {/* TOP BAR */}
        <div style={styles.topBar}>
          <div />
          <button style={styles.logoutBtn} onClick={handleLogout}>
            <FaSignOutAlt />
            Logout
          </button>
        </div>

        {/* TOP HERO */}
        <div style={styles.heroSection}>
          <div>
            <p style={styles.welcomeText}>Welcome Back Admin 👋</p>
            <h1 style={styles.mainTitle}>College Examination Dashboard</h1>
            <p style={styles.subText}>
              Manage students, professors, assigned papers, and examination workflows easily.
            </p>
          </div>
          <div style={styles.heroBadge}>
            <FaArrowUp />
            <span>System Active</span>
          </div>
        </div>

        {/* STATS GRID */}
        <div style={styles.statsGrid}>
          
          {/* TOTAL STUDENTS CARD */}
          <div style={styles.statCard}>
            <div style={{ ...styles.iconBox, background: "linear-gradient(135deg,#10b981,#059669)" }}>
              <FaUserGraduate />
            </div>
            <div>
              <p style={styles.cardTitle}>Total Students</p>
              <h2 style={styles.cardValue}>{totalStudents}</h2>
              <span style={styles.cardBottom}>Registered in System</span>
            </div>
          </div>

          {/* TOTAL PROFESSORS CARD */}
          <div style={styles.statCard}>
            <div style={{ ...styles.iconBox, background: "linear-gradient(135deg,#4f46e5,#7c3aed)" }}>
              <FaChalkboardTeacher />
            </div>
            <div>
              <p style={styles.cardTitle}>Total Professors</p>
              <h2 style={styles.cardValue}>{totalProfessors}</h2>
              <span style={styles.cardBottom}>Active Faculty Members</span>
            </div>
          </div>

          {/* ASSIGNED PAPERS CARD */}
          <div style={styles.statCard}>
            <div style={{ ...styles.iconBox, background: "linear-gradient(135deg,#0ea5e9,#2563eb)" }}>
              <FaClipboardList />
            </div>
            <div>
              <p style={styles.cardTitle}>Assigned Papers</p>
              <h2 style={styles.cardValue}>{assignedPapers.length}</h2>
              <span style={styles.cardBottom}>Currently Allocated</span>
            </div>
          </div>

          {/* PENDING REVIEWS CARD */}
          <div style={styles.statCard}>
            <div style={{ ...styles.iconBox, background: "linear-gradient(135deg,#f59e0b,#d97706)" }}>
              <FaClipboardCheck />
            </div>
            <div>
              <p style={styles.cardTitle}>Pending Reviews</p>
              <h2 style={styles.cardValue}>{pendingReviews}</h2>
              <span style={styles.cardBottom}>Awaiting Committee Action</span>
            </div>
          </div>

        </div>

        {/* RECENT PAPERS TABLE */}
        <div style={styles.recentSection}>
          <div style={styles.sectionHeader}>
            <div style={styles.sectionTitleBox}>
              <FaClock color="#60a5fa" />
              <h2 style={styles.sectionTitle}>Recent Assigned Papers</h2>
            </div>
            <div style={styles.liveBadge}>LIVE</div>
          </div>

          {recentPapers.length === 0 ? (
            <div style={styles.emptyCard}>
              <FaBookOpen size={45} color="#64748b" />
              <h3>No Assigned Papers Yet</h3>
              <p>Assigned papers will appear here.</p>
            </div>
          ) : (
            <div style={{ overflowX: "auto" }}>
              <table style={styles.table}>
                <thead>
                  <tr>
                    <th style={styles.th}>Subject</th>
                    <th style={styles.th}>Professor</th>
                    <th style={styles.th}>Academic Year</th>
                    <th style={styles.th}>Semester</th>
                    <th style={styles.th}>Exam Type</th>
                    <th style={styles.th}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {recentPapers.map((paper) => (
                    <tr key={paper.id}>
                      <td style={styles.td}>{paper.subject}</td>
                      <td style={styles.td}>{paper.professor_name}</td>
                      <td style={styles.td}>{paper.academic_year}</td>
                      <td style={styles.td}>{paper.semester}</td>
                      <td style={styles.td}>
                        <span style={styles.examBadge}>{paper.exam_type}</span>
                      </td>
                      <td style={styles.td}>
                        <button
                          style={styles.viewBtn}
                          onClick={() => setSelectedPaper(paper)}
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* VIEW MODAL */}
        {selectedPaper && (
          <div style={styles.modalOverlay}>
            <div style={styles.modalBox}>
              <div style={styles.modalHeader}>
                <h2 style={styles.modalTitle}>Assigned Paper Details</h2>
                <button
                  style={styles.modalCloseIcon}
                  onClick={() => setSelectedPaper(null)}
                >
                  ✕
                </button>
              </div>
              <div style={styles.modalContent}>
                <div style={styles.detailRow}>
                  <span>Subject</span>
                  <strong>{selectedPaper.subject}</strong>
                </div>
                <div style={styles.detailRow}>
                  <span>Professor</span>
                  <strong>{selectedPaper.professor_name}</strong>
                </div>
                <div style={styles.detailRow}>
                  <span>Academic Year</span>
                  <strong>{selectedPaper.academic_year}</strong>
                </div>
                <div style={styles.detailRow}>
                  <span>Year</span>
                  <strong>{selectedPaper.year}</strong>
                </div>
                <div style={styles.detailRow}>
                  <span>Semester</span>
                  <strong>{selectedPaper.semester}</strong>
                </div>
                <div style={styles.detailRow}>
                  <span>Exam Type</span>
                  <strong style={styles.modalExamBadge}>
                    {selectedPaper.exam_type}
                  </strong>
                </div>
                <div style={styles.detailRow}>
                  <span>Roll Range</span>
                  <strong>
                    {selectedPaper.start_roll} - {selectedPaper.end_roll}
                  </strong>
                </div>
              </div>
              <div style={styles.modalFooter}>
                <button
                  style={styles.closeBtn}
                  onClick={() => setSelectedPaper(null)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  wrapper: {
    display: "flex"
  },
  container: {
    marginLeft: "280px", // Adjusted slightly to match the 280px width of your Sidebar
    width: "calc(100% - 280px)",
    minHeight: "100vh",
    padding: "35px",
    fontFamily: "'Inter', 'Poppins', sans-serif",
    background: "#f8fafc",
    color: "#0f172a",
    boxSizing: "border-box"
  },
  topBar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "25px"
  },
  logoutBtn: {
    background: "linear-gradient(135deg,#1d4ed8,#2563eb)",
    border: "none",
    color: "white",
    padding: "12px 20px",
    borderRadius: "12px",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: "8px",
    fontSize: "14px",
    fontWeight: "600",
    boxShadow: "0 4px 12px rgba(37,99,235,0.2)"
  },
  heroSection: {
    background: "#ffffff",
    border: "1px solid #e2e8f0",
    borderRadius: "20px",
    padding: "35px 40px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    boxShadow: "0 10px 25px rgba(15,23,42,0.03)"
  },
  welcomeText: {
    fontSize: "14px",
    fontWeight: "600",
    color: "#3b82f6",
    marginBottom: "8px",
    textTransform: "uppercase",
    letterSpacing: "1px"
  },
  mainTitle: {
    fontSize: "32px",
    fontWeight: "800",
    marginBottom: "12px",
    color: "#1e293b",
    letterSpacing: "-0.5px"
  },
  subText: {
    fontSize: "15px",
    color: "#64748b",
    maxWidth: "600px",
    lineHeight: "1.6"
  },
  heroBadge: {
    background: "linear-gradient(135deg,#10b981,#059669)",
    padding: "12px 20px",
    borderRadius: "12px",
    display: "flex",
    alignItems: "center",
    gap: "8px",
    fontWeight: "600",
    fontSize: "14px",
    color: "white",
    boxShadow: "0 8px 16px rgba(16, 185, 129, 0.2)"
  },
  statsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", // Slightly smaller minmax to fit 4 cards nicely
    gap: "20px",
    marginTop: "30px"
  },
  statCard: {
    background: "#ffffff",
    border: "1px solid #e2e8f0",
    padding: "24px",
    borderRadius: "16px",
    display: "flex",
    alignItems: "center",
    gap: "18px",
    boxShadow: "0 4px 12px rgba(15,23,42,0.03)",
    transition: "transform 0.2s ease",
    cursor: "default"
  },
  iconBox: {
    width: "60px",
    height: "60px",
    borderRadius: "14px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontSize: "24px",
    color: "white"
  },
  cardTitle: {
    fontSize: "13px",
    fontWeight: "600",
    color: "#64748b",
    marginBottom: "4px"
  },
  cardValue: {
    fontSize: "28px",
    fontWeight: "800",
    marginBottom: "2px",
    color: "#1e293b",
    lineHeight: "1"
  },
  cardBottom: {
    fontSize: "11px",
    color: "#94a3b8",
    fontWeight: "500"
  },
  recentSection: {
    marginTop: "30px",
    background: "#ffffff",
    border: "1px solid #e2e8f0",
    borderRadius: "20px",
    padding: "30px",
    boxShadow: "0 10px 25px rgba(15,23,42,0.03)"
  },
  sectionHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "25px"
  },
  sectionTitleBox: {
    display: "flex",
    alignItems: "center",
    gap: "10px"
  },
  sectionTitle: {
    fontSize: "20px",
    fontWeight: "700",
    color: "#1e293b"
  },
  liveBadge: {
    background: "#eff6ff",
    border: "1px solid #bfdbfe",
    padding: "6px 12px",
    borderRadius: "20px",
    fontSize: "11px",
    fontWeight: "700",
    color: "#2563eb",
    letterSpacing: "0.5px"
  },
  emptyCard: {
    height: "200px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    gap: "12px",
    color: "#94a3b8",
    background: "#f8fafc",
    borderRadius: "12px",
    border: "2px dashed #e2e8f0"
  },
  table: {
    width: "100%",
    borderCollapse: "collapse"
  },
  th: {
    background: "#f8fafc",
    color: "#475569",
    padding: "16px",
    textAlign: "left",
    fontWeight: "600",
    fontSize: "13px",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
    borderBottom: "2px solid #e2e8f0"
  },
  td: {
    padding: "16px",
    borderBottom: "1px solid #e2e8f0",
    fontSize: "14px",
    color: "#334155",
    fontWeight: "500"
  },
  examBadge: {
    background: "#eff6ff",
    border: "1px solid #bfdbfe",
    padding: "6px 12px",
    borderRadius: "20px",
    fontSize: "12px",
    fontWeight: "600",
    color: "#2563eb"
  },
  viewBtn: {
    background: "#f1f5f9",
    color: "#475569",
    border: "1px solid #cbd5e1",
    padding: "8px 16px",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "600",
    fontSize: "13px",
    transition: "all 0.2s ease"
  },
  modalOverlay: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    background: "rgba(15, 23, 42, 0.6)",
    backdropFilter: "blur(4px)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000
  },
  modalBox: {
    width: "550px",
    maxWidth: "90%",
    background: "#ffffff",
    borderRadius: "20px",
    overflow: "hidden",
    boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)"
  },
  modalHeader: {
    background: "#f8fafc",
    borderBottom: "1px solid #e2e8f0",
    padding: "20px 25px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center"
  },
  modalTitle: {
    margin: 0,
    fontSize: "18px",
    fontWeight: "700",
    color: "#1e293b"
  },
  modalCloseIcon: {
    background: "#f1f5f9",
    border: "none",
    color: "#64748b",
    width: "32px",
    height: "32px",
    borderRadius: "50%",
    cursor: "pointer",
    fontSize: "14px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "background 0.2s"
  },
  modalContent: {
    padding: "25px"
  },
  detailRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "14px 16px",
    marginBottom: "10px",
    background: "#ffffff",
    borderRadius: "10px",
    border: "1px solid #e2e8f0",
    fontSize: "14px",
    color: "#475569"
  },
  modalExamBadge: {
    background: "#eff6ff",
    color: "#2563eb",
    padding: "4px 12px",
    borderRadius: "20px",
    fontSize: "12px",
    border: "1px solid #bfdbfe"
  },
  modalFooter: {
    padding: "15px 25px",
    textAlign: "right",
    background: "#f8fafc",
    borderTop: "1px solid #e2e8f0"
  },
  closeBtn: {
    background: "#1e293b",
    color: "white",
    border: "none",
    padding: "10px 24px",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "600",
    fontSize: "14px"
  }
};