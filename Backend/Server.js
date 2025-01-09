require('dotenv').config();
const express = require('express');
const connectDB = require('./Config/Db');
const bookRoutes = require('./Routes/BookRoute'); 
const userRoute = require('./Routes/UserRoute');
const borrowRoute = require ('./Routes/BorrowRoute')
const cors = require('cors');


const app = express();
app.use(express.json()); 
app.use(cors({ origin: 'http://localhost:3000' }));

app.use(express.json()); 

connectDB();

app.use('/api', bookRoutes); 
app.use('/api', userRoute); 
app.use('/api', borrowRoute);


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 