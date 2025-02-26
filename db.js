const mysql = require('mysql');
require('dotenv').config(); 

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'password',
  database: process.env.DB_NAME || 'recipes_db',
  connectionLimit: 10
});

module.exports = pool;
