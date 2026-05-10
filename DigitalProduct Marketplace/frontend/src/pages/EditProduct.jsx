import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { useParams, useNavigate } from 'react-router-dom';

const EditProduct = () => {
  const { id } = useParams(); // Get ID from URL
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [currentImages, setCurrentImages] = useState([]); // To show existing images
  
  // New files (if user wants to change them)
  const [imageFiles, setImageFiles] = useState([]);
  const [productFile, setProductFile] = useState(null);

  // 1. Load Existing Data
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        // We reuse the public endpoint to get details
        // (Ideally, create a getProductById API, but we can filter from 'all' for now or assume backend has /products/{id})
        // Let's assume you haven't made a single product API yet, so we cheat and fetch all, then find one.
        // BETTER: Add @GetMapping("/{id}") in backend. Assuming it exists or we use this logic:
        const res = await api.get('/products/all');
        const product = res.data.find(p => p.id === parseInt(id));
        
        if (product) {
          setName(product.name);
          setDescription(product.description);
          setPrice(product.price);
          setCurrentImages(product.imageUrls || []);
        }
      } catch (err) {
        alert("Error loading product");
      }
    };
    fetchProduct();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('name', name);
    formData.append('description', description);
    formData.append('price', price);

    // Only append files if user selected new ones
    if (imageFiles.length > 0) {
      imageFiles.forEach(file => formData.append('images', file));
    }
    if (productFile) {
      formData.append('productFile', productFile);
    }

    try {
      await api.put(`/products/update/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      alert('Product Updated Successfully!');
      navigate('/admin');
    } catch (error) {
      console.error(error);
      alert('Failed to update product');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 bg-white p-8 rounded-xl shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center">Edit Product</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
           <label className="block text-sm font-bold text-gray-700">Name</label>
           <input className="w-full p-2 border rounded" value={name} onChange={e => setName(e.target.value)} required />
        </div>
        
        <div>
           <label className="block text-sm font-bold text-gray-700">Description</label>
           <textarea className="w-full p-2 border rounded" value={description} onChange={e => setDescription(e.target.value)} required />
        </div>

        <div>
           <label className="block text-sm font-bold text-gray-700">Price</label>
           <input className="w-full p-2 border rounded" type="number" value={price} onChange={e => setPrice(e.target.value)} required />
        </div>
        
        {/* Existing Images Preview */}
        {currentImages.length > 0 && (
          <div className="flex gap-2 mb-2">
            {currentImages.map((img, idx) => (
              <img key={idx} src={img} alt="preview" className="w-16 h-16 object-cover rounded border" />
            ))}
          </div>
        )}

        <div className="border p-2 rounded">
          <label className="block text-sm text-gray-500 mb-1">Replace Images (Optional)</label>
          <input type="file" multiple onChange={e => setImageFiles(Array.from(e.target.files))} className="w-full" />
        </div>

        <div className="border p-2 rounded">
          <label className="block text-sm text-gray-500 mb-1">Replace Digital File (Optional)</label>
          <input type="file" onChange={e => setProductFile(e.target.files[0])} className="w-full" />
        </div>

        <button type="submit" className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700">Update Product</button>
      </form>
    </div>
  );
};

export default EditProduct;