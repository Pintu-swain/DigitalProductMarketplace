import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { Link, useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

  // Load all products
  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await api.get('/products/all');
      setProducts(res.data);
    } catch (err) {
      console.error("Failed to load products");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        await api.delete(`/products/delete/${id}`);
        fetchProducts(); // Refresh list
      } catch (err) {
        alert("Failed to delete");
      }
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>
        
        <div className="flex gap-4">
          {/* NEW BUTTON: Manage Categories */}
          <Link to="/admin/categories" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 font-medium shadow transition">
            Manage Categories
          </Link>

          {/* Add Product Button */}
          <Link to="/admin/add" className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 font-medium shadow transition">
            + Add New Product
          </Link>
        </div>
      </div>

      <div className="bg-white shadow-md rounded-lg overflow-hidden border border-gray-200">
        <table className="min-w-full leading-normal">
          <thead>
            <tr>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-50 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                Product
              </th>
              {/* New Category Header */}
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-50 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                Category
              </th>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-50 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                Price
              </th>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-50 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id} className="hover:bg-gray-50 transition">
                <td className="px-5 py-5 border-b border-gray-200 text-sm">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 w-12 h-12">
                      <img className="w-full h-full rounded-md object-cover border" 
                           src={product.imageUrls?.[0] || "https://via.placeholder.com/50"} 
                           alt="" />
                    </div>
                    <div className="ml-4">
                      <p className="text-gray-900 font-bold text-base">
                        {product.name}
                      </p>
                    </div>
                  </div>
                </td>
                
                {/* New Category Column */}
                <td className="px-5 py-5 border-b border-gray-200 text-sm">
                  <span className="bg-indigo-50 text-indigo-700 border border-indigo-100 text-xs px-2 py-1 rounded-full font-semibold">
                    {product.category || "General"}
                  </span>
                </td>

                <td className="px-5 py-5 border-b border-gray-200 text-sm font-medium text-gray-900">
                  ₹{product.price}
                </td>
                <td className="px-5 py-5 border-b border-gray-200 text-sm">
                  <button 
                    onClick={() => navigate(`/admin/edit/${product.id}`)}
                    className="text-indigo-600 hover:text-indigo-900 mr-4 font-bold border border-indigo-200 px-3 py-1 rounded hover:bg-indigo-50 transition"
                  >
                    Edit
                  </button>
                  <button 
                    onClick={() => handleDelete(product.id)}
                    className="text-red-600 hover:text-red-900 font-bold border border-red-200 px-3 py-1 rounded hover:bg-red-50 transition"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {products.length === 0 && (
                <tr>
                    <td colSpan="4" className="text-center py-10 text-gray-500">
                        No products found. Start by adding one!
                    </td>
                </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminDashboard;