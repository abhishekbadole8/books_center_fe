import React, { useState, useEffect } from "react";
import "./App.css";

const Books_API = "https://books-center.onrender.com/api/books";

const App = () => {
  const [books, setBooks] = useState([]);
  const [newBook, setNewBook] = useState({ title: "", author: "", year: "" });
  const [editBook, setEditBook] = useState(null); // book-id save here

  // fetching all books
  const fetchBooks = async () => {
    try {
      const response = await fetch(Books_API);
      const data = await response.json();
      if (data) {
        setBooks(data);
      }
    } catch (error) {
      console.error("Error fetching books:", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewBook({ ...newBook, [name]: value });
  };

  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setBooks((prevBooks) =>
      prevBooks.map((book) =>
        book._id === editBook ? { ...book, [name]: value } : book
      )
    );
  };

  const addBook = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(Books_API, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newBook),
      });

      if (response.ok) {
        setNewBook({ title: "", author: "", year: "" });
        fetchBooks();
      }
    } catch (error) {
      console.error("Error adding book:", error);
    }
  };

  const cancelEdit = () => {
    setEditBook(null);
  };

  const updateBook = async (bookId, updatedBook) => {
    try {
      const response = await fetch(`${Books_API}/${bookId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedBook),
      });

      if (response.ok) {
        setEditBook(null);
        fetchBooks();
      }
    } catch (error) {
      console.error("Error updating book:", error);
    }
  };

  const deleteBook = async (bookId) => {
    try {
      const response = await fetch(`${Books_API}/${bookId}`, {
        method: "DELETE",
      });

      if (response) {
        fetchBooks();
      }
    } catch (error) {
      console.error("Error deleting book:", error);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  return (
    <div className="container">
      <h1>Book Inventory</h1>

      <form onSubmit={addBook}>
        <div>
          <label>Title :</label>
          <input
            type="text"
            name="title"
            value={newBook.title}
            onChange={handleInputChange}
            required
          />
        </div>

        <div>
          <label>Author :</label>
          <input
            type="text"
            name="author"
            value={newBook.author}
            onChange={handleInputChange}
            required
          />
        </div>

        <div>
          <label>Year :</label>
          <input
            type="number"
            name="year"
            value={newBook.year}
            onChange={handleInputChange}
            required
          />
        </div>

        <button type="submit">Add Book</button>
      </form>

      <ul>
        {books.map((book) => (
          <li key={book._id} className="card">
            {editBook === book._id ? (
              <div className="card-inside-edit">
                <div>
                  <label>Title : </label>
                  <input
                    type="text"
                    name="title"
                    value={book.title}
                    onChange={handleEditInputChange}
                  />
                </div>
                <div>
                  <label>author : </label>
                  <input
                    type="text"
                    name="author"
                    value={book.author}
                    onChange={handleEditInputChange}
                  />
                </div>
                <div>
                  <label>year : </label>
                  <input
                    type="number"
                    name="year"
                    value={book.year}
                    onChange={handleEditInputChange}
                  />
                </div>

                <button onClick={() => updateBook(book._id, book)}>Save</button>
                <button onClick={cancelEdit}>Cancel</button>
              </div>
            ) : (
              <div className="card-inside">
                <div>
                  <span>{book.title}</span>
                  <span className="author">
                    <br /> ~ by {book.author} ({book.year})
                  </span>
                </div>

                <div className="card-actions">
                  <button onClick={() => setEditBook(book._id)}>Edit</button>
                  <button onClick={() => deleteBook(book._id)}>Delete</button>
                </div>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default App;
