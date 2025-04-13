import React from "react";
import { Routes, Route } from "react-router-dom";
import { Container } from "@mui/material";
import Home from "./Components/Home";
import Dashboard from "./Components/Dashboard";
import Login from "./User/Login";
import Register from "./User/Register";
import UserProfile from "./User/UserProfile";
import BookManagement from "./Components/BookManagement";
import AdminRegister from "./Admin/AdminRegistration";
import AdminLogin from "./Admin/AdminLogin";

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
