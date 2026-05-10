import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import AddProduct from './pages/AddProduct';
import ThankYou from './pages/ThankYou';
import Cart from './pages/Cart';
import Login from './pages/Login';
import Signup from './pages/Signup'; 
import AdminDashboard from './pages/AdminDashboard';
import EditProduct from './pages/EditProduct';
import ProductDetails from './pages/ProductDetails';
import ManageCategories from './pages/ManageCategories';
import PurchaseHistory from './pages/PurchaseHistory'; 
import ProtectedRoute from './components/ProtectedRoute'; 

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <BrowserRouter>
          <div className="flex flex-col min-h-screen bg-gray-50">
            <Navbar />
            <main className="flex-grow">
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<Home />} />
                <Route path="/product/:id" element={<ProductDetails />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/register" element={<Signup />} /> 
                <Route path="/thank-you" element={<ThankYou />} />

                {/* User Protected Routes */}
                {/* FIX: Map BOTH to PurchaseHistory to fix Screenshot 143929.png */}
                <Route path="/my-orders" element={<ProtectedRoute><PurchaseHistory /></ProtectedRoute>} />
                <Route path="/purchases" element={<ProtectedRoute><PurchaseHistory /></ProtectedRoute>} />

                {/* Admin Protected Routes */}
                <Route path="/admin" element={<ProtectedRoute adminOnly={true}><AdminDashboard /></ProtectedRoute>} />
                <Route path="/admin/add" element={<ProtectedRoute adminOnly={true}><AddProduct /></ProtectedRoute>} />
                <Route path="/admin/edit/:id" element={<ProtectedRoute adminOnly={true}><EditProduct /></ProtectedRoute>} />
                <Route path="/admin/categories" element={<ProtectedRoute adminOnly={true}><ManageCategories /></ProtectedRoute>} />
              </Routes>
            </main>
            <Footer />
          </div>
        </BrowserRouter>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;