const express = require("express");
const router = express.Router();
const db = require("../config/db");

// Helper to get grade logic
const getGrade = async (marks) => {
  const [rules] = await db.query("SELECT grade FROM grade_rules WHERE ? BETWEEN min_marks AND max_marks", [marks]);
  return rules.length > 0 ? rules[0].grade : "Fail";
};

// SAVE OR UPDATE MARKS
router.post("/save", async (req, res) => {
  const { assignment_id, roll_no, marks, remarks } = req.body;
  try {
    const grade = await getGrade(marks);
    const [existing] = await db.query("SELECT * FROM marks_entry WHERE assignment_id=? AND roll_no=?", [assignment_id, roll_no]);
    
    if (existing.length > 0) {
      await db.query("UPDATE marks_entry SET marks=?, remarks=?, grade=? WHERE assignment_id=? AND roll_no=?", [marks, remarks, grade, assignment_id, roll_no]);
      res.send("Marks Updated");
    } else {
      await db.query("INSERT INTO marks_entry (assignment_id, roll_no, marks, remarks, grade) VALUES (?,?,?,?,?)", [assignment_id, roll_no, marks, remarks, grade]);
      res.send("Marks Saved");
    }
  } catch (err) { res.status(500).send(err); }
});

// GET MARKS BY ASSIGNMENT
router.get("/:assignmentId", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM marks_entry WHERE assignment_id=?", [req.params.assignmentId]);
    res.json(rows);
  } catch (err) { res.status(500).send(err); }
});

// GET GRADE PREVIEW
router.get("/grade/:marks", async (req, res) => {
  try {
    const grade = await getGrade(req.params.marks);
    res.json({ grade });
  } catch (err) { res.status(500).send(err); }
});

module.exports = router;