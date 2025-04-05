import React, { useEffect, useState } from "react";
import "./Shopping.css";
const Shopping = () => {
  const products = [
    { id: 1, name: "Laptop", price: 500 },
    { id: 2, name: "Smartphone", price: 300 },
    { id: 3, name: "Headphones", price: 100 },
    { id: 4, name: "SmartWatch", price: 150 },
  ];

  const FREE_GIFT={id:'gift',name:"FREE wireless Mouse",price:0,quantity:1}
  const THRESHOLD=1000
  const [cart, setCart] = useState([]);
  const geSubtotal=(items)=>items.filter(item=>item.id!=='gift').reduce((sum,item)=>sum+item.price*item.quantity,0)
  const addToCart = (product) => {
    setCart((prev) => {
      const existItem = prev.find((item) => item.id === product.id);
      if (existItem) {
        return prev.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const incrementQty = (item) => {
    setCart((prev) =>
      prev.map((i) =>
        i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
      )
    );
  };
  const decrementQty = (item) => {
    setCart(prev =>{
        if(item.quantity===1){
            return prev.filter(i=>i.id!==item.id)
        }
      return  prev.map(i =>
        i.id === item.id ? { ...i, quantity: i.quantity - 1 } : i)
    })
  };
  const removeItem = (id) => {
    if (id === "gift") return;
    setCart((prev) => prev.filter((item) => item.id !== id));
  };
const subtotal=geSubtotal(cart)
const progreess=Math.min((subtotal/THRESHOLD)*100,100)
useEffect(() => {
    const hasGift = cart.some(item => item.id === 'gift');
  
    if (subtotal >= THRESHOLD && !hasGift) {
      setCart(prev => [...prev, FREE_GIFT]);
    }
  
    if (subtotal < THRESHOLD && hasGift) {
      setCart(prev => prev.filter(item => item.id !== 'gift'));
    }
  }, [subtotal, cart, THRESHOLD, FREE_GIFT]);
  
  return (
    <div className="shopping-container">
      <h1>Shopping Cart</h1>
      <div className="products-section">
        {products.map((product) => {
          return (
            <div className="product-card">
              <h3>{product.name}</h3>
              <p>${product.price}</p>
              <button onClick={() => addToCart(product)}>Add to Cart</button>
            </div>
          );
        })}
      </div>

      <div className="cart-summary">

        <h2>Cart summary</h2>
        <p>subtotal:<strong>${subtotal}</strong></p>
        {subtotal<THRESHOLD&&(
            <p className="gift-hint">
                Add ${THRESHOLD-subtotal} more to get a <strong>FREE wireless Mouse!</strong>
            </p>
        )}
        <div className="progress-bar-container">
            <div className="progress-bar" style={{width:`${progreess}%`}}></div>
        </div>
        <div className="cart-items">
          <h2>Cart Items</h2>
          {cart.length === 0 && <p>Your cart is empty.</p>}
          {cart.map((item) => (
            <div className="cart-item" key={item.id}>
              <div>
                <h4>{item.name}</h4>
                <p>
                  ${item.price}*{item.quantity}=${item.price * item.quantity}
                </p>
              </div>
              {item.id !== "gift" && (
                <div className="quantity-controls">
                  <button
                    className="qty-btn red"
                    aria-label="Decrease quantity"
                    onClick={() => decrementQty(item)}
                  >
                    -
                  </button>
                  <span>{item.quantity}</span>
                  <button
                    className="qty-btn green"
                    aria-label="Increase quantity"
                    onClick={() => incrementQty(item)}
                  >
                    +
                  </button>
                  <button className="remove-btn" onClick={() => removeItem(item.id)}>Remove</button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Shopping;
