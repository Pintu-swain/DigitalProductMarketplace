import { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom'; // Added useLocation
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation(); // To redirect user back to where they were

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/auth/login', { email, password });
      
      console.log("Login Response:", res.data); 

      if (res.data.email) {
          login(res.data); 
          
          // IMPROVEMENT: If the user was redirected from a protected route, 
          // send them back there. Otherwise, go home.
          const origin = location.state?.from?.pathname || '/';
          navigate(origin);
      } else {
          alert("Login failed: Backend did not return an email.");
      }

    } catch (error) {
      alert("Invalid Credentials");
    }
  };

  return (
    <div className="flex justify-center items-center h-[80vh] bg-gray-50">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-xl shadow-lg w-full max-w-sm border">
        <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">Welcome Back</h2>
        
        <div className="space-y-4">
          <input 
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" 
            type="email" 
            placeholder="Email Address" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            required 
          />
          <input 
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" 
            type="password" 
            placeholder="Password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            required 
          />
          <button className="w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 font-bold transition">
            Login
          </button>
        </div>

        <p className="mt-6 text-center text-gray-600">
          {/* FIX: Changed /register to /signup to match App.jsx */}
          Don't have an account? <Link to="/signup" className="text-blue-600 font-bold hover:underline">Register</Link>
        </p>
      </form>
    </div>
  );
};

export default Login;