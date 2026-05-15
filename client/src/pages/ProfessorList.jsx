import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";

export default function ProfessorList() {
  const navigate = useNavigate();

  const [professors, setProfessors] = useState([]);
  const [selectedProfessor, setSelectedProfessor] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingProfessor, setEditingProfessor] = useState(null);

  const [editForm, setEditForm] = useState({
    name: "",
    designation: "",
    subject: "",
    email: "",
    mobile: "",
    experience: "",
    photo: "",
    bank_name: "",
    branch_name: "",
    ifsc_code: "",
    account_number: "",
    account_holder_name: ""
  });

  useEffect(() => {
    fetchProfessors();
  }, []);

  const fetchProfessors = async () => {
    try {
      const res = await axios.get("http://localhost:5000/admin/professors").catch(() => ({ data: [] }));
      setProfessors(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleEditClick = (professor) => {
    setEditingProfessor(professor.id);

    setEditForm({
      name: professor.name || "",
      designation: professor.designation || "",
      subject: professor.subject || "",
      email: professor.email || "",
      mobile: professor.mobile || "",
      experience: professor.experience || "",
      photo: professor.photo || "",
      bank_name: professor.bank_name || "",
      branch_name: professor.branch_name || "",
      ifsc_code: professor.ifsc_code || "",
      account_number: professor.account_number || "",
      account_holder_name: professor.account_holder_name || ""
    });
  };

  const handleEditChange = (e) => {
    setEditForm({
      ...editForm,
      [e.target.name]: e.target.value
    });
  };

  const handleFinalUpdate = async (id) => {
    try {
      await axios.put(
        `http://localhost:5000/admin/update-professor/${id}`,
        editForm
      );

      alert("Professor Updated Successfully ✅");
      setEditingProfessor(null);
      fetchProfessors();
    } catch (error) {
      console.log(error);
      alert("Error updating professor.");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this professor?")) return;

    try {
      await axios.delete(
        `http://localhost:5000/admin/delete-professor/${id}`
      );

      alert("Deleted Successfully ❌");
      setSelectedProfessor(null);
      fetchProfessors();
    } catch (error) {
      console.log(error);
    }
  };

  const filteredProfessors = professors.filter(
    (p) =>
      p.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.subject?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.designation?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <style>{`
        .prof-row { transition: all 0.2s ease; }
        .prof-row:hover { background: #f8fafc !important; }
        .btn-hover { transition: transform 0.2s ease; }
        .btn-hover:hover { transform: scale(1.05); }
        .close-btn-hover:hover { background: rgba(255,255,255,0.3) !important; }
      `}</style>

      <div style={styles.container}>
        <Sidebar />

        <div style={styles.contentArea}>
          <div style={styles.mainCard}>

            <h1 style={styles.title}>Professor Directory</h1>

            <input
              type="text"
              placeholder="Search by name, subject, or designation..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={styles.searchInput}
            />

            {/* TABLE */}
            <div style={styles.tableWrapper}>
              <table style={styles.table}>
                <thead>
                  <tr>
                    <th style={styles.th}>Photo</th>
                    <th style={styles.th}>Name</th>
                    <th style={styles.th}>Designation</th>
                    <th style={styles.th}>Subject</th>
                    <th style={styles.th}>Mobile</th>
                    <th style={styles.th}>Action</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredProfessors.length === 0 ? (
                    <tr>
                      <td colSpan="6" style={styles.emptyState}>No professors found.</td>
                    </tr>
                  ) : (
                    filteredProfessors.map((p) => (
                      <tr key={p.id} style={styles.tr} className="prof-row">
                        <td style={styles.td}>
                          <img
                            src={p.photo ? `http://localhost:5000/uploads/${p.photo}` : "https://via.placeholder.com/45/2563eb/ffffff?text=P"}
                            alt={p.name}
                            style={styles.photo}
                          />
                        </td>
                        <td style={styles.tdActive}>{p.name}</td>
                        <td style={styles.td}>{p.designation}</td>
                        <td style={styles.td}>{p.subject}</td>
                        <td style={styles.td}>{p.mobile}</td>

                        <td style={styles.td}>
                          <div style={styles.actionButtons}>
                            <button
                              className="btn-hover"
                              style={styles.viewBtn}
                              onClick={() => setSelectedProfessor(p)}
                            >
                              View
                            </button>

                            <button
                              className="btn-hover"
                              style={styles.updateBtn}
                              onClick={() => handleEditClick(p)}
                            >
                              Edit
                            </button>

                            <button
                              className="btn-hover"
                              style={styles.deleteBtn}
                              onClick={() => handleDelete(p.id)}
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* VIEW MODAL */}
            {selectedProfessor && (
              <div style={styles.overlay}>
                <div style={styles.viewModal}>
                  
                  {/* Header */}
                  <div style={styles.viewTopSection}>
                    <button
                      className="close-btn-hover"
                      style={styles.viewCloseBtn}
                      onClick={() => setSelectedProfessor(null)}
                    >
                      ✕
                    </button>

                    <img
                      src={selectedProfessor.photo ? `http://localhost:5000/uploads/${selectedProfessor.photo}` : "https://via.placeholder.com/70/ffffff/2563eb?text=P"}
                      alt="Professor"
                      style={styles.viewPhoto}
                    />

                    <h2 style={styles.viewName}>
                      {selectedProfessor.name}
                    </h2>

                    <p style={styles.viewDesignation}>
                      {selectedProfessor.designation}
                    </p>

                    <div style={styles.profIdBadge}>
                      ID: {String(selectedProfessor.id).padStart(4, "0")}
                    </div>
                  </div>

                  {/* Details */}
                  <div style={styles.viewDetailsGrid}>
                    <div style={styles.viewInfoCard}>
                      <span style={styles.viewInfoLabel}>Subject</span>
                      <strong>{selectedProfessor.subject}</strong>
                    </div>

                    <div style={styles.viewInfoCard}>
                      <span style={styles.viewInfoLabel}>Email</span>
                      <strong>{selectedProfessor.email}</strong>
                    </div>

                    <div style={styles.viewInfoCard}>
                      <span style={styles.viewInfoLabel}>Mobile</span>
                      <strong>{selectedProfessor.mobile}</strong>
                    </div>

                    <div style={styles.viewInfoCard}>
                      <span style={styles.viewInfoLabel}>Experience</span>
                      <strong>{selectedProfessor.experience}</strong>
                    </div>

                    <div style={styles.viewInfoCard}>
                      <span style={styles.viewInfoLabel}>Bank Name</span>
                      <strong>{selectedProfessor.bank_name || "N/A"}</strong>
                    </div>

                    <div style={styles.viewInfoCard}>
                      <span style={styles.viewInfoLabel}>Branch</span>
                      <strong>{selectedProfessor.branch_name || "N/A"}</strong>
                    </div>

                    <div style={styles.viewInfoCard}>
                      <span style={styles.viewInfoLabel}>IFSC Code</span>
                      <strong>{selectedProfessor.ifsc_code || "N/A"}</strong>
                    </div>

                    <div style={styles.viewInfoCard}>
                      <span style={styles.viewInfoLabel}>Account No</span>
                      <strong>{selectedProfessor.account_number || "N/A"}</strong>
                    </div>

                    <div style={{...styles.viewInfoCard, gridColumn: "span 2"}}>
                      <span style={styles.viewInfoLabel}>Account Holder Name</span>
                      <strong>{selectedProfessor.account_holder_name || "N/A"}</strong>
                    </div>
                  </div>

                  {/* Footer */}
                  <div style={styles.viewFooter}>
                    <button
                      className="btn-hover"
                      style={styles.closeProfileBtn}
                      onClick={() => setSelectedProfessor(null)}
                    >
                      Close Profile
                    </button>
                  </div>

                </div>
              </div>
            )}

            {/* EDIT MODAL */}
            {editingProfessor && (
              <div style={styles.overlay}>
                <div style={styles.editModal}>

                  <h2 style={styles.modalTitle}>Update Professor Profile</h2>

                  {/* PERSONAL INFO */}
                  <div style={styles.sectionCard}>
                    <h3 style={styles.sectionTitle}>Personal Information</h3>
                    <div style={styles.formGrid}>
                      <input name="name" value={editForm.name} onChange={handleEditChange} placeholder="Full Name" style={styles.input} />
                      <input name="designation" value={editForm.designation} onChange={handleEditChange} placeholder="Designation" style={styles.input} />
                      <input name="subject" value={editForm.subject} onChange={handleEditChange} placeholder="Subject" style={styles.input} />
                      <input type="email" name="email" value={editForm.email} onChange={handleEditChange} placeholder="Email" style={styles.input} />
                      <input name="mobile" value={editForm.mobile} onChange={handleEditChange} placeholder="Mobile" style={styles.input} />
                      <input name="experience" value={editForm.experience} onChange={handleEditChange} placeholder="Experience" style={styles.input} />
                    </div>
                  </div>

                  {/* BANK INFO */}
                  <div style={styles.sectionCard}>
                    <h3 style={styles.sectionTitle}>Bank Details</h3>
                    <div style={styles.formGrid}>
                      <input name="bank_name" value={editForm.bank_name} onChange={handleEditChange} placeholder="Bank Name" style={styles.input} />
                      <input name="branch_name" value={editForm.branch_name} onChange={handleEditChange} placeholder="Branch Name" style={styles.input} />
                      <input name="ifsc_code" value={editForm.ifsc_code} onChange={handleEditChange} placeholder="IFSC Code" style={styles.input} />
                      <input name="account_number" value={editForm.account_number} onChange={handleEditChange} placeholder="Account Number" style={styles.input} />
                      <input name="account_holder_name" value={editForm.account_holder_name} onChange={handleEditChange} placeholder="Account Holder Name" style={styles.input} />
                      <input name="photo" value={editForm.photo} onChange={handleEditChange} placeholder="Photo File Name" style={styles.input} />
                    </div>
                  </div>

                  {/* BUTTONS */}
                  <div style={styles.editButtons}>
                    <button
                      className="btn-hover"
                      onClick={() => setEditingProfessor(null)}
                      style={styles.closeBtn}
                    >
                      Cancel
                    </button>
                    <button
                      className="btn-hover"
                      onClick={() => handleFinalUpdate(editingProfessor)}
                      style={styles.saveBtn}
                    >
                      Save Changes
                    </button>
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

/* 🔥 STYLES */
const styles = {
  container: {
    display: "flex",
    background: "#f8fafc",
    minHeight: "100vh",
    fontFamily: "'Inter', 'Poppins', sans-serif"
  },
  contentArea: {
    marginLeft: "280px", // Match sidebar width
    padding: "35px",
    width: "calc(100% - 280px)",
    boxSizing: "border-box"
  },
  mainCard: {
    background: "#ffffff",
    padding: "35px",
    borderRadius: "20px",
    boxShadow: "0 10px 30px rgba(15,23,42,0.04)",
    border: "1px solid #e2e8f0"
  },
  title: {
    fontSize: "26px",
    fontWeight: "800",
    color: "#0f172a",
    marginBottom: "25px",
    margin: "0 0 25px 0"
  },
  searchInput: {
    width: "100%",
    padding: "16px",
    borderRadius: "12px",
    border: "1px solid #cbd5e1",
    outline: "none",
    background: "#f8fafc",
    marginBottom: "25px",
    fontSize: "14px",
    color: "#334155",
    transition: "border-color 0.2s"
  },

  /* TABLE */
  tableWrapper: {
    overflowX: "auto",
    borderRadius: "12px",
    border: "1px solid #e2e8f0"
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    background: "#fff",
  },
  th: {
    background: "#f8fafc",
    color: "#475569",
    padding: "16px",
    fontSize: "13px",
    fontWeight: "600",
    textAlign: "center",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
    borderBottom: "2px solid #e2e8f0"
  },
  tr: {
    borderBottom: "1px solid #e2e8f0",
  },
  td: {
    padding: "16px",
    textAlign: "center",
    fontSize: "14px",
    color: "#475569"
  },
  tdActive: {
    padding: "16px",
    textAlign: "center",
    fontSize: "14px",
    color: "#0f172a",
    fontWeight: "600"
  },
  photo: {
    width: "40px",
    height: "40px",
    borderRadius: "50%",
    objectFit: "cover",
    border: "2px solid #e2e8f0"
  },
  emptyState: {
    padding: "40px",
    textAlign: "center",
    color: "#94a3b8",
    fontSize: "14px"
  },

  /* ACTION BUTTONS */
  actionButtons: {
    display: "flex",
    gap: "8px",
    justifyContent: "center"
  },
  viewBtn: {
    background: "#f1f5f9",
    color: "#475569",
    border: "1px solid #cbd5e1",
    padding: "6px 12px",
    borderRadius: "8px",
    fontSize: "13px",
    fontWeight: "600",
    cursor: "pointer"
  },
  updateBtn: {
    background: "#10b981",
    color: "#fff",
    border: "none",
    padding: "6px 12px",
    borderRadius: "8px",
    fontSize: "13px",
    fontWeight: "600",
    cursor: "pointer"
  },
  deleteBtn: {
    background: "#ef4444",
    color: "#fff",
    border: "none",
    padding: "6px 12px",
    borderRadius: "8px",
    fontSize: "13px",
    fontWeight: "600",
    cursor: "pointer"
  },

  /* ================= MODAL BASE ================= */
  overlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(15,23,42,0.6)",
    backdropFilter: "blur(4px)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 999
  },

  /* ================= VIEW MODAL ================= */
  viewModal: {
    width: "550px",
    maxWidth: "90%",
    background: "#fff",
    borderRadius: "20px",
    overflow: "hidden",
    boxShadow: "0 25px 50px -12px rgba(0,0,0,0.25)"
  },
  viewTopSection: {
    background: "linear-gradient(135deg,#1d4ed8,#2563eb)",
    padding: "25px",
    textAlign: "center",
    color: "#fff",
    position: "relative"
  },
  viewCloseBtn: {
    position: "absolute",
    top: "15px",
    right: "15px",
    background: "rgba(255,255,255,0.15)",
    border: "none",
    color: "#fff",
    width: "32px",
    height: "32px",
    borderRadius: "50%",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "14px",
    transition: "background 0.2s"
  },
  viewPhoto: {
    width: "80px",
    height: "80px",
    borderRadius: "50%",
    border: "4px solid rgba(255,255,255,0.3)",
    objectFit: "cover",
    marginBottom: "10px"
  },
  viewName: {
    margin: "0",
    fontSize: "22px",
    fontWeight: "800"
  },
  viewDesignation: {
    margin: "4px 0 0 0",
    fontSize: "14px",
    opacity: "0.9"
  },
  profIdBadge: {
    marginTop: "12px",
    background: "rgba(255,255,255,0.2)",
    color: "#ffffff",
    padding: "4px 14px",
    borderRadius: "20px",
    fontSize: "12px",
    fontWeight: "600",
    display: "inline-block"
  },
  viewDetailsGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "12px",
    padding: "25px"
  },
  viewInfoCard: {
    background: "#f8fafc",
    border: "1px solid #e2e8f0",
    padding: "12px 16px",
    borderRadius: "10px",
    display: "flex",
    flexDirection: "column",
    gap: "4px",
    fontSize: "14px",
    color: "#0f172a"
  },
  viewInfoLabel: {
    fontSize: "11px",
    color: "#64748b",
    textTransform: "uppercase",
    fontWeight: "700",
    letterSpacing: "0.5px"
  },
  viewFooter: {
    padding: "15px 25px",
    textAlign: "right",
    background: "#f8fafc",
    borderTop: "1px solid #e2e8f0"
  },
  closeProfileBtn: {
    background: "#1e293b",
    color: "#fff",
    border: "none",
    padding: "10px 20px",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "600",
    fontSize: "13px"
  },

  /* ================= EDIT MODAL ================= */
  editModal: {
    width: "650px",
    maxWidth: "95%",
    background: "#fff",
    borderRadius: "20px",
    padding: "30px",
    maxHeight: "90vh",
    overflowY: "auto",
    boxShadow: "0 25px 50px -12px rgba(0,0,0,0.25)"
  },
  modalTitle: {
    margin: "0 0 25px 0",
    fontSize: "22px",
    fontWeight: "800",
    color: "#0f172a",
  },
  sectionCard: {
    background: "#f8fafc",
    border: "1px solid #e2e8f0",
    padding: "20px",
    borderRadius: "16px",
    marginBottom: "20px"
  },
  sectionTitle: {
    margin: "0 0 15px 0",
    fontSize: "15px",
    fontWeight: "700",
    color: "#2563eb",
  },
  formGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "15px"
  },
  input: {
    padding: "12px",
    borderRadius: "10px",
    border: "1px solid #cbd5e1",
    fontSize: "14px",
    outline: "none",
    color: "#1e293b",
    transition: "border-color 0.2s"
  },
  editButtons: {
    display: "flex",
    justifyContent: "flex-end",
    gap: "12px",
    marginTop: "25px"
  },
  saveBtn: {
    background: "linear-gradient(135deg,#1d4ed8,#2563eb)",
    color: "#fff",
    padding: "12px 24px",
    border: "none",
    borderRadius: "10px",
    cursor: "pointer",
    fontWeight: "600",
    fontSize: "14px"
  },
  closeBtn: {
    background: "#f1f5f9",
    color: "#475569",
    padding: "12px 24px",
    border: "1px solid #cbd5e1",
    borderRadius: "10px",
    cursor: "pointer",
    fontWeight: "600",
    fontSize: "14px"
  }
};