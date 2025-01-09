require('dotenv').config();
const express = require('express');
const connectDB = require('./Config/Db');
const bookRoutes = require('./Routes/BookRoute'); // Adjust path as needed
const userRoute = require('./Routes/UserRoute');
const borrowRoute = require ('./Routes/BorrowRoute')
const cors = require('cors');


const app = express();
app.use(express.json()); // For parsing JSON data
app.use(cors({ origin: 'http://localhost:3000' }));

// Middleware
app.use(express.json()); // For parsing JSON data

// Connect to the database
connectDB();

// Routes
app.use('/api', bookRoutes); 
app.use('/api', userRoute); 
app.use('/api', borrowRoute);


// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 