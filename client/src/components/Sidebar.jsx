import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import {
  FaTachometerAlt,
  FaUserGraduate,
  FaBook,
  FaFileAlt,
  FaUserTie,
  FaChalkboardTeacher,
  FaPenSquare,
  FaCheckDouble,
  FaAward,
  FaFileInvoice,
  FaChartPie,
  FaGraduationCap,
  FaChevronRight,
  FaCogs,
  FaUserPlus,
  FaUsers,
  FaClipboardList,
  FaClipboardCheck // Added for Review Modules
} from "react-icons/fa";

export default function Sidebar() {
  const [openMenus, setOpenMenus] = useState({
    records: true,     // Student & Subject
    planning: false,   // Exam creation & Manage process
    evaluation: false, // Examiner, Marks, & Review
    results: false,    // Processing, Report Card & Analytics
    professors: false  // Add/View Professor & Assign Paper
  });

  const toggleMenu = (menuKey) => {
    setOpenMenus((prev) => ({
      ...prev,
      [menuKey]: !prev[menuKey]
    }));
  };

  return (
    <aside style={styles.sidebar}>
      {/* Brand Logo Section */}
      <div style={styles.brandWrapper}>
        <div style={styles.brandIcon}>
          <FaGraduationCap />
        </div>
        <div style={styles.brandTextContainer}>
          <span style={styles.brandText}>Examatrix</span>
          <span style={styles.brandSubText}>LIVE SYSTEM</span>
        </div>
      </div>

      {/* Scrollable Menu List */}
      <div className="custom-scrollbar" style={styles.menuContainer}>
        
        {/* DASHBOARD */}
        <NavLink to="/admin" style={styles.link}>
          {({ isActive }) => (
            <div style={styles.menuItem(isActive)}>
              <div style={styles.menuItemLeft}>
                <FaTachometerAlt style={styles.menuIcon(isActive)} />
                <span style={styles.menuText}>Admin Dashboard</span>
              </div>
            </div>
          )}
        </NavLink>

        <div style={styles.divider}></div>

        {/* =========================================
            SECTION 1: RECORDS & MANAGEMENT
        ========================================= */}
        <div style={styles.sectionHeader}>Exam Management</div>

        <div style={styles.menuItem(false)} onClick={() => toggleMenu("records")}>
          <div style={styles.menuItemLeft}>
            <FaUserGraduate style={styles.menuIcon(false)} />
            <span style={styles.menuText}>Academic Records</span>
          </div>
          <FaChevronRight style={styles.chevron(openMenus.records)} />
        </div>

        <div style={styles.subMenuContainer(openMenus.records)}>
          <NavLink to="/student-module" style={styles.link}>
            {({ isActive }) => (
              <div style={styles.subMenuItem(isActive)}>
                <div style={styles.subMenuDot(isActive)}></div> Student Module
              </div>
            )}
          </NavLink>
          <NavLink to="/subject-module" style={styles.link}>
            {({ isActive }) => (
              <div style={styles.subMenuItem(isActive)}>
                <div style={styles.subMenuDot(isActive)}></div> Subject Module
              </div>
            )}
          </NavLink>
        </div>

        {/* =========================================
            SECTION 2: EXAMINATION PLANNING
        ========================================= */}
        <div style={styles.menuItem(false)} onClick={() => toggleMenu("planning")}>
          <div style={styles.menuItemLeft}>
            <FaFileAlt style={styles.menuIcon(false)} />
            <span style={styles.menuText}>Exam Operations</span>
          </div>
          <FaChevronRight style={styles.chevron(openMenus.planning)} />
        </div>

        <div style={styles.subMenuContainer(openMenus.planning)}>
          <NavLink to="/examination-module" style={styles.link}>
            {({ isActive }) => (
              <div style={styles.subMenuItem(isActive)}>
                <div style={styles.subMenuDot(isActive)}></div> Examination Module
              </div>
            )}
          </NavLink>
          <NavLink to="/controller-exams" style={styles.link}>
            {({ isActive }) => (
              <div style={styles.subMenuItem(isActive)}>
                <div style={styles.subMenuDot(isActive)}></div> Controller of Exams
              </div>
            )}
          </NavLink>
          <NavLink to="/head-examiner" style={styles.link}>
            {({ isActive }) => (
              <div style={styles.subMenuItem(isActive)}>
                <div style={styles.subMenuDot(isActive)}></div> Head Examiner
              </div>
            )}
          </NavLink>
        </div>

        {/* =========================================
            SECTION 3: EVALUATION SYSTEM
        ========================================= */}
        <div style={styles.menuItem(false)} onClick={() => toggleMenu("evaluation")}>
          <div style={styles.menuItemLeft}>
            <FaChalkboardTeacher style={styles.menuIcon(false)} />
            <span style={styles.menuText}>Evaluation Hub</span>
          </div>
          <FaChevronRight style={styles.chevron(openMenus.evaluation)} />
        </div>

        <div style={styles.subMenuContainer(openMenus.evaluation)}>
          <NavLink to="/examiner-module" style={styles.link}>
            {({ isActive }) => (
              <div style={styles.subMenuItem(isActive)}>
                <div style={styles.subMenuDot(isActive)}></div> Examiner Module
              </div>
            )}
          </NavLink>
          <NavLink to="/marks-entry" style={styles.link}>
            {({ isActive }) => (
              <div style={styles.subMenuItem(isActive)}>
                <div style={styles.subMenuDot(isActive)}></div> Marks Entry Module
              </div>
            )}
          </NavLink>
          <NavLink to="/grade-module" style={styles.link}>
            {({ isActive }) => (
              <div style={styles.subMenuItem(isActive)}>
                <div style={styles.subMenuDot(isActive)}></div> Grade Module
              </div>
            )}
          </NavLink>
          {/* NEW: Review Process Links added here */}
          <NavLink to="/review-applications" style={styles.link}>
            {({ isActive }) => (
              <div style={styles.subMenuItem(isActive)}>
                <div style={styles.subMenuDot(isActive)}></div> Review Applications
              </div>
            )}
          </NavLink>
          <NavLink to="/review-committee" style={styles.link}>
            {({ isActive }) => (
              <div style={styles.subMenuItem(isActive)}>
                <div style={styles.subMenuDot(isActive)}></div> Review Committee
              </div>
            )}
          </NavLink>
        </div>

        {/* =========================================
            SECTION 4: RESULTS & ANALYTICS
        ========================================= */}
        <div style={styles.sectionHeader}>Exam Results</div>

        <div style={styles.menuItem(false)} onClick={() => toggleMenu("results")}>
          <div style={styles.menuItemLeft}>
            <FaChartPie style={styles.menuIcon(false)} />
            <span style={styles.menuText}>Results & Analytics</span>
          </div>
          <FaChevronRight style={styles.chevron(openMenus.results)} />
        </div>

        <div style={styles.subMenuContainer(openMenus.results)}>
          <NavLink to="/result-processing" style={styles.link}>
            {({ isActive }) => (
              <div style={styles.subMenuItem(isActive)}>
                <div style={styles.subMenuDot(isActive)}></div> Result Processing
              </div>
            )}
          </NavLink>
          <NavLink to="/report-card" style={styles.link}>
            {({ isActive }) => (
              <div style={styles.subMenuItem(isActive)}>
                <div style={styles.subMenuDot(isActive)}></div> Report Card
              </div>
            )}
          </NavLink>
          <NavLink to="/analytics" style={styles.link}>
            {({ isActive }) => (
              <div style={styles.subMenuItem(isActive)}>
                <div style={styles.subMenuDot(isActive)}></div> Analytics
              </div>
            )}
          </NavLink>
        </div>

        {/* =========================================
            SECTION 5: FACULTY MANAGEMENT
        ========================================= */}
        <div style={styles.sectionHeader}>Faculty Management</div>

        <div style={styles.menuItem(false)} onClick={() => toggleMenu("professors")}>
          <div style={styles.menuItemLeft}>
            <FaUserTie style={styles.menuIcon(false)} />
            <span style={styles.menuText}>Professor Hub</span>
          </div>
          <FaChevronRight style={styles.chevron(openMenus.professors)} />
        </div>

        <div style={styles.subMenuContainer(openMenus.professors)}>
          <NavLink to="/professors" style={styles.link}>
            {({ isActive }) => (
              <div style={styles.subMenuItem(isActive)}>
                <div style={styles.subMenuDot(isActive)}></div> Add Professor
              </div>
            )}
          </NavLink>
          <NavLink to="/professor-list" style={styles.link}>
            {({ isActive }) => (
              <div style={styles.subMenuItem(isActive)}>
                <div style={styles.subMenuDot(isActive)}></div> View Professors
              </div>
            )}
          </NavLink>
          <NavLink to="/assign-paper" style={styles.link}>
            {({ isActive }) => (
              <div style={styles.subMenuItem(isActive)}>
                <div style={styles.subMenuDot(isActive)}></div> Assign Paper
              </div>
            )}
          </NavLink>
        </div>

      </div>
    </aside>
  );
}

