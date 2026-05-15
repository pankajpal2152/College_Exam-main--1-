const express = require("express");
const router = express.Router();
const db = require("../config/db");

// PROFESSOR LOGIN
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const [rows] = await db.query("SELECT * FROM professors WHERE email=? AND password=?", [email, password]);
    if (rows.length > 0) res.json(rows[0]);
    else res.status(401).send("Invalid Credentials");
  } catch (err) { res.status(500).send(err); }
});

// GET ASSIGNED PAPERS FOR DASHBOARD
router.get("/assigned/:id", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM paper_assignments WHERE professor_id=?", [req.params.id]);
    res.json(rows);
  } catch (err) { res.status(500).send(err); }
});

module.exports = router;