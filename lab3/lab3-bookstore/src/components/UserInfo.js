import React from 'react';

function UserInfo() {
  return (
    <div className="user-info-card">
      <p><strong>Користувач:</strong> Dmytro Daniuk</p>
      <p><strong>Email:</strong> dimasdaniuk@gmail.com</p>
      <h3>Історія покупок:</h3>
      <ul>
        <li>Замовлення #123 - "Енеїда" (Виконано)</li>
        <li>Замовлення #124 - "Місто" (В дорозі)</li>
      </ul>
    </div>
  );
}

export default UserInfo;