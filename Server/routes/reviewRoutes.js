const express = require("express");
const router = express.Router();
const db = require("../config/db");

// 1. Fetch all pending reviews
router.get("/pending", async (req, res) => {
    try {
        const [rows] = await db.query("SELECT * FROM review_applications WHERE status = 'Pending'");
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: "Database error fetching reviews" });
    }
});

// 2. Fetch Review Committee Members (Professors)
router.get("/committee", async (req, res) => {
    try {
        // Fetching all professors to act as committee members for the demo
        const [rows] = await db.query("SELECT id, name, subject FROM professors");
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: "Database error fetching committee" });
    }
});

// 3. Assign Review to Professor
router.post("/assign", async (req, res) => {
    const { application_id, professor_id } = req.body;
    try {
        const sql = "UPDATE review_applications SET assigned_professor_id = ?, status = 'Assigned' WHERE id = ?";
        await db.query(sql, [professor_id, application_id]);
        res.json({ message: "Review Application Assigned Successfully" });
    } catch (err) {
        res.status(500).json({ error: "Failed to assign review" });
    }
});

module.exports = router;