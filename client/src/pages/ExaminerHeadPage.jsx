import React, { useState, useEffect } from "react";
import axios from "axios";
import Sidebar from "../components/Sidebar";

export default function HeadExaminerPage() {
  // --- 1. Dynamic State Variables ---
  const [stats, setStats] = useState([
    { title: "Total Professors", value: "...", icon: "👨‍🏫" },
    { title: "Pending Reviews", value: "...", icon: "📄" },
    { title: "Completed Scripts", value: "...", icon: "✅" },
    { title: "Departments", value: "...", icon: "🏛️" },
  ]);

  const [recentActivities, setRecentActivities] = useState([]);
  const [profileStats, setProfileStats] = useState({
    totalReviews: "...",
    pendingTasks: "...",
    departments: "..."
  });

  // --- 2. Fetch Data from Database on Load ---
  useEffect(() => {
    fetchHeadExaminerData();
  }, []);

  const fetchHeadExaminerData = async () => {
    try {
      // Parallel fetching for performance
      const [statsRes, activitiesRes, profileRes] = await Promise.all([
        axios.get("http://localhost:5000/head-examiner/stats"),
        axios.get("http://localhost:5000/head-examiner/recent-activities"),
        axios.get("http://localhost:5000/head-examiner/profile-stats")
      ]);

      // Set Main Stats
      setStats([
        { title: "Total Professors", value: statsRes.data.totalProfessors, icon: "👨‍🏫" },
        { title: "Pending Reviews", value: statsRes.data.pendingReviews, icon: "📄" },
        { title: "Completed Scripts", value: statsRes.data.completedScripts, icon: "✅" },
        { title: "Departments", value: statsRes.data.totalDepartments, icon: "🏛️" },
      ]);

      // Set Recent Activities Table
      setRecentActivities(activitiesRes.data);

      // Set Profile Card Stats
      setProfileStats(profileRes.data);

    } catch (error) {
      console.error("Error fetching head examiner data:", error);
      // Removed hardcoded fallback. Let it fail gracefully or show 0s.
    }
  };

  return (
    <div style={{ display: "flex", background: "#f4f9ff", minHeight: "100vh" }}>
      <Sidebar />

      <style>{`
        @import url("https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap");

        * { margin: 0; padding: 0; box-sizing: border-box; font-family: "Inter", sans-serif; }

        .headExaminerPage {
          flex: 1;
          margin-left: 280px; 
          padding: 35px;
          background:
            radial-gradient(circle at top left, rgba(59,130,246,0.15), transparent 30%),
            radial-gradient(circle at bottom right, rgba(96,165,250,0.18), transparent 30%),
            linear-gradient(to bottom right, #f8fbff, #eef6ff);
          min-height: 100vh;
          box-sizing: border-box;
        }

        .dashboardHeader {
          width: 100%; padding: 32px; border-radius: 32px;
          background: rgba(255,255,255,0.85); backdrop-filter: blur(18px);
          border: 1px solid rgba(59,130,246,0.12);
          box-shadow: 0 10px 30px rgba(37,99,235,0.08), inset 0 1px 0 rgba(255,255,255,0.7);
          display: flex; justify-content: space-between; align-items: center; gap: 20px; flex-wrap: wrap;
        }

        .dashboardHeader h1 { font-size: 38px; font-weight: 900; color: #0f172a; letter-spacing: -1px; }
        .dashboardHeader p { margin-top: 8px; color: #2563eb; font-size: 16px; font-weight: 500; }

        .primaryBtn {
          padding: 14px 24px; border: none; border-radius: 18px;
          background: linear-gradient(135deg, #2563eb, #3b82f6);
          color: white; font-weight: 700; font-size: 15px; cursor: pointer;
          transition: 0.35s; box-shadow: 0 8px 22px rgba(37,99,235,0.25);
        }
        .primaryBtn:hover { transform: translateY(-3px); background: linear-gradient(135deg, #1d4ed8, #2563eb); box-shadow: 0 12px 30px rgba(37,99,235,0.35); }

        .secondaryBtn {
          width: 100%; padding: 15px; border: none; border-radius: 18px;
          background: #eff6ff; color: #2563eb; font-size: 15px; font-weight: 700; cursor: pointer; transition: 0.3s;
        }
        .secondaryBtn:hover { background: #dbeafe; transform: scale(1.02); }

        .profileIcon {
          width: 60px; height: 60px; border-radius: 22px;
          background: linear-gradient(135deg, #2563eb, #60a5fa);
          display: flex; justify-content: center; align-items: center;
          font-size: 28px; color: white; box-shadow: 0 10px 24px rgba(37,99,235,0.28);
        }

        .statsGrid { margin-top: 32px; display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 24px; }

        .statCard {
          background: rgba(255,255,255,0.92); border-radius: 28px; padding: 28px;
          border: 1px solid rgba(59,130,246,0.08);
          box-shadow: 0 8px 24px rgba(37,99,235,0.08), inset 0 1px 0 rgba(255,255,255,0.6);
          transition: 0.35s ease; position: relative; overflow: hidden;
        }
        .statCard::before {
          content: ""; position: absolute; top: -40px; right: -40px;
          width: 130px; height: 130px; background: rgba(59,130,246,0.08); border-radius: 50%;
        }
        .statCard:hover { transform: translateY(-6px); box-shadow: 0 18px 40px rgba(37,99,235,0.14), inset 0 1px 0 rgba(255,255,255,0.7); }

        .statCardTop { display: flex; justify-content: space-between; align-items: center; }
        .statCard p { color: #3b82f6; font-size: 13px; font-weight: 700; letter-spacing: 1px; text-transform: uppercase; }
        .statCard h2 { margin-top: 10px; font-size: 38px; font-weight: 900; color: #0f172a; }
        .statIcon { width: 60px; height: 60px; border-radius: 20px; background: #eff6ff; display: flex; align-items: center; justify-content: center; font-size: 28px; transition: 0.3s; }
        .statCard:hover .statIcon { transform: scale(1.1) rotate(5deg); }

        .mainGrid { margin-top: 32px; display: grid; grid-template-columns: 2fr 1fr; gap: 28px; }

        .activitySection { background: rgba(255,255,255,0.92); border-radius: 32px; overflow: hidden; border: 1px solid rgba(59,130,246,0.08); box-shadow: 0 10px 28px rgba(37,99,235,0.08), inset 0 1px 0 rgba(255,255,255,0.7); }
        .sectionHeader { padding: 28px 32px; border-bottom: 1px solid #e0ecff; display: flex; justify-content: space-between; align-items: center; gap: 20px; }
        .sectionHeader h2 { font-size: 24px; font-weight: 800; color: #0f172a; }
        .sectionHeader p { margin-top: 5px; color: #3b82f6; font-size: 14px; }
        
        .tableWrapper { overflow-x: auto; padding-bottom: 10px; }
        table { width: 100%; border-collapse: collapse; }
        thead { background: #f0f7ff; }
        thead th { padding: 16px 24px; text-align: left; color: #2563eb; font-size: 14px; font-weight: 800; }
        tbody tr { border-bottom: 1px solid #eef4ff; transition: 0.25s; }
        tbody tr:hover { background: rgba(59,130,246,0.05); }
        tbody td { padding: 20px 24px; font-size: 14px; }
        
        .professorName { font-weight: 700; color: #0f172a; }
        .subjectText { color: #475569; font-weight: 500; }
        .timeText { color: #64748b; font-weight: 600; font-size: 13px; }
        
        .status { padding: 8px 16px; border-radius: 999px; font-size: 12px; font-weight: 800; display: inline-flex; align-items: center; justify-content: center; }
        .reviewed { background: #dbeafe; color: #2563eb; }
        .pending { background: #fef3c7; color: #b45309; }
        .approved { background: #dcfce7; color: #15803d; }

        .rightPanel { display: flex; flex-direction: column; gap: 28px; }

        .profileCard { position: relative; overflow: hidden; border-radius: 32px; padding: 32px; background: linear-gradient(135deg, #2563eb, #3b82f6, #60a5fa); color: white; box-shadow: 0 18px 40px rgba(37,99,235,0.28); }
        .profileCard::before { content: ""; position: absolute; width: 220px; height: 220px; background: rgba(255,255,255,0.08); border-radius: 50%; top: -100px; right: -80px; }
        .profileContent { position: relative; z-index: 2; }
        .bigProfile { width: 75px; height: 75px; border-radius: 24px; background: rgba(255,255,255,0.15); backdrop-filter: blur(12px); border: 1px solid rgba(255,255,255,0.18); display: flex; justify-content: center; align-items: center; font-size: 35px; margin-bottom: 20px; }
        .profileCard h2 { font-size: 26px; font-weight: 900; }
        .profileCard p { color: #dbeafe; margin-top: 4px; font-size: 14px; }
        
        .profileStats { margin-top: 24px; display: flex; flex-direction: column; gap: 12px; }
        .profileStatItem { background: rgba(255,255,255,0.12); padding: 14px 18px; border-radius: 16px; display: flex; justify-content: space-between; align-items: center; backdrop-filter: blur(12px); font-size: 14px; }
        .profileStatItem span:last-child { font-weight: 800; font-size: 16px; }

        .quickActions { background: rgba(255,255,255,0.92); border-radius: 32px; padding: 30px; border: 1px solid rgba(59,130,246,0.08); box-shadow: 0 10px 28px rgba(37,99,235,0.08), inset 0 1px 0 rgba(255,255,255,0.7); }
        .quickActions h2 { font-size: 22px; font-weight: 800; color: #0f172a; margin-bottom: 20px; }
        .quickActionsButtons { display: flex; flex-direction: column; gap: 14px; }

        .emptyState { text-align: center; color: #64748b; padding: 20px; font-style: italic; }

        @media (max-width: 1100px) { .mainGrid { grid-template-columns: 1fr; } }
      `}</style>

      <div className="headExaminerPage">
        {/* HEADER */}
        <div className="dashboardHeader">
          <div>
            <h1>Head Examiner Dashboard</h1>
            <p>Manage professors, monitor reviews & control examination workflow.</p>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <button className="primaryBtn">+ Assign Professor</button>
            <div className="profileIcon">👨‍💼</div>
          </div>
        </div>

        {/* DYNAMIC STATS GRID */}
        <div className="statsGrid">
          {stats.map((item, index) => (
            <div key={index} className="statCard">
              <div className="statCardTop">
                <div>
                  <p>{item.title}</p>
                  <h2>{item.value}</h2>
                </div>
                <div className="statIcon">{item.icon}</div>
              </div>
            </div>
          ))}
        </div>

        {/* MAIN GRID */}
        <div className="mainGrid">
          
          {/* LEFT: DYNAMIC RECENT ACTIVITIES */}
          <div className="activitySection">
            <div className="sectionHeader">
              <div>
                <h2>Recent Examination Activities</h2>
                <p>Live updates from professors and reviewers.</p>
              </div>
            </div>

            <div className="tableWrapper">
              <table>
                <thead>
                  <tr>
                    <th>Professor</th>
                    <th>Subject</th>
                    <th>Status</th>
                    <th>Time</th>
                  </tr>
                </thead>
                <tbody>
                  {recentActivities.length === 0 ? (
                    <tr>
                      <td colSpan="4" className="emptyState">No recent activities found in the database.</td>
                    </tr>
                  ) : (
                    recentActivities.map((item, index) => (
                      <tr key={index}>
                        <td className="professorName">{item.name}</td>
                        <td className="subjectText">{item.subject}</td>
                        <td>
                          <span className={`status ${
                              item.status === "Pending" ? "pending"
                            : item.status === "Approved" ? "approved"
                            : "reviewed"
                          }`}>
                            {item.status}
                          </span>
                        </td>
                        <td className="timeText">{item.time}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* RIGHT PANEL */}
          <div className="rightPanel">
            
            {/* DYNAMIC PROFILE CARD */}
            <div className="profileCard">
              <div className="profileContent">
                <div className="bigProfile">👨‍💼</div>
                <h2>Dr. Head Examiner</h2>
                <p>Examination Controller</p>

                <div className="profileStats">
                  <div className="profileStatItem">
                    <span>Total Reviews</span>
                    <span>{profileStats.totalReviews}</span>
                  </div>
                  <div className="profileStatItem">
                    <span>Pending Tasks</span>
                    <span>{profileStats.pendingTasks}</span>
                  </div>
                  <div className="profileStatItem">
                    <span>Departments</span>
                    <span>{profileStats.departments}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* QUICK ACTIONS */}
            <div className="quickActions">
              <h2>Quick Actions</h2>
              <div className="quickActionsButtons">
                <button className="primaryBtn">Upload Marks</button>
                <button className="secondaryBtn">Review Scripts</button>
                <button className="secondaryBtn">Generate Reports</button>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}