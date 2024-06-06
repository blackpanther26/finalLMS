CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password_hash VARCHAR(256) NOT NULL,
    is_admin BOOLEAN DEFAULT FALSE
);

CREATE TABLE books (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    author VARCHAR(255) NOT NULL,
    isbn VARCHAR(13) UNIQUE NOT NULL,
    total_copies INT NOT NULL DEFAULT 1
);

CREATE TABLE transactions (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    book_id INTEGER REFERENCES books(id),
    transaction_type VARCHAR(10) NOT NULL,
    transaction_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    due_date TIMESTAMP,
    return_date TIMESTAMP,
    fine DECIMAL(10, 2) DEFAULT 0,
    status VARCHAR(255) DEFAULT 'pending'
);

CREATE TABLE admin_requests (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    status ENUM('pending', 'approved', 'denied') DEFAULT 'pending'
);