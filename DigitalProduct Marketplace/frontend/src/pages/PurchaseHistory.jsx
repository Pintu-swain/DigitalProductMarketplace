import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

const PurchaseHistory = () => {
  const { user } = useAuth();
  const [collection, setCollection] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCollection = async () => {
      if (!user?.email) return;
      try {
        // Matches your OrderController @GetMapping("/user/{email}")
        const res = await api.get(`/orders/user/${user.email}`);
        setCollection(res.data);
      } catch (err) {
        console.error("Fetch failed", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCollection();
  }, [user?.email]);

  if (loading) return <div className="text-center py-20 text-indigo-600 font-bold">Refreshing assets...</div>;

  return (
    <div className="container mx-auto px-4 py-10">
      <h1 className="text-3xl font-extrabold mb-8 text-gray-800 border-b pb-4">My Collection</h1>
      {collection.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border-2 border-dashed border-gray-200">
          <p className="text-gray-500 text-lg">You haven't purchased any items yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {collection.map((item) => (
            <div key={item.id} className="bg-white p-5 rounded-2xl shadow-lg border border-gray-100 flex flex-col">
              <img src={item.productImage || "https://via.placeholder.com/300"} alt="" className="w-full h-48 object-cover rounded-xl mb-4 shadow-sm" />
              <h3 className="font-extrabold text-xl text-gray-800 mb-2">{item.productName}</h3>
              <p className="text-sm text-gray-400 mb-4 font-medium">Order Date: {new Date(item.date).toLocaleDateString()}</p>
              <div className="flex justify-between items-center mt-auto border-t pt-4">
                <span className="text-indigo-600 font-bold text-lg">₹{item.amount}</span>
                <a 
                  href={item.downloadUrl} 
                  download 
                  className="bg-indigo-600 text-white px-6 py-2 rounded-xl font-bold hover:bg-indigo-700 transition"
                >
                  Download
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PurchaseHistory;