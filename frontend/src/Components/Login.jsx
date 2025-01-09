import React, { useState } from 'react';
import { TextField, Button, Typography, Box, Snackbar, Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Axios from '../Utils/Axios';
import image from './imagecopy.png'; // Background image

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false); // For success message
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const response = await Axios.post('/users/login', { email, password });
      localStorage.setItem('token', response.data.token);
      setSuccess(true); // Show success message
      setTimeout(() => navigate('/dashboard'), 2000); // Navigate to home after 2 seconds
    } catch (err) {
      setError('Invalid credentials');
    }
  };

  return (
    <>
      <Box
        sx={{
          width: '100%',
          height: '100vh',
          display: 'flex',
          justifyContent: 'flex-start', // Aligns the box to the left
          alignItems: 'center',
          backgroundImage: `url(${image})`, // Background image
          backgroundSize: 'cover', // Ensures the image covers the container
          backgroundPosition: 'center', // Centers the image
          backgroundRepeat: 'no-repeat', // Prevents image repetition
          position: 'absolute', // Stretches properly
          top: '0',
          left: '0',
          zIndex: '-1', // Pushes the image behind the form
        }}
      >
        <Box
          sx={{
            maxWidth: 400,
            padding: 5,
            marginLeft: '110px', // Adjusts the position
            backgroundColor: 'rgb(255, 255, 255)',
            borderRadius: 2,
            boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)', // Adds a soft shadow
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
        </Box>
      </Box>

      {/* Success Snackbar */}
      <Snackbar
        open={success}
        autoHideDuration={3000} // Snackbar disappears after 3 seconds
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
