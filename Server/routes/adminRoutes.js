const express = require("express");
const router = express.Router();
const db = require("../config/db"); 
const upload = require("../middleware/upload");

// ==========================================
// 1. ADMIN LOGIN (Database Connected)
// ==========================================
router.post("/login", async (req, res) => {
  const { email, password, role } = req.body;

  // We query the 'login' table from your SQL dump
  const sql = "SELECT * FROM login WHERE UserName = ? AND UserPwd = ? AND IsActive = 1";
  
  try {
    const [rows] = await db.query(sql, [email, password]);

    if (rows.length > 0) {
      // Send back user data but exclude the password for security
      const { UserPwd, ...userData } = rows[0];
      res.status(200).json(userData);
    } else {
      res.status(401).json({ message: "Invalid Institutional Credentials" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// ==========================================
// 2. ADD PROFESSOR
// ==========================================
router.post("/add-professor", upload.single("photo"), async (req, res) => {
  const data = req.body;
  const photoFile = req.file ? req.file.filename : null;

  const sql = `
    INSERT INTO professors (
      name, designation, subject, email, password,
      mobile, experience, photo,
      bank_name, branch_name, ifsc_code,
      account_number, account_holder_name, bank_address
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  try {
    await db.query(sql, [
      data.name,
      data.designation,
      data.subject,
      data.email,
      data.password, // In production, you should hash this!
      data.mobile,
      data.experience,
      photoFile,
      data.bank_name,
      data.branch_name,
      data.ifsc_code,
      data.account_number,
      data.account_holder_name,
      data.bank_address
    ]);
    res.status(201).json({ message: "Professor Registered Successfully ✅" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to add professor to database" });
  }
});

// ==========================================
// 3. GET ALL PROFESSORS
// ==========================================
router.get("/professors", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM professors ORDER BY id DESC");
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ==========================================
// 4. UPDATE PROFESSOR
// ==========================================
router.put("/update-professor/:id", upload.single("photo"), async (req, res) => {
  const id = req.params.id;
  const data = req.body;
  
  // If a new photo is uploaded, use it. Otherwise, keep the old photo name.
  const photoFile = req.file ? req.file.filename : data.photo;

  const sql = `
    UPDATE professors SET
      name=?, designation=?, subject=?, email=?,
      mobile=?, experience=?, photo=?,
      bank_name=?, branch_name=?, ifsc_code=?,
      account_number=?, account_holder_name=?, bank_address=?
    WHERE id=?
  `;

  try {
    await db.query(sql, [
      data.name, data.designation, data.subject, data.email,
      data.mobile, data.experience, photoFile,
      data.bank_name, data.branch_name, data.ifsc_code,
      data.account_number, data.account_holder_name, data.bank_address,
      id
    ]);
    res.json({ message: "Professor profile updated successfully ✅" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ==========================================
// 5. DELETE PROFESSOR
// ==========================================
router.delete("/delete-professor/:id", async (req, res) => {
  const id = req.params.id;
  try {
    await db.query("DELETE FROM professors WHERE id = ?", [id]);
    res.json({ message: "Professor record removed from system ❌" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;