// Enterprise-Grade Professional Styles
const styles = {
  sidebar: {
    width: "280px",
    minWidth: "280px",
    height: "100vh",
    backgroundColor: "#ffffff",
    display: "flex",
    flexDirection: "column",
    boxShadow: "0px 0px 30px rgba(0, 0, 0, 0.03)",
    borderRight: "1px solid rgba(226, 232, 240, 0.6)",
    position: "fixed",
    left: 0,
    top: 0,
    zIndex: 1000,
    transition: "all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1)",
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
  },

  brandWrapper: {
    padding: "32px 28px",
    display: "flex",
    alignItems: "center",
    textDecoration: "none",
    background: "linear-gradient(to bottom, #ffffff, #fafafa)"
  },

  brandIcon: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "42px",
    height: "42px",
    backgroundColor: "#2563eb",
    color: "#ffffff",
    borderRadius: "12px",
    fontSize: "22px",
    marginRight: "14px",
    boxShadow: "0 8px 16px rgba(37, 99, 235, 0.2)"
  },

  brandTextContainer: {
    display: "flex",
    flexDirection: "column",
  },

  brandText: {
    fontSize: "22px",
    fontWeight: "900",
    color: "#1e293b",
    letterSpacing: "-0.8px",
    lineHeight: "1"
  },

  brandSubText: {
    fontSize: "10px",
    fontWeight: "700",
    color: "#94a3b8",
    letterSpacing: "1.5px",
    marginTop: "4px"
  },

  menuContainer: {
    flex: 1,
    overflowY: "auto",
    padding: "10px 0 30px 0",
    scrollbarWidth: "none", 
    msOverflowStyle: "none",
    scrollBehavior: "smooth"
  },

  link: {
    textDecoration: "none",
    display: "block"
  },

  divider: {
    height: "1px",
    backgroundColor: "rgba(226, 232, 240, 0.8)",
    margin: "15px 28px"
  },

  sectionHeader: {
    fontSize: "11px",
    textTransform: "uppercase",
    color: "#3b82f6",
    backgroundColor: "rgba(59, 130, 246, 0.05)",
    padding: "10px 18px",
    borderRadius: "8px",
    margin: "10px 24px 12px 24px",
    letterSpacing: "1.2px",
    fontWeight: "800",
    borderLeft: "4px solid #3b82f6"
  },

  menuItem: (isActive) => ({
    margin: "2px 18px",
    padding: "14px 18px",
    backgroundColor: isActive ? "rgba(37, 99, 235, 0.08)" : "transparent",
    color: isActive ? "#1d4ed8" : "#475569",
    borderRadius: "12px",
    fontWeight: isActive ? "700" : "600",
    fontSize: "14.5px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    cursor: "pointer",
    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
    transform: isActive ? "translateX(4px)" : "none",
    border: isActive ? "1px solid rgba(37, 99, 235, 0.1)" : "1px solid transparent"
  }),

  menuItemLeft: {
    display: "flex",
    alignItems: "center"
  },

  menuText: {
    letterSpacing: "-0.2px"
  },

  menuIcon: (isActive) => ({
    marginRight: "16px",
    fontSize: "19px",
    color: isActive ? "#2563eb" : "#94a3b8",
    transition: "all 0.3s ease"
  }),

  subMenuContainer: (isOpen) => ({
    overflow: "hidden",
    transition: "max-height 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
    maxHeight: isOpen ? "800px" : "0px", /* Increased maxHeight to accommodate new links */
    backgroundColor: "rgba(248, 250, 252, 0.5)"
  }),

  subMenuItem: (isActive) => ({
    padding: "12px 18px 12px 54px",
    margin: "2px 18px",
    color: isActive ? "#2563eb" : "#64748b",
    backgroundColor: isActive ? "#ffffff" : "transparent",
    borderRadius: "10px",
    fontWeight: isActive ? "700" : "500",
    fontSize: "14px",
    display: "flex",
    alignItems: "center",
    cursor: "pointer",
    transition: "all 0.25s ease",
    boxShadow: isActive ? "0 4px 12px rgba(0,0,0,0.03)" : "none",
    border: isActive ? "1px solid rgba(226, 232, 240, 0.8)" : "1px solid transparent"
  }),

  subMenuDot: (isActive) => ({
    width: "8px",
    height: "8px",
    borderRadius: "3px",
    marginRight: "14px",
    backgroundColor: isActive ? "#2563eb" : "#cbd5e1",
    boxShadow: isActive ? "0 0 0 4px rgba(37, 99, 235, 0.12)" : "none",
    transition: "all 0.3s ease",
    transform: isActive ? "scale(1.1)" : "scale(1)"
  }),

  chevron: (isOpen) => ({
    transform: isOpen ? "rotate(90deg)" : "rotate(0deg)",
    transition: "transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
    fontSize: "11px",
    color: isOpen ? "#2563eb" : "#94a3b8"
  })
};