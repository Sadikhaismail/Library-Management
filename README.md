Library Management System
This is a Full-Stack Library Management application built using the MERN stack (MongoDB, Express, React, Node.js). The system allows users to manage a library catalog, borrow books, and maintain user accounts. Admin users can perform CRUD operations on books, while regular users can view and borrow books.

Features
User Authentication: Secure login and registration system for users.
Book Management: Admin users can add, update, and delete books.
Search and Filter: Search and filter books by title, author, genre, and availability.
Borrowing System: Users can borrow and return books, with real-time updates on availability.
Responsive UI: A fully responsive and intuitive user interface built with React.
Admin Dashboard: Provides admin users with an overview of the library, including book statistics.
Tech Stack
Frontend:

React.js
React Router for navigation
Axios for API calls

Backend:

Node.js
Express.js
MongoDB (Mongoose for database interaction)
JWT (JSON Web Tokens) for authentication
Tools:

Postman for API testing
Git for version control
Installation
To run the project locally, follow these steps:

1. Clone the repository
bash
Copy code
git clone https://github.com/Sadikhaismail/Library-Management.git
2. Install dependencies
Backend (Server)
Navigate to the backend folder and install the necessary dependencies:

bash
Copy code
cd backend
npm install
Frontend (Client)
Navigate to the frontend folder and install the necessary dependencies:

bash
Copy code
cd frontend
npm install
3. Set up environment variables
Create a .env file in the backend directory and add the following environment variables:

bash
Copy code
MONGO_URI=mongodb://127.0.0.1:27017/booksmanager
JWT_SECRET=12345
PORT=5000
ADMIN_KEY=12345

4. Run the application
Backend
Start the server:

bash
Copy code
cd backend
npm start
Frontend
Start the client:

bash
Copy code
cd frontend
npm start
The application will now be running on http://localhost:3000 (frontend) and http://localhost:5000 (backend).

Usage
Admin Users: Can log in and manage the library catalog (add/update/delete books).
Regular Users: Can search for books, borrow available books, and return borrowed books.
Authentication: JWT-based authentication is implemented for both admin and regular users.
