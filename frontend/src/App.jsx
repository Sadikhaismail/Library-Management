import {  Routes, Route } from 'react-router-dom';
import { Container } from '@mui/material';
import Home from './Components/Home'; 
import Dashboard from './Components/Dashboard';
import Login from './Components/Login';
import Register from './Components/Register';
import UserProfile from './Components/UserProfile';
import BookManagement from './Components/BookManagement';
import AdminRegister from './Components/AdminRegistration';
import AdminLogin from './Components/AdminLogin';



const App = () => {
  return (
    
      <Container maxWidth="md">
        <Routes>
          <Route path="/" element={<Home />} /> 
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/profile" element={<UserProfile />} />
          <Route path="/Manage" element={<BookManagement />} />
          <Route path="/Admin" element={<AdminRegister />} />
          <Route path="/AdminLogin" element={<AdminLogin />} />



        </Routes>
      </Container>
   
  );
};

export default App;
