const express = require("express");
const router = express.Router();
const db = require("../config/db");

const tables = ["designations", "subjects", "academic_years", "years", "semesters", "exam_types", "exam_type_rules", "credit_points"];

// Dynamic route generator for dropdowns
tables.forEach(table => {
  router.get(`/${table.replace('_', '-')}`, async (req, res) => {
    try {
      const [rows] = await db.query(`SELECT * FROM ${table}`);
      res.json(rows);
    } catch (err) { res.status(500).json(err); }
  });
});

module.exports = router;