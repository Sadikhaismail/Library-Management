const Book = require('../Models/BookModel');

// Create a new book
exports.createBook = async (req, res) => {
  try {
    const { title, author, isbn, publishedYear, availableCopies } = req.body;

    const book = new Book({
      title,
      author,
      isbn,
      publishedYear,
      availableCopies: availableCopies || 1,
    });

    await book.save();
    res.status(201).json({ message: 'Book created successfully', book });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// List all books with pagination
exports.listBooks = async (req, res) => {
  try {
    const { page = 1 } = req.query;
    const limit = 100;
    const skip = (page - 1) * limit;

    const books = await Book.find().skip(skip).limit(limit);
    const totalBooks = await Book.countDocuments();

    res.json({
      totalPages: Math.ceil(totalBooks / limit),
      currentPage: parseInt(page),
      books,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Search books by title or author
exports.searchBooks = async (req, res) => {
  try {
    const { query } = req.query;
    const books = await Book.find({
      $or: [
        { title: new RegExp(query, 'i') },
        { author: new RegExp(query, 'i') },
      ],
    });

    res.json({ books });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update book details
exports.updateBook = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedData = req.body;

    const book = await Book.findByIdAndUpdate(id, updatedData, { new: true });

    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    res.json({ message: 'Book updated successfully', book });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete a book
exports.deleteBook = async (req, res) => {
  try {
    const { id } = req.params;

    const book = await Book.findByIdAndDelete(id);

    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    res.json({ message: 'Book deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};