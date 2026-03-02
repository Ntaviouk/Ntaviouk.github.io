import React from 'react';

function UserInfo({ email, purchaseHistory = [] }) {
  return (
    <div className="user-info-card">
      <p><strong>Email:</strong> {email || 'Невідомо'}</p>
      <h3>Історія покупок:</h3>
      <ul>
        {purchaseHistory.length === 0 ? (
          <li>Поки немає замовлень.</li>
        ) : (
          purchaseHistory.map((order, index) => {
            const titles = Array.isArray(order.items) && order.items.length > 0
              ? order.items.map((item) => `"${item.title}"`).join(', ')
              : 'Без товарів';

            const status = order.status || 'В обробці';
            const orderNumber = order.id ? order.id.slice(-6).toUpperCase() : `${index + 1}`;

            return (
              <li key={order.id || `${orderNumber}-${index}`}>
                Замовлення #{orderNumber} - {titles} ({status})
              </li>
            );
          })
        )}
      </ul>
    </div>
  );
}

export default UserInfo;