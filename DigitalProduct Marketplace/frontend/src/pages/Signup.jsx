import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';

const Signup = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/auth/register', formData); // Backend still uses /register endpoint
      alert("Registration Successful! Please login.");
      navigate('/login');
    } catch (err) {
      alert("Registration failed. Email might already exist.");
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-gray-50 px-4">
      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">Create Account</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input 
            type="text" placeholder="Full Name" required 
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
            onChange={(e) => setFormData({...formData, name: e.target.value})}
          />
          <input 
            type="email" placeholder="Email Address" required 
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
            onChange={(e) => setFormData({...formData, email: e.target.value})}
          />
          <input 
            type="password" placeholder="Password" required 
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
            onChange={(e) => setFormData({...formData, password: e.target.value})}
          />
          <button className="w-full bg-indigo-600 text-white py-3 rounded-lg font-bold hover:bg-indigo-700 transition">
            Sign Up
          </button>
        </form>
        <p className="text-center mt-4 text-gray-600">
          Already have an account? <Link to="/login" className="text-indigo-600 font-bold">Login</Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;