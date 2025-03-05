const express = require('express');
const {
  createBook,
  listBooks,
  searchBooks,
  updateBook,
  deleteBook,
} = require('../Controllers/BookController');
const { protect, isAdmin } = require('../Controllers/UserController');

const router = express.Router();

router.post('/books', protect, createBook);
router.get('/books', listBooks);
router.get('/books/search', searchBooks);
router.put('/books/:id', protect,  updateBook);
router.delete('/books/:id', protect,  deleteBook);

module.exports = router;
