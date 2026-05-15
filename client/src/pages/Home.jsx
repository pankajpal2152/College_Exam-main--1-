import React, { useEffect, useState } from "react";
import homeBg from "../assets/HomeBg.jpg.jpeg";
import axios from "axios";
import { Link } from "react-router-dom";
import {
  FaUserShield,
  FaChalkboardTeacher,
  FaClipboardCheck,
  FaGraduationCap,
  FaArrowRight,
  FaUniversity,
  FaBookOpen,
  FaUsers,
  FaChartLine
} from "react-icons/fa";

export default function Home() {
  // 1. State for the visible animating numbers
  const [stats, setStats] = useState({
    professors: 0,
    papers: 0,
    evaluations: 0
  });

  // 2. State to hold the actual targets from the database
  const [targetStats, setTargetStats] = useState({
    professors: 0,
    papers: 0,
    evaluations: 0
  });

  const [currentText, setCurrentText] = useState(0);

  const rotatingTexts = [
    "Calcutta Institute Of Technology" // Note: Fixed slight typo here (Institute)
  ];

  // Rotating Text Effect
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentText((prev) =>
        prev === rotatingTexts.length - 1 ? 0 : prev + 1
      );
    }, 2500);

    return () => clearInterval(interval);
  }, []);

  // 3. Fetch Real Stats from Backend
  useEffect(() => {
    const fetchRealStats = async () => {
      try {
        // This endpoint will be created in your Node backend to count rows in your tables
        const res = await axios.get("http://localhost:5000/public/stats");
        
        setTargetStats({
          professors: res.data.professors || 0,
          papers: res.data.papers || 0,
          evaluations: res.data.evaluations || 0
        });
      } catch (error) {
        console.log("Backend not connected yet. Using fallback data for UI testing.");
        // Fallback numbers so the animation still looks good while building
        setTargetStats({
          professors: 48,
          papers: 124,
          evaluations: 3450
        });
      }
    };

    fetchRealStats();
  }, []);

  // 4. Trigger Animation once Target Stats are loaded
  useEffect(() => {
    // Only run animation if there's actually a target to count to
    if (targetStats.professors > 0 || targetStats.papers > 0 || targetStats.evaluations > 0) {
      
      const animateValue = (key, endValue, duration) => {
        let start = 0;
        const increment = endValue / (duration / 16);

        const timer = setInterval(() => {
          start += increment;
          if (start >= endValue) {
            start = endValue;
            clearInterval(timer);
          }
          setStats((prev) => ({
            ...prev,
            [key]: Math.floor(start)
          }));
        }, 16);
      };

      animateValue("professors", targetStats.professors, 2000);
      animateValue("papers", targetStats.papers, 2200);
      animateValue("evaluations", targetStats.evaluations, 2600);
    }
  }, [targetStats]);

  return (
    <div style={styles.container}>

      {/* BACKGROUND */}
      <div style={styles.bg1}></div>
      <div style={styles.bg2}></div>
      <div style={styles.bg3}></div>

      {/* NAVBAR */}
      <nav style={styles.navbar}>

        <div style={styles.logo}>
          <div style={styles.logoIcon}>
            <FaGraduationCap />
          </div>

          <div>
            <h2 style={styles.logoText}>
              Smart Examination Evaluation System
            </h2>

            <p style={styles.logoSub}>
              Digital & Smart ExamFlow
            </p>
          </div>
        </div>

        <div style={styles.navButtons}>

          <Link
            to="/admin-login"
            style={styles.adminBtn}
          >
            <FaUserShield />
            Admin
          </Link>

          <Link
            to="/professor-login"
            style={styles.profBtn}
          >
            <FaChalkboardTeacher />
            Professor
          </Link>

        </div>

      </nav>

      {/* HERO */}
      <section style={styles.heroSection}>

        {/* LEFT */}
        <div style={styles.leftSection}>

          <div style={styles.badge}>
            <span style={styles.liveDot}></span>
            Live Smart Portal
          </div>

          <h1 style={styles.heroTitle}>
            {rotatingTexts[currentText]}
          </h1>

          <p style={styles.heroText}>
            Welcome to Calcutta Institute of Technology (CIT) – where innovation meets excellence, shaping future engineers and leaders through world-class education, cutting-edge research, and a dynamic learning environment.
          </p>

          <div style={styles.heroButtons}>

            <Link
              to="/admin-login"
              style={styles.primaryBtn}
            >
              Get Started
              <FaArrowRight />
            </Link>

            <Link
              to="/professor-login"
              style={styles.secondaryBtn}
            >
              Open Portal
            </Link>

          </div>

          {/* STATS */}
          <div style={styles.statsGrid}>

            <div style={styles.statCard}>
              <FaUsers style={styles.statIcon} />

              <h2>
                {stats.professors}+
              </h2>

              <p>Professors</p>
            </div>

            <div style={styles.statCard}>
              <FaBookOpen style={styles.statIcon} />

              <h2>
                {stats.papers}+
              </h2>

              <p>Assigned Papers</p>
            </div>

            <div style={styles.statCard}>
              <FaChartLine style={styles.statIcon} />

              <h2>
                {stats.evaluations}+
              </h2>

              <p>Evaluations</p>
            </div>

          </div>

        </div>

        {/* RIGHT */}
        <div style={styles.rightSection}>

          <div style={styles.mainCard}>

            <div style={styles.topGlow}></div>

            <div style={styles.cardIcon}>
              <FaUniversity />
            </div>

            <h2 style={styles.cardTitle}>
              Product Features
            </h2>

            <p style={styles.cardText}>
              Fully digital modern examination
              workflow with premium UI and
              secure management system.
            </p>

            <div style={styles.cardMiniGrid}>

              <div style={styles.miniCard}>
                <FaClipboardCheck />

                <span>
                  Smart Evaluation
                </span>
              </div>

              <div style={styles.miniCard}>
                <FaUserShield />

                <span>
                  Secure Access
                </span>
              </div>

            </div>

          </div>

        </div>

      </section>

    </div>
  );
}

