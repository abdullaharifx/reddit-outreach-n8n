import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';
import { storage } from '../utils/helpers';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check for existing auth token on app start
    const token = storage.get('authToken');
    const userData = storage.get('userData');
    
    if (token && userData) {
      setUser(userData);
      setIsAuthenticated(true);
    }
    
    setLoading(false);
  }, []);

  const login = async (credentials) => {
    try {
      setLoading(true);
      
      // Demo mode - use these credentials for testing
      const demoCredentials = {
        username: 'demo',
        password: 'demo123'
      };
      
      // Check if demo credentials are used
      if (credentials.username === demoCredentials.username && 
          credentials.password === demoCredentials.password) {
        
        // Demo authentication
        const demoToken = 'demo-jwt-token-' + Date.now();
        const demoUser = {
          id: 1,
          username: 'demo',
          email: 'demo@example.com'
        };

        // Store auth data
        storage.set('authToken', demoToken);
        storage.set('userData', demoUser);
        localStorage.setItem('authToken', demoToken);

        setUser(demoUser);
        setIsAuthenticated(true);
        
        return { success: true };
      }
      
      // Try real API authentication
      const response = await authAPI.login(credentials);
      const { token, user: userData } = response.data;

      // Store auth data
      storage.set('authToken', token);
      storage.set('userData', userData);
      localStorage.setItem('authToken', token);

      setUser(userData);
      setIsAuthenticated(true);
      
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.message || 'Invalid credentials. For demo, use username: "demo" and password: "demo123"' 
      };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    storage.remove('authToken');
    storage.remove('userData');
    localStorage.removeItem('authToken');
    
    setUser(null);
    setIsAuthenticated(false);
  };

  const value = {
    user,
    isAuthenticated,
    loading,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};