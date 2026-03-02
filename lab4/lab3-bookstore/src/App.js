import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Catalog from './pages/Catalog';
import Auth from './pages/Auth';
import CartItem from './components/CartItem';
import UserInfo from './components/UserInfo';
import './App.css'; 

import { auth, db } from './firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { collection, addDoc, getDocs, query, where } from 'firebase/firestore';

function App() {
  const [cart, setCart] = useState([]);
  const [user, setUser] = useState(null);
  const [purchaseHistory, setPurchaseHistory] = useState([]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const loadPurchaseHistory = async () => {
      if (!user) {
        setPurchaseHistory([]);
        return;
      }

      try {
        const ordersQuery = query(
          collection(db, 'orders'),
          where('userId', '==', user.uid)
        );
        const snapshot = await getDocs(ordersQuery);

        const orders = snapshot.docs
          .map((doc) => ({ id: doc.id, ...doc.data() }))
          .sort((firstOrder, secondOrder) => {
            const firstDate = firstOrder.date?.toDate ? firstOrder.date.toDate() : new Date(firstOrder.date || 0);
            const secondDate = secondOrder.date?.toDate ? secondOrder.date.toDate() : new Date(secondOrder.date || 0);
            return secondDate - firstDate;
          });

        setPurchaseHistory(orders);
      } catch (e) {
        console.error('Помилка завантаження історії покупок:', e);
        setPurchaseHistory([]);
      }
    };

    loadPurchaseHistory();
  }, [user]);

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
    if (!user) {
      alert("Тільки авторизовані користувачі можуть оформлювати замовлення!");
      return;
    }
    try {
      const orderPayload = {
        userId: user.uid,
        email: user.email,
        items: cart,
        total: totalSum,
        date: new Date(),
        status: 'В обробці'
      };

      const docRef = await addDoc(collection(db, "orders"), orderPayload);

      setPurchaseHistory((prevHistory) => [
        { id: docRef.id, ...orderPayload },
        ...prevHistory
      ]);

      alert("Ваше замовлення успішно оформлено!");
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

          <Route path="/account" element={user ? <section><h2>Мій акаунт</h2><UserInfo email={user.email} purchaseHistory={purchaseHistory} /></section> : <p>Будь ласка, увійдіть.</p>} />
        </Routes>
      </main>
    </Router>
  );
}

export default App;