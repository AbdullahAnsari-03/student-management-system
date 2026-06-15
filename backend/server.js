require("dotenv").config();

const express = require("express");
const cors = require("cors");
const pool = require("./config/db");
const path = require("path");

const app = express();
const studentRoutes = require("./routes/studentRoutes");

app.use(cors());
app.use(express.json());

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.get("/", (req, res) => {
  res.send("Student Management API Running");
});

app.use("/students", studentRoutes);

pool.connect()
  .then(() => {
    console.log("PostgreSQL Connected Successfully");
  })
  .catch((err) => {
    console.error("Database Connection Error:", err.message);
  });

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});