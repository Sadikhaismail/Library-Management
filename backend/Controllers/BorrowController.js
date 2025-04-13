const Borrowing = require('../Models/BorrowModel');
const Book = require('../Models/BookModel');
const User = require('../Models/UserModel');


//////borrow book.....///////
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

    const returnDate = new Date();
    returnDate.setDate(returnDate.getDate() + 14); // Borrowing period: 14 days

    const borrowing = new Borrowing({
      user: req.user._id, // User ID from middleware
      book: book._id,
      returnDate,
    });

    await borrowing.save();

    book.availableCopies -= 1; // Decrease available copies
    await book.save();

    res.status(201).json({ message: 'Book borrowed successfully', borrowing });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

///return book//////
exports.returnBook = async (req, res) => {
  const { bookId } = req.params;

  try {
    const borrowing = await Borrowing.findOne({
      book: bookId,
      user: req.user._id,
      returned: false,
    });

    if (!borrowing) {
      return res.status(404).json({ message: 'No active borrowing found for this book' });
    }

    borrowing.returned = true;
    borrowing.returnedDate = new Date(); // Update the returned date
    await borrowing.save();

    const book = await Book.findById(bookId);
    book.availableCopies += 1; // Increment available copies
    await book.save();

    res.status(200).json({ message: 'Book returned successfully', borrowing });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};






////borrowing history///////
exports.getBorrowingHistory = async (req, res) => {
  try {
    const history = await Borrowing.find({ user: req.user._id })
      .populate('book', 'title author')
      .sort({ borrowedAt: -1 });

    const formattedHistory = history.map((borrowing) => ({
      book: borrowing.book,
      borrowedAt: borrowing.borrowedAt,
      returnDate: borrowing.returnDate,
      returnedDate: borrowing.returnedDate || null, // Include returnedDate
    }));

    res.status(200).json({ history: formattedHistory });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};