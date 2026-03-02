import React from 'react';

function CartItem({ item, changeQuantity, removeFromCart }) {
  return (
    <div className="cart-item">
      <span className="cart-item-title">{item.title} ({item.author})</span>
      <div className="cart-controls">
        <button onClick={() => changeQuantity(item.id, -1)}>-</button>
        <span className="cart-quantity">{item.quantity} шт.</span>
        <button onClick={() => changeQuantity(item.id, 1)}>+</button>
        <button className="delete-btn" onClick={() => removeFromCart(item.id)}>Видалити</button>
      </div>
      <div className="cart-item-total">{item.price * item.quantity} грн</div>
    </div>
  );
}

export default CartItem;