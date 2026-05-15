import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaClipboardCheck, FaSearch, FaUserTie, FaCheckCircle, FaTimes } from "react-icons/fa";
import Sidebar from "../components/Sidebar";

export default function ReviewApplications() {
  const [applications, setApplications] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedApp, setSelectedApp] = useState(null);
  const [committeeMembers, setCommitteeMembers] = useState([]);
  const [selectedProfessor, setSelectedProfessor] = useState("");

  useEffect(() => {
    fetchReviewApplications();
    fetchCommitteeMembers();
  }, []);

  // Fetch pending review applications strictly from DB
  const fetchReviewApplications = async () => {
    try {
      const res = await axios.get("http://localhost:5000/admin/reviews/pending");
      setApplications(res.data);
    } catch (error) {
      console.log("Error fetching reviews:", error);
    }
  };

  // Fetch Professors for the Dropdown
  const fetchCommitteeMembers = async () => {
    try {
      const res = await axios.get("http://localhost:5000/admin/reviews/committee");
      setCommitteeMembers(res.data);
    } catch (error) {
      console.log("Error fetching committee members:", error);
    }
  };

  const handleAssignClick = (app) => {
    setSelectedApp(app);
    setSelectedProfessor("");
    setShowModal(true);
  };

  const handleConfirmAssignment = async () => {
    if (!selectedProfessor) {
      alert("Please select a Review Committee member first.");
      return;
    }

    try {
      await axios.post("http://localhost:5000/admin/reviews/assign", {
        application_id: selectedApp.id,
        professor_id: selectedProfessor
      });

      alert("Review successfully assigned to committee! ✅");
      setShowModal(false);
      
      // Refresh the list from the database
      fetchReviewApplications();
      
    } catch (error) {
      console.log("Assignment error:", error);
      alert("Failed to assign review.");
    }
  };

  const filteredApps = applications.filter((app) =>
    app.student_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    app.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
    app.exam_roll.includes(searchTerm)
  );

  return (
    <>
      <style>{`
        .btn-hover { transition: all 0.2s ease; }
        .btn-hover:hover { transform: translateY(-2px); box-shadow: 0 6px 15px rgba(0,0,0,0.1); }
      `}</style>

      <div style={styles.container}>
        <Sidebar />

        <div style={styles.contentArea}>
          <div style={styles.mainCard}>
            
            <div style={styles.header}>
              <div>
                <h1 style={styles.title}><FaClipboardCheck color="#2563eb" /> Review Applications</h1>
                <p style={styles.subText}>Manage and allocate student re-evaluation requests to the Review Committee.</p>
              </div>
            </div>

            <div style={styles.searchBox}>
              <FaSearch style={styles.searchIcon} />
              <input
                type="text"
                placeholder="Search by Student Name, Roll No, or Subject..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={styles.searchInput}
              />
            </div>

            <div style={styles.tableWrapper}>
              <table style={styles.table}>
                <thead>
                  <tr>
                    <th style={styles.th}>Exam Roll</th>
                    <th style={styles.th}>Student Name</th>
                    <th style={styles.th}>Subject</th>
                    <th style={styles.th}>Current Marks</th>
                    <th style={styles.th}>Status</th>
                    <th style={styles.th}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredApps.length === 0 ? (
                    <tr><td colSpan="6" style={styles.emptyState}>No pending review applications in the database.</td></tr>
                  ) : (
                    filteredApps.map((app) => (
                      <tr key={app.id} style={styles.tr}>
                        <td style={styles.tdBold}>{app.exam_roll}</td>
                        <td style={styles.td}>{app.student_name}</td>
                        <td style={styles.tdActive}>{app.subject}</td>
                        <td style={styles.td}>{app.current_marks}</td>
                        <td style={styles.td}>
                          <span style={styles.statusBadge}>{app.status}</span>
                        </td>
                        <td style={styles.td}>
                          <button 
                            style={styles.assignBtn} 
                            className="btn-hover"
                            onClick={() => handleAssignClick(app)}
                          >
                            <FaUserTie /> Assign Committee
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* ASSIGNMENT MODAL */}
            {showModal && selectedApp && (
              <div style={styles.modalOverlay}>
                <div style={styles.modalBox}>
                  
                  <div style={styles.modalHeader}>
                    <h2 style={styles.modalTitle}>Assign Review Committee</h2>
                    <button style={styles.closeModalBtn} onClick={() => setShowModal(false)}><FaTimes /></button>
                  </div>

                  <div style={styles.modalContent}>
                    <div style={styles.appDetailsBox}>
                      <p><strong>Student:</strong> {selectedApp.student_name} (Roll: {selectedApp.exam_roll})</p>
                      <p><strong>Subject:</strong> {selectedApp.subject}</p>
                      <p><strong>Original Marks:</strong> {selectedApp.current_marks}</p>
                    </div>

                    <h3 style={styles.sectionHeading}>Select Committee Member</h3>
                    <select 
                      style={styles.input} 
                      value={selectedProfessor} 
                      onChange={(e) => setSelectedProfessor(e.target.value)}
                    >
                      <option value="">-- Select Professor --</option>
                      {committeeMembers.map((prof) => (
                        <option key={prof.id} value={prof.id}>
                          {prof.name} ({prof.subject})
                        </option>
                      ))}
                    </select>

                    <div style={styles.modalFooter}>
                      <button style={styles.cancelBtn} className="btn-hover" onClick={() => setShowModal(false)}>Cancel</button>
                      <button style={styles.submitBtn} className="btn-hover" onClick={handleConfirmAssignment}>
                        <FaCheckCircle /> Confirm Assignment
                      </button>
                    </div>
                  </div>

                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </>
  );
}

const styles = {
  container: { display: "flex", background: "#f8fafc", minHeight: "100vh", fontFamily: "'Inter', 'Poppins', sans-serif" },
  contentArea: { marginLeft: "280px", width: "calc(100% - 280px)", padding: "35px", boxSizing: "border-box" },
  mainCard: { background: "#ffffff", padding: "35px", borderRadius: "20px", boxShadow: "0 10px 30px rgba(15,23,42,0.04)", border: "1px solid #e2e8f0" },
  
  header: { marginBottom: "25px" },
  title: { fontSize: "26px", fontWeight: "800", color: "#0f172a", margin: "0 0 5px 0", display: "flex", alignItems: "center", gap: "10px" },
  subText: { color: "#64748b", fontSize: "14px", margin: 0 },
  
  searchBox: { position: "relative", marginBottom: "25px" },
  searchIcon: { position: "absolute", left: "16px", top: "50%", transform: "translateY(-50%)", color: "#94a3b8" },
  searchInput: { width: "100%", padding: "14px 14px 14px 45px", borderRadius: "12px", border: "1px solid #cbd5e1", outline: "none", background: "#f8fafc", fontSize: "14px", boxSizing: "border-box" },

  tableWrapper: { overflowX: "auto", borderRadius: "12px", border: "1px solid #e2e8f0" },
  table: { width: "100%", borderCollapse: "collapse", background: "#fff" },
  th: { background: "#f8fafc", color: "#475569", padding: "16px", fontSize: "13px", fontWeight: "700", textAlign: "left", borderBottom: "2px solid #e2e8f0" },
  tr: { borderBottom: "1px solid #e2e8f0" },
  td: { padding: "16px", fontSize: "14px", color: "#475569", textAlign: "left" },
  tdBold: { padding: "16px", fontSize: "14px", color: "#0f172a", fontWeight: "700", textAlign: "left" },
  tdActive: { padding: "16px", fontSize: "14px", color: "#1e293b", fontWeight: "600", textAlign: "left" },
  statusBadge: { background: "#fef3c7", color: "#b45309", padding: "6px 12px", borderRadius: "20px", fontSize: "12px", fontWeight: "700", border: "1px solid #fde68a" },
  emptyState: { padding: "40px", textAlign: "center", color: "#94a3b8", fontSize: "14px", background: "#f8fafc", fontStyle: "italic" },

  assignBtn: { background: "#2563eb", color: "white", border: "none", padding: "8px 14px", borderRadius: "8px", cursor: "pointer", fontWeight: "600", fontSize: "13px", display: "flex", alignItems: "center", gap: "6px" },

  modalOverlay: { position: "fixed", top: 0, left: 0, width: "100%", height: "100%", background: "rgba(15,23,42,0.6)", backdropFilter: "blur(4px)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 1000 },
  modalBox: { width: "500px", maxWidth: "90%", background: "#fff", borderRadius: "20px", overflow: "hidden", boxShadow: "0 25px 50px rgba(0,0,0,0.2)" },
  modalHeader: { background: "linear-gradient(135deg,#1d4ed8,#2563eb)", padding: "20px 25px", color: "white", display: "flex", justifyContent: "space-between", alignItems: "center" },
  modalTitle: { margin: 0, fontSize: "18px", fontWeight: "700" },
  closeModalBtn: { background: "rgba(255,255,255,0.2)", border: "none", color: "white", width: "32px", height: "32px", borderRadius: "50%", display: "flex", justifyContent: "center", alignItems: "center", cursor: "pointer" },
  
  modalContent: { padding: "30px" },
  appDetailsBox: { background: "#f8fafc", padding: "15px", borderRadius: "10px", border: "1px solid #e2e8f0", marginBottom: "20px", fontSize: "14px", color: "#334155", lineHeight: "1.6" },
  sectionHeading: { fontSize: "14px", color: "#1e293b", marginBottom: "10px", fontWeight: "700" },
  input: { width: "100%", padding: "12px", borderRadius: "10px", border: "1px solid #cbd5e1", fontSize: "14px", outline: "none", background: "#ffffff", boxSizing: "border-box" },
  
  modalFooter: { display: "flex", justifyContent: "flex-end", gap: "12px", marginTop: "25px" },
  cancelBtn: { background: "#f1f5f9", color: "#475569", border: "1px solid #cbd5e1", padding: "12px 20px", borderRadius: "10px", fontWeight: "600", cursor: "pointer" },
  submitBtn: { background: "#10b981", color: "white", border: "none", padding: "12px 20px", borderRadius: "10px", fontWeight: "600", cursor: "pointer", display: "flex", alignItems: "center", gap: "8px" },
};