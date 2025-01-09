import React, { useState, useEffect } from 'react';
import {
  Button,
  TextField,
  Box,
  Grid,
  Typography,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Snackbar,
  Alert,
  Pagination,
} from '@mui/material';
import Axios from '../Utils/Axios';

const BookManagement = () => {
  const [books, setBooks] = useState([]);
  const [newBook, setNewBook] = useState({ title: '', author: '', genre: '', year: '' });
  const [selectedBook, setSelectedBook] = useState(null);
  const [loading, setLoading] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogType, setDialogType] = useState('create'); // 'create' or 'update'
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [page, setPage] = useState(1);
  const booksPerPage = 6;

  // Admin-only check
  const isAdmin = localStorage.getItem('isAdmin') === 'true'; // Modify as per your auth logic

  // Fetch books from API
  useEffect(() => {
    const fetchBooks = async () => {
      setLoading(true);
      try {
        const response = await Axios.get('/books');
        setBooks(response.data.books);
      } catch (err) {
        console.error('Failed to fetch books', err);
        showSnackbar('Failed to fetch books. Please try again.', 'error');
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, []);

  // Snackbar utility
  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  // Close Snackbar
  const handleSnackbarClose = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  // Validation function
  const validateFields = (book) => {
    if (!book.title || !book.author || !book.genre || isNaN(book.year)) {
      showSnackbar('Please fill out all fields with valid data.', 'error');
      return false;
    }
    return true;
  };

  // Handle creating a new book
  const handleCreateBook = async () => {
    if (!validateFields(newBook)) return;

    try {
      const response = await Axios.post('/books', newBook);
      setBooks([...books, response.data.book]);
      showSnackbar('Book created successfully!');
      setOpenDialog(false);
    } catch (err) {
      console.error('Failed to create book', err);
      showSnackbar('Failed to create book. Please try again.', 'error');
    }
  };

  // Handle updating an existing book
  const handleUpdateBook = async () => {
    if (!validateFields(selectedBook)) return;

    try {
      const response = await Axios.put(`/books/${selectedBook._id}`, selectedBook);
      setBooks(books.map((book) => (book._id === selectedBook._id ? response.data.book : book)));
      showSnackbar('Book updated successfully!');
      setOpenDialog(false);
    } catch (err) {
      console.error('Failed to update book', err);
      showSnackbar('Failed to update book. Please try again.', 'error');
    }
  };

  // Handle deleting a book
  const handleDeleteBook = async (bookId) => {
    try {
      await Axios.delete(`/books/${bookId}`);
      setBooks(books.filter((book) => book._id !== bookId));
      showSnackbar('Book deleted successfully!');
    } catch (err) {
      console.error('Failed to delete book', err);
      showSnackbar('Failed to delete book. Please try again.', 'error');
    }
  };

  // Handle borrow action
  const handleBorrowBook = async (bookId) => {
    try {
      const book = books.find((book) => book._id === bookId);
      if (book.copiesAvailable > 0) {
        // Perform the borrowing action
        await Axios.put(`/books/borrow/${bookId}`);
        setBooks(books.map((book) => (book._id === bookId ? { ...book, copiesAvailable: book.copiesAvailable - 1 } : book)));
        showSnackbar('Book borrowed successfully!');
      } else {
        showSnackbar('No copies available for borrowing.', 'error');
      }
    } catch (err) {
      console.error('Failed to borrow book', err);
      showSnackbar('Failed to borrow book. Please try again.', 'error');
    }
  };

  // Handle return action
  const handleReturnBook = async (bookId) => {
    try {
      await Axios.put(`/books/return/${bookId}`);
      setBooks(books.map((book) => (book._id === bookId ? { ...book, copiesAvailable: book.copiesAvailable + 1 } : book)));
      showSnackbar('Book returned successfully!');
    } catch (err) {
      console.error('Failed to return book', err);
      showSnackbar('Failed to return book. Please try again.', 'error');
    }
  };

  // Open the dialog for create or update
  const handleOpenDialog = (type, book = null) => {
    setDialogType(type);
    if (type === 'update' && book) {
      setSelectedBook(book);
    } else {
      setNewBook({ title: '', author: '', genre: '', year: '' });
    }
    setOpenDialog(true);
  };

  // Close the dialog
  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  // Pagination
  const handlePageChange = (event, value) => {
    setPage(value);
  };

  const paginatedBooks = books.slice((page - 1) * booksPerPage, page * booksPerPage);

  return (
    <Box sx={{ padding: 4 }}>
      <Typography variant="h5" gutterBottom>Book Management</Typography>

      {isAdmin && (
        <Button variant="contained" color="primary" onClick={() => handleOpenDialog('create')}>
          Add New Book
        </Button>
      )}

      {loading ? (
        <CircularProgress sx={{ marginTop: 4 }} />
      ) : (
        <>
          {books.length === 0 && (
            <Typography variant="body1" color="textSecondary" sx={{ marginTop: 4 }}>
              No books available.
            </Typography>
          )}

          <Grid container spacing={2} sx={{ marginTop: 2 }}>
            {paginatedBooks.map((book) => (
              <Grid item xs={12} sm={6} md={4} key={book._id}>
                <Box sx={{ padding: 2, border: '1px solid #ddd', borderRadius: 2 }}>
                  <Typography variant="h6">{book.title}</Typography>
                  <Typography variant="body2" color="textSecondary">{book.author}</Typography>
                  <Typography variant="body2" color="textSecondary">{book.genre}</Typography>
                  <Typography variant="body2" color="textSecondary">{book.year}</Typography>
                  <Typography variant="body2" color="textSecondary">Copies Available: {book.copiesAvailable}</Typography>

                  {isAdmin && (
                    <Box sx={{ marginTop: 1 }}>
                      <Button
                        variant="outlined"
                        color="primary"
                        onClick={() => handleOpenDialog('update', book)}
                        sx={{ marginRight: 1 }}
                      >
                        Update
                      </Button>
                      <Button
                        variant="outlined"
                        color="secondary"
                        onClick={() => handleDeleteBook(book._id)}
                      >
                        Delete
                      </Button>
                    </Box>
                  )}

                  {!isAdmin && (
                    <Box sx={{ marginTop: 1 }}>
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={() => handleBorrowBook(book._id)}
                        disabled={book.copiesAvailable <= 0}
                      >
                        Borrow
                      </Button>
                      <Button
                        variant="outlined"
                        color="secondary"
                        onClick={() => handleReturnBook(book._id)}
                        sx={{ marginLeft: 1 }}
                      >
                        Return
                      </Button>
                    </Box>
                  )}
                </Box>
              </Grid>
            ))}
          </Grid>

          <Pagination
            count={Math.ceil(books.length / booksPerPage)}
            page={page}
            onChange={handlePageChange}
            sx={{ marginTop: 4, display: 'flex', justifyContent: 'center' }}
          />
        </>
      )}

      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>{dialogType === 'create' ? 'Add New Book' : 'Update Book'}</DialogTitle>
        <DialogContent>
          <TextField
            label="Title"
            value={dialogType === 'create' ? newBook.title : selectedBook?.title || ''}
            onChange={(e) => {
              if (dialogType === 'create') {
                setNewBook({ ...newBook, title: e.target.value });
              } else {
                setSelectedBook({ ...selectedBook, title: e.target.value });
              }
            }}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Author"
            value={dialogType === 'create' ? newBook.author : selectedBook?.author || ''}
            onChange={(e) => {
              if (dialogType === 'create') {
                setNewBook({ ...newBook, author: e.target.value });
              } else {
                setSelectedBook({ ...selectedBook, author: e.target.value });
              }
            }}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Genre"
            value={dialogType === 'create' ? newBook.genre : selectedBook?.genre || ''}
            onChange={(e) => {
              if (dialogType === 'create') {
                setNewBook({ ...newBook, genre: e.target.value });
              } else {
                setSelectedBook({ ...selectedBook, genre: e.target.value });
              }
            }}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Year"
            value={dialogType === 'create' ? newBook.year : selectedBook?.year || ''}
            onChange={(e) => {
              if (dialogType === 'create') {
                setNewBook({ ...newBook, year: e.target.value });
              } else {
                setSelectedBook({ ...selectedBook, year: e.target.value });
              }
            }}
            fullWidth
            margin="normal"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="secondary">
            Cancel
          </Button>
          <Button
            onClick={dialogType === 'create' ? handleCreateBook : handleUpdateBook}
            color="primary"
          >
            {dialogType === 'create' ? 'Create' : 'Update'}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleSnackbarClose} severity={snackbar.severity}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default BookManagement;
