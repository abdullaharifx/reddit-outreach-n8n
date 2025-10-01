import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';
import toast from 'react-hot-toast';
import { Eye, EyeOff, LogIn } from 'lucide-react';

const Login = () => {
  const [credentials, setCredentials] = useState({
    username: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/dashboard';

  useEffect(() => {
    if (isAuthenticated) {
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, from]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCredentials(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!credentials.username || !credentials.password) {
      toast.error('Please fill in all fields');
      return;
    }

    setIsLoading(true);
    const result = await login(credentials);

    if (result.success) {
      toast.success('Login successful!');
      navigate(from, { replace: true });
    } else {
      toast.error(result.error);
    }
    
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="px-8 py-6">
          <div className="text-center mb-8">
            <div className="mx-auto w-16 h-16 bg-reddit-orange rounded-full flex items-center justify-center mb-4">
              <LogIn className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">
              Reddit Marketing Platform
            </h1>
            <p className="text-gray-600 mt-2">
              Sign in to manage your Reddit outreach campaigns
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
                Username
              </label>
              <input
                type="text"
                id="username"
                name="username"
                value={credentials.username}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-reddit-orange focus:border-reddit-orange"
                placeholder="Enter your username"
                required
                disabled={isLoading}
                autoComplete="username"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  value={credentials.password}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-reddit-orange focus:border-reddit-orange"
                  placeholder="Enter your password"
                  required
                  disabled={isLoading}
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={isLoading}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-gray-400" />
                  ) : (
                    <Eye className="h-4 w-4 text-gray-400" />
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-reddit-orange hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-reddit-orange disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
            >
              {isLoading ? (
                <LoadingSpinner size="sm" text="" />
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-xs text-gray-500">
              By signing in, you agree to our Terms of Service and Privacy Policy
            </p>
          </div>
        </div>

        <div className="px-8 py-4 bg-blue-50 border-t border-blue-200">
          <div className="text-center">
            <p className="text-sm font-medium text-blue-800 mb-2">Demo Credentials</p>
            <div className="text-xs text-blue-600 space-y-1">
              <p><span className="font-medium">Username:</span> demo</p>
              <p><span className="font-medium">Password:</span> demo123</p>
            </div>
          </div>
        </div>

        <div className="px-8 py-4 bg-gray-50 border-t border-gray-200">
          <div className="flex items-center justify-center space-x-2 text-sm text-gray-600">
            <span>Need help?</span>
            <button className="text-reddit-orange hover:text-orange-600 font-medium">
              Contact Support
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;