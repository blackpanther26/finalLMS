# Library Management System

This is a Library Management System (LMS) built with Node.js and Express.js, designed to provide comprehensive functionalities for both clients and administrators. 

## Features

1. **Separate Client and Admin Portals**: The system includes separate portals for clients and administrators, each with its own set of functionalities and access permissions.
   
2. **Secure Authentication and Authorization**: Users can securely log in to their respective portals, with authentication and authorization mechanisms in place to control access to different features based on user roles.

3. **Comprehensive Admin Features**:
   - Manage Book Catalog: Admins can list, update, add, and remove books from the library catalog.
   - Handle Requests: Admins can approve or deny checkout and check-in requests from clients, ensuring smooth management of book lending activities.
   - Admin Privileges: Admins have the authority to approve or deny requests from users seeking admin privileges, ensuring controlled access to administrative functions.

4. **Client Functions**:
   - View Available Books: Clients can browse the list of available books in the library catalog.
   - Request Checkout and Check-in: Clients can request to borrow books by checking them out and return them by checking them in, all managed by the admin.
   - View Borrowing History: Clients can view their borrowing history, providing transparency and accountability in their interactions with the library.

5. **Secure Password Storage**: User passwords are hashed and salted before being stored in the database, ensuring robust security measures to protect user accounts from unauthorized access.

6. **JWT-based Session Management**: The system implements session management using JSON Web Tokens (JWT), providing stateless authentication without relying on external libraries like express-session.

## Installation

   ```bash
   git clone https://github.com/blackpanther26/finalLMS
   cd finalLMS
   npm install bcrypt cookie-parser dotenv ejs express express-async-handler express-validator jsonwebtoken mysql2 nodemon
   npm start

