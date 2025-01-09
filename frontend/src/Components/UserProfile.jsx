import React, { useState, useEffect } from 'react';
import { Box, Typography, Grid, CircularProgress } from '@mui/material';
import Axios from '../Utils/Axios';

const UserProfile = () => {
  const [user, setUser] = useState(null);  // User details
  const [borrowingHistory, setBorrowingHistory] = useState([]);  // User's borrowed books
  const [loading, setLoading] = useState(false);  // Loading state for data fetching

  // Fetch user details and borrowing history
  useEffect(() => {
    setLoading(true);
    const fetchUserData = async () => {
      try {
        // Fetching user details
        const userResponse = await Axios.get('/users/profile');
        setUser(userResponse.data);
        console.log('User Data:', userResponse.data); // Log user data to ensure it's being fetched

        // Fetching borrowing history
        const historyResponse = await Axios.get('http://127.0.0.1:5000/api/borrow/history'); // Corrected API endpoint
        setBorrowingHistory(historyResponse.data.history); // Update based on API response format
        console.log('Borrowing History:', historyResponse.data.history); // Log borrowing history to ensure it's fetched correctly
      } catch (error) {
        console.error('Error fetching data:', error);
        alert('Failed to load user data.');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  // Render Profile and Borrowing History
  return (
    <Box sx={{ padding: 4 }}>
      <Typography variant="h5" gutterBottom>User Profile</Typography>
      {loading ? (
        <CircularProgress />
      ) : (
        <>
          {/* User Details Section */}
          <Box sx={{ marginBottom: 4 }}>
            <Typography variant="h6">Profile Information</Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Typography>Name: {user?.name}</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography>Email: {user?.email}</Typography>
              </Grid>
            </Grid>
          </Box>

          {/* Borrowing History Section */}
          <Box>
            <Typography variant="h6">Borrowing History</Typography>
            {borrowingHistory.length > 0 ? (
              <Grid container spacing={2}>
                {borrowingHistory.map((borrowedBook, index) => (
                  <Grid item xs={12} sm={6} key={index}>
                    <Box sx={{ border: '1px solid #ddd', padding: 2, borderRadius: 2 }}>
                      <Typography variant="h6">{borrowedBook.book.title}</Typography>
                      <Typography variant="body2" color="textSecondary">
                        Borrowed on: {new Date(borrowedBook.borrowedAt).toLocaleDateString()}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        Return by: {new Date(borrowedBook.returnDate).toLocaleDateString()}
                      </Typography>
                    </Box>
                  </Grid>
                ))}
              </Grid>
            ) : (
              <Typography>No borrowing history available.</Typography>
            )}
          </Box>
        </>
      )}
    </Box>
  );
};

export default UserProfile;
