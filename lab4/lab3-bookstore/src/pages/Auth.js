import React, { useState } from 'react';
import { auth } from '../firebase';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail
} from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [isResetMode, setIsResetMode] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();

  const passwordChecks = [
    {
      label: 'Мінімум 8 символів',
      isValid: password.length >= 8
    },
    {
      label: 'Хоча б одна велика літера',
      isValid: /[A-ZА-ЯІЇЄҐ]/.test(password)
    },
    {
      label: 'Хоча б одна мала літера',
      isValid: /[a-zа-яіїєґ]/.test(password)
    },
    {
      label: 'Хоча б одна цифра',
      isValid: /\d/.test(password)
    }
  ];

  const isPasswordValid = passwordChecks.every((check) => check.isValid);

  const mapFirebaseError = (errorCode) => {
    if (errorCode === 'auth/wrong-password' || errorCode === 'auth/invalid-credential') {
      return 'Неправильний пароль. Спробуйте ще раз.';
    }

    if (errorCode === 'auth/user-not-found') {
      return 'Користувача з таким email не знайдено.';
    }

    if (errorCode === 'auth/email-already-in-use') {
      return 'Цей email вже використовується.';
    }

    if (errorCode === 'auth/weak-password') {
      return 'Пароль занадто слабкий.';
    }

    if (errorCode === 'auth/invalid-email') {
      return 'Некоректний формат email.';
    }

    if (errorCode === 'auth/too-many-requests') {
      return 'Забагато спроб. Спробуйте трохи пізніше.';
    }

    if (errorCode === 'auth/unauthorized-continue-uri') {
      return 'Домен не авторизований у Firebase. Додайте його в Authentication → Settings → Authorized domains.';
    }

    if (errorCode === 'auth/invalid-continue-uri') {
      return 'Некоректний URL для повернення після відновлення паролю.';
    }

    return 'Сталася помилка. Спробуйте пізніше.';
  };

  const switchAuthMode = () => {
    setIsLogin((prevMode) => !prevMode);
    setIsResetMode(false);
    setErrorMessage('');
    setSuccessMessage('');
    setPassword('');
  };

  const openResetMode = () => {
    setIsResetMode(true);
    setErrorMessage('');
    setSuccessMessage('');
    setPassword('');
  };

  const closeResetMode = () => {
    setIsResetMode(false);
    setErrorMessage('');
    setSuccessMessage('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (isResetMode) {
      const normalizedEmail = email.trim();

      if (!normalizedEmail) {
        setErrorMessage('Введіть email для відновлення паролю.');
        return;
      }

      try {
        const actionCodeSettings = {
          url: `${window.location.origin}/#/auth`,
          handleCodeInApp: false
        };

        await sendPasswordResetEmail(auth, normalizedEmail, actionCodeSettings);
        setSuccessMessage('Якщо акаунт існує, лист для відновлення паролю надіслано. Перевірте також папку "Спам".');
      } catch (error) {
        setErrorMessage(mapFirebaseError(error.code));
      }

      return;
    }

    if (!isLogin && !isPasswordValid) {
      setErrorMessage('Пароль не відповідає вимогам реєстрації.');
      return;
    }

    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
        setSuccessMessage('Ви успішно увійшли!');
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
        setSuccessMessage('Реєстрація успішна!');
      }
      navigate('/');
    } catch (error) {
      setErrorMessage(mapFirebaseError(error.code));
    }
  };

  return (
    <section className="auth-section">
      <h2>{isResetMode ? 'Відновлення паролю' : (isLogin ? 'Вхід' : 'Реєстрація')}</h2>
      <form onSubmit={handleSubmit} className="auth-form">
        {errorMessage && <p className="auth-message auth-message-error">{errorMessage}</p>}
        {successMessage && <p className="auth-message auth-message-success">{successMessage}</p>}

        <input 
          type="email" placeholder="Email" required 
          value={email} onChange={(e) => setEmail(e.target.value)} 
          className="auth-input"
        />

        {!isResetMode && (
          <>
            <input 
              type="password" placeholder="Пароль" required 
              value={password} onChange={(e) => setPassword(e.target.value)} 
              className="auth-input"
            />

            {!isLogin && (
              <ul className="password-requirements">
                {passwordChecks.map((check) => (
                  <li
                    key={check.label}
                    className={check.isValid ? 'requirement-valid' : 'requirement-invalid'}
                  >
                    {check.label}
                  </li>
                ))}
              </ul>
            )}
          </>
        )}

        <button type="submit">
          {isResetMode ? 'Надіслати лист' : (isLogin ? 'Увійти' : 'Зареєструватися')}
        </button>
      </form>

      {isLogin && !isResetMode && (
        <p className="auth-link" onClick={openResetMode}>
          Забули пароль?
        </p>
      )}

      {isResetMode ? (
        <p className="auth-toggle" onClick={closeResetMode}>
          Повернутись до входу
        </p>
      ) : (
        <p className="auth-toggle" onClick={switchAuthMode}>
          {isLogin ? 'Немає акаунта? Зареєструватися' : 'Вже є акаунт? Увійти'}
        </p>
      )}
    </section>
  );
}

export default Auth;