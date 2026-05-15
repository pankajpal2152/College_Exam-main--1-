const express = require("express");
const router = express.Router();
const db = require("../config/db");

// 1. Get Main Dashboard Stats
router.get("/stats", async (req, res) => {
    try {
        const sql = `
      SELECT 
        (SELECT COUNT(*) FROM professors) AS totalProfessors,
        (SELECT COUNT(*) FROM paper_assignments WHERE status = 'Draft') AS pendingReviews,
        (SELECT COUNT(*) FROM paper_assignments WHERE status = 'Submitted') AS completedScripts,
        (SELECT COUNT(DISTINCT subject_name) FROM subjects) AS totalDepartments
    `;
        const [rows] = await db.query(sql);

        // Send the first row (the counts)
        res.json({
            totalProfessors: rows[0].totalProfessors || 0,
            pendingReviews: rows[0].pendingReviews || 0,
            completedScripts: rows[0].completedScripts || 0,
            totalDepartments: rows[0].totalDepartments || 0
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to fetch stats" });
    }
});

// 2. Get Profile Stats (Right Panel)
router.get("/profile-stats", async (req, res) => {
    try {
        const sql = `
      SELECT 
        (SELECT COUNT(*) FROM paper_assignments WHERE status = 'Submitted') AS totalReviews,
        (SELECT COUNT(*) FROM paper_assignments WHERE status = 'Draft') AS pendingTasks,
        (SELECT COUNT(DISTINCT subject_name) FROM subjects) AS departments
    `;
        const [rows] = await db.query(sql);

        res.json({
            totalReviews: rows[0].totalReviews || 0,
            pendingTasks: rows[0].pendingTasks || 0,
            departments: rows[0].departments || 0
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to fetch profile stats" });
    }
});

// 3. Get Recent Activities (Table)
router.get("/recent-activities", async (req, res) => {
    try {
        // Join paper_assignments and professors to get real activity
        const sql = `
      SELECT 
        p.name, 
        pa.subject, 
        CASE 
          WHEN pa.status = 'Submitted' THEN 'Reviewed' 
          ELSE 'Pending' 
        END as status,
        'Recently' as time
      FROM paper_assignments pa
      JOIN professors p ON pa.professor_id = p.id
      ORDER BY pa.id DESC
      LIMIT 5
    `;
        const [rows] = await db.query(sql);
        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to fetch activities" });
    }
});

module.exports = router;