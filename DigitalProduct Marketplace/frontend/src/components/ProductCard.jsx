import React, { useState } from 'react';
import api from '../services/api';
import { useNavigate, Link } from 'react-router-dom'; // <--- Link imported
import { useCart } from '../context/CartContext';

const ProductCard = ({ product }) => {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const images = product.imageUrls && product.imageUrls.length > 0 
    ? product.imageUrls 
    : ["https://via.placeholder.com/400x300?text=No+Image"];

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleBuyNow = async () => {
    try {
      const orderResponse = await api.post('/payment/create-order', {
        amount: product.price,
        productId: product.id
      });
      const { orderId } = orderResponse.data;

      const options = {
        key: "YOUR_RAZORPAY_KEY_HERE", // <--- PASTE KEY HERE
        amount: product.price * 100,
        currency: "INR",
        name: "Select Marketplace",
        description: `Buying ${product.name}`,
        order_id: orderId, 
        handler: async function (response) {
          try {
             const verifyRes = await api.post('/payment/verify-payment', {
               razorpay_order_id: response.razorpay_order_id,
               razorpay_payment_id: response.razorpay_payment_id,
               razorpay_signature: response.razorpay_signature
             });
             if(verifyRes.data.success) {
               const fileLink = encodeURIComponent(verifyRes.data.downloadUrl);
               navigate(`/thank-you?file=${fileLink}`);
             }
          } catch (err) {
             console.error(err);
             alert("Payment verification failed!");
          }
        },
        theme: { color: "#4F46E5" }
      };

      const rzp = new window.Razorpay(options);
      rzp.open();

    } catch (error) {
      console.error("Payment Error:", error);
      alert("Something went wrong initializing payment.");
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 flex flex-col h-full group">
      
      {/* CAROUSEL */}
      <div className="relative w-full h-48 bg-gray-100">
        <img 
          src={images[currentImageIndex]} 
          alt={product.name} 
          className="w-full h-full object-cover transition-opacity duration-300"
        />
        
        {images.length > 1 && (
          <>
            <button 
              onClick={(e) => { e.stopPropagation(); prevImage(); }}
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 text-white w-8 h-8 rounded-full flex items-center justify-center hover:bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              &#10094;
            </button>

            <button 
              onClick={(e) => { e.stopPropagation(); nextImage(); }}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 text-white w-8 h-8 rounded-full flex items-center justify-center hover:bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              &#10095;
            </button>
            
            <div className="absolute bottom-2 left-0 right-0 flex justify-center space-x-1">
              {images.map((_, idx) => (
                <div 
                  key={idx} 
                  className={`w-2 h-2 rounded-full ${idx === currentImageIndex ? 'bg-white' : 'bg-white/50'}`} 
                />
              ))}
            </div>
          </>
        )}
      </div>

      {/* DETAILS */}
      <div className="p-4 flex flex-col flex-grow">
        
        {/* CLICKABLE TITLE */}
        <Link to={`/product/${product.id}`} className="hover:text-indigo-600 transition block mb-1">
          <h3 className="text-xl font-bold text-gray-800">{product.name}</h3>
        </Link>
        
        <p className="text-gray-600 text-sm flex-grow line-clamp-2">{product.description}</p>
        
        <div className="mt-4 pt-4 border-t border-gray-100">
          <div className="flex justify-between items-center mb-3">
             <span className="text-2xl font-bold text-indigo-600">₹{product.price}</span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button 
              onClick={() => addToCart(product)} 
              className="bg-gray-100 text-gray-800 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-gray-200 transition border border-gray-300"
            >
              Add to Cart
            </button>
            
            <button 
              onClick={handleBuyNow}
              className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-indigo-700 transition shadow-md"
            >
              Buy Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;