import React from 'react';

function UserInfo() {
  return (
    <div style={{ background: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
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