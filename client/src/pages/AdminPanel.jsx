import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  FaUserTie,
  FaBookOpen,
  FaClipboardList,
  FaTrash,
  FaEdit,
  FaGraduationCap
} from "react-icons/fa";
import Sidebar from "../components/Sidebar";

export default function AdminPanel() {
  const navigate = useNavigate();

  const [professors, setProfessors] = useState([]);
  const [selectedProf, setSelectedProf] = useState(null);
  const [assignedPapers, setAssignedPapers] = useState([]);
  const [editingPaperId, setEditingPaperId] = useState(null);
  
  const [academicYears, setAcademicYears] = useState([]);
  const [years, setYears] = useState([]);
  const [semesters, setSemesters] = useState([]);
  const [examTypes, setExamTypes] = useState([]);
  const [examRules, setExamRules] = useState([]);
  const [selectedRule, setSelectedRule] = useState(null);
  const [creditPoints, setCreditPoints] = useState([]);

  const [formData, setFormData] = useState({
    professor_id: "",
    academic_year: "", 
    year: "",
    semester: "",
    subject: "",
    exam_type: "",
    credit_point: "",
    start_roll: "",
    end_roll: "",
  });

  useEffect(() => {
    fetchProfessors();
    fetchAssignedPapers();
    fetchDropdowns();
  }, []);

  const fetchProfessors = async () => {
    try {
      const res = await axios.get("http://localhost:5000/admin/professors").catch(() => ({ data: [] }));
      setProfessors(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchAssignedPapers = async () => {
    try {
      const res = await axios.get("http://localhost:5000/assignment/all").catch(() => ({ data: [] }));
      setAssignedPapers(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchDropdowns = async () => {
    try {
      // Catching errors individually to prevent UI crashes if backend isn't ready
      const [yearRes, semRes, examRes, academicRes, ruleRes, creditRes] = await Promise.all([
        axios.get("http://localhost:5000/dropdown/years").catch(() => ({ data: [] })),
        axios.get("http://localhost:5000/dropdown/semesters").catch(() => ({ data: [] })),
        axios.get("http://localhost:5000/dropdown/exam-types").catch(() => ({ data: [] })),
        axios.get("http://localhost:5000/dropdown/academic-years").catch(() => ({ data: [] })),
        axios.get("http://localhost:5000/dropdown/exam-type-rules").catch(() => ({ data: [] })),
        axios.get("http://localhost:5000/dropdown/credit-points").catch(() => ({ data: [] }))
      ]);

      setYears(yearRes.data);
      setSemesters(semRes.data);
      setExamTypes(examRes.data);
      setAcademicYears(academicRes.data);
      setExamRules(ruleRes.data);
      setCreditPoints(creditRes.data);
    } catch (err) {
      console.log(err);
    }
  };

  const handleDeletePaper = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to remove this assigned paper?");
    if (!confirmDelete) return;

    try {
      await axios.delete(`http://localhost:5000/assignment/delete/${id}`);
      alert("Assigned Paper Removed Successfully ✅");
      fetchAssignedPapers();
    } catch (error) {
      console.log(error);
    }
  };

  const handleEditPaper = (paper) => {
    setEditingPaperId(paper.id);
    setFormData({
      professor_id: paper.professor_id,
      academic_year: paper.academic_year || "",
      year: paper.year,
      semester: paper.semester,
      subject: paper.subject,
      exam_type: paper.exam_type,
      credit_point: paper.credit_point || "",
      start_roll: paper.start_roll,
      end_roll: paper.end_roll,
    });

    const prof = professors.find((p) => p.id == paper.professor_id);
    setSelectedProf(prof);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleProfessorChange = (e) => {
    const id = e.target.value;
    const prof = professors.find((p) => p.id == id);
    setFormData({
      ...formData,
      professor_id: id,
      subject: prof ? prof.subject : "", 
    });
    setSelectedProf(prof);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    let updated = { ...formData, [name]: value };

    if (name === "exam_type") {
      const rule = examRules.find((r) => r.exam_type_name === value);
      setSelectedRule(rule || null);
    }
    setFormData(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { professor_id, academic_year, year, semester, subject, exam_type, credit_point, start_roll, end_roll } = formData;

    if (!professor_id || !academic_year || !year || !semester || !subject || !exam_type || !credit_point || !start_roll || !end_roll) {
      alert("All fields are required ❌");
      return;
    }

    try {
      if (editingPaperId) {
        await axios.put(`http://localhost:5000/assignment/update/${editingPaperId}`, formData);
        alert("Paper Updated Successfully ✅");
        setEditingPaperId(null);
      } else {
        await axios.post("http://localhost:5000/assignment/assign-paper", formData);
        alert("Paper Assigned Successfully ✅");
      }

      setFormData({
        professor_id: "", academic_year: "", year: "", semester: "", subject: "", exam_type: "", credit_point: "", start_roll: "", end_roll: "",
      });
      setSelectedProf(null);
      fetchAssignedPapers();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <style>{`
        .assign-btn { transition: all 0.3s ease; }
        .assign-btn:hover { transform: translateY(-2px); box-shadow: 0 8px 25px rgba(37,99,235,0.4); }
        .action-btn { transition: all 0.2s ease; display: flex; align-items: center; justify-content: center; width: 35px; height: 35px; border-radius: 8px; border: none; cursor: pointer; color: white; }
        .btn-edit { background: #10b981; }
        .btn-edit:hover { background: #059669; transform: scale(1.05); }
        .btn-delete { background: #ef4444; }
        .btn-delete:hover { background: #dc2626; transform: scale(1.05); }
        
        @media (max-width: 1024px) {
          .paper-row { grid-template-columns: 1fr !important; gap: 10px; text-align: left; }
          .col-actions { justify-content: flex-start !important; }
        }
      `}</style>

      <div style={styles.container}>
        <Sidebar />
        
        <div style={styles.contentArea}>
          <div style={styles.mainCard}>
            {/* Title */}
            <div style={styles.header}>
              <FaGraduationCap size={30} color="#2563eb" />
              <h1 style={styles.title}>Assign Examination Paper</h1>
            </div>

            {/* Select Professor */}
            <select
              value={formData.professor_id}
              onChange={handleProfessorChange}
              style={styles.input}
            >
              <option value="">Select Professor to Assign</option>
              {professors.map((p) => (
                <option key={p.id} value={p.id}>{p.name} - {p.subject}</option>
              ))}
            </select>

            {/* Professor Info Card */}
            {selectedProf && (
              <div style={styles.profCard}>
                <div style={styles.profIconBox}>
                  <FaUserTie size={24} color="#ffffff" />
                </div>
                <div>
                  <h3 style={styles.profName}>{selectedProf.name}</h3>
                  <p style={styles.profDetails}>{selectedProf.designation} • {selectedProf.subject}</p>
                  <p style={styles.profContact}>{selectedProf.email} | {selectedProf.mobile}</p>
                </div>
              </div>
            )}

            {/* Form */}
            {selectedProf && (
              <form onSubmit={handleSubmit}>
                <div style={styles.grid}>
                  <select name="academic_year" value={formData.academic_year} onChange={handleChange} style={styles.input}>
                    <option value="">Select Academic Year</option>
                    {academicYears.map((y) => (<option key={y.id} value={y.year_label}>{y.year_label}</option>))}
                  </select>

                  <select name="year" value={formData.year} onChange={handleChange} style={styles.input}>
                    <option value="">Select Year</option>
                    {years.map((y) => (<option key={y.id} value={y.year_name}>{y.year_name}</option>))}
                  </select>

                  <select name="semester" value={formData.semester} onChange={handleChange} style={styles.input}>
                    <option value="">Select Semester</option>
                    {semesters.map((s) => (<option key={s.id} value={s.semester_name}>{s.semester_name}</option>))}
                  </select>

                  <input name="subject" placeholder="Professor Subject" value={formData.subject} readOnly style={{...styles.input, background: "#f1f5f9", cursor: "not-allowed", color: "#475569", fontWeight: "600"}} />

                  <select name="exam_type" value={formData.exam_type} onChange={handleChange} style={styles.input}>
                    <option value="">Select Exam Type</option>
                    {examTypes.map((e) => (<option key={e.id} value={e.exam_type_name}>{e.exam_type_name}</option>))}
                  </select>

                  <select name="credit_point" value={formData.credit_point} onChange={handleChange} style={styles.input}>
                    <option value="">Select Credit Point</option>
                    {creditPoints.map((c) => (<option key={c.id} value={c.credit_value}>{c.credit_value}</option>))}
                  </select>

                  <input type="number" name="start_roll" placeholder="Start Roll No." value={formData.start_roll} onChange={handleChange} style={styles.input} />
                  <input type="number" name="end_roll" placeholder="End Roll No." value={formData.end_roll} onChange={handleChange} style={styles.input} />
                </div>

                {/* Exam Rules Preview */}
                {selectedRule && (
                  <div style={styles.ruleBox}>
                    <p>Theory Marks: <strong>{selectedRule.theory}</strong></p>
                    <p>Practical Marks: <strong>{selectedRule.practical}</strong></p>
                    <p>Attendance: <strong>{selectedRule.attendance}</strong></p>
                    <p style={styles.totalMarks}>Total: {selectedRule.theory + selectedRule.practical + selectedRule.attendance}</p>
                  </div>
                )}

                <button type="submit" style={styles.assignBtn} className="assign-btn">
                  {editingPaperId ? "Update Paper Assignment" : "Confirm Assignment"}
                </button>
              </form>
            )}
          </div>

          {/* Assigned Papers Section */}
          <div style={styles.assignedSection}>
            <h2 style={styles.assignedTitle}>
              <FaClipboardList color="#2563eb" /> Active Assignments
            </h2>

            {assignedPapers.length === 0 ? (
              <div style={styles.emptyState}>No papers have been assigned yet.</div>
            ) : (
              <div style={styles.paperTable}>
                {/* Table Header */}
                <div style={styles.tableHeader}>
                  <div>Subject & Prof</div>
                  <div style={{textAlign: "center"}}>Term</div>
                  <div style={{textAlign: "center"}}>Exam Type</div>
                  <div style={{textAlign: "center"}}>Roll Range</div>
                  <div style={{textAlign: "center"}}>Actions</div>
                </div>

                {assignedPapers.map((paper) => (
                  <div key={paper.id} style={styles.paperRow} className="paper-row">
                    <div style={styles.colSubject}>
                      <span style={{display: "block", fontWeight: "700", color: "#1e293b", marginBottom: "4px"}}><FaBookOpen color="#3b82f6" /> {paper.subject}</span>
                      <span style={{fontSize: "12px", color: "#64748b"}}>{paper.professor_name}</span>
                    </div>

                    <div style={styles.col}>
                      <span style={{display: "block", fontWeight: "600", color: "#334155"}}>{paper.academic_year}</span>
                      <span style={{fontSize: "12px", color: "#64748b"}}>{paper.year} • {paper.semester}</span>
                    </div>

                    <div style={styles.col}>
                      <span style={styles.examBadge}>{paper.exam_type}</span>
                    </div>

                    <div style={styles.col}>
                      <span style={{fontWeight: "600", color: "#0f172a"}}>{paper.start_roll}</span> - <span style={{fontWeight: "600", color: "#0f172a"}}>{paper.end_roll}</span>
                    </div>

                    <div style={styles.colActions} className="col-actions">
                      <button className="action-btn btn-edit" onClick={() => handleEditPaper(paper)} title="Edit">
                        <FaEdit />
                      </button>
                      <button className="action-btn btn-delete" onClick={() => handleDeletePaper(paper.id)} title="Delete">
                        <FaTrash />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

/* POLISHED STYLES */
const styles = {
  container: {
    display: "flex",
    background: "#f8fafc",
    minHeight: "100vh",
    fontFamily: "'Inter', 'Poppins', sans-serif",
  },
  contentArea: {
    marginLeft: "280px", // Sidebar width
    padding: "40px",
    width: "calc(100% - 280px)",
    boxSizing: "border-box"
  },
  mainCard: {
    background: "#ffffff",
    padding: "35px",
    borderRadius: "20px",
    boxShadow: "0 10px 30px rgba(15,23,42,0.04)",
    border: "1px solid #e2e8f0",
  },
  header: {
    display: "flex",
    alignItems: "center",
    gap: "15px",
    marginBottom: "25px",
    paddingBottom: "15px",
    borderBottom: "1px solid #f1f5f9"
  },
  title: {
    fontSize: "26px",
    fontWeight: "800",
    color: "#0f172a",
    margin: 0
  },
  input: {
    width: "100%",
    padding: "14px 16px",
    borderRadius: "12px",
    border: "1px solid #cbd5e1",
    outline: "none",
    background: "#ffffff",
    color: "#1e293b",
    fontSize: "14px",
    fontWeight: "500",
    boxSizing: "border-box",
    transition: "border-color 0.2s"
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
    gap: "20px",
    marginTop: "20px"
  },
  profCard: {
    display: "flex",
    alignItems: "center",
    gap: "20px",
    background: "linear-gradient(to right, #f8fafc, #ffffff)",
    padding: "20px",
    borderRadius: "16px",
    marginTop: "20px",
    border: "1px solid #e2e8f0",
  },
  profIconBox: {
    width: "50px",
    height: "50px",
    borderRadius: "12px",
    background: "#2563eb",
    display: "flex",
    justifyContent: "center",
    alignItems: "center"
  },
  profName: { margin: "0 0 4px 0", fontSize: "18px", color: "#0f172a", fontWeight: "700" },
  profDetails: { margin: "0 0 2px 0", fontSize: "14px", color: "#475569", fontWeight: "500" },
  profContact: { margin: 0, fontSize: "13px", color: "#94a3b8" },
  ruleBox: {
    background: "#eff6ff",
    border: "1px solid #bfdbfe",
    padding: "16px 20px",
    borderRadius: "12px",
    marginTop: "20px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    fontSize: "14px",
    color: "#1e3a8a"
  },
  totalMarks: { background: "#2563eb", color: "white", padding: "6px 14px", borderRadius: "8px", fontWeight: "700" },
  assignBtn: {
    width: "100%",
    padding: "16px",
    background: "linear-gradient(135deg,#1d4ed8,#2563eb)",
    border: "none",
    borderRadius: "12px",
    cursor: "pointer",
    fontWeight: "700",
    color: "white",
    fontSize: "15px",
    marginTop: "25px",
    boxShadow: "0 4px 12px rgba(37,99,235,0.2)"
  },
  assignedSection: {
    marginTop: "35px",
    background: "#ffffff",
    padding: "35px",
    borderRadius: "20px",
    border: "1px solid #e2e8f0",
    boxShadow: "0 10px 30px rgba(15,23,42,0.04)",
  },
  assignedTitle: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    fontSize: "22px",
    fontWeight: "800",
    marginBottom: "25px",
    color: "#0f172a",
    margin: "0 0 25px 0"
  },
  tableHeader: {
    display: "grid",
    gridTemplateColumns: "2.5fr 1.5fr 1.5fr 1.5fr 1fr",
    padding: "0 16px 12px 16px",
    borderBottom: "2px solid #e2e8f0",
    fontSize: "13px",
    fontWeight: "700",
    color: "#64748b",
    textTransform: "uppercase"
  },
  paperTable: { display: "flex", flexDirection: "column", gap: "12px" },
  paperRow: {
    display: "grid",
    gridTemplateColumns: "2.5fr 1.5fr 1.5fr 1.5fr 1fr",
    alignItems: "center",
    background: "#ffffff",
    padding: "16px",
    borderRadius: "12px",
    border: "1px solid #e2e8f0",
    transition: "box-shadow 0.2s",
  },
  colSubject: { display: "flex", flexDirection: "column", gap: "4px" },
  col: { textAlign: "center" },
  colActions: { display: "flex", justifyContent: "center", gap: "8px" },
  examBadge: {
    background: "#f1f5f9",
    border: "1px solid #cbd5e1",
    padding: "6px 12px",
    borderRadius: "8px",
    color: "#475569",
    fontSize: "12px",
    fontWeight: "700"
  },
  emptyState: { textAlign: "center", padding: "40px", color: "#94a3b8", background: "#f8fafc", borderRadius: "12px", border: "2px dashed #e2e8f0" },
};