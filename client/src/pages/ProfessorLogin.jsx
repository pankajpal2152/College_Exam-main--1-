import React, { useState } from "react";
import loginBg from "../assets/loginBg.png";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  FaEnvelope,
  FaLock,
  FaArrowRight,
  FaUserTie,
  FaEye,
  FaEyeSlash,
  FaGoogle,
  FaMicrosoft,
  FaArrowLeft,
} from "react-icons/fa";

export default function ProfessorLogin() {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(
        "http://localhost:5000/professor/login",
        { email, password }
      );

      if (res.data && res.data.id) {
        localStorage.setItem("professor", JSON.stringify(res.data));
        navigate("/professor-dashboard");
      } else {
        alert("Invalid response from server");
      }

    } catch (err) {
      alert("Invalid Professor Login");
    }
  };

  return (
    <>
      <style>
        {`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800&display=swap');

        *{
          margin: 0;
          padding: 0;
          box-sizing: border-box;
          font-family: "Poppins", sans-serif;
        }

        body, html {
          overflow: hidden;
          height: 100%;
        }

        .professor-login-container {
          width: 100%;
          height: 100vh;
          display: flex;
          background: #020617;
          overflow: hidden;
        }

        /* ================= LEFT SIDE ================= */
        .left-panel {
          flex: 1.2;
          position: relative;
          display: flex;
          align-items: flex-end;
          justify-content: flex-start;
          padding: 60px;
          background: linear-gradient(rgba(2,6,23,0.4), rgba(2,6,23,0.8)), url(${loginBg});
          background-size: cover;
          background-position: center;
        }

        .left-content {
          position: relative;
          z-index: 2;
          max-width: 600px;
          color: white;
        }

        .brand {
          display: flex;
          align-items: center;
          gap: 15px;
          margin-bottom: 25px;
        }

        .brand-logo {
          width: 60px;
          height: 60px;
          border-radius: 18px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(255,255,255,0.1);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255,255,255,0.2);
        }

        .faculty-icon { font-size: 30px; color: #8b5cf6; }
        .brand-text h1 { font-size: 32px; font-weight: 800; }
        .brand-text p { color: #ddd6fe; font-size: 11px; letter-spacing: 2px; }
        .main-heading { font-size: 3.5rem; line-height: 1.1; font-weight: 800; margin-bottom: 20px; }
        .main-heading span { background: linear-gradient(135deg, #8b5cf6, #c084fc); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
        
        .stats-box { display: flex; gap: 15px; }
        .stat-card { padding: 15px 20px; border-radius: 18px; background: rgba(255,255,255,0.05); backdrop-filter: blur(10px); border: 1px solid rgba(255,255,255,0.1); }
        .stat-card h2 { font-size: 24px; margin-bottom: 4px; color: white; }
        .stat-card p { color: #cbd5e1; font-size: 12px; }

        /* ================= RIGHT SIDE (FIXED BACK NAV) ================= */
        .right-panel {
          flex: 0.8;
          background: #f8fafc;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 40px;
          position: relative;
        }

        .back-nav {
          position: absolute;
          top: 30px;
          left: 30px;
          z-index: 10; /* Ensure it stays above the card */
          color: #475569;
          text-decoration: none;
          font-size: 13px;
          font-weight: 700;
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 10px 18px;
          background: #ffffff;
          border: 1.5px solid #e2e8f0;
          border-radius: 12px;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
        }

        .back-nav:hover { 
          color: #7c3aed;
          border-color: #7c3aed;
          transform: translateX(-3px);
          box-shadow: 0 10px 15px -3px rgba(124, 58, 237, 0.1);
        }

        .login-card {
          width: 100%;
          max-width: 440px;
          background: #ffffff;
          padding: 45px;
          border-radius: 24px;
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.05);
          z-index: 2;
        }

        .top-badge {
          display: inline-block;
          padding: 6px 14px;
          border-radius: 8px;
          background: #f5f3ff;
          color: #7c3aed;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 1px;
          margin-bottom: 15px;
          border: 1px solid #ddd6fe;
        }

        .login-card h2 { font-size: 32px; color: #0f172a; font-weight: 800; margin-bottom: 8px; }
        .subtitle { color: #64748b; font-size: 14px; margin-bottom: 30px; }

        .input-wrapper { margin-bottom: 20px; }
        .input-label { display: block; margin-bottom: 8px; font-size: 12px; font-weight: 700; color: #475569; text-transform: uppercase; letter-spacing: 0.5px; }

        .input-group {
          width: 100%;
          height: 52px;
          border-radius: 12px;
          background: #ffffff;
          border: 1.5px solid #e2e8f0;
          display: flex;
          align-items: center;
          padding: 0 16px;
          transition: all 0.2s ease;
        }

        .input-group:focus-within {
          border-color: #7c3aed;
          box-shadow: 0 0 0 4px rgba(124, 58, 237, 0.1);
        }

        .input-icon { color: #94a3b8; font-size: 16px; margin-right: 12px; }
        
        .input-group input {
          flex: 1;
          border: none;
          background: transparent;
          outline: none;
          font-size: 14px;
          color: #1e293b;
          font-weight: 500;
        }

        .extra-options {
          display: flex;
          justify-content: space-between;
          margin: 20px 0;
          font-size: 13px;
        }

        .login-btn {
          width: 100%;
          height: 52px;
          border: none;
          border-radius: 12px;
          background: #0f172a;
          color: white;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          transition: all 0.3s ease;
        }

        .login-btn:hover { background: #1e293b; transform: translateY(-1px); }

        .divider {
          display: flex;
          align-items: center;
          text-align: center;
          margin: 25px 0;
          color: #94a3b8;
          font-size: 12px;
        }
        .divider::before, .divider::after {
          content: '';
          flex: 1;
          border-bottom: 1px solid #e2e8f0;
        }
        .divider span { padding: 0 10px; }

        .social-group {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
        }

        .social-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          height: 48px;
          border-radius: 12px;
          border: 1px solid #e2e8f0;
          background: white;
          color: #475569;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .social-btn:hover { background: #f8fafc; border-color: #cbd5e1; }

        @media(max-width: 1024px) {
          .left-panel { display: none; }
          .right-panel { flex: 1; padding: 20px; }
          .back-nav { top: 20px; left: 20px; } /* Adjust for mobile */
          .login-card { padding: 30px; margin-top: 60px; }
        }
        `}
      </style>

      <div className="professor-login-container">
        {/* LEFT SIDE */}
        <div className="left-panel">
          <div className="left-content">
            <div className="brand">
              <div className="brand-logo">
                <FaUserTie className="faculty-icon" />
              </div>
              <div className="brand-text">
                <h1>ExamtrixLive</h1>
                <p>PROFESSIONAL FACULTY PORTAL</p>
              </div>
            </div>
            <h1 className="main-heading">
              Secure <span>Faculty Access</span>
            </h1>
            <p className="description" style={{ marginBottom: "30px", color: "#cbd5e1" }}>
              Access your classroom tools, manage question banks, and monitor student performance.
            </p>
            <div className="stats-box">
              <div className="stat-card">
                <h2>500+</h2>
                <p>Questions</p>
              </div>
              <div className="stat-card">
                <h2>Live</h2>
                <p>Monitoring</p>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="right-panel">
          {/* FIXED BACK BUTTON */}
          <div className="back-nav" onClick={() => navigate("/")}>
            <FaArrowLeft /> Back to Home
          </div>

          <div className="login-card">
            <div className="top-badge">FACULTY PORTAL</div>
            <h2>Professor Login</h2>
            <p className="subtitle">Sign in to manage your examinations.</p>

            <form onSubmit={handleLogin}>
              <div className="input-wrapper">
                <label className="input-label">Institutional Email</label>
                <div className="input-group">
                  <FaEnvelope className="input-icon" />
                  <input
                    type="email"
                    placeholder="professor@institution.edu"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="input-wrapper">
                <label className="input-label">Password</label>
                <div className="input-group">
                  <FaLock className="input-icon" />
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <div
                    style={{ cursor: "pointer", color: "#94a3b8", marginLeft: "10px" }}
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </div>
                </div>
              </div>

              <div className="extra-options">
                <label style={{ display: "flex", alignItems: "center", gap: "8px", color: "#64748b", cursor: "pointer" }}>
                  <input type="checkbox" style={{ accentColor: "#7c3aed" }} /> Keep me signed in
                </label>
                <span style={{ color: "#7c3aed", fontWeight: "600", cursor: "pointer" }}>Need help?</span>
              </div>

              <button type="submit" className="login-btn">
                Enter Dashboard <FaArrowRight />
              </button>
            </form>

            <div className="divider">
              <span>FACULTY SSO</span>
            </div>

            <div className="social-group">
              <button className="social-btn">
                <FaGoogle style={{ color: "#EA4335" }} /> Google
              </button>
              <button className="social-btn">
                <FaMicrosoft style={{ color: "#00A4EF" }} /> Microsoft
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}