import React, { useState } from 'react';
import { TextField, Button, Typography, Box, Snackbar, Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Axios from '../Utils/Axios';
import image from './imagecopy.png'; // Renamed image file

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false); // For success message
  const navigate = useNavigate();
  

  const handleRegister = async () => {
    try {
      await Axios.post('/users/register', { name, email, password });
      setSuccess(true); // Show success message
      setTimeout(() => navigate('/login'), 2000); // Navigate to login after 2 seconds
    } catch (err) {
      setError('User Already Exist');
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
            marginLeft: '110px', // Adds some space from the left edge
            backgroundColor: 'rgb(255, 255, 255)',
            borderRadius: 2,
          }}
        >
          <Typography variant="h5" gutterBottom>Register</Typography>
          {error && <Typography color="error">{error}</Typography>}
          <TextField
            label="Name"
            fullWidth
            margin="normal"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
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
            onClick={handleRegister}
            sx={{ marginTop: 2 }}
          >
            Register
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
          Registration successful!
        </Alert>
      </Snackbar>
    </>
  );
};

export default Register;
