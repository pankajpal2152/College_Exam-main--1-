import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaUserGraduate, FaPlus, FaSearch, FaEdit, FaTrash, FaTimes, FaFileExcel } from "react-icons/fa";
import Sidebar from "../components/Sidebar";

export default function StudentModule() {
    const [students, setStudents] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [editingId, setEditingId] = useState(null);

    // Form State mapping to the Excel headers you provided
    const [formData, setFormData] = useState({
        name: "", reg_no: "", exam_roll: "", abcid: "", stream: "",
        major: "", minor1: "", minor2: "", aec1: "", mdc1: "", vac1: "", sec1_p: ""
    });

    useEffect(() => {
        fetchStudents();
    }, []);

    const fetchStudents = async () => {
        try {
            const res = await axios.get("http://localhost:5000/admin/students").catch(() => ({ data: [] }));
            setStudents(res.data);
        } catch (error) {
            console.log(error);
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleEdit = (student) => {
        setEditingId(student.id);
        setFormData({
            name: student.name || "", reg_no: student.reg_no || "", exam_roll: student.exam_roll || "",
            abcid: student.abcid || "", stream: student.stream || "", major: student.major || "",
            minor1: student.minor1 || "", minor2: student.minor2 || "", aec1: student.aec1 || "",
            mdc1: student.mdc1 || "", vac1: student.vac1 || "", sec1_p: student.sec1_p || ""
        });
        setShowModal(true);
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this student record?")) return;
        try {
            await axios.delete(`http://localhost:5000/admin/students/${id}`);
            alert("Student Deleted ✅");
            fetchStudents();
        } catch (error) {
            console.log(error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingId) {
                await axios.put(`http://localhost:5000/admin/students/${editingId}`, formData);
                alert("Student Updated ✅");
            } else {
                await axios.post("http://localhost:5000/admin/students", formData);
                alert("Student Registered ✅");
            }
            setShowModal(false);
            setEditingId(null);
            setFormData({ name: "", reg_no: "", exam_roll: "", abcid: "", stream: "", major: "", minor1: "", minor2: "", aec1: "", mdc1: "", vac1: "", sec1_p: "" });
            fetchStudents();
        } catch (error) {
            console.log(error);
            alert("Error saving student data.");
        }
    };

    const filteredStudents = students.filter(
        (s) =>
            s.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            s.reg_no?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            s.abcid?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <>
            <style>{`
        .btn-hover { transition: all 0.2s ease; }
        .btn-hover:hover { transform: translateY(-2px); box-shadow: 0 6px 15px rgba(0,0,0,0.1); }
        .table-row:hover { background: #f8fafc !important; }
      `}</style>

            <div style={styles.container}>
                <Sidebar />

                <div style={styles.contentArea}>
                    <div style={styles.mainCard}>

                        {/* Header Section */}
                        <div style={styles.header}>
                            <div>
                                <h1 style={styles.title}><FaUserGraduate color="#2563eb" /> Student Database</h1>
                                <p style={styles.subText}>Manage academic records, subjects, and ABC IDs.</p>
                            </div>
                            <div style={styles.headerActions}>
                                <button style={styles.exportBtn} className="btn-hover" onClick={() => alert("Excel Export Feature Pending")}>
                                    <FaFileExcel /> Export
                                </button>
                                <button style={styles.addBtn} className="btn-hover" onClick={() => { setEditingId(null); setShowModal(true); }}>
                                    <FaPlus /> Register Student
                                </button>
                            </div>
                        </div>

                        {/* Search Bar */}
                        <div style={styles.searchBox}>
                            <FaSearch style={styles.searchIcon} />
                            <input
                                type="text"
                                placeholder="Search by Name, Reg No, or ABC ID..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                style={styles.searchInput}
                            />
                        </div>

                        {/* Data Table */}
                        <div style={styles.tableWrapper}>
                            <table style={styles.table}>
                                <thead>
                                    <tr>
                                        <th style={styles.th}>Reg No.</th>
                                        <th style={styles.th}>Exam Roll</th>
                                        <th style={styles.th}>Student Name</th>
                                        <th style={styles.th}>Major Subject</th>
                                        <th style={styles.th}>ABC ID</th>
                                        <th style={styles.th}>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredStudents.length === 0 ? (
                                        <tr><td colSpan="6" style={styles.emptyState}>No students found in the database.</td></tr>
                                    ) : (
                                        filteredStudents.map((s) => (
                                            <tr key={s.id} style={styles.tr} className="table-row">
                                                <td style={styles.tdBold}>{s.reg_no}</td>
                                                <td style={styles.td}>{s.exam_roll}</td>
                                                <td style={styles.tdActive}>{s.name}</td>
                                                <td style={styles.td}>{s.major}</td>
                                                <td style={styles.tdBadge}><span style={styles.abcBadge}>{s.abcid}</span></td>
                                                <td style={styles.td}>
                                                    <div style={styles.actionButtons}>
                                                        <button style={styles.editBtn} className="btn-hover" onClick={() => handleEdit(s)}><FaEdit /></button>
                                                        <button style={styles.deleteBtn} className="btn-hover" onClick={() => handleDelete(s.id)}><FaTrash /></button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* ADD/EDIT MODAL */}
                        {showModal && (
                            <div style={styles.modalOverlay}>
                                <div style={styles.modalBox}>

                                    <div style={styles.modalHeader}>
                                        <h2 style={styles.modalTitle}>{editingId ? "Update Student Record" : "Register New Student"}</h2>
                                        <button style={styles.closeModalBtn} onClick={() => setShowModal(false)}><FaTimes /></button>
                                    </div>

                                    <form onSubmit={handleSubmit} style={styles.modalContent}>

                                        <h3 style={styles.sectionHeading}>Basic Information</h3>
                                        <div style={styles.formGrid}>
                                            <input name="name" value={formData.name} onChange={handleChange} placeholder="Full Name" required style={styles.input} />
                                            <input name="reg_no" value={formData.reg_no} onChange={handleChange} placeholder="Registration Number" required style={styles.input} />
                                            <input name="exam_roll" value={formData.exam_roll} onChange={handleChange} placeholder="Examination Roll" required style={styles.input} />
                                            <input name="abcid" value={formData.abcid} onChange={handleChange} placeholder="ABC ID (Academic Bank of Credits)" style={styles.input} />
                                            <input name="stream" value={formData.stream} onChange={handleChange} placeholder="Stream (e.g., B.Tech, B.Sc)" required style={styles.input} />
                                        </div>

                                        <h3 style={styles.sectionHeading}>Academic Subjects</h3>
                                        <div style={styles.formGrid}>
                                            <input name="major" value={formData.major} onChange={handleChange} placeholder="Major Subject" required style={styles.input} />
                                            <input name="minor1" value={formData.minor1} onChange={handleChange} placeholder="Minor 1" style={styles.input} />
                                            <input name="minor2" value={formData.minor2} onChange={handleChange} placeholder="Minor 2" style={styles.input} />
                                            <input name="aec1" value={formData.aec1} onChange={handleChange} placeholder="AEC" style={styles.input} />
                                            <input name="mdc1" value={formData.mdc1} onChange={handleChange} placeholder="MDC" style={styles.input} />
                                            <input name="vac1" value={formData.vac1} onChange={handleChange} placeholder="VAC" style={styles.input} />
                                            <input name="sec1_p" value={formData.sec1_p} onChange={handleChange} placeholder="SEC" style={styles.input} />
                                        </div>

                                        <div style={styles.modalFooter}>
                                            <button type="button" style={styles.cancelBtn} className="btn-hover" onClick={() => setShowModal(false)}>Cancel</button>
                                            <button type="submit" style={styles.submitBtn} className="btn-hover">{editingId ? "Update Record" : "Save Record"}</button>
                                        </div>

                                    </form>
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

    header: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "25px" },
    title: { fontSize: "26px", fontWeight: "800", color: "#0f172a", margin: "0 0 5px 0", display: "flex", alignItems: "center", gap: "10px" },
    subText: { color: "#64748b", fontSize: "14px", margin: 0 },

    headerActions: { display: "flex", gap: "12px" },
    exportBtn: { background: "#10b981", color: "white", border: "none", padding: "10px 18px", borderRadius: "10px", fontWeight: "600", display: "flex", alignItems: "center", gap: "8px", cursor: "pointer" },
    addBtn: { background: "#2563eb", color: "white", border: "none", padding: "10px 18px", borderRadius: "10px", fontWeight: "600", display: "flex", alignItems: "center", gap: "8px", cursor: "pointer" },

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
    tdBadge: { padding: "16px", textAlign: "left" },
    abcBadge: { background: "#eff6ff", color: "#2563eb", padding: "6px 12px", borderRadius: "20px", fontSize: "12px", fontWeight: "700", border: "1px solid #bfdbfe" },
    emptyState: { padding: "40px", textAlign: "center", color: "#94a3b8", fontSize: "14px", background: "#f8fafc" },

    actionButtons: { display: "flex", gap: "8px" },
    editBtn: { background: "#f59e0b", color: "white", border: "none", padding: "8px 12px", borderRadius: "8px", cursor: "pointer" },
    deleteBtn: { background: "#ef4444", color: "white", border: "none", padding: "8px 12px", borderRadius: "8px", cursor: "pointer" },

    modalOverlay: { position: "fixed", top: 0, left: 0, width: "100%", height: "100%", background: "rgba(15,23,42,0.6)", backdropFilter: "blur(4px)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 1000 },
    modalBox: { width: "700px", maxWidth: "90%", background: "#fff", borderRadius: "20px", overflow: "hidden", boxShadow: "0 25px 50px rgba(0,0,0,0.2)" },
    modalHeader: { background: "linear-gradient(135deg,#1d4ed8,#2563eb)", padding: "20px 25px", color: "white", display: "flex", justifyContent: "space-between", alignItems: "center" },
    modalTitle: { margin: 0, fontSize: "18px", fontWeight: "700" },
    closeModalBtn: { background: "rgba(255,255,255,0.2)", border: "none", color: "white", width: "32px", height: "32px", borderRadius: "50%", display: "flex", justifyContent: "center", alignItems: "center", cursor: "pointer" },

    modalContent: { padding: "30px", maxHeight: "75vh", overflowY: "auto" },
    sectionHeading: { fontSize: "15px", color: "#2563eb", marginBottom: "15px", borderBottom: "2px solid #f1f5f9", paddingBottom: "8px" },
    formGrid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px", marginBottom: "25px" },
    input: { padding: "12px", borderRadius: "10px", border: "1px solid #cbd5e1", fontSize: "14px", outline: "none", background: "#f8fafc" },

    modalFooter: { display: "flex", justifyContent: "flex-end", gap: "12px", marginTop: "10px" },
    cancelBtn: { background: "#f1f5f9", color: "#475569", border: "1px solid #cbd5e1", padding: "12px 20px", borderRadius: "10px", fontWeight: "600", cursor: "pointer" },
    submitBtn: { background: "#2563eb", color: "white", border: "none", padding: "12px 24px", borderRadius: "10px", fontWeight: "600", cursor: "pointer" },
};