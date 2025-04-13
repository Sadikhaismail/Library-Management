
const express = require('express');
const { borrowBook, returnBook, getBorrowingHistory } = require('../Controllers/BorrowController');
const { protect } = require('../Middleware/AuthMiddleware');

const router = express.Router();

router.post('/borrow/:bookId', protect, borrowBook);
router.post('/return/:bookId', protect, returnBook);
router.get('/borrow/history', protect, getBorrowingHistory);

module.exports = router;
