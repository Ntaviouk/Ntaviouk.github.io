import React, { useState, useEffect } from 'react';

function UserInfo({ user, apiBaseUrl = '' }) {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user) {
      setOrders([]);
      setError('');
      return;
    }

    setIsLoading(true);
    setError('');

    const normalizedApiBaseUrl = apiBaseUrl ? apiBaseUrl.replace(/\/+$/, '') : '';

    user.getIdToken()
      .then((token) => fetch(`${normalizedApiBaseUrl}/api/orders/${user.uid}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }))
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || 'Не вдалося завантажити замовлення.');
        }
        return data;
      })
      .then((data) => setOrders(Array.isArray(data) ? data : []))
      .catch((err) => {
        console.error(err);
        if (err instanceof TypeError) {
          setError('Сервер недоступний. Переконайтесь, що бекенд запущено на http://localhost:5000.');
          return;
        }

        setError(err.message);
      })
      .finally(() => setIsLoading(false));
  }, [user, apiBaseUrl]);

  return (
    <div>
      <h3>Ваш Email: {user.email}</h3>
      <hr/>
      <h4>Історія ваших замовлень:</h4>
      {isLoading ? <p>Завантаження...</p> : error ? <p>Помилка: {error}</p> : orders.length === 0 ? <p>У вас ще немає замовлень.</p> : (
        <ul style={{ listStyleType: 'none', padding: 0 }}>
          {orders.map(order => (
            <li key={order.id} style={{ border: '1px solid #ccc', margin: '10px 0', padding: '10px' }}>
              <strong>Дата:</strong> {new Date(order.date).toLocaleString()} <br/>
              <strong>Сума:</strong> {order.total} грн <br/>
              <strong>Товари:</strong> {order.items.map(item => `${item.title} (${item.quantity} шт)`).join(', ')}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default UserInfo;


