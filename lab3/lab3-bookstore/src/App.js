import React, { useState } from 'react';
import { HashRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Catalog from './pages/Catalog';
import CartItem from './components/CartItem';
import UserInfo from './components/UserInfo';
import './App.css'; // Ваш CSS (можна скопіювати стилі з 2 лаби сюди)

function App() {
  const [cart, setCart] = useState([]);

  const addToCart = (book) => {
    const existing = cart.find(item => item.id === book.id);
    if (existing) {
      setCart(cart.map(item => item.id === book.id ? { ...item, quantity: item.quantity + 1 } : item));
    } else {
      setCart([...cart, { ...book, quantity: 1 }]);
    }
    alert(`"${book.title}" додано до кошика!`);
  };

  const changeQuantity = (id, change) => {
    setCart(cart.map(item => {
      if (item.id === id) {
        const newQty = item.quantity + change;
        return { ...item, quantity: newQty > 0 ? newQty : 1 };
      }
      return item;
    }));
  };

  const removeFromCart = (id) => {
    setCart(cart.filter(item => item.id !== id));
  };

  const totalSum = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  return (
    <Router>
      <header>
        <div className="logo">BookStore</div>
        <nav>
          <ul>
            <li><Link to="/">Каталог</Link></li>
            <li><Link to="/cart">Кошик ({cart.length})</Link></li>
            <li><Link to="/account">Мій акаунт</Link></li>
          </ul>
        </nav>
      </header>

      <main>
        <Routes>
          <Route path="/" element={<Catalog addToCart={addToCart} />} />
          
          <Route path="/cart" element={
            <section id="cart">
              <h2>Кошик</h2>
              {cart.length === 0 ? <p>Кошик порожній</p> : cart.map(item => (
                <CartItem key={item.id} item={item} changeQuantity={changeQuantity} removeFromCart={removeFromCart} />
              ))}
              <h3 className="cart-total">Загальна сума: {totalSum} грн</h3>
            </section>
          } />

          <Route path="/account" element={
            <section id="account">
              <h2>Мій акаунт</h2>
              <UserInfo />
            </section>
          } />
        </Routes>
      </main>
    </Router>
  );
}

export default App;