const express = require("express");
const router = express.Router();
const db = require("../config/db");

// 1. REGISTER STUDENT (Handles: POST http://localhost:5000/admin/students)
router.post("/", async (req, res) => {
    const { name, reg_no, exam_roll, abcid, stream, major, minor1, minor2, aec1, mdc1, vac1, sec1_p } = req.body;

    const sql = `
    INSERT INTO students 
    (name, reg_no, exam_roll, abcid, stream, major, minor1, minor2, aec1, mdc1, vac1, sec1_p) 
    VALUES (?,?,?,?,?,?,?,?,?,?,?,?)
  `;

    try {
        await db.query(sql, [name, reg_no, exam_roll, abcid, stream, major, minor1, minor2, aec1, mdc1, vac1, sec1_p]);
        res.status(201).json({ message: "Student Registered Successfully ✅" });
    } catch (err) {
        console.error("Database Insert Error:", err);
        res.status(500).json({ error: err.sqlMessage || "Failed to register student." });
    }
});

// 2. GET ALL STUDENTS (Handles: GET http://localhost:5000/admin/students)
router.get("/", async (req, res) => {
    try {
        const [rows] = await db.query("SELECT * FROM students ORDER BY id DESC");
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 3. SEARCH STUDENT (For Report Card)
router.get("/search", async (req, res) => {
    const { query } = req.query;
    try {
        const [rows] = await db.query("SELECT * FROM students WHERE reg_no = ? OR abcid = ?", [query, query]);
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 4. GET STUDENT MARKS (For Report Card)
router.get("/:roll/marks", async (req, res) => {
    const sql = `
    SELECT me.*, pa.subject, pa.semester, pa.exam_type, cp.credit_value, gr.grade_point
    FROM marks_entry me
    JOIN paper_assignments pa ON me.assignment_id = pa.id
    JOIN credit_points cp ON pa.credit_point = cp.credit_value
    JOIN grade_rules gr ON me.grade = gr.grade
    WHERE me.roll_no = ?
    ORDER BY pa.semester ASC
  `;
    try {
        const [rows] = await db.query(sql, [req.params.roll]);
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;