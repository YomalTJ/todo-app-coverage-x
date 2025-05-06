const { Pool } = require("pg");

const pool = new Pool({
  user: process.env.POSTGRES_USER || "postgres",
  host: process.env.POSTGRES_HOST || "postgres",
  database: process.env.POSTGRES_DB || "todo_db",
  password: process.env.POSTGRES_PASSWORD || "Yomal2001",
  port: 5432,
});

// Test database connection
pool.query("SELECT NOW()", (err, res) => {
  if (err) {
    console.error("Database connection error:", err);
  } else {
    console.log("Database connected successfully");
  }
});

module.exports = {
  query: (text, params) => pool.query(text, params),
};
