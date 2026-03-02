import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Catalog from './pages/Catalog';
import Auth from './pages/Auth';
import CartItem from './components/CartItem';
import UserInfo from './components/UserInfo';
import './App.css'; 

import { auth } from './firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';

const normalizeApiBaseUrl = (url) => (url ? url.replace(/\/+$/, '') : '');

const getApiBaseUrl = () => {
  const envApiUrl = normalizeApiBaseUrl(process.env.REACT_APP_API_URL || '');
  if (envApiUrl) {
    return envApiUrl;
  }

  if (typeof window !== 'undefined') {
    if (window.location.protocol === 'file:' || window.location.port === '3000') {
      return 'http://localhost:5000';
    }
  }

  return '';
};

const API_BASE_URL = getApiBaseUrl();

function App() {
  const [cart, setCart] = useState([]);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

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
    setCart(cart.map(item => item.id === id ? { ...item, quantity: Math.max(1, item.quantity + change) } : item));
  };

  const removeFromCart = (id) => setCart(cart.filter(item => item.id !== id));
  const totalSum = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const handleCheckout = async () => {
    if (!user) return alert("Тільки авторизовані користувачі можуть оформлювати замовлення!");
    if (cart.length === 0) return alert('Кошик порожній. Додайте товари перед оформленням.');
    
    try {
      const token = await user.getIdToken();
      const response = await fetch(`${API_BASE_URL}/api/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          items: cart,
          total: totalSum
        })
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.error);

      alert(result.message);
      setCart([]);
    } catch (e) {
      alert("Помилка оформлення: " + e.message);
    }
  };

  return (
    <Router>
      <header className="app-header">
        <div className="app-logo">BookStore</div>
        <nav className="app-nav">
          <Link to="/" className="app-nav-link">Каталог</Link>
          <Link to="/cart" className="app-nav-link">Кошик ({cart.length})</Link>
          
          {user ? (
            <>
              <Link to="/account" className="app-nav-link">Мій акаунт</Link>
              <button onClick={() => signOut(auth)} className="logout-btn">Вийти</button>
            </>
          ) : (
            <Link to="/auth" className="app-nav-link login-link">Увійти</Link>
          )}
        </nav>
      </header>

      <main className="app-main">
        <Routes>
          <Route path="/" element={<Catalog addToCart={addToCart} />} />
          <Route path="/auth" element={<Auth />} />
          
          <Route path="/cart" element={
            <section>
              <h2>Кошик</h2>
              {cart.length === 0 ? <p>Кошик порожній</p> : cart.map(item => (
                <CartItem key={item.id} item={item} changeQuantity={changeQuantity} removeFromCart={removeFromCart} />
              ))}
              <h3 className="cart-total-heading">Загальна сума: {totalSum} грн</h3>

              {cart.length > 0 && (
                <div className="checkout-actions">
                  {user ? (
                    <button onClick={handleCheckout} className="checkout-btn">Оформити замовлення</button>
                  ) : (
                    <p className="checkout-hint">Увійдіть або зареєструйтесь, щоб оформити замовлення.</p>
                  )}
                </div>
              )}
            </section>
          } />

          <Route path="/account" element={user ? <section><h2>Мій акаунт</h2><UserInfo user={user} apiBaseUrl={API_BASE_URL} /></section> : <p>Будь ласка, увійдіть.</p>} />
        </Routes>
      </main>
    </Router>
  );
}

export default App;