import React from 'react';

function CartItem({ item, changeQuantity, removeFromCart }) {
  return (
    <div className="cart-item" style={{ display: 'flex', justifyContent: 'space-between', padding: '10px', borderBottom: '1px solid #ccc' }}>
      <span>{item.title} ({item.author})</span>
      <div className="cart-controls">
        <button onClick={() => changeQuantity(item.id, -1)}>-</button>
        <span style={{ margin: '0 10px' }}>{item.quantity} шт.</span>
        <button onClick={() => changeQuantity(item.id, 1)}>+</button>
        <button onClick={() => removeFromCart(item.id)} style={{ marginLeft: '10px', backgroundColor: '#c0392b', color: 'white' }}>Видалити</button>
      </div>
      <div>{item.price * item.quantity} грн</div>
    </div>
  );
}

export default CartItem;