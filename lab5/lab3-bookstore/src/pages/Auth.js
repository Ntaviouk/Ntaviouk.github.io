import React, { useState } from 'react';
import { auth } from '../firebase';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
        alert("Ви успішно увійшли!");
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
        alert("Реєстрація успішна!");
      }
      navigate('/');
    } catch (error) {
      alert("Помилка: " + error.message);
    }
  };

  return (
    <section className="auth-section">
      <h2>{isLogin ? 'Вхід' : 'Реєстрація'}</h2>
      <form onSubmit={handleSubmit} className="auth-form">
        <input 
          type="email" placeholder="Email" required 
          value={email} onChange={(e) => setEmail(e.target.value)} 
          className="auth-input"
        />
        <input 
          type="password" placeholder="Пароль (мін. 6 символів)" required 
          value={password} onChange={(e) => setPassword(e.target.value)} 
          className="auth-input"
        />
        <button type="submit">{isLogin ? 'Увійти' : 'Зареєструватися'}</button>
      </form>
      <p className="auth-toggle" onClick={() => setIsLogin(!isLogin)}>
        {isLogin ? 'Немає акаунта? Зареєструватися' : 'Вже є акаунт? Увійти'}
      </p>
    </section>
  );
}

export default Auth;