const styles = {
  container: {
    minHeight: "100vh",
    backgroundImage:
      `linear-gradient(rgba(2,6,23,0.75), rgba(15,23,42,0.75)), url(${homeBg})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    position: "relative",
    overflow: "hidden",
    fontFamily: "'Poppins', sans-serif",
    color: "white"
  },

  bg1: {
    position: "absolute",
    width: "350px",
    height: "350px",
    borderRadius: "50%",
    background: "#7c3aed",
    top: "-120px",
    left: "-100px",
    opacity: 0.4,
    filter: "blur(120px)"
  },

  bg2: {
    position: "absolute",
    width: "350px",
    height: "350px",
    borderRadius: "50%",
    background: "#2563eb",
    bottom: "-120px",
    right: "-100px",
    opacity: 0.4,
    filter: "blur(120px)"
  },

  bg3: {
    position: "absolute",
    width: "250px",
    height: "250px",
    borderRadius: "50%",
    background: "#06b6d4",
    top: "40%",
    left: "45%",
    opacity: 0.2,
    filter: "blur(100px)"
  },

  /* NAVBAR */
  navbar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "24px 60px",
    position: "relative",
    zIndex: 2
  },

  logo: {
    display: "flex",
    alignItems: "center",
    gap: "15px"
  },

  logoIcon: {
    width: "55px",
    height: "55px",
    borderRadius: "18px",
    background:
      "linear-gradient(135deg,#7c3aed,#2563eb)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontSize: "24px",
    boxShadow:
      "0 10px 30px rgba(99,102,241,0.45)"
  },

  logoText: {
    margin: 0,
    fontSize: "26px",
    fontWeight: "700"
  },

  logoSub: {
    margin: 0,
    color: "#94a3b8",
    fontSize: "12px"
  },

  navButtons: {
    display: "flex",
    gap: "15px"
  },

  adminBtn: {
    textDecoration: "none",
    background:
      "rgba(255,255,255,0.08)",
    border:
      "1px solid rgba(255,255,255,0.1)",
    color: "white",
    padding: "12px 20px",
    borderRadius: "16px",
    display: "flex",
    alignItems: "center",
    gap: "10px",
    backdropFilter: "blur(15px)",
    fontWeight: "600"
  },

  profBtn: {
    textDecoration: "none",
    background:
      "linear-gradient(135deg,#7c3aed,#2563eb)",
    color: "white",
    padding: "12px 22px",
    borderRadius: "16px",
    display: "flex",
    alignItems: "center",
    gap: "10px",
    fontWeight: "600",
    boxShadow:
      "0 10px 25px rgba(99,102,241,0.4)"
  },

  /* HERO */
  heroSection: {
    minHeight: "calc(100vh - 100px)",
    display: "grid",
    gridTemplateColumns: "1.1fr 0.9fr",
    alignItems: "center",
    gap: "50px",
    padding: "20px 60px 60px",
    position: "relative",
    zIndex: 2
  },

  leftSection: {
    maxWidth: "700px"
  },

  badge: {
    display: "inline-flex",
    alignItems: "center",
    gap: "10px",
    background:
      "rgba(255,255,255,0.08)",
    border:
      "1px solid rgba(255,255,255,0.1)",
    padding: "10px 18px",
    borderRadius: "30px",
    color: "#cbd5e1",
    fontSize: "14px",
    marginBottom: "30px",
    backdropFilter: "blur(15px)"
  },

  liveDot: {
    width: "10px",
    height: "10px",
    borderRadius: "50%",
    background: "#22c55e"
  },

  heroTitle: {
    fontSize: "68px",
    lineHeight: "80px",
    fontWeight: "800",
    marginBottom: "25px",
    background:
      "linear-gradient(135deg,#ffffff,#c4b5fd,#93c5fd)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent"
  },

  heroText: {
    color: "#cbd5e1",
    fontSize: "18px",
    lineHeight: "34px",
    maxWidth: "620px"
  },

  heroButtons: {
    display: "flex",
    gap: "18px",
    marginTop: "35px"
  },

  primaryBtn: {
    textDecoration: "none",
    background:
      "linear-gradient(135deg,#7c3aed,#2563eb)",
    color: "white",
    padding: "16px 28px",
    borderRadius: "18px",
    display: "flex",
    alignItems: "center",
    gap: "12px",
    fontWeight: "700",
    boxShadow:
      "0 15px 35px rgba(99,102,241,0.4)"
  },

  secondaryBtn: {
    textDecoration: "none",
    background:
      "rgba(255,255,255,0.08)",
    border:
      "1px solid rgba(255,255,255,0.1)",
    color: "white",
    padding: "16px 28px",
    borderRadius: "18px",
    backdropFilter: "blur(15px)",
    fontWeight: "600"
  },

  statsGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(3,minmax(150px,1fr))",
    gap: "20px",
    marginTop: "50px"
  },

  statCard: {
    background:
      "rgba(255,255,255,0.07)",
    border:
      "1px solid rgba(255,255,255,0.08)",
    borderRadius: "24px",
    padding: "24px",
    backdropFilter: "blur(18px)",
    boxShadow:
      "0 10px 30px rgba(0,0,0,0.25)"
  },

  statIcon: {
    fontSize: "26px",
    color: "#a5b4fc",
    marginBottom: "18px"
  },

  /* RIGHT */
  rightSection: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center"
  },

  mainCard: {
    width: "430px",
    padding: "40px",
    borderRadius: "32px",
    background:
      "rgba(255,255,255,0.08)",
    border:
      "1px solid rgba(255,255,255,0.1)",
    backdropFilter: "blur(25px)",
    boxShadow:
      "0 20px 60px rgba(0,0,0,0.45)",
    position: "relative",
    overflow: "hidden"
  },

  topGlow: {
    position: "absolute",
    width: "220px",
    height: "220px",
    borderRadius: "50%",
    background:
      "linear-gradient(135deg,#7c3aed,#2563eb)",
    top: "-100px",
    right: "-100px",
    opacity: 0.35,
    filter: "blur(60px)"
  },

  cardIcon: {
    width: "90px",
    height: "90px",
    borderRadius: "28px",
    background:
      "linear-gradient(135deg,#7c3aed,#2563eb)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontSize: "34px",
    marginBottom: "30px",
    boxShadow:
      "0 15px 35px rgba(99,102,241,0.45)"
  },

  cardTitle: {
    fontSize: "32px",
    fontWeight: "700",
    marginBottom: "20px"
  },

  cardText: {
    color: "#cbd5e1",
    lineHeight: "30px",
    fontSize: "16px"
  },

  cardMiniGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "18px",
    marginTop: "35px"
  },

  miniCard: {
    background:
      "rgba(255,255,255,0.06)",
    border:
      "1px solid rgba(255,255,255,0.08)",
    borderRadius: "20px",
    padding: "22px",
    display: "flex",
    flexDirection: "column",
    gap: "15px",
    fontSize: "20px",
    color: "#a5b4fc"
  }
};