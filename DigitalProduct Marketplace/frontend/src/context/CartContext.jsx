import { createContext, useState, useContext } from 'react';

// Create the "Brain"
const CartContext = createContext();

// Create the Provider (The Wrapper)
export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);

  // Function to add item
  const addToCart = (product) => {
    // Check if item already exists
    const exists = cart.find((item) => item.id === product.id);
    if (exists) {
      alert("Item is already in your cart!");
    } else {
      setCart([...cart, product]);
      alert(`${product.name} added to cart!`);
    }
  };

  // Function to remove item
  const removeFromCart = (productId) => {
    setCart(cart.filter((item) => item.id !== productId));
  };

  // Function to clear cart (after payment)
  const clearCart = () => {
    setCart([]);
  };

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};

// Custom Hook to use the cart easily
export const useCart = () => useContext(CartContext);