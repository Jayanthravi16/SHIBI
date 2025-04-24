import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';

const Navbar = () => {
  const location = useLocation();
  const token = localStorage.getItem('token');

  const isActive = (path) => {
    return location.pathname === path ? 'bg-primary/20 text-primary' : 'text-gray-300 hover:text-primary';
  };

  return (
    <nav className="bg-gray-900 border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="group">
              <motion.span
                className="text-2xl font-bold bg-gradient-to-r from-blue-400 via-indigo-500 to-purple-500 bg-clip-text text-transparent"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Shibi
              </motion.span>
              <span className="block h-0.5 w-0 bg-gradient-to-r from-blue-400 via-indigo-500 to-purple-500 transition-all duration-300 group-hover:w-full"></span>
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            {token ? (
              <>
                <Link
                  to="/topics"
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${isActive('/topics')}`}
                >
                  Topics
                </Link>
                <Link
                  to="/profile"
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${isActive('/profile')}`}
                >
                  Profile
                </Link>
                <button
                  onClick={() => {
                    localStorage.removeItem('token');
                    localStorage.removeItem('user');
                    window.location.href = '/';
                  }}
                  className="px-3 py-2 rounded-md text-sm font-medium text-gray-300 hover:text-primary transition-colors duration-200"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${isActive('/login')}`}
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${isActive('/register')}`}
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 