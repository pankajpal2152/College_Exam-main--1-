// import React from "react";

// export default function ProfessorForm({
//   formData,
//   handleChange,
//   handleSubmit,
//   resetForm,
//   isEditing,
// }) {
//   return (
//     <>
//       <style>{`
//         .prof-form-wrapper {
//           display: flex;
//           align-items: center;
//           justify-content: center;
//           background: linear-gradient(135deg, #eef2ff, #f8fafc);
//           padding: 20px;
//           font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
//         }

//         .prof-form {
//           background: #ffffff;
//           padding: 40px 30px;
//           border-radius: 20px;
//           width: 100%;
//           max-width: 420px;
//           box-shadow: 0 20px 45px rgba(0, 0, 0, 0.1);
//           display: flex;
//           flex-direction: column;
//           gap: 16px;
//           transition: all 0.3s ease;
//         }

//         .prof-form:hover {
//           transform: translateY(-4px);
//           box-shadow: 0 25px 55px rgba(0, 0, 0, 0.15);
//         }

//         .prof-input {
//           padding: 12px 14px;
//           border-radius: 10px;
//           border: 1px solid #d1d5db;
//           font-size: 14px;
//           outline: none;
//           transition: all 0.25s ease;
//           background: #f9fafb;
//         }

//         .prof-input:focus {
//           border-color: #2563eb;
//           background: #ffffff;
//           box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.15);
//         }

//         .prof-input::placeholder {
//           color: #9ca3af;
//         }

//         .prof-actions {
//           display: flex;
//           gap: 12px;
//           margin-top: 10px;
//         }

//         .btn-primary {
//           flex: 1;
//           padding: 12px;
//           border: none;
//           border-radius: 12px;
//           background: linear-gradient(135deg, #2563eb, #1d4ed8);
//           color: white;
//           font-weight: 600;
//           cursor: pointer;
//           transition: all 0.25s ease;
//         }

//         .btn-primary:hover {
//           transform: scale(1.05);
//           background: linear-gradient(135deg, #1d4ed8, #1e40af);
//         }

//         .btn-secondary {
//           flex: 1;
//           padding: 12px;
//           border-radius: 12px;
//           border: 1px solid #d1d5db;
//           background: #f3f4f6;
//           color: #374151;
//           font-weight: 500;
//           cursor: pointer;
//           transition: all 0.25s ease;
//         }

//         .btn-secondary:hover {
//           background: #e5e7eb;
//           transform: scale(1.05);
//         }

//         .btn-primary:active,
//         .btn-secondary:active {
//           transform: scale(0.96);
//         }

//         @media (max-width: 480px) {
//           .prof-form {
//             padding: 25px 20px;
//           }
//         }
//       `}</style>

//       <div className="prof-form-wrapper">
//         <form onSubmit={handleSubmit} className="prof-form">
//           <input
//             name="name"
//             placeholder="Name"
//             value={formData.name}
//             onChange={handleChange}
//             className="prof-input"
//             required
//           />

//           <input
//             name="department"
//             placeholder="Department"
//             value={formData.department}
//             onChange={handleChange}
//             className="prof-input"
//             required
//           />

//           <input
//             name="designation"
//             placeholder="Designation"
//             value={formData.designation}
//             onChange={handleChange}
//             className="prof-input"
//             required
//           />

//           <input
//             name="subject"
//             placeholder="Subject"
//             value={formData.subject}
//             onChange={handleChange}
//             className="prof-input"
//             required
//           />

//           <input
//             type="email"
//             name="email"
//             placeholder="Email"
//             value={formData.email}
//             onChange={handleChange}
//             className="prof-input"
//             required
//           />

//           <input
//             name="phone"
//             placeholder="Phone"
//             value={formData.phone}
//             onChange={handleChange}
//             className="prof-input"
//             required
//           />

//           <div className="prof-actions">
//             <button className="btn-primary">
//               {isEditing ? "Update" : "Add"}
//             </button>

//             <button
//               type="button"
//               onClick={resetForm}
//               className="btn-secondary"
//             >
//               Reset
//             </button>
//           </div>
//         </form>
//       </div>
//     </>
//   );
// }














import React from "react";

