import React from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext'; 
import api from '../services/api';
import { useNavigate } from 'react-router-dom';

const Cart = () => {
  const { cart, removeFromCart, clearCart } = useCart();
  const { user } = useAuth(); 
  const navigate = useNavigate();

  const total = cart.reduce((sum, item) => sum + item.price, 0);

  const handleCheckout = async () => {
    // 1. CHECK IF CART IS EMPTY
    if (cart.length === 0) return;

    // 2. CHECK IF USER IS LOGGED IN (CRITICAL FIX)
    if (!user || !user.email) {
      alert("You must be logged in to checkout so we can save your order history!");
      navigate('/login');
      return;
    }

    console.log("Processing Checkout for:", user.email); // Debug Log

    try {
      const productIds = cart.map(item => item.id);
      
      const orderResponse = await api.post('/payment/create-order', {
        amount: total,
        productIds: productIds,
        email: user.email // Now we know this is not null
      });

      const { orderId } = orderResponse.data;

      const options = {
        key: "rzp_test_Rxnivs8D4e4KEv", // Your Key
        amount: total * 100,
        currency: "INR",
        name: "Select Marketplace",
        description: `Checkout - ${cart.length} Items`,
        order_id: orderId,
        prefill: {
            email: user.email,
            name: user.name
        },
        handler: async function (response) {
          try {
             const verifyRes = await api.post('/payment/verify-payment', {
               razorpay_order_id: response.razorpay_order_id,
               razorpay_payment_id: response.razorpay_payment_id,
               razorpay_signature: response.razorpay_signature
             });

             if(verifyRes.data.success) {
               clearCart();
               navigate(`/thank-you?message=Order_Placed_Successfully`);
             }
          } catch (err) {
             alert("Payment verification failed!");
          }
        },
        theme: { color: "#4F46E5" }
      };

      const rzp = new window.Razorpay(options);
      rzp.open();

    } catch (error) {
      console.error(error);
      alert("Checkout Failed");
    }
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Your Cart is Empty</h2>
        <a href="/" className="bg-indigo-600 text-white px-6 py-2 rounded shadow hover:bg-indigo-700">
          Start Shopping
        </a>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>
      
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Left: Cart Items */}
        <div className="flex-1 space-y-4">
          {cart.map((item, index) => (
            <div key={`${item.id}-${index}`} className="flex items-center justify-between bg-white p-4 rounded-lg shadow-sm border">
              <div className="flex items-center gap-4">
                <img 
                  src={item.imageUrls?.[0] || "https://via.placeholder.com/80"} 
                  alt={item.name} 
                  className="w-20 h-20 object-cover rounded"
                />
                <div>
                  <h3 className="font-bold text-lg">{item.name}</h3>
                  <p className="text-gray-500 text-sm">Digital License</p>
                </div>
              </div>
              <div className="flex items-center gap-6">
                <span className="font-bold text-lg">₹{item.price}</span>
                <button 
                  onClick={() => removeFromCart(item.id)}
                  className="text-red-500 hover:text-red-700 font-medium"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Right: Summary */}
        <div className="lg:w-1/3">
          <div className="bg-white p-6 rounded-lg shadow-md border sticky top-24">
            <h2 className="text-xl font-bold mb-4 border-b pb-2">Order Summary</h2>
            <div className="flex justify-between mb-2">
              <span className="text-gray-600">Subtotal</span>
              <span className="font-bold">₹{total}</span>
            </div>
            <div className="flex justify-between text-xl font-bold mb-6 pt-4 border-t">
              <span>Total</span>
              <span>₹{total}</span>
            </div>
            
            <button 
              onClick={handleCheckout}
              className="w-full bg-indigo-600 text-white py-3 rounded-xl font-bold hover:bg-indigo-700 transition shadow-lg"
            >
              {user ? "Checkout Now" : "Login to Checkout"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;