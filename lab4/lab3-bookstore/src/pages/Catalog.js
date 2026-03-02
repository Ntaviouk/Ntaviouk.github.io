import React, { useState, useEffect } from 'react';
import BookCard from '../components/BookCard';
import { db } from '../firebase';
import { collection, getDocs } from 'firebase/firestore';

function Catalog({ addToCart }) {
  const [books, setBooks] = useState([]);
  const [genreFilter, setGenreFilter] = useState('Всі');
  const [authorFilter, setAuthorFilter] = useState('Всі');

  useEffect(() => {
    const fetchBooks = async () => {
      const querySnapshot = await getDocs(collection(db, "books"));
      const booksData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setBooks(booksData);
    };
    fetchBooks();
  }, []);

  // Отримання унікальних авторів
  const uniqueAuthors = [...new Set(books.map(book => book.author))].sort();

  const filteredBooks = books.filter(book => {
    const genreMatch = genreFilter === 'Всі' || book.genre === genreFilter;
    const authorMatch = authorFilter === 'Всі' || book.author === authorFilter;
    return genreMatch && authorMatch;
  });

  return (
    <section>
      <h2>Каталог книг</h2>
      
      <div className="catalog-toolbar">
        <div>
          <strong>Фільтр за жанром:</strong>
          <div className="filter-buttons">
            <button className={genreFilter === 'Всі' ? 'active-filter' : ''} onClick={() => setGenreFilter('Всі')}>Всі</button>
            <button className={genreFilter === 'Поезія' ? 'active-filter' : ''} onClick={() => setGenreFilter('Поезія')}>Поезія</button>
            <button className={genreFilter === 'Проза' ? 'active-filter' : ''} onClick={() => setGenreFilter('Проза')}>Проза</button>
            <button className={genreFilter === 'Драма' ? 'active-filter' : ''} onClick={() => setGenreFilter('Драма')}>Драма</button>
          </div>
        </div>

        <div className="author-filter">
          <label htmlFor="author-select"><strong>Фільтр за автором:</strong></label>
          <select 
            id="author-select"
            value={authorFilter} 
            onChange={(e) => setAuthorFilter(e.target.value)}
          >
            <option value="Всі">Всі автори</option>
            {uniqueAuthors.map(author => (
              <option key={author} value={author}>{author}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="book-container">
        {filteredBooks.map(book => (
          <BookCard key={book.id} book={book} addToCart={addToCart} />
        ))}
      </div>
    </section>
  );
}

export default Catalog;