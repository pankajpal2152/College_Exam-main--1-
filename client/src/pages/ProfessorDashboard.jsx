import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";

import {
  FaBookOpen,
  FaUserTie,
  FaCalendarAlt,
  FaClipboardCheck,
  FaSignOutAlt,
  FaPhone,
  FaEnvelope,
  FaBriefcase,
  FaGraduationCap
} from "react-icons/fa";

export default function ProfessorDashboard() {
  const navigate = useNavigate();

  // Retrieve professor data from localStorage
  const profStr = localStorage.getItem("professor");
  const storedProf = profStr ? JSON.parse(profStr) : null;

  // State to hold sanitized professor data (stripping out sensitive fields)
  const [prof, setProf] = useState(null);
  const [papers, setPapers] = useState([]);

  useEffect(() => {
    // 1. Check if logged in
    if (!storedProf || !storedProf.id) {
      navigate("/professor-login");
      return;
    }

    // 2. Sanitize data (Never store or handle passwords in state if possible)
    const { password, ...safeProfData } = storedProf;
    setProf(safeProfData);

    // 3. Fetch Assigned Papers based on Professor ID
    const fetchPapers = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/professor/assigned/${safeProfData.id}`);
        setPapers(res.data);
      } catch (err) {
        console.log("Error fetching papers:", err);
        // Fallback for UI testing if backend isn't ready
        setPapers([
          { id: 1, subject: "Computer Networks", academic_year: "2023-2024", semester: "4th", exam_type: "Major", year: "2nd Year", start_roll: 101, end_roll: 150 },
          { id: 2, subject: "Operating Systems", academic_year: "2023-2024", semester: "4th", exam_type: "Minor", year: "2nd Year", start_roll: 101, end_roll: 150 }
        ]);
      }
    };

    fetchPapers();
  }, [navigate]); // Intentionally omitting storedProf to prevent infinite loops from object reference changes

  const handleLogout = () => {
    const confirm = window.confirm("Are you sure you want to log out?");
    if (!confirm) return;

    localStorage.removeItem("professor");
    navigate("/professor-login");
  };

  // Do not render the dashboard until the professor data is validated
  if (!prof) {
    return null;
  }

  return (
    <>
      <style>{`
        .paper-card-hover {
          transition: all 0.2s ease;
        }
        .paper-card-hover:hover {
          transform: translateX(4px);
          box-shadow: 0 8px 20px rgba(37,99,235,0.1) !important;
          border-color: #bfdbfe !important;
        }
        .review-btn-hover {
          transition: all 0.2s ease;
        }
        .review-btn-hover:hover {
          background: linear-gradient(135deg, #1d4ed8, #2563eb) !important;
          transform: scale(1.02);
        }
      `}</style>

      <div style={styles.layoutContainer}>

        {/* Sidebar */}
        <Sidebar />

        {/* Main Content */}
        <div style={styles.contentArea}>
          <div style={styles.container}>

            {/* Navbar */}
            <div style={styles.navbar}>
              <div>
                <h2 style={styles.navTitle}>Professor Dashboard</h2>
                <p style={styles.subText}>
                  Manage your assigned evaluation papers easily
                </p>
              </div>

              <button onClick={handleLogout} style={styles.logoutBtn}>
                <FaSignOutAlt />
                Logout
              </button>
            </div>

            {/* Hero Section */}
            <div style={styles.hero}>
              <div>
                <h1 style={styles.heroTitle}>Welcome Back, {prof.name} 👋</h1>
                <p style={styles.heroSubText}>Track your evaluation workflow efficiently.</p>
              </div>

              <div style={styles.heroCard}>
                <FaClipboardCheck size={32} color="#ffffff" style={{ opacity: 0.9 }} />
                <h2 style={styles.heroCardNumber}>{papers.length}</h2>
                <p style={styles.heroCardLabel}>Total Assigned Papers</p>
              </div>
            </div>

            {/* Main Section */}
            <div style={styles.mainGrid}>

              {/* Profile Card (Left Column) */}
              <div style={styles.profileCard}>
                {/* Fallback image if photo is null in DB */}
                <img
                  src={prof.photo ? `http://localhost:5000/uploads/${prof.photo}` : "https://via.placeholder.com/150/2563eb/ffffff?text=Prof"}
                  alt="Professor Profile"
                  style={styles.profileImage}
                />

                <h2 style={styles.profileName}>{prof.name}</h2>

                <div style={styles.detailsList}>
                  <div style={styles.detailRow}>
                    <FaUserTie color="#64748b" />
                    <span><strong>Designation:</strong> {prof.designation || "Not Set"}</span>
                  </div>

                  <div style={styles.detailRow}>
                    <FaGraduationCap color="#64748b" />
                    <span><strong>Subject:</strong> {prof.subject || "Not Set"}</span>
                  </div>

                  <div style={styles.detailRow}>
                    <FaEnvelope color="#64748b" />
                    <span><strong>Email:</strong> {prof.email}</span>
                  </div>

                  <div style={styles.detailRow}>
                    <FaPhone color="#64748b" />
                    <span><strong>Mobile:</strong> {prof.mobile || "Not Set"}</span>
                  </div>

                  <div style={styles.detailRow}>
                    <FaBriefcase color="#64748b" />
                    <span><strong>Experience:</strong> {prof.experience || "Not Set"}</span>
                  </div>
                </div>
              </div>

              {/* Assigned Papers (Right Column) */}
              <div style={styles.paperSection}>
                <h2 style={styles.sectionTitle}>Your Assigned Papers</h2>

                {papers.length === 0 ? (
                  <div style={styles.emptyCard}>
                    <FaBookOpen size={50} color="#cbd5e1" style={{ marginBottom: "15px" }} />
                    <h3 style={{ color: "#475569" }}>No Papers Assigned Yet</h3>
                    <p style={{ color: "#94a3b8" }}>The Administration has not assigned any papers to your queue.</p>
                  </div>
                ) : (
                  <div style={styles.paperList}>
                    {papers.map((paper) => (
                      <div key={paper.id} style={styles.paperListItem} className="paper-card-hover">

                        <div style={styles.leftInfo}>
                          <div style={styles.titleRow}>
                            <FaBookOpen style={{ color: "#2563eb" }} />
                            <h3 style={styles.paperTitle}>{paper.subject}</h3>
                          </div>

                          <div style={styles.metaRow}>
                            <span>{paper.academic_year}</span>
                            <span>• Sem {paper.semester}</span>
                            <span>• {paper.exam_type}</span>
                          </div>

                          <div style={styles.extraRow}>
                            Year: <strong>{paper.year}</strong> | Roll Range: <strong>{paper.start_roll} - {paper.end_roll}</strong>
                          </div>
                        </div>
                        <button
                          style={{
                            ...styles.reviewBtn,
                            background: paper.status === "Submitted" ? "#64748b" : "linear-gradient(135deg,#2563eb,#3b82f6)"
                          }}
                          onClick={() => navigate("/review-marks", { state: { paper } })}
                        >
                          {paper.status === "Submitted" ? "View Marks" : "Start Evaluation"}
                        </button>

                      </div>
                    ))}
                  </div>
                )}
              </div>

            </div>
          </div>
        </div>
      </div>
    </>
  );
}

// ---------------- STYLES ----------------
const styles = {
  layoutContainer: {
    display: "flex",
    background: "#f8fafc", // Softer slate background
    minHeight: "100vh"
  },
  contentArea: {
    marginLeft: "280px", // sidebar width
    width: "calc(100% - 280px)",
    minHeight: "100vh",
    boxSizing: "border-box"
  },
  container: {
    padding: "35px",
    color: "#0f172a",
    fontFamily: "'Inter', 'Poppins', sans-serif"
  },
  navbar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "20px 30px",
    background: "#ffffff",
    borderRadius: "20px",
    border: "1px solid #e2e8f0",
    boxShadow: "0 10px 25px rgba(15,23,42,0.03)"
  },
  navTitle: { margin: 0, fontSize: "22px", fontWeight: "800", color: "#1e293b" },
  subText: { margin: "4px 0 0 0", color: "#64748b", fontSize: "14px" },
  logoutBtn: {
    background: "linear-gradient(135deg, #ef4444, #dc2626)",
    color: "#fff",
    border: "none",
    padding: "12px 20px",
    borderRadius: "12px",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: "8px",
    fontWeight: "600",
    fontSize: "14px",
    boxShadow: "0 4px 12px rgba(239,68,68,0.2)"
  },
  hero: {
    marginTop: "30px",
    padding: "40px",
    borderRadius: "24px",
    background: "linear-gradient(135deg, #2563eb, #3b82f6)",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    color: "#fff",
    boxShadow: "0 15px 30px rgba(37,99,235,0.2)"
  },
  heroTitle: { margin: 0, fontSize: "32px", fontWeight: "800", letterSpacing: "-0.5px" },
  heroSubText: { margin: "8px 0 0 0", fontSize: "16px", color: "#dbeafe" },
  heroCard: {
    background: "rgba(255,255,255,0.15)",
    backdropFilter: "blur(10px)",
    border: "1px solid rgba(255,255,255,0.2)",
    padding: "25px 40px",
    borderRadius: "20px",
    textAlign: "center",
    boxShadow: "0 8px 20px rgba(0,0,0,0.1)"
  },
  heroCardNumber: { margin: "10px 0 0 0", fontSize: "36px", fontWeight: "900", lineHeight: "1" },
  heroCardLabel: { margin: "5px 0 0 0", fontSize: "13px", fontWeight: "600", color: "#e0e7ff", textTransform: "uppercase" },

  mainGrid: {
    display: "grid",
    gridTemplateColumns: "360px 1fr",
    gap: "30px",
    marginTop: "30px"
  },

  profileCard: {
    background: "#ffffff",
    padding: "40px 30px",
    borderRadius: "24px",
    textAlign: "center",
    border: "1px solid #e2e8f0",
    boxShadow: "0 10px 25px rgba(15,23,42,0.03)",
    height: "fit-content"
  },
  profileImage: {
    width: "140px",
    height: "140px",
    borderRadius: "50%",
    objectFit: "cover",
    border: "4px solid #eff6ff",
    boxShadow: "0 8px 20px rgba(37,99,235,0.15)",
    marginBottom: "20px"
  },
  profileName: { margin: "0 0 25px 0", fontSize: "24px", fontWeight: "800", color: "#0f172a" },

  detailsList: {
    display: "flex",
    flexDirection: "column",
    gap: "16px",
    textAlign: "left"
  },
  detailRow: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    fontSize: "14px",
    color: "#334155",
    paddingBottom: "12px",
    borderBottom: "1px solid #f1f5f9"
  },

  paperSection: {
    background: "#ffffff",
    padding: "35px",
    borderRadius: "24px",
    border: "1px solid #e2e8f0",
    boxShadow: "0 10px 25px rgba(15,23,42,0.03)"
  },
  sectionTitle: { margin: "0 0 25px 0", fontSize: "22px", fontWeight: "800", color: "#1e293b" },

  emptyCard: {
    textAlign: "center",
    padding: "60px 20px",
    background: "#f8fafc",
    borderRadius: "16px",
    border: "2px dashed #e2e8f0"
  },

  paperList: {
    display: "flex",
    flexDirection: "column",
    gap: "16px"
  },
  paperListItem: {
    background: "#ffffff",
    padding: "24px",
    borderRadius: "16px",
    border: "1px solid #e2e8f0",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    boxShadow: "0 4px 10px rgba(15,23,42,0.02)",
  },
  leftInfo: {
    display: "flex",
    flexDirection: "column",
    gap: "8px"
  },
  titleRow: {
    display: "flex",
    alignItems: "center",
    gap: "10px"
  },
  paperTitle: {
    margin: 0,
    fontSize: "18px",
    fontWeight: "700",
    color: "#0f172a"
  },
  metaRow: {
    fontSize: "13px",
    color: "#2563eb",
    display: "flex",
    gap: "10px",
    fontWeight: "600"
  },
  extraRow: {
    fontSize: "13px",
    color: "#64748b"
  },
  reviewBtn: {
    padding: "14px 24px",
    border: "none",
    borderRadius: "12px",
    background: "#2563eb",
    color: "white",
    cursor: "pointer",
    fontWeight: "600",
    fontSize: "14px",
    boxShadow: "0 6px 15px rgba(37,99,235,0.2)"
  }
};