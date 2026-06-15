const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload");

const {
  getAllStudents,
  getStudentById,
  createStudent,
  deleteStudent,
  updateStudent,
  getActivityLogs,
} = require("../controllers/studentController");

router.get("/", getAllStudents);
router.get("/logs", getActivityLogs);
router.get("/:id", getStudentById);
router.post("/", createStudent);
router.delete("/:id", deleteStudent);
router.put("/:id", updateStudent);

router.post(
  "/upload",
  upload.single("photo"),
  (req, res) => {
    res.json({
      message: "File uploaded successfully",
      filePath: `/uploads/${req.file.filename}`,
    });
  }
);

module.exports = router;