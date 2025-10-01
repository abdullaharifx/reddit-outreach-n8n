import axios from 'axios';
import toast from 'react-hot-toast';

const BASE_URL = process.env.REACT_APP_N8N_BASE_URL;
const API_KEY = process.env.REACT_APP_N8N_API_KEY;

// Create axios instance with default config
const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'X-API-Key': API_KEY,
  },
  timeout: 10000, // 10 second timeout
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.message || 'An error occurred';
    
    if (error.response?.status === 401) {
      localStorage.removeItem('authToken');
      window.location.href = '/login';
      toast.error('Session expired. Please login again.');
    } else if (error.response?.status >= 500) {
      toast.error('Server error. Please try again later.');
    } else {
      toast.error(message);
    }
    
    return Promise.reject(error);
  }
);

// Retry logic
const retryRequest = async (fn, retries = 3) => {
  try {
    return await fn();
  } catch (error) {
    if (retries > 0 && error.response?.status >= 500) {
      await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1 second
      return retryRequest(fn, retries - 1);
    }
    throw error;
  }
};

// Authentication API
export const authAPI = {
  login: (credentials) => retryRequest(() => api.post('/', { 
    action: 'login',
    ...credentials 
  })),
};

// Products API
export const productsAPI = {
  getAll: () => retryRequest(() => api.post('/', { action: 'getProducts' })),
  create: (product) => retryRequest(() => api.post('/', { 
    action: 'createProduct',
    ...product 
  })),
  update: (id, product) => retryRequest(() => api.post('/', { 
    action: 'updateProduct',
    id,
    ...product 
  })),
  delete: (id) => retryRequest(() => api.post('/', { 
    action: 'deleteProduct',
    id 
  })),
};

// Comments API
export const commentsAPI = {
  getPending: () => retryRequest(() => api.post('/', { action: 'getPendingComments' })),
  approve: (id, editedComment = null) => retryRequest(() => 
    api.post('/', { 
      action: 'approveComment',
      id, 
      editedComment 
    })
  ),
  reject: (id, reason = '') => retryRequest(() => 
    api.post('/', { 
      action: 'rejectComment',
      id, 
      reason 
    })
  ),
};

// Analytics API
export const analyticsAPI = {
  getEngagement: (dateRange) => retryRequest(() => 
    api.post('/', { 
      action: 'getAnalytics',
      type: 'engagement',
      dateRange 
    })
  ),
  getTraffic: (dateRange) => retryRequest(() => 
    api.post('/', { 
      action: 'getAnalytics',
      type: 'traffic',
      dateRange 
    })
  ),
  getConversions: (dateRange) => retryRequest(() => 
    api.post('/', { 
      action: 'getAnalytics',
      type: 'conversions',
      dateRange 
    })
  ),
  getPerformance: (dateRange) => retryRequest(() => 
    api.post('/', { 
      action: 'getAnalytics',
      type: 'performance',
      dateRange 
    })
  ),
};

// Settings API
export const settingsAPI = {
  get: () => retryRequest(() => api.post('/', { action: 'getSettings' })),
  update: (settings) => retryRequest(() => api.post('/', { 
    action: 'updateSettings',
    ...settings 
  })),
};

export default api;