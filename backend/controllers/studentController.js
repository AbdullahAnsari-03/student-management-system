const pool = require("../config/db");

const logActivity = async (action, studentName) => {
  await pool.query(
    `INSERT INTO activity_logs (action, student_name)
     VALUES ($1, $2)`,
    [action, studentName]
  );
};

async function generateAdmissionNumber() {
  const result = await pool.query(`
    SELECT admission_number
    FROM students
    ORDER BY CAST(SUBSTRING(admission_number FROM 4) AS INTEGER) DESC
    LIMIT 1
  `);

  if (result.rows.length === 0) {
    return "ADM0001";
  }

  const lastAdmissionNo = result.rows[0].admission_number;
  const number = parseInt(lastAdmissionNo.replace("ADM", ""));

  return `ADM${String(number + 1).padStart(4, "0")}`;
}

const getAllStudents = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;

    const offset = (page - 1) * limit;

    const studentsResult = await pool.query(
      "SELECT * FROM students ORDER BY id ASC LIMIT $1 OFFSET $2",
      [limit, offset]
    );

    const countResult = await pool.query(
      "SELECT COUNT(*) FROM students"
    );

    const total = parseInt(countResult.rows[0].count);

    res.json({
      students: studentsResult.rows,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Server Error",
    });
  }
};

const getStudentById = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      "SELECT * FROM students WHERE id = $1",
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Student not found",
      });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Server Error",
    });
  }
};

const createStudent = async (req, res) => {
  try {
    const {
      name,
      course,
      year,
      dob,
      email,
      mobile,
      gender,
      address,
      photo_url,
    } = req.body;

    if (
      !name ||
      !course ||
      !year ||
      !dob ||
      !email ||
      !mobile ||
      !gender
    ) {
      return res.status(400).json({
        message: "All required fields must be provided",
      });
    }

    const admission_number = await generateAdmissionNumber();

    const result = await pool.query(
      `INSERT INTO students (
        admission_number,
        name,
        course,
        year,
        dob,
        email,
        mobile,
        gender,
        address,
        photo_url
      )
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
      RETURNING *`,
      [
        admission_number,
        name,
        course,
        year,
        dob,
        email,
        mobile,
        gender,
        address,
        photo_url,
      ]
    );
    await logActivity("CREATE", name);

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: error.message,
    });
  }
};

const deleteStudent = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      "DELETE FROM students WHERE id = $1 RETURNING *",
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Student not found",
      });
    }

    await logActivity("DELETE", result.rows[0].name);

    res.json({
      message: "Student deleted successfully",
      student: result.rows[0],
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Server Error",
    });
  }
};

const updateStudent = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      name,
      course,
      year,
      dob,
      email,
      mobile,
      gender,
      address,
      photo_url,
    } = req.body;

    const result = await pool.query(
      `UPDATE students
       SET
         name = $1,
         course = $2,
         year = $3,
         dob = $4,
         email = $5,
         mobile = $6,
         gender = $7,
         address = $8,
         photo_url = COALESCE($9, photo_url)
       WHERE id = $10
       RETURNING *`,
      [
        name,
        course,
        year,
        dob,
        email,
        mobile,
        gender,
        address,
        photo_url || null,
        id,
      ]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Student not found",
      });
    }
    await logActivity("UPDATE", result.rows[0].name);

    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Server Error",
    });
  }
};

const getActivityLogs = async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM activity_logs ORDER BY created_at DESC"
    );

    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Server Error",
    });
  }
};

module.exports = {
  getAllStudents,
  getStudentById,
  createStudent,
  deleteStudent,
  updateStudent,
  getActivityLogs,
};

