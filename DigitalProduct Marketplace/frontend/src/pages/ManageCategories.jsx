import React, { useEffect, useState } from 'react';
import api from '../services/api';

const ManageCategories = () => {
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState('');

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await api.get('/categories/all');
      setCategories(res.data);
    } catch (error) {
      console.error("Failed to load categories");
    }
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!newCategory.trim()) return;
    try {
      await api.post('/categories/add', { name: newCategory });
      setNewCategory('');
      fetchCategories(); // Refresh list
    } catch (error) {
      alert("Failed to add category");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure?")) {
      try {
        await api.delete(`/categories/delete/${id}`);
        fetchCategories();
      } catch (error) {
        alert("Failed to delete");
      }
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-xl shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Manage Categories</h2>
      
      {/* Add Form */}
      <form onSubmit={handleAdd} className="flex gap-2 mb-6">
        <input 
          type="text" 
          placeholder="New Category Name" 
          value={newCategory}
          onChange={(e) => setNewCategory(e.target.value)}
          className="flex-1 p-2 border rounded focus:outline-indigo-500"
          required
        />
        <button type="submit" className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700">
          Add
        </button>
      </form>

      {/* List */}
      <ul className="space-y-2">
        {categories.map((cat) => (
          <li key={cat.id} className="flex justify-between items-center p-3 bg-gray-50 rounded border">
            <span className="font-medium text-gray-700">{cat.name}</span>
            <button 
              onClick={() => handleDelete(cat.id)} 
              className="text-red-500 hover:text-red-700 text-sm font-bold"
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ManageCategories;