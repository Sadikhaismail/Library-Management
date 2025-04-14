require('dotenv').config();
const express = require('express');
const connectDB = require('./Config/Db');
const bookRoutes = require('./Routes/BookRoute'); 
const userRoute = require('./Routes/UseRoute');
const borrowRoute = require ('./Routes/BorrowRoute')
const adminRoutes = require ('./Routes/AdminRoute')
const cookieParser = require("cookie-parser");


const cors = require('cors');


const app = express();
app.use(express.json()); 
app.use(cors({ credentials: true, origin: "https://library-management-1-gzg6.onrender.com" }));

  

app.use(express.json()); 

connectDB();
app.get("/", (req, res) => {
  res.send("Backend is running!");
});
app.use(cookieParser());


app.get("/api/test", (req, res) => {
  res.json({ message: "API is working!" });
});


app.use('/api', bookRoutes); 
app.use('/api', borrowRoute);
app.use("/api/users", userRoute);
app.use("/api/admin", adminRoutes);


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 

const path = require('path');

// Serve static frontend files
app.use(express.static(path.join(__dirname, 'build')));

// Catch-all route to serve React app for unknown routes
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
});
