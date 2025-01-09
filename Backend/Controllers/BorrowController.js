const Borrowing = require('../Models/BorrowModel');
const Book = require('../Models/BookModel');
const User = require('../Models/UserModel');


exports.borrowBook = async (req, res) => {
    const { bookId } = req.params;
  
    try {
      const book = await Book.findById(bookId);
  
      if (!book) {
        return res.status(404).json({ message: 'Book not found' });
      }
  
      if (book.availableCopies <= 0) {
        return res.status(400).json({ message: 'No copies available for this book' });
      }
  
      // Default borrowing period: 14 days
      const returnDate = new Date();
      returnDate.setDate(returnDate.getDate() + 14);
  
      const borrowing = new Borrowing({
        user: req.user._id, // From protect middleware
        book: book._id,
        returnDate,
      });
  
      await borrowing.save();
  
      // Decrease available copies
      book.availableCopies -= 1;
      await book.save();
  
      res.status(201).json({ message: 'Book borrowed successfully', borrowing });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

  
  exports.returnBook = async (req, res) => {
    const { bookId } = req.params;
  
    try {
      const borrowing = await Borrowing.findOne({
        book: bookId,
        user: req.user._id, // From protect middleware
        returned: false,
      });
  
      if (!borrowing) {
        return res.status(404).json({ message: 'No active borrowing found for this book' });
      }
  
      borrowing.returned = true;
      await borrowing.save();
  
      // Increase available copies
      const book = await Book.findById(bookId);
      book.availableCopies += 1;
      await book.save();
  
      res.status(200).json({ message: 'Book returned successfully', borrowing });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };


  exports.getBorrowingHistory = async (req, res) => {
    try {
      const history = await Borrowing.find({ user: req.user._id })
        .populate('book', 'title author') // Include book title and author
        .sort({ borrowedAt: -1 }); // Sort by latest borrowing date
  
      res.status(200).json({ history });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  
  