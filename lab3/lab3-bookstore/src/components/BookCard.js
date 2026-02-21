import React from 'react';

function BookCard({ book, addToCart }) {
  return (
    <article className="book-card">
      <div className="book-image">
        <img 
          src={book.image} 
          alt={book.title} 
          style={{ width: '100%', height: '100%', objectFit: 'contain', borderRadius: '4px' }} 
        />
      </div>
      <h3>{book.title}</h3>
      <p className="author">Автор: {book.author}</p>
      <p className="genre">Жанр: {book.genre}</p>
      <p className="price">{book.price} грн</p>
      <button onClick={() => addToCart(book)}>Купити</button>
    </article>
  );
}

export default BookCard;