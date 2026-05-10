import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const ProductDetails = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const { addToCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await api.get(`/products/${id}`);
        setProduct(res.data);
      } catch (err) {
        console.error("Failed to load product");
      }
    };
    fetchProduct();
  }, [id]);

  const handleBuyNow = async () => {
    if (!user || !user.email) {
      alert("Please login to purchase items.");
      navigate('/login');
      return;
    }

    try {
      const orderResponse = await api.post('/payment/create-order', {
        amount: product.price,
        productId: product.id,
        email: user.email
      });

      const { orderId } = orderResponse.data;

      const options = {
        key: "YOUR_RAZORPAY_KEY_HERE", 
        amount: product.price * 100,
        currency: "INR",
        name: "Select Marketplace",
        description: `Buy ${product.name}`,
        order_id: orderId,
        prefill: { email: user.email, name: user.name },
        handler: async function (response) {
          try {
             const verifyRes = await api.post('/payment/verify-payment', {
               razorpay_order_id: response.razorpay_order_id,
               razorpay_payment_id: response.razorpay_payment_id,
               razorpay_signature: response.razorpay_signature
             });

             if(verifyRes.data.success) {
               // Get the fileLink from backend response
               const downloadPath = verifyRes.data.fileLink;
               // Redirect to Thank You page
               navigate(`/thank-you?message=Order_Placed_Successfully&file=${encodeURIComponent(downloadPath)}`);
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
      alert("Could not initiate payment");
    }
  };

  if (!product) return <div className="text-center py-20">Loading...</div>;

  return (
    <div className="container mx-auto px-4 py-10">
      <div className="flex flex-col md:flex-row gap-10 bg-white p-6 rounded-xl shadow-lg border">
        <div className="md:w-1/2">
          <img src={product.imageUrls?.[0] || "https://via.placeholder.com/500"} alt={product.name} className="w-full rounded-lg" />
        </div>
        <div className="md:w-1/2 flex flex-col justify-center">
          <h1 className="text-4xl font-extrabold text-gray-800 mb-4">{product.name}</h1>
          <p className="text-gray-600 mb-6">{product.description}</p>
          <div className="text-3xl font-bold text-gray-900 mb-8">₹{product.price}</div>
          <div className="flex gap-4">
            <button onClick={() => addToCart(product)} className="flex-1 bg-gray-100 py-3 rounded-lg font-bold">Add to Cart</button>
            <button onClick={handleBuyNow} className="flex-1 bg-indigo-600 text-white py-3 rounded-lg font-bold">Buy Now</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;