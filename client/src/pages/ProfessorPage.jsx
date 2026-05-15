import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  FaUserTie,
  FaCheckCircle,
  FaImage,
  FaTimes
} from "react-icons/fa";
import Sidebar from "../components/Sidebar";

export default function ProfessorPage() {
  const navigate = useNavigate();
  const [showPreview, setShowPreview] = useState(false);
  const [designations, setDesignations] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [photoPreviewUrl, setPhotoPreviewUrl] = useState(null); // Fix for image preview

  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    designation: "",
    subject: "",
    email: "",
    password: "",
    confirmPassword: "",
    mobile: "",
    experience: "",
    photo: null,
    bank_name: "",
    branch_name: "",
    ifsc_code: "",
    account_number: "",
    account_holder_name: "",
    bank_address: ""
  });

  useEffect(() => {
    fetchDropdownData();
  }, []);

  const fetchDropdownData = async () => {
    try {
      const designationRes = await axios.get("http://localhost:5000/dropdown/designations").catch(() => ({ data: [] }));
      const subjectRes = await axios.get("http://localhost:5000/dropdown/subjects").catch(() => ({ data: [] }));
      
      setDesignations(designationRes.data);
      setSubjects(subjectRes.data);
    } catch (error) {
      console.log("Dropdown error:", error);
    }
  };

  const onlyCharacters = (value) => /^[A-Za-z\s]*$/.test(value);
  const onlyNumbers = (value) => /^[0-9]*$/.test(value);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (
      ["first_name", "last_name", "designation", "subject", "bank_name", "branch_name", "account_holder_name", "bank_address"].includes(name)
    ) {
      if (!onlyCharacters(value) && value !== "") return;
    }

    if (name === "mobile") {
      if (!onlyNumbers(value) || value.length > 10) return;
    }

    if (name === "account_number") {
      if (!onlyNumbers(value) && value !== "") return;
    }

    setFormData({ ...formData, [name]: value });
  };

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, photo: file });
      // Generate a readable URL for the browser preview
      setPhotoPreviewUrl(URL.createObjectURL(file)); 
    }
  };

  const removePhoto = () => {
    setFormData({ ...formData, photo: null });
    setPhotoPreviewUrl(null);
  };

  const handlePreview = (e) => {
    e.preventDefault();

    // Basic validation check
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match ❌");
      return;
    }

    setShowPreview(true);
  };

  const handleSubmit = async () => {
    try {
      const form = new FormData();
      form.append("name", `${formData.first_name} ${formData.last_name}`);
      form.append("designation", formData.designation);
      form.append("subject", formData.subject);
      form.append("email", formData.email);
      form.append("password", formData.password);
      form.append("mobile", formData.mobile);
      form.append("experience", formData.experience);
      form.append("bank_name", formData.bank_name);
      form.append("branch_name", formData.branch_name);
      form.append("ifsc_code", formData.ifsc_code);
      form.append("account_number", formData.account_number);
      form.append("account_holder_name", formData.account_holder_name);
      form.append("bank_address", formData.bank_address);

      if (formData.photo) {
        form.append("photo", formData.photo);
      }

      await axios.post("http://localhost:5000/admin/add-professor", form);
      alert("Professor Added Successfully ✅");
      
      navigate("/professor-list"); // Redirect to the list view after adding

    } catch (err) {
      console.log("Submit Error:", err);
      alert("Something went wrong ❌");
    }
  };

  return (
    <>
      <style>{`
        .add-prof-input { transition: all 0.2s ease; border: 1px solid #cbd5e1; }
        .add-prof-input:focus { border-color: #2563eb; box-shadow: 0 0 0 3px rgba(37,99,235,0.1); }
        .btn-hover { transition: transform 0.2s ease, box-shadow 0.2s ease; }
        .btn-hover:hover { transform: translateY(-2px); box-shadow: 0 6px 15px rgba(0,0,0,0.1); }
      `}</style>

      <div style={styles.wrapper}>
        <Sidebar />

        <div style={styles.container}>
          <div style={styles.mainCard}>

            <div style={styles.header}>
              <FaUserTie size={40} color="#2563eb" />
              <h1 style={styles.title}>Register New Professor</h1>
              <p style={styles.subText}>Enter faculty details to grant them portal access.</p>
            </div>

            {/* FORM */}
            <form onSubmit={handlePreview}>
              
              {/* PHOTO UPLOAD BOX */}
              <div style={styles.section}>
                <h2 style={styles.photoTitle}><FaImage /> Profile Photo</h2>
                
                <div style={styles.photoUploadBox}>
                  {!photoPreviewUrl ? (
                    <div style={styles.photoPlaceholder}>
                      <span style={{marginBottom: "8px", fontSize: "24px"}}>📸</span>
                      No Photo Selected
                    </div>
                  ) : (
                    <img src={photoPreviewUrl} alt="Preview" style={styles.uploadPreview} />
                  )}

                  <div style={styles.photoActions}>
                    <input
                      id="photoInput"
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoUpload}
                      style={styles.fileInput}
                    />
                    {photoPreviewUrl && (
                      <button type="button" onClick={removePhoto} style={styles.removeBtn}>
                        Remove
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* PERSONAL DETAILS */}
              <div style={styles.section}>
                <h2 style={styles.sectionTitle}>Personal Details</h2>
                
                <div style={styles.grid2}>
                  <input name="first_name" placeholder="First Name" value={formData.first_name} onChange={handleChange} required style={styles.input} className="add-prof-input" />
                  <input name="last_name" placeholder="Last Name" value={formData.last_name} onChange={handleChange} required style={styles.input} className="add-prof-input" />
                </div>

                <div style={styles.grid3}>
                  <select name="designation" value={formData.designation} onChange={handleChange} required style={styles.input} className="add-prof-input">
                    <option value="">Select Designation</option>
                    {designations.map((d) => (<option key={d.id} value={d.designation_name}>{d.designation_name}</option>))}
                  </select>

                  <select name="subject" value={formData.subject} onChange={handleChange} required style={styles.input} className="add-prof-input">
                    <option value="">Select Subject</option>
                    {subjects.map((s) => (<option key={s.id} value={s.subject_name}>{s.subject_name}</option>))}
                  </select>

                  <input name="experience" placeholder="Experience (e.g., 5 Years)" value={formData.experience} onChange={handleChange} required style={styles.input} className="add-prof-input" />
                </div>
              </div>

              {/* LOGIN DETAILS */}
              <div style={styles.section}>
                <h2 style={styles.sectionTitle}>Account & Login Credentials</h2>
                
                <div style={styles.loginGrid}>
                  <input name="mobile" placeholder="Mobile Number" value={formData.mobile} onChange={handleChange} required style={styles.input} className="add-prof-input" />
                  <input type="email" name="email" placeholder="Institutional Email" value={formData.email} onChange={handleChange} required style={styles.input} className="add-prof-input" />
                  <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} required style={styles.input} className="add-prof-input" />
                  <input type="password" name="confirmPassword" placeholder="Confirm Password" value={formData.confirmPassword} onChange={handleChange} required style={styles.input} className="add-prof-input" />
                </div>
              </div>

              {/* BANK DETAILS */}
              <div style={styles.section}>
                <h2 style={styles.sectionTitle}>Bank & Financial Details</h2>
                
                <div style={styles.grid3}>
                  <input name="account_holder_name" placeholder="Account Holder Name" value={formData.account_holder_name} onChange={handleChange} style={styles.input} className="add-prof-input" />
                  <input name="bank_name" placeholder="Bank Name" value={formData.bank_name} onChange={handleChange} style={styles.input} className="add-prof-input" />
                  <input name="account_number" placeholder="Account Number" value={formData.account_number} onChange={handleChange} style={styles.input} className="add-prof-input" />
                  <input name="branch_name" placeholder="Branch Name" value={formData.branch_name} onChange={handleChange} style={styles.input} className="add-prof-input" />
                  <input name="ifsc_code" placeholder="IFSC Code" value={formData.ifsc_code} onChange={handleChange} style={styles.input} className="add-prof-input" />
                  <input name="bank_address" placeholder="Bank Address" value={formData.bank_address} onChange={handleChange} style={styles.input} className="add-prof-input" />
                </div>
              </div>

              {/* ACTION BUTTONS */}
              <div style={styles.formButtonBox}>
                <button type="button" style={styles.cancelFormBtn} className="btn-hover" onClick={() => navigate("/admin")}>
                  Cancel
                </button>
                <button type="submit" style={styles.submitFormBtn} className="btn-hover">
                  <FaCheckCircle /> Review & Submit
                </button>
              </div>

            </form>
          </div>
        </div>

        {/* SUBMIT PREVIEW MODAL */}
        {showPreview && (
          <div style={styles.modalOverlay}>
            <div style={styles.previewModal}>
              
              <div style={styles.previewTopSection}>
                <button style={styles.previewCloseBtn} onClick={() => setShowPreview(false)}><FaTimes /></button>
                <img src={photoPreviewUrl || "https://via.placeholder.com/140/ffffff/2563eb?text=No+Photo"} alt="Professor" style={styles.previewPhoto} />
                <h2 style={styles.previewName}>{formData.first_name} {formData.last_name}</h2>
                <p style={styles.previewDesignation}>{formData.designation} • {formData.subject}</p>
              </div>

              <div style={styles.previewDetailsGrid}>
                <div style={styles.infoCard}>
                  <span style={styles.label}>Email</span>
                  <span style={styles.value}>{formData.email}</span>
                </div>
                <div style={styles.infoCard}>
                  <span style={styles.label}>Mobile</span>
                  <span style={styles.value}>{formData.mobile}</span>
                </div>
                <div style={styles.infoCard}>
                  <span style={styles.label}>Account No.</span>
                  <span style={styles.value}>{formData.account_number || "N/A"}</span>
                </div>
                <div style={styles.infoCard}>
                  <span style={styles.label}>IFSC</span>
                  <span style={styles.value}>{formData.ifsc_code || "N/A"}</span>
                </div>
              </div>

              <div style={styles.previewFooter}>
                <button onClick={() => setShowPreview(false)} style={styles.cancelFormBtn} className="btn-hover">
                  Edit Details
                </button>
                <button onClick={handleSubmit} style={styles.confirmBtn} className="btn-hover">
                  Confirm & Register
                </button>
              </div>

            </div>
          </div>
        )}
      </div>
    </>
  );
}

