const mysql = require('mysql2');
require('dotenv').config();

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
});

const createBooksTableQuery = `
    CREATE TABLE IF NOT EXISTS books (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        author VARCHAR(255) NOT NULL,
        published_date DATE,
        genre VARCHAR(100)
    )
`;

pool.query(createBooksTableQuery, (err, results) => {
    if (err) {
        return console.error('Error:', err.message);
    }
    console.log('Books table created successfully');
});



