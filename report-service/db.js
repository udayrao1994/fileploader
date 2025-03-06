const mysql = require('mysql2/promise');
const dotenv = require('dotenv');

// 🔄 Load .env file
dotenv.config();

// Create a connection pool
const db = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

// Test connection by making a simple query
db.query('SELECT 1')
    .then(() => console.log('✅ MySQL Connected!'))
    .catch((err) => console.error('❌ MySQL Connection Failed:', err));

module.exports = db;  // Export the pool directly
