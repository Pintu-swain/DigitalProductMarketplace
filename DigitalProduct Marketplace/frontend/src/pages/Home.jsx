import React, { useEffect, useState } from 'react';
import api from '../services/api'; 
import ProductCard from '../components/ProductCard';
import { useSearchParams, Link } from 'react-router-dom';

function Home() {
  const [products, setProducts] = useState([]);
  const [searchParams] = useSearchParams(); 

  // Pagination State
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const searchQuery = searchParams.get('search');   
  const categoryQuery = searchParams.get('category'); 

  // Reset page to 0 when search/category changes
  useEffect(() => {
    setCurrentPage(0);
  }, [searchQuery, categoryQuery]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        let response;
        
        // Define params including page number
        const params = {
          page: currentPage,
          size: 8 // Must match backend default or be custom
        };

        if (searchQuery) {
          response = await api.get(`/products/search?q=${searchQuery}`, { params });
        } else if (categoryQuery) {
          response = await api.get(`/products/category?cat=${categoryQuery}`, { params });
        } else {
          // Use the new /home endpoint for pagination
          response = await api.get('/products/home', { params });
        }
        
        // Backend now returns a Page object: { content: [...], totalPages: X, ... }
        setProducts(response.data.content);
        setTotalPages(response.data.totalPages);

      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, [searchQuery, categoryQuery, currentPage]); 

  const getPageTitle = () => {
    if (searchQuery) return `Search Results for "${searchQuery}"`;
    if (categoryQuery) return `${categoryQuery} Products`;
    return "Latest Digital Products";
  };

  // Pagination Button Handler
  const handlePageChange = (newPage) => {
    if (newPage >= 0 && newPage < totalPages) {
      setCurrentPage(newPage);
      window.scrollTo(0, 0); // Scroll to top when page changes
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex justify-between items-end mb-6 border-b pb-4">
        <h2 className="text-3xl font-bold text-gray-800">{getPageTitle()}</h2>
        {(searchQuery || categoryQuery) && (
            <Link to="/" className="text-indigo-600 font-semibold hover:underline">
                Clear Filters
            </Link>
        )}
      </div>
      
      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 min-h-[400px]">
        {products.length > 0 ? (
          products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))
        ) : (
          <div className="col-span-full text-center py-20 bg-gray-50 rounded-lg">
            <p className="text-gray-500 text-xl font-medium">No products found.</p>
            <Link to="/" className="inline-block mt-4 bg-indigo-600 text-white px-6 py-2 rounded hover:bg-indigo-700 transition">
                View All Products
            </Link>
          </div>
        )}
      </div>

      {/* PAGINATION CONTROLS - Only show if we have pages */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center mt-10 space-x-2">
          
          {/* Previous Button */}
          <button 
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 0}
            className={`px-4 py-2 rounded border ${currentPage === 0 ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white text-indigo-600 hover:bg-indigo-50 border-indigo-600'}`}
          >
            Previous
          </button>

          {/* Page Numbers */}
          <span className="text-gray-600 font-medium px-4">
            Page {currentPage + 1} of {totalPages}
          </span>

          {/* Next Button */}
          <button 
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages - 1}
            className={`px-4 py-2 rounded border ${currentPage === totalPages - 1 ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white text-indigo-600 hover:bg-indigo-50 border-indigo-600'}`}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}

export default Home;