import React, { useEffect } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom'; // Added Link and useNavigate
import { useCart } from '../context/CartContext';

const ThankYou = () => {
  const [searchParams] = useSearchParams();
  const fileLink = searchParams.get('file');
  const { clearCart } = useCart();
  const navigate = useNavigate(); // Hook for navigation

  useEffect(() => {
    if (searchParams.get('message') === 'Order_Placed_Successfully') {
      clearCart();
    }
  }, [searchParams, clearCart]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] text-center p-6">
      <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full border border-gray-100">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path>
          </svg>
        </div>

        <h1 className="text-3xl font-extrabold text-gray-900 mb-2">Success!</h1>
        <p className="text-gray-500 mb-8">Your payment was verified successfully.</p>

        {fileLink && fileLink !== "undefined" ? (
          <div className="mb-4">
            <a 
              href={decodeURIComponent(fileLink)} 
              className="block w-full bg-indigo-600 text-white py-3 rounded-xl font-bold hover:bg-indigo-700 transition shadow-lg"
              download
            >
              Download Your Product
            </a>
          </div>
        ) : (
          <Link to="/my-orders" className="block w-full bg-blue-600 text-white py-3 rounded-xl font-bold mb-4">
            View My Orders
          </Link>
        )}

        {/* FIXED BUTTON: Added Link to="/" */}
        <Link 
          to="/" 
          className="block w-full text-indigo-600 font-bold py-3 border-2 border-indigo-600 rounded-xl hover:bg-indigo-50 transition"
        >
          Continue Shopping
        </Link>
      </div>
    </div>
  );
};

export default ThankYou;