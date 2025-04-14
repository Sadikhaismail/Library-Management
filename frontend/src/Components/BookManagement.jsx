import React, { useState, useEffect } from "react";
import API from "../Api";
import { FaEdit, FaTrash } from "react-icons/fa";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";

function App() {
  const [books, setBooks] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    author: "",
    isbn: "",
    publishedYear: "",
    availableCopies: 1,
  });
  const [editBookId, setEditBookId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
const [totalPages, setTotalPages] = useState(1);
const [searchQuery, setSearchQuery] = useState("");


useEffect(() => {
  fetchBooks(currentPage);
}, [currentPage]);



const fetchBooks = async (page = 1) => {
  try {
    const response = await API.get(`api/books?page=${page}`);
    setBooks(response.data.books);
    setCurrentPage(response.data.currentPage);
    setTotalPages(response.data.totalPages);
    console.log("Fetched books:", response.data.books);
  } catch (error) {
    console.error("Error fetching books:", error);
  }
};

  
  localStorage.getItem('token')

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    console.log(localStorage.getItem("token"));

  
    try {
      if (editBookId) {
        await API.put(`api/books/${editBookId}`, formData, {
          headers: { Authorization: `Bearer ${token}` },
        });
        alert("Book updated successfully!");
      } else {
        await API.post(`api/books`, formData, {
          headers: { Authorization: `Bearer ${token}` },
        });
        alert("Book created successfully!");
      }
  
      // Reset
      setFormData({
        title: "",
        author: "",
        isbn: "",
        publishedYear: "",
        availableCopies: 1,
      });
      setEditBookId(null);
      fetchBooks();
      closeModal();
    } catch (error) {
      console.error("Error saving book:", error.response?.data || error.message);
    }
  };
  
  const handleEdit = (book) => {
    setFormData(book);
    setEditBookId(book._id);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    try {
      await API.delete(`api/books/${id}`);
      alert("Book deleted successfully!");
      fetchBooks();
    } catch (error) {
      console.error("Error deleting book:", error);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditBookId(null);
  };



  return (
    <div className="max-w-4xl mx-auto mt-10">
      <h1 className="text-3xl font-bold text-center mb-6">
        Library Management
      </h1>

      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-lg shadow-md mb-10"
      >
        <h2 className="text-2xl font-semibold text-center mb-4">Create Book</h2>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <input
            type="text"
            placeholder="Title"
            value={formData.title}
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
            className="border border-gray-300 rounded-lg p-2"
            required
          />
          <input
            type="text"
            placeholder="Author"
            value={formData.author}
            onChange={(e) =>
              setFormData({ ...formData, author: e.target.value })
            }
            className="border border-gray-300 rounded-lg p-2"
            required
          />
          <input
            type="text"
            placeholder="ISBN"
            value={formData.isbn}
            onChange={(e) => setFormData({ ...formData, isbn: e.target.value })}
            className="border border-gray-300 rounded-lg p-2"
            required
          />
          <input
            type="number"
            placeholder="Published Year"
            value={formData.publishedYear}
            onChange={(e) =>
              setFormData({ ...formData, publishedYear: e.target.value })
            }
            className="border border-gray-300 rounded-lg p-2"
            required
          />
          <input
            type="number"
            placeholder="Available Copies"
            value={formData.availableCopies}
            onChange={(e) =>
              setFormData({ ...formData, availableCopies: e.target.value })
            }
            className="border border-gray-300 rounded-lg p-2"
          />
        </div>
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded-lg mt-4 hover:bg-blue-600"
        >
          {editBookId ? "Update Book" : "Create Book"}
        </button>
      </form>
      <div className="mb-4 flex justify-center">
  <input
    type="text"
    placeholder="Search by Title or Author"
    value={searchQuery}
    onChange={(e) => setSearchQuery(e.target.value)}
    className="border border-gray-400 rounded-lg p-2 w-full sm:w-1/2"
  />
</div>

      <ul className="space-y-4">
      {books
  .filter((book) =>
    book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    book.author.toLowerCase().includes(searchQuery.toLowerCase())
  )
  .map((book) => (
    <li key={book._id} className="p-4 bg-gray-100 rounded-lg flex justify-between items-center shadow-md">
  

            <div className="space-y-2">
              <div>
                <strong>Title:</strong> {book.title}
              </div>
              <div>
                <strong>Author:</strong> {book.author}
              </div>
              <div>
                <strong>ISBN:</strong> {book.isbn}
              </div>
              <div>
                <strong>Published Year:</strong> {book.publishedYear}
              </div>
              <div>
                <strong>Available Copies:</strong> {book.availableCopies}
              </div>
            </div>
            <div className="space-x-2">
              <button
                onClick={() => handleEdit(book)}
                className="bg-green-500 text-white p-2 rounded-lg hover:bg-green-700"
              >
                <FaEdit className="text-white" />
              </button>
              <button
                onClick={() => handleDelete(book._id)}
                className="bg-red-500 text-white p-2 rounded-lg hover:bg-red-600"
              >
                <FaTrash className="text-white" />
              </button>
            </div>
          </li>
        ))}
      </ul>

      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-md max-w-lg w-full">
            <h2 className="text-xl font-bold mb-4">Edit Book</h2>
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <input
                  type="text"
                  placeholder="Title"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  className="border border-gray-300 rounded-lg p-2"
                  required
                />
                <input
                  type="text"
                  placeholder="Author"
                  value={formData.author}
                  onChange={(e) =>
                    setFormData({ ...formData, author: e.target.value })
                  }
                  className="border border-gray-300 rounded-lg p-2"
                  required
                />
                <input
                  type="text"
                  placeholder="ISBN"
                  value={formData.isbn}
                  onChange={(e) =>
                    setFormData({ ...formData, isbn: e.target.value })
                  }
                  className="border border-gray-300 rounded-lg p-2"
                  required
                />
                <input
                  type="number"
                  placeholder="Published Year"
                  value={formData.publishedYear}
                  onChange={(e) =>
                    setFormData({ ...formData, publishedYear: e.target.value })
                  }
                  className="border border-gray-300 rounded-lg p-2"
                  required
                />
                <input
                  type="number"
                  placeholder="Available Copies"
                  value={formData.availableCopies}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      availableCopies: e.target.value,
                    })
                  }
                  className="border border-gray-300 rounded-lg p-2"
                />
              </div>
              <div className="flex justify-end space-x-2 mt-4">
                <button
                  type="button"
                  onClick={closeModal}
                  className="bg-gray-400 text-white px-4 py-2 rounded-lg hover:bg-gray-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                >
                  Update Book
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      <div className="flex justify-center mt-6 space-x-4">
  <button
    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
    disabled={currentPage === 1}
    className="px-4 py-2 rounded disabled:opacity-50"
  >
    <FaArrowLeft
      className={`text-gray-500 hover:text-black ${currentPage === 1 ? "cursor-not-allowed" : "cursor-pointer"}`}
    />
  </button>

  <span className="text-lg font-semibold">
    Page {currentPage} of {totalPages}
  </span>

  <button
    onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
    disabled={currentPage === totalPages}
    className="px-4 py-2 rounded disabled:opacity-50"
  >
    <FaArrowRight
      className={`text-gray-500 hover:text-black ${currentPage === totalPages ? "cursor-not-allowed" : "cursor-pointer"}`}
    />
  </button>
</div>
    </div>
  );
}

export default App;