export default function ProfessorForm({
  formData,
  handleChange,
  handleCheckboxChange, // New prop for handling roles
  handleSubmit,
  resetForm,
  isEditing,
}) {
  return (
    <>
      <style>{`
        .prof-form-wrapper {
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #eef2ff, #f8fafc);
          padding: 20px;
          font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
        }

        .prof-form {
          background: #ffffff;
          padding: 30px;
          border-radius: 20px;
          width: 100%;
          max-width: 800px; /* Widened to accommodate two columns */
          box-shadow: 0 20px 45px rgba(0, 0, 0, 0.1);
          display: flex;
          flex-direction: column;
          gap: 20px;
          transition: all 0.3s ease;
        }

        .prof-form:hover {
          transform: translateY(-4px);
          box-shadow: 0 25px 55px rgba(0, 0, 0, 0.15);
        }

        .form-section-title {
          font-size: 1.1rem;
          color: #1d4ed8;
          border-bottom: 2px solid #eef2ff;
          padding-bottom: 5px;
          margin-bottom: 10px;
          font-weight: 600;
        }

        .form-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
        }

        .full-width {
          grid-column: span 2;
        }

        .prof-input {
          padding: 12px 14px;
          border-radius: 10px;
          border: 1px solid #d1d5db;
          font-size: 14px;
          outline: none;
          transition: all 0.25s ease;
          background: #f9fafb;
          width: 100%;
          box-sizing: border-box;
        }

        .prof-input:focus {
          border-color: #2563eb;
          background: #ffffff;
          box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.15);
        }

        .prof-input::placeholder {
          color: #9ca3af;
        }

        .checkbox-group {
          display: flex;
          gap: 20px;
          padding: 10px 0;
        }

        .checkbox-label {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 14px;
          color: #374151;
          cursor: pointer;
        }

        .prof-actions {
          display: flex;
          gap: 12px;
          margin-top: 10px;
        }

        .btn-primary {
          flex: 1;
          padding: 12px;
          border: none;
          border-radius: 12px;
          background: linear-gradient(135deg, #2563eb, #1d4ed8);
          color: white;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.25s ease;
        }

        .btn-primary:hover {
          transform: scale(1.02);
          background: linear-gradient(135deg, #1d4ed8, #1e40af);
        }

        .btn-secondary {
          flex: 1;
          padding: 12px;
          border-radius: 12px;
          border: 1px solid #d1d5db;
          background: #f3f4f6;
          color: #374151;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.25s ease;
        }

        .btn-secondary:hover {
          background: #e5e7eb;
          transform: scale(1.02);
        }

        @media (max-width: 600px) {
          .form-grid {
            grid-template-columns: 1fr;
          }
          .full-width {
            grid-column: span 1;
          }
          .checkbox-group {
            flex-direction: column;
            gap: 10px;
          }
        }
      `}</style>

      <div className="prof-form-wrapper">
        <form onSubmit={handleSubmit} className="prof-form">
          
          <div>
            <h3 className="form-section-title">Personal & Academic Details</h3>
            <div className="form-grid">
              <input
                name="name"
                placeholder="Full Name"
                value={formData.name || ""}
                onChange={handleChange}
                className="prof-input"
                required
              />
              <input
                name="email"
                type="email"
                placeholder="Email Address"
                value={formData.email || ""}
                onChange={handleChange}
                className="prof-input"
                required
              />
              <input
                name="password"
                type="password"
                placeholder="Login Password"
                value={formData.password || ""}
                onChange={handleChange}
                className="prof-input"
                required
              />
              <input
                name="mobile"
                placeholder="Mobile Number"
                value={formData.mobile || ""}
                onChange={handleChange}
                className="prof-input"
                required
              />
              <input
                name="designation"
                placeholder="Designation (e.g., Assistant Professor)"
                value={formData.designation || ""}
                onChange={handleChange}
                className="prof-input"
                required
              />
              <input
                name="subject"
                placeholder="Subject"
                value={formData.subject || ""}
                onChange={handleChange}
                className="prof-input"
                required
              />
              <input
                name="experience"
                placeholder="Years of Experience"
                value={formData.experience || ""}
                onChange={handleChange}
                className="prof-input full-width"
              />
            </div>
          </div>

          <div>
            <h3 className="form-section-title">Bank Details</h3>
            <div className="form-grid">
              <input
                name="bank_name"
                placeholder="Bank Name"
                value={formData.bank_name || ""}
                onChange={handleChange}
                className="prof-input"
              />
              <input
                name="branch_name"
                placeholder="Branch Name"
                value={formData.branch_name || ""}
                onChange={handleChange}
                className="prof-input"
              />
              <input
                name="ifsc_code"
                placeholder="IFSC Code"
                value={formData.ifsc_code || ""}
                onChange={handleChange}
                className="prof-input"
              />
              <input
                name="account_number"
                placeholder="Account Number"
                value={formData.account_number || ""}
                onChange={handleChange}
                className="prof-input"
              />
              <input
                name="account_holder_name"
                placeholder="Account Holder Name"
                value={formData.account_holder_name || ""}
                onChange={handleChange}
                className="prof-input"
              />
              <input
                name="bank_address"
                placeholder="Bank Address"
                value={formData.bank_address || ""}
                onChange={handleChange}
                className="prof-input"
              />
            </div>
          </div>

          <div>
            <h3 className="form-section-title">Assign Roles & Authorities</h3>
            <div className="checkbox-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  name="roles"
                  value="Head Examiner"
                  checked={formData.roles?.includes("Head Examiner") || false}
                  onChange={handleCheckboxChange}
                />
                Head Examiner
              </label>
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  name="roles"
                  value="Paper Evaluator"
                  checked={formData.roles?.includes("Paper Evaluator") || false}
                  onChange={handleCheckboxChange}
                />
                Paper Evaluator
              </label>
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  name="roles"
                  value="Review Committee"
                  checked={formData.roles?.includes("Review Committee") || false}
                  onChange={handleCheckboxChange}
                />
                Review Committee
              </label>
            </div>
          </div>

          <div className="prof-actions">
            <button type="submit" className="btn-primary">
              {isEditing ? "Update Professor" : "Add Professor"}
            </button>
            <button
              type="button"
              onClick={resetForm}
              className="btn-secondary"
            >
              Reset Form
            </button>
          </div>
        </form>
      </div>
    </>
  );
}