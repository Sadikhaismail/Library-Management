const mongoose = require('mongoose');

const borrowingSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    book: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Book',
      required: true,
    },
    borrowedAt: {
      type: Date,
      default: Date.now,
    },
    returnDate: {
      type: Date,
      required: true,
    },
    returnedDate: {
      type: Date, // Store the actual date the book was returned
    },
    returned: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Borrowing', borrowingSchema);
