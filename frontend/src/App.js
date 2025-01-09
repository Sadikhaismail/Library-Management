import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Container } from '@mui/material';
import Home from './Components/Home'; // Import Home component (only once)
import Dashboard from './Components/Dashboard';
import Login from './Components/Login';
import Register from './Components/Register';
import UserProfile from './Components/UserProfile';
import BookManagement from './Components/BookManagement';
import AdminRegister from './Components/AdminRegistration';
import AdminLogin from './Components/AdminLogin';
import './index.css';


const App = () => {
  return (
    <Router>
      <Container maxWidth="md">
        <Routes>
          <Route path="/" element={<Home />} /> {/* Set Home as the front page */}
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/profile" element={<UserProfile />} />
          <Route path="/Manage" element={<BookManagement />} />
          <Route path="/Admin" element={<AdminRegister />} />
          <Route path="/AdminLogin" element={<AdminLogin />} />



        </Routes>
      </Container>
    </Router>
  );
};

export default App;
