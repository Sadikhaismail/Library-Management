import React, { useState } from 'react';
import { TextField, Button, Typography, Box, Snackbar, Alert, Link } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Axios from '../Utils/Axios';
import image from './imagecopy.png'; 

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false); 
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const response = await Axios.post('/users/login', { email, password });
      localStorage.setItem('token', response.data.token);
      setSuccess(true); 
      setTimeout(() => navigate('/dashboard'), 2000); 
    } catch (err) {
      console.error("Login Error:", err); // Log the error for debugging
      setError(err.response?.data?.message || 'Invalid credentials'); // Use the API error message if available
    }
  };
  

  return (
    <>
      <Box
        sx={{
          width: '100%',
          height: '100vh',
          display: 'flex',
          justifyContent: 'flex-start', 
          alignItems: 'center',
          backgroundImage: `url(${image})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat', 
          position: 'absolute', 
          top: '0',
          left: '0',
          zIndex: '-1',
        }}
      >
        <Box
          sx={{
            maxWidth: 400,
            padding: 5,
            marginLeft: '110px', 
            backgroundColor: 'rgb(255, 255, 255)',
            borderRadius: 2,
            boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)', 
          }}
        >
          <Typography variant="h5" gutterBottom>Login</Typography>
          {error && <Typography color="error">{error}</Typography>}
          <TextField
            label="Email"
            fullWidth
            margin="normal"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            label="Password"
            type="password"
            fullWidth
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button
            variant="contained"
            color="primary"
            fullWidth
            onClick={handleLogin}
            sx={{ marginTop: 2 }}
          >
            Login
          </Button>

          <Typography variant="body2" sx={{ marginTop: 2, textAlign: 'center' }}>
            Not registered?{' '}
            <Link href="/register" underline="hover">
              Register here
            </Link>
          </Typography>
        </Box>
      </Box>

      <Snackbar
        open={success}
        autoHideDuration={2000}
        onClose={() => setSuccess(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={() => setSuccess(false)} severity="success" sx={{ width: '100%' }}>
          Login successful!
        </Alert>
      </Snackbar>
    </>
  );
};

export default Login;
