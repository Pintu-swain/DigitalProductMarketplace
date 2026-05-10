import React, { useState, useEffect } from 'react';
import api from '../services/api';

const AddProduct = () => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  
  // Category State
  const [category, setCategory] = useState('General'); 
  const [categoriesList, setCategoriesList] = useState([]); // <--- New State for Dynamic List

  const [imageFiles, setImageFiles] = useState([]); 
  const [productFile, setProductFile] = useState(null);

  // 1. Fetch Categories from Backend on Load
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await api.get('/categories/all');
        setCategoriesList(res.data);
      } catch (error) {
        console.error("Failed to load categories");
      }
    };
    fetchCategories();
  }, []);

  const handleImageChange = (e) => {
    setImageFiles(Array.from(e.target.files)); 
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('name', name);
    formData.append('description', description);
    formData.append('price', price);
    formData.append('category', category);
    formData.append('productFile', productFile);

    imageFiles.forEach((file) => {
      formData.append('images', file);
    });

    try {
      await api.post('/products/add', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      alert('Product Added Successfully!');
    } catch (error) {
      console.error(error);
      alert('Failed to add product');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 bg-white p-8 rounded-xl shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center">Add New Product</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input className="w-full p-2 border rounded" placeholder="Product Name" onChange={e => setName(e.target.value)} required />
        <textarea className="w-full p-2 border rounded" placeholder="Description" onChange={e => setDescription(e.target.value)} required />
        
        {/* 2. DYNAMIC CATEGORY DROPDOWN */}
        <div className="border p-2 rounded">
          <label className="block text-sm text-gray-500 mb-1">Category</label>
          <select 
            value={category} 
            onChange={(e) => setCategory(e.target.value)} 
            className="w-full p-2 bg-white outline-none"
          >
            <option value="General">General</option>
            {/* Map through the list fetched from backend */}
            {categoriesList.map((cat) => (
              <option key={cat.id} value={cat.name}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        <input className="w-full p-2 border rounded" type="number" placeholder="Price" onChange={e => setPrice(e.target.value)} required />
        
        <div className="border p-2 rounded">
          <label className="block text-sm text-gray-500 mb-1">Product Images (Select Multiple)</label>
          <input type="file" multiple onChange={handleImageChange} className="w-full" required />
        </div>

        <div className="border p-2 rounded">
          <label className="block text-sm text-gray-500 mb-1">Digital Product File (PDF/Zip)</label>
          <input type="file" onChange={e => setProductFile(e.target.files[0])} className="w-full" required />
        </div>

        <button type="submit" className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700">Upload Product</button>
      </form>
    </div>
  );
};

export default AddProduct;