const styles = {
  wrapper: { display: "flex", background: "#f8fafc", minHeight: "100vh", fontFamily: "'Inter', 'Poppins', sans-serif" },
  container: { marginLeft: "280px", width: "calc(100% - 280px)", padding: "40px", boxSizing: "border-box" },
  mainCard: { background: "white", padding: "40px", borderRadius: "24px", boxShadow: "0 10px 30px rgba(15,23,42,0.04)", border: "1px solid #e2e8f0" },
  header: { textAlign: "center", marginBottom: "30px", paddingBottom: "20px", borderBottom: "1px solid #f1f5f9" },
  title: { color: "#0f172a", fontSize: "28px", fontWeight: "800", margin: "15px 0 5px 0" },
  subText: { color: "#64748b", fontSize: "15px", margin: 0 },
  
  section: { background: "#f8fafc", padding: "25px", borderRadius: "16px", marginBottom: "25px", border: "1px solid #e2e8f0" },
  sectionTitle: { color: "#1e293b", marginBottom: "20px", fontSize: "18px", fontWeight: "700" },
  
  grid2: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px", marginBottom: "15px" },
  grid3: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "15px" },
  loginGrid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px" },
  
  input: { padding: "14px", borderRadius: "10px", outline: "none", fontSize: "14px", color: "#1e293b", background: "#ffffff" },
  
  photoTitle: { color: "#1e293b", marginBottom: "15px", fontSize: "18px", fontWeight: "700", display: "flex", alignItems: "center", gap: "10px" },
  photoUploadBox: { display: "flex", alignItems: "center", gap: "30px" },
  photoPlaceholder: { width: "120px", height: "120px", borderRadius: "12px", background: "#e2e8f0", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", color: "#64748b", fontWeight: "600", fontSize: "12px", border: "2px dashed #94a3b8" },
  uploadPreview: { width: "120px", height: "120px", objectFit: "cover", borderRadius: "12px", border: "4px solid #ffffff", boxShadow: "0 4px 12px rgba(0,0,0,0.1)" },
  photoActions: { display: "flex", flexDirection: "column", gap: "10px" },
  fileInput: { padding: "10px", border: "1px solid #cbd5e1", borderRadius: "8px", background: "white", fontSize: "13px", cursor: "pointer" },
  removeBtn: { background: "#fee2e2", color: "#ef4444", border: "none", padding: "8px 16px", borderRadius: "8px", cursor: "pointer", fontWeight: "600", fontSize: "13px", alignSelf: "flex-start" },

  formButtonBox: { display: "flex", justifyContent: "flex-end", gap: "15px", marginTop: "30px", paddingTop: "20px", borderTop: "1px solid #e2e8f0" },
  cancelFormBtn: { background: "#f1f5f9", color: "#475569", border: "1px solid #cbd5e1", padding: "12px 24px", borderRadius: "10px", cursor: "pointer", fontWeight: "600", fontSize: "14px" },
  submitFormBtn: { background: "linear-gradient(135deg,#1d4ed8,#2563eb)", color: "white", border: "none", padding: "12px 24px", borderRadius: "10px", cursor: "pointer", fontWeight: "600", fontSize: "14px", display: "flex", alignItems: "center", gap: "8px" },

  /* MODAL */
  modalOverlay: { position: "fixed", top: 0, left: 0, width: "100%", height: "100%", background: "rgba(15,23,42,0.75)", backdropFilter: "blur(6px)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 999 },
  previewModal: { width: "550px", maxWidth: "90%", background: "#ffffff", borderRadius: "24px", overflow: "hidden", boxShadow: "0 25px 50px -12px rgba(0,0,0,0.25)" },
  previewTopSection: { background: "linear-gradient(135deg,#1d4ed8,#2563eb)", padding: "30px", textAlign: "center", position: "relative", color: "white" },
  previewCloseBtn: { position: "absolute", top: "15px", right: "15px", background: "rgba(255,255,255,0.2)", border: "none", color: "white", width: "32px", height: "32px", borderRadius: "50%", cursor: "pointer", display: "flex", justifyContent: "center", alignItems: "center" },
  previewPhoto: { width: "110px", height: "110px", borderRadius: "50%", objectFit: "cover", border: "4px solid white", boxShadow: "0 10px 25px rgba(0,0,0,0.2)", marginBottom: "15px" },
  previewName: { margin: 0, fontSize: "24px", fontWeight: "800" },
  previewDesignation: { margin: "5px 0 0 0", fontSize: "15px", opacity: "0.9" },
  
  previewDetailsGrid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px", padding: "25px" },
  infoCard: { background: "#f8fafc", padding: "15px", borderRadius: "12px", border: "1px solid #e2e8f0" },
  label: { display: "block", fontSize: "12px", fontWeight: "700", color: "#64748b", textTransform: "uppercase", marginBottom: "4px" },
  value: { color: "#0f172a", fontWeight: "600", fontSize: "15px" },
  
  previewFooter: { padding: "20px 25px", display: "flex", gap: "15px", background: "#f8fafc", borderTop: "1px solid #e2e8f0" },
  confirmBtn: { flex: 1, background: "linear-gradient(135deg,#10b981,#059669)", color: "white", border: "none", padding: "12px", borderRadius: "10px", cursor: "pointer", fontWeight: "700", fontSize: "14px", boxShadow: "0 4px 12px rgba(16,185,129,0.2)" }
};