const express = require("express");
const cors = require("cors");
const path = require("path");
const fs = require("fs");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Ensure 'uploads' folder exists for Professor/Student photos
const uploadDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// Static folder for images
app.use("/uploads", express.static(uploadDir));

/* IMPORT ROUTES */
const adminRoutes = require("./routes/adminRoutes");
const professorRoutes = require("./routes/professorRoutes");
const marksRoutes = require("./routes/marksRoutes");
const assignmentRoutes = require("./routes/assignmentRoutes");
const dropdownRoutes = require("./routes/dropdownRoutes");
const studentRoutes = require("./routes/studentRoutes");
const headExaminerRoutes = require("./routes/headExaminerRoutes");
const reviewRoutes = require("./routes/reviewRoutes");


/* USE ROUTES */
app.use("/admin", adminRoutes);
app.use("/professor", professorRoutes);
app.use("/marks", marksRoutes);
app.use("/assignment", assignmentRoutes);
app.use("/dropdown", dropdownRoutes);
app.use("/admin/students", studentRoutes);
app.use("/admin/student", studentRoutes);
app.use("/head-examiner", headExaminerRoutes);
app.use("/admin/reviews", reviewRoutes);

// Global Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send({ error: "Something went wrong on the server!" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});