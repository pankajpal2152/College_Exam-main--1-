const express = require("express");
const router = express.Router();
const db = require("../config/db");

// ASSIGN PAPER
router.post("/assign-paper", async (req, res) => {
  const { professor_id, academic_year, year, semester, subject, exam_type, credit_point, start_roll, end_roll } = req.body;
  const sql = `INSERT INTO paper_assignments (professor_id, academic_year, year, semester, subject, exam_type, credit_point, start_roll, end_roll, status) VALUES (?,?,?,?,?,?,?,?,'Draft')`;
  try {
    await db.query(sql, [professor_id, academic_year, year, semester, subject, exam_type, credit_point, start_roll, end_roll]);
    res.send("Paper Assigned Successfully ✅");
  } catch (err) { res.status(500).send(err); }
});

// FINAL SUBMIT (Lock the marks)
router.put("/final-submit/:id", async (req, res) => {
  const id = req.params.id;
  try {
    await db.query("UPDATE paper_assignments SET status = 'Submitted' WHERE id = ?", [id]);
    res.send({ message: "Marks Submitted and Locked Successfully ✅" });
  } catch (err) {
    res.status(500).send(err);
  }
});

// GET ALL ASSIGNED PAPERS
router.get("/all", async (req, res) => {
  const sql = `SELECT paper_assignments.*, professors.name AS professor_name FROM paper_assignments 
               JOIN professors ON paper_assignments.professor_id = professors.id ORDER BY paper_assignments.id DESC`;
  try {
    const [rows] = await db.query(sql);
    res.json(rows);
  } catch (err) { res.status(500).send(err); }
});

// DELETE ASSIGNED PAPER
router.delete("/delete/:id", async (req, res) => {
  try {
    await db.query("DELETE FROM marks_entry WHERE assignment_id=?", [req.params.id]);
    await db.query("DELETE FROM paper_assignments WHERE id=?", [req.params.id]);
    res.send("Assigned Paper Deleted Successfully ❌");
  } catch (err) { res.status(500).send(err); }
});

module.exports = router;