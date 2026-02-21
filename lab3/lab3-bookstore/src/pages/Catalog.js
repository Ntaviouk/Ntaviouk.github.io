import React, { useState } from 'react';
import BookCard from '../components/BookCard';

const allBooks = [
  { id: 1, title: "Кобзар", author: "Тарас Шевченко", genre: "Поезія", price: 350, image: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5c/Slastion-Bandurist_Samiylo_Yasnij.jpg/220px-Slastion-Bandurist_Samiylo_Yasnij.jpg" },
  { id: 2, title: "Тіні забутих предків", author: "Михайло Коцюбинський", genre: "Проза", price: 280, image: "https://upload.wikimedia.org/wikipedia/uk/thumb/e/e3/Tini_predkiv.jpg/250px-Tini_predkiv.jpg" },
  { id: 3, title: "Захар Беркут", author: "Іван Франко", genre: "Проза", price: 300, image: "https://upload.wikimedia.org/wikipedia/uk/thumb/e/e5/%D0%9F%D0%BE%D1%81%D1%82%D0%B5%D1%80_%D1%84%D1%96%D0%BB%D1%8C%D0%BC%D1%83_%D0%97%D0%B0%D1%85%D0%B0%D1%80_%D0%91%D0%B5%D1%80%D0%BA%D1%83%D1%82_%282019%29.jpg/250px-%D0%9F%D0%BE%D1%81%D1%82%D0%B5%D1%80_%D1%84%D1%96%D0%BB%D1%8C%D0%BC%D1%83_%D0%97%D0%B0%D1%85%D0%B0%D1%80_%D0%91%D0%B5%D1%80%D0%BA%D1%83%D1%82_%282019%29.jpg" },
  { id: 4, title: "Лісова пісня", author: "Леся Українка", genre: "Драма", price: 250, image: "https://static.yakaboo.ua/media/cloudflare/product/webp/600x840/c/o/cover_858_1.jpg" },
  { id: 5, title: "Кайдашева сім'я", author: "Іван Нечуй-Левицький", genre: "Проза", price: 220, image: "https://chitaka.com.ua/wp-content/uploads/2022/03/Kajdasheva-simya-1.jpg" },
  { id: 6, title: "Місто", author: "Валер'ян Підмогильний", genre: "Проза", price: 310, image: "https://upload.wikimedia.org/wikipedia/commons/4/43/Misto_Pidmohylnyy_1928.jpg" },
  { id: 7, title: "Тигролови", author: "Іван Багряний", genre: "Проза", price: 290, image: "https://static.yakaboo.ua/media/catalog/product/i/m/img347_144.jpg" },
  { id: 8, title: "Intermezzo", author: "Михайло Коцюбинський", genre: "Проза", price: 180, image: "https://static.yakaboo.ua/media/cloudflare/product/webp/600x840/c/o/cover_65_102.jpg" }
];

function Catalog({ addToCart }) {
  const [filter, setFilter] = useState('Всі'); 

  const filteredBooks = filter === 'Всі' 
    ? allBooks 
    : allBooks.filter(book => book.genre === filter);

  return (
    <section>
      <h2>Каталог книг</h2>
      
      <div style={{ marginBottom: '20px', display: 'flex', gap: '10px' }}>
        <strong>Фільтр за жанром:</strong>
        <button onClick={() => setFilter('Всі')}>Всі</button>
        <button onClick={() => setFilter('Поезія')}>Поезія</button>
        <button onClick={() => setFilter('Проза')}>Проза</button>
        <button onClick={() => setFilter('Драма')}>Драма</button>
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
        {filteredBooks.map(book => (
          <BookCard key={book.id} book={book} addToCart={addToCart} />
        ))}
      </div>
    </section>
  );
}

export default Catalog;