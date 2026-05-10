import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { cart } = useCart();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // --- 1. DEFINE WHO IS ADMIN ---
  // Replace 'admin@select.com' with the exact email you use to login as Admin
  const isAdmin = user && (user.email === 'admin@select.com' || user.role === 'ADMIN'); 

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        
        {/* LOGO */}
        <Link to="/" className="text-2xl font-extrabold text-indigo-600 tracking-wide">
          Select.
        </Link>

        {/* SEARCH BAR (Hidden on mobile) */}
        <div className="hidden md:flex items-center flex-1 mx-10 max-w-lg">
           <form action="/" className="flex w-full border rounded-full overflow-hidden shadow-sm hover:shadow-md transition">
               <input 
                 name="search" 
                 type="text" 
                 placeholder="Search for templates, ebooks..." 
                 className="w-full px-4 py-2 outline-none text-gray-600"
               />
               <button type="submit" className="bg-indigo-600 text-white px-6 font-medium hover:bg-indigo-700">
                 Search
               </button>
           </form>
        </div>

        {/* RIGHT SIDE MENU */}
        <div className="flex items-center space-x-6">
          
          {/* Categories Dropdown */}
          <div className="relative group cursor-pointer hidden sm:block">
            <span className="text-gray-600 hover:text-indigo-600 font-medium">Categories ▾</span>
            <div className="absolute top-full right-0 mt-2 w-48 bg-white border rounded shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                <Link to="/?category=E-books" className="block px-4 py-2 hover:bg-gray-50 text-gray-700">E-books</Link>
                <Link to="/?category=Software" className="block px-4 py-2 hover:bg-gray-50 text-gray-700">Software</Link>
                <Link to="/?category=Templates" className="block px-4 py-2 hover:bg-gray-50 text-gray-700">Templates</Link>
            </div>
          </div>

          {/* CART ICON */}
          <Link to="/cart" className="relative text-gray-600 hover:text-indigo-600 transition">
            <span className="font-medium">Cart</span>
            {cart.length > 0 && (
              <span className="absolute -top-2 -right-3 bg-red-500 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full">
                {cart.length}
              </span>
            )}
          </Link>

          {/* --- 2. CONDITIONAL ADMIN LINK --- */}
          {isAdmin && (
            <Link to="/admin" className="px-4 py-1 border border-indigo-100 bg-indigo-50 rounded hover:bg-indigo-100 text-sm font-bold text-indigo-700">
              Admin Panel
            </Link>
          )}

          {/* USER SECTION */}
          {user ? (
             <div className="flex items-center space-x-4 pl-4 border-l border-gray-300">
               <span className="text-gray-800 font-bold hidden lg:block">Hi, {user.name}</span>
               
               <Link to="/purchases" className="text-sm font-bold text-indigo-600 hover:underline">
                  My Orders
               </Link>

               <button 
                 onClick={handleLogout} 
                 className="text-red-500 text-sm font-semibold hover:text-red-700 transition"
               >
                 Logout
               </button>
             </div>
          ) : (
            <Link to="/login" className="bg-indigo-600 text-white px-5 py-2 rounded-full font-bold hover:bg-indigo-700 transition shadow-md">
              Login
            </Link>
          )}

        </div>
      </div>
    </nav>
  );
};

export default Navbar;