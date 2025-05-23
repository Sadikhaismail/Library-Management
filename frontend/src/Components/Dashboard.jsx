import React, { useState, useEffect } from 'react';
import {
  Button,
  TextField,
  Box,
  Grid,
  Typography,
  Pagination,
  Autocomplete,
  CircularProgress
} from '@mui/material';
import { Link } from 'react-router-dom';
import API from "../Api";
import { debounce } from 'lodash';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Dashboard = () => {
  const [books, setBooks] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBook, setSelectedBook] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [borrowedBooks, setBorrowedBooks] = useState([]);
  const [searchResults, setSearchResults] = useState([]);

  useEffect(() => {
    const fetchBooks = debounce(async () => {
      setLoading(true);
      try {
        if (searchQuery.trim()) {
          const response = await API.get(`api/books?search=${searchQuery}`);
          setSearchResults(response.data.books || []);
        } else {
          const response = await API.get(`api/books?page=${page}&limit=3`);
          setBooks(response.data.books || []);
          setTotalPages(response.data.totalPages || 1);
          setSearchResults([]); // clear search
        }
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

  useEffect(() => {
    const savedBorrowedBooks = JSON.parse(localStorage.getItem('borrowedBooks')) || [];
    setBorrowedBooks(savedBorrowedBooks);
  }, []);

  const handleBorrow = async (bookId) => {
    try {
      await API.post(`api/borrow/${bookId}`);
      toast.success('Book borrowed successfully!');
      const updatedBorrowedBooks = [...borrowedBooks, bookId];
      setBorrowedBooks(updatedBorrowedBooks);
      localStorage.setItem('borrowedBooks', JSON.stringify(updatedBorrowedBooks));

      setBooks(prevBooks =>
        prevBooks.map(book => book._id === bookId ? { ...book, borrowed: true } : book)
      );
      setSearchResults(prevResults =>
        prevResults.map(book => book._id === bookId ? { ...book, borrowed: true } : book)
      );
    } catch (err) {
      console.error('Failed to borrow book', err);
      toast.error('No Copies Available');
    }
  };

  const handleReturn = async (bookId) => {
    try {
      setLoading(true);
      await API.post(`api/return/${bookId}`);
      toast.success('Book returned successfully!');
      const updatedBorrowedBooks = borrowedBooks.filter(id => id !== bookId);
      setBorrowedBooks(updatedBorrowedBooks);
      localStorage.setItem('borrowedBooks', JSON.stringify(updatedBorrowedBooks));

      setBooks(prevBooks =>
        prevBooks.map(book => book._id === bookId ? { ...book, borrowed: false } : book)
      );
      setSearchResults(prevResults =>
        prevResults.map(book => book._id === bookId ? { ...book, borrowed: false } : book)
      );
    } catch (err) {
      console.error('Failed to return book', err);
      toast.error('Failed to return book. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleBookSelect = (book) => {
    setSelectedBook(book);
    setSearchQuery(book.title);
  };

  const displayedBooks = searchQuery ? searchResults : books;

  return (
    <Box sx={{ padding: 4 }}>
      <Box sx={{ position: 'absolute', top: 16, right: 16 }}>
        <Link to="/profile">
          <Button variant="contained" color="secondary">Profile</Button>
        </Link>
      </Box>

      <Typography variant="h5" gutterBottom>Library Dashboard</Typography>

      <ToastContainer
        position="top-center"
        autoClose={3000}
        hideProgressBar
        closeOnClick
        pauseOnHover
        draggable
        toastStyle={{
          background: '#fff',
          color: '#000',
          textAlign: 'center',
          borderRadius: '8px',
          fontSize: '16px'
        }}
      />

      <Autocomplete
        freeSolo
        options={searchResults}
        getOptionLabel={(option) => `${option.title} by ${option.author}`}
        onInputChange={(event, newValue) => setSearchQuery(newValue)}
        onChange={(event, newValue) => handleBookSelect(newValue)}
        inputValue={searchQuery}
        renderInput={(params) => (
          <TextField
            {...params}
            label="Search Books"
            fullWidth
            margin="normal"
            sx={{ marginBottom: 2 }} // Added marginBottom here to create space
            InputProps={{
              ...params.InputProps,
              endAdornment: (
                <>
                  {loading && <CircularProgress color="inherit" size={24} />}
                  {params.InputProps.endAdornment}
                </>
              ),
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
            disabled={
              selectedBook.borrowed ||
              borrowedBooks.includes(selectedBook._id) ||
              selectedBook.copiesAvailable === 0
            }
          >
            {selectedBook.borrowed || borrowedBooks.includes(selectedBook._id) || selectedBook.copiesAvailable === 0
              ? 'No Copies Available'
              : 'Borrow'}
          </Button>

          <Button
            variant="outlined"
            color="secondary"
            sx={{ marginLeft: 1, marginTop: 1 }}
            onClick={() => handleReturn(selectedBook._id)}
            disabled={!borrowedBooks.includes(selectedBook._id) || loading}
          >
            Return
          </Button>
        </Box>
      ) : displayedBooks.length === 0 ? (
        <Typography>No books found.</Typography>
      ) : (
        <Grid container spacing={3} columns={{ xs: 4, sm: 8, md: 12 }}>
          {displayedBooks.map((book) => (
            <Grid key={book._id} item xs={4} sm={4} md={4}>
              <Box sx={{ padding: 2, border: '1px solid #ddd', borderRadius: 2 }}>
                <Typography variant="h6">{book.title}</Typography>
                <Typography variant="body2" color="textSecondary">{book.author}</Typography>

                <Button
                  variant="contained"
                  color="primary"
                  sx={{ marginTop: 1 }}
                  onClick={() => handleBorrow(book._id)}
                  disabled={book.borrowed || borrowedBooks.includes(book._id) || book.availableCopies <= 0}
                >
                  {book.borrowed || borrowedBooks.includes(book._id) || book.availableCopies <= 0
                    ? 'Borrowed'
                    : 'Borrow'}
                </Button>

                <Button
                  variant="outlined"
                  color="secondary"
                  sx={{ marginLeft: 1, marginTop: 1 }}
                  onClick={() => handleReturn(book._id)}
                  disabled={!borrowedBooks.includes(book._id) || loading}
                >
                  Return
                </Button>
              </Box>
            </Grid>
          ))}
        </Grid>
      )}

      {!searchQuery && totalPages > 1 && (
        <Pagination
          count={totalPages}
          page={page}
          onChange={(event, value) => setPage(value)}
          sx={{ marginTop: 4, display: 'flex', justifyContent: 'center' }}
        />
      )}
    </Box>
  );
};

export default Dashboard;
