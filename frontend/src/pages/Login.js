import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';

const GOOGLE_CLIENT_ID = '669629705758-mlhd4a7fn3jsav227se1flsu2v38stac.apps.googleusercontent.com';

const Login = () => {
  const navigate = useNavigate();
  const [isGoogleLoaded, setIsGoogleLoaded] = useState(false);
  const [error, setError] = useState(null);
  const [isManualLogin, setIsManualLogin] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const handleGoogleLogin = async () => {
    try {
      if (!isGoogleLoaded) {
        setError('Google Sign-In is not ready yet. Please try again in a moment.');
        return;
      }

      const auth2 = window.gapi.auth2.getAuthInstance();
      const googleUser = await auth2.signIn({
        scope: 'email profile'
      });
      const token = googleUser.getAuthResponse().id_token;

      const response = await axios.post('http://localhost:5000/api/auth/google', { token });
      
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      
      navigate('/topics');
    } catch (error) {
      console.error('Login error:', error);
      if (error.message?.includes('Tracking Prevention')) {
        setError('Please allow cookies and tracking for Google Sign-In to work properly.');
      } else if (error.error === 'popup_closed_by_user') {
        setError('Sign-in was cancelled. Please try again.');
      } else {
        setError(error.response?.data?.message || 'Failed to sign in with Google. Please try again.');
      }
    }
  };

  const handleManualLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', formData);
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      navigate('/topics');
    } catch (error) {
      if (error.response?.status === 401) {
        if (error.response?.data?.message?.toLowerCase().includes('password')) {
          setError('Incorrect password. Please try again.');
        } else if (error.response?.data?.message?.toLowerCase().includes('user')) {
          setError('No account found with this email. Please check your email or register.');
        } else {
          setError('Invalid email or password. Please try again.');
        }
      } else {
        setError('An error occurred. Please try again later.');
      }
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  useEffect(() => {
    const initializeGoogleAuth = () => {
      if (window.gapi) {
        window.gapi.load('auth2', () => {
          window.gapi.auth2.init({
            client_id: GOOGLE_CLIENT_ID,
            scope: 'email profile',
            ux_mode: 'popup',
            redirect_uri: `${window.location.origin}/auth/google/callback`
          }).then(() => {
            setIsGoogleLoaded(true);
          }).catch((error) => {
            console.error('Google Auth initialization error:', error);
            if (error.message?.includes('Tracking Prevention')) {
              setError('Please allow cookies and tracking for Google Sign-In to work properly.');
            } else {
              setError('Failed to initialize Google Sign-In. Please try manual login.');
            }
          });
        });
      }
    };

    // Load Google API script
    const script = document.createElement('script');
    script.src = 'https://apis.google.com/js/platform.js';
    script.async = true;
    script.defer = true;
    script.onload = () => {
      setTimeout(initializeGoogleAuth, 1000);
    };
    script.onerror = () => {
      setError('Failed to load Google Sign-In. Please try manual login.');
    };
    document.body.appendChild(script);

    return () => {
      const script = document.querySelector('script[src="https://apis.google.com/js/platform.js"]');
      if (script) {
        script.remove();
      }
    };
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gray-900">
      <motion.div
        className="max-w-md w-full space-y-8 bg-gray-800 p-8 rounded-lg shadow-lg"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-white">
            Sign in to your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-400">
            Start your coding journey today
          </p>
        </div>
        {error && (
          <div className="bg-red-500/20 text-red-500 p-3 rounded-md text-center">
            {error}
          </div>
        )}
        <div className="mt-8 space-y-6">
          {!isManualLogin ? (
            <>
              <button
                onClick={handleGoogleLogin}
                disabled={!isGoogleLoaded}
                className={`w-full flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white ${
                  isGoogleLoaded ? 'bg-primary hover:bg-primary/90' : 'bg-gray-600 cursor-not-allowed'
                } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors duration-200`}
              >
                <img
                  className="h-5 w-5 mr-2"
                  src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
                  alt="Google logo"
                />
                {isGoogleLoaded ? 'Sign in with Google' : 'Loading...'}
              </button>
              <div className="text-center">
                <button
                  onClick={() => setIsManualLogin(true)}
                  className="text-primary hover:text-primary/80 transition-colors duration-200"
                >
                  Sign in with email and password
                </button>
              </div>
              <div className="text-center">
                <Link
                  to="/register"
                  className="text-primary hover:text-primary/80 transition-colors duration-200"
                >
                  Don't have an account? Register
                </Link>
              </div>
            </>
          ) : (
            <form onSubmit={handleManualLogin} className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-300">
                  Email address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleInputChange}
                  className="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="john@example.com"
                />
              </div>
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-300">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={formData.password}
                  onChange={handleInputChange}
                  className="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="••••••••"
                />
              </div>
              <div className="flex items-center justify-between">
                <button
                  type="submit"
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors duration-200"
                >
                  Sign in
                </button>
              </div>
              <div className="text-center space-y-4">
                <button
                  type="button"
                  onClick={() => setIsManualLogin(false)}
                  className="text-primary hover:text-primary/80 transition-colors duration-200"
                >
                  Back to Google Sign-in
                </button>
                <div>
                  <Link
                    to="/register"
                    className="text-primary hover:text-primary/80 transition-colors duration-200"
                  >
                    Don't have an account? Register
                  </Link>
                </div>
              </div>
            </form>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default Login; 