const express = require("express");
const cors = require("cors");
const mysql = require("mysql2");
const app = express();

app.use(cors());
app.use(express.json()); // Untuk parsing JSON dari request body

// Koneksi ke database MySQL
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "", // Sesuaikan dengan password MySQL Anda
  database: "kkm",
});

db.connect((err) => {
  if (err) throw err;
  console.log("Connected to MySQL database");
});

// API endpoint untuk mengambil semua dosen
app.get("/api/dosen", (req, res) => {
  const sql =
    "SELECT dosen.id, dosen.nama, dosen.nidn, COUNT(comments.id) AS comment_count FROM dosen LEFT JOIN comments ON dosen.id = comments.dosen_id GROUP BY dosen.id";
  db.query(sql, (err, results) => {
    if (err) throw err;
    res.json(results);
  });
});

// API endpoint untuk mengambil komentar berdasarkan dosen_id
app.get("/api/comments/:dosenId", (req, res) => {
  const { dosenId } = req.params;
  const sql = "SELECT comment, created_at FROM comments WHERE dosen_id = ?";
  db.query(sql, [dosenId], (err, results) => {
    if (err) throw err;
    res.json(results);
  });
});

// API endpoint untuk menambahkan komentar berdasarkan dosen_id
app.post("/api/comments", (req, res) => {
  const { dosenId, comment } = req.body;

  if (!dosenId || !comment) {
    return res
      .status(400)
      .json({ message: "User ID dan komentar harus diisi" });
  }

  const sql = "INSERT INTO comments (dosen_id, comment) VALUES (?, ?)";
  db.query(sql, [dosenId, comment], (err, result) => {
    if (err) throw err;
    res.json({
      message: "Comment added successfully",
      commentId: result.insertId,
    });
  });
});

// Menjalankan server
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
