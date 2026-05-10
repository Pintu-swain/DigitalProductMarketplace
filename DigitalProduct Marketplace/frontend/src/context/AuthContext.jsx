import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Check Local Storage when app loads
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        // Try parsing it as an object (Correct way)
        setUser(JSON.parse(storedUser));
      } catch (e) {
        // If it was saved as a plain string (Old/Wrong way), clear it
        localStorage.removeItem("user");
        setUser(null);
      }
    }
  }, []);

  const login = (userData) => {
    // SAVE THE FULL OBJECT: { name: "...", email: "...", role: "..." }
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    // Also clear cart if you want
    localStorage.removeItem("cart"); 
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);