const express = require('express');
const { protect, adminMiddleware } = require('../Middleware/AuthMiddleware');
const {
  createBook,
  listBooks,
  searchBooks,
  updateBook,
  deleteBook,
} = require('../Controllers/BookController');

const router = express.Router();

router.post('/books', protect, adminMiddleware, createBook);
router.get('/books', listBooks);
router.get('/books/search', searchBooks);
router.put('/books/:id', protect, adminMiddleware, updateBook);
router.delete('/books/:id', protect, adminMiddleware, deleteBook);

module.exports = router;  



