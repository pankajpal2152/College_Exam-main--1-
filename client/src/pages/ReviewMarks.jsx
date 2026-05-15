import React, { useEffect, useState } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import { FaSave, FaEdit, FaArrowLeft, FaCheckCircle, FaBookOpen, FaGraduationCap, FaLock } from "react-icons/fa";
import Sidebar from "../components/Sidebar";

export default function ReviewMarks() {
  const location = useLocation();
  const navigate = useNavigate();
  const [paper, setPaper] = useState(location.state?.paper);
  const [students, setStudents] = useState([]);
  
  // Safely check if locked
  const isLocked = paper?.status === "Submitted";

  useEffect(() => {
    // If there is no paper data (e.g., user refreshed the page), send them back to dashboard
    if (!paper) {
      navigate("/professor-dashboard");
      return;
    }
    loadSavedMarks();
  }, [paper, navigate]);

  const loadSavedMarks = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/marks/${paper.id}`);
      const savedMarks = res.data;
      let arr = [];
      for (let i = paper.start_roll; i <= paper.end_roll; i++) {
        const existingStudent = savedMarks.find((item) => Number(item.roll_no) === i);
        arr.push({
          roll_no: i,
          marks: existingStudent ? String(existingStudent.marks) : "",
          remarks: existingStudent ? existingStudent.remarks : "",
          grade: existingStudent ? existingStudent.grade : "",
          saved: Boolean(existingStudent)
        });
      }
      setStudents(arr);
    } catch (error) { console.log(error); }
  };

  const handleChange = async (index, field, value) => {
    if (isLocked) return;
    const updated = [...students];
    updated[index][field] = value;
    if (field === "marks") {
      try {
        if (value === "") {
          updated[index].grade = "";
        } else {
          const res = await axios.get(`http://localhost:5000/marks/grade/${value}`);
          updated[index].grade = res.data.grade || "-";
        }
      } catch (error) { console.log(error); }
    }
    setStudents(updated);
  };

  const handleSaveAll = async () => {
    if (isLocked) return;
    try {
      const filtered = students.filter(s => !s.saved && (s.marks !== "" || s.remarks !== ""));
      for (let s of filtered) {
        await axios.post("http://localhost:5000/marks/save", {
          assignment_id: paper.id, roll_no: s.roll_no, marks: s.marks, remarks: s.remarks
        });
      }
      alert("Progress Saved ✅");
      loadSavedMarks();
    } catch (error) { alert("Error saving marks."); }
  };

  const handleUpdateAll = async () => {
    if (isLocked) return;
    try {
      const filtered = students.filter(s => s.marks !== "" || s.remarks !== "");
      for (let s of filtered) {
        await axios.put(`http://localhost:5000/marks/update/${paper.id}/${s.roll_no}`, {
          marks: s.marks, remarks: s.remarks
        });
      }
      alert("Marks Updated Successfully ✅");
      loadSavedMarks();
    } catch (error) { alert("Error updating marks."); }
  };

  const handleFinalSubmit = async () => {
    const confirm = window.confirm("Are you sure? Once submitted, marks cannot be changed!");
    if (!confirm) return;
    try {
      await axios.put(`http://localhost:5000/assignment/final-submit/${paper.id}`);
      alert("Marks Locked and Submitted ✅");
      setPaper({ ...paper, status: "Submitted" });
    } catch (error) { alert("Submission failed."); }
  };

  // Safe fallback UI while redirecting if paper is undefined
  if (!paper) {
    return (
      <div style={styles.pageWrapper}>
        <Sidebar />
        <div style={styles.contentArea}>
          <div style={styles.container}>
            <h2>Redirecting to Dashboard...</h2>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.pageWrapper}>
      <Sidebar />
      <div style={styles.contentArea}>
        <div style={styles.container}>
          
          <div style={styles.header}>
            <div>
              <h1 style={styles.pageTitle}>Evaluation Panel {isLocked && <FaLock size={18} color="#ef4444" />}</h1>
              <p style={styles.subText}>{isLocked ? "This paper is submitted and locked." : "Enter student marks for the assigned paper."}</p>
            </div>
            <button onClick={() => navigate("/professor-dashboard")} style={styles.backBtn}>
              <FaArrowLeft /> Back
            </button>
          </div>

          {/* Added Optional Chaining (?.) to prevent any future undefined crashes */}
          <div style={styles.paperInfoCard}>
            <div style={styles.paperDetails}>
              <h2 style={styles.paperSubject}>{paper?.subject} ({paper?.status})</h2>
              <div style={styles.paperBadges}>
                <span style={styles.badge}><FaGraduationCap /> {paper?.academic_year}</span>
                <span style={styles.badgeRoll}>Rolls: {paper?.start_roll} - {paper?.end_roll}</span>
              </div>
            </div>
          </div>

          <div style={styles.tableContainer}>
            <table style={styles.table}>
              <thead>
                <tr style={styles.tableHeader}>
                  <th style={styles.th}>Roll No</th>
                  <th style={styles.th}>Marks</th>
                  <th style={styles.th}>Remarks</th>
                  <th style={styles.th}>Grade</th>
                </tr>
              </thead>
              <tbody>
                {students.map((student, index) => (
                  <tr key={student.roll_no} style={styles.tr}>
                    <td style={styles.tdRoll}>{student.roll_no}</td>
                    <td style={styles.td}>
                      <input type="number" disabled={isLocked} value={student.marks} onChange={(e) => handleChange(index, "marks", e.target.value)} style={styles.input} />
                    </td>
                    <td style={styles.td}>
                      <input type="text" disabled={isLocked} value={student.remarks} onChange={(e) => handleChange(index, "remarks", e.target.value)} style={styles.input} />
                    </td>
                    <td style={styles.td}><div style={styles.gradeBox}>{student.grade || "-"}</div></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {!isLocked && (
            <div style={styles.actionRow}>
              <button style={styles.saveBtn} onClick={handleSaveAll}><FaSave /> Save Progress</button>
              <button style={styles.editBtn} onClick={handleUpdateAll}><FaEdit /> Update Changes</button>
              <button style={styles.submitBtn} onClick={handleFinalSubmit}><FaCheckCircle /> Final Submit</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const styles = {
  pageWrapper: { display: "flex", background: "#f8fafc", minHeight: "100vh" },
  contentArea: { marginLeft: "280px", width: "calc(100% - 280px)", boxSizing: "border-box" },
  container: { padding: "40px", fontFamily: "'Poppins', sans-serif" },
  header: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "25px", background: "#fff", padding: "20px", borderRadius: "15px", boxShadow: "0 4px 12px rgba(0,0,0,0.05)" },
  pageTitle: { margin: 0, fontSize: "22px", fontWeight: "700", display: "flex", alignItems: "center", gap: "10px" },
  subText: { color: "#64748b", margin: 0, fontSize: "14px", marginTop: "5px" },
  backBtn: { background: "#f1f5f9", color: "#334155", border: "1px solid #cbd5e1", padding: "8px 16px", borderRadius: "10px", cursor: "pointer", display: "flex", gap: "8px", alignItems: "center", fontWeight: "600" },
  paperInfoCard: { background: "linear-gradient(135deg, #1e293b, #0f172a)", padding: "25px", borderRadius: "15px", marginBottom: "25px", color: "#fff", boxShadow: "0 10px 20px rgba(15,23,42,0.15)" },
  paperSubject: { margin: "0 0 12px 0", fontSize: "20px", fontWeight: "700" },
  paperBadges: { display: "flex", gap: "10px" },
  badge: { background: "rgba(255,255,255,0.15)", padding: "6px 14px", borderRadius: "8px", fontSize: "12px", fontWeight: "600", display: "flex", alignItems: "center", gap: "6px" },
  badgeRoll: { background: "#2563eb", padding: "6px 14px", borderRadius: "8px", fontSize: "12px", fontWeight: "700" },
  tableContainer: { background: "#fff", borderRadius: "15px", overflow: "hidden", border: "1px solid #e2e8f0", boxShadow: "0 5px 15px rgba(0,0,0,0.03)" },
  table: { width: "100%", borderCollapse: "collapse" },
  tableHeader: { background: "#f8fafc", borderBottom: "2px solid #e2e8f0" },
  th: { padding: "16px", textAlign: "center", color: "#475569", fontSize: "13px", textTransform: "uppercase", fontWeight: "700", letterSpacing: "0.5px" },
  tr: { borderBottom: "1px solid #f1f5f9" },
  td: { padding: "12px" },
  tdRoll: { textAlign: "center", fontWeight: "700", color: "#0f172a" },
  input: { width: "90%", padding: "12px", borderRadius: "8px", border: "1px solid #cbd5e1", textAlign: "center", fontSize: "14px", outline: "none" },
  gradeBox: { background: "#eff6ff", color: "#2563eb", padding: "10px", borderRadius: "8px", fontWeight: "800", textAlign: "center", fontSize: "15px" },
  actionRow: { marginTop: "25px", display: "flex", gap: "15px", justifyContent: "flex-end", alignItems: "center" },
  saveBtn: { background: "#10b981", color: "#fff", border: "none", padding: "12px 25px", borderRadius: "10px", cursor: "pointer", fontWeight: "600", display: "flex", alignItems: "center", gap: "8px" },
  editBtn: { background: "#f59e0b", color: "#fff", border: "none", padding: "12px 25px", borderRadius: "10px", cursor: "pointer", fontWeight: "600", display: "flex", alignItems: "center", gap: "8px" },
  submitBtn: { background: "#2563eb", color: "#fff", border: "none", padding: "12px 25px", borderRadius: "10px", cursor: "pointer", fontWeight: "600", display: "flex", alignItems: "center", gap: "8px" }
};