import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem('user'));

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const isActive = (path) => {
    return location.pathname === path ? 'bg-primary/20 text-primary' : 'text-gray-300 hover:text-primary';
  };

  return (
    <>
      <nav className="bg-gray-800 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Link to="/" className="group">
                <span className="text-2xl font-bold bg-gradient-to-r from-primary to-blue-500 text-transparent bg-clip-text transition-all duration-300 group-hover:from-blue-500 group-hover:to-primary">
                  SHIBI
                </span>
                <span className="block h-0.5 w-0 bg-gradient-to-r from-primary to-blue-500 transition-all duration-300 group-hover:w-full"></span>
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              {user ? (
                <>
                  <Link
                    to="/topics"
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${isActive('/topics')}`}
                  >
                    Topics
                  </Link>
                  <Link
                    to="/profile"
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${isActive('/profile')}`}
                  >
                    Profile
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="px-4 py-2 text-sm font-medium text-gray-300 hover:text-primary transition-colors duration-200"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="px-4 py-2 text-sm font-medium text-gray-300 hover:text-primary transition-colors duration-200"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="px-4 py-2 text-sm font-medium text-gray-300 hover:text-primary transition-colors duration-200"
                  >
                    Register
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>
      {user && (
        <div className="bg-gray-900 py-2">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <p className="text-gray-300 text-sm">
              Welcome back, <span className="text-primary font-medium">{user.name}</span>
            </p>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar; 