import React, { useState, useEffect } from 'react';
import { Button, TextField, Box, Grid, Typography, Pagination, Autocomplete, CircularProgress } from '@mui/material';
import { Link } from 'react-router-dom';
import Axios from '../Utils/Axios';
import { debounce } from 'lodash';

const Dashboard = () => {
  const [books, setBooks] = useState([]);  // State for storing books
  const [searchQuery, setSearchQuery] = useState('');  // State for search query
  const [selectedBook, setSelectedBook] = useState(null); // To track selected book
  const [page, setPage] = useState(1);  // State for current page
  const [totalPages, setTotalPages] = useState(1);  // State for total pages
  const [loading, setLoading] = useState(false);  // State for loading indicator

  useEffect(() => {
    const fetchBooks = debounce(async () => {
      setLoading(true);
      try {
        // Fetch books based on the search query and current page, limiting to 3 per page
        const response = await Axios.get(`/books?search=${searchQuery}&page=${page}&limit=3`);
        setBooks(response.data.books || []);
        setTotalPages(response.data.totalPages || 1);
      } catch (err) {
        console.error('Failed to fetch books', err);
        alert(err.response?.data?.message || 'Failed to fetch books. Please try again.');
      } finally {
        setLoading(false);
      }
    }, 500);

    fetchBooks();

    return () => fetchBooks.cancel();
  }, [searchQuery, page]);

  // Function to handle borrowing a book
  const handleBorrow = async (bookId) => {
    try {
      await Axios.post(`/borrow/${bookId}`);
      alert('Book borrowed successfully!');
      setBooks(books.map(book =>
        book._id === bookId ? { ...book, borrowed: true } : book
      ));
    } catch (err) {
      console.error('Failed to borrow book', err.response ? err.response.data : err.message);
      alert('No Copies Available');
    }
  };

  // Function to handle returning a book
  const handleReturn = async (bookId) => {
    try {
      await Axios.post(`/return/${bookId}`);
      alert('Book returned successfully!');
      setBooks(books.map(book =>
        book._id === bookId ? { ...book, borrowed: false } : book
      ));
    } catch (err) {
      console.error('Failed to return book', err.response ? err.response.data : err.message);
      alert('Failed to return book. Please try again.');
    }
  };

  // Handle the selection of a book from the suggestions
  const handleBookSelect = (book) => {
    setSelectedBook(book); // Set selected book
    setSearchQuery(book.title); // Set search query to the selected book's title
  };

  return (
    <Box sx={{ padding: 4 }}>

      {/* Profile Button */}
      <Box sx={{ position: 'absolute', top: 16, right: 16 }}>
        <Link to="/profile"> {/* Ensure proper link to the profile page */}
          <Button variant="contained" color="secondary">
            Profile
          </Button>
        </Link>
      </Box>

      <Typography variant="h5" gutterBottom>Library Dashboard</Typography>

      <Autocomplete
        freeSolo
        options={books}
        getOptionLabel={(option) => `${option.title} by ${option.author}`}
        onInputChange={(event, newInputValue) => setSearchQuery(newInputValue)}
        onChange={(event, newValue) => handleBookSelect(newValue)}
        inputValue={searchQuery}
        renderInput={(params) => (
          <TextField
            {...params}
            label="Search Books"
            fullWidth
            margin="normal"
            InputProps={{
              ...params.InputProps,
              endAdornment: loading ? <CircularProgress color="inherit" size={24} /> : null,
            }}
          />
        )}
      />

      {selectedBook ? (
        <Box sx={{ marginTop: 2 }}>
          <Typography variant="h6">{selectedBook.title}</Typography>
          <Typography variant="body2" color="textSecondary">{selectedBook.author}</Typography>
          <Button
            variant="contained"
            color="primary"
            sx={{ marginTop: 1 }}
            onClick={() => handleBorrow(selectedBook._id)}
            disabled={selectedBook.borrowed}
          >
            {selectedBook.borrowed ? 'Borrowed' : 'Borrow'}
          </Button>
          <Button
            variant="outlined"
            color="secondary"
            sx={{ marginLeft: 1, marginTop: 1 }}
            onClick={() => handleReturn(selectedBook._id)}
            disabled={!selectedBook.borrowed}
          >
            Return
          </Button>
        </Box>
      ) : books.length === 0 ? (
        <Typography>No books found.</Typography>
      ) : (
        <Grid container spacing={2} sx={{ marginTop: 2 }}>
          {books.map((book) => (
            <Grid item xs={12} sm={6} md={4} key={book._id}>
              <Box sx={{ padding: 2, border: '1px solid #ddd', borderRadius: 2 }}>
                <Typography variant="h6">{book.title}</Typography>
                <Typography variant="body2" color="textSecondary">{book.author}</Typography>
                <Button
                  variant="contained"
                  color="primary"
                  sx={{ marginTop: 1 }}
                  onClick={() => handleBorrow(book._id)}
                  disabled={book.borrowed}
                >
                  {book.borrowed ? 'Borrowed' : 'Borrow'}
                </Button>
                <Button
                  variant="outlined"
                  color="secondary"
                  sx={{ marginLeft: 1, marginTop: 1 }}
                  onClick={() => handleReturn(book._id)}
                  disabled={!book.borrowed}
                >
                  Return
                </Button>
              </Box>
            </Grid>
          ))}
        </Grid>
      )}

      <Pagination
        count={totalPages}
        page={page}
        onChange={(event, value) => setPage(value)}
        sx={{ marginTop: 4, display: 'flex', justifyContent: 'center' }}
      />
    </Box>
  );
};

export default Dashboard;
