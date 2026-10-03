// API Configuration - LIVE BACKEND
const API_URL = 'https://pro-platform-backend.onrender.com/api';

// Helper function for API calls
const apiCall = async (endpoint, method = 'GET', data = null, storeSlug = null) => {
  const options = {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
  };

  // Add token if exists
  const token = localStorage.getItem('token');
  if (token) {
    options.headers.Authorization = `Bearer ${token}`;
  }

  // Add store slug header if provided
  if (storeSlug) {
    options.headers['x-store-slug'] = storeSlug;
  }

  // Add body if data exists
  if (data) {
    options.body = JSON.stringify(data);
  }

  try {
    const response = await fetch(`${API_URL}${endpoint}`, options);
    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || 'Something went wrong');
    }

    return result;
  } catch (error) {
    throw error;
  }
};

// Auth APIs
export const authAPI = {
  signup: (userData) => apiCall('/auth/signup', 'POST', userData),
  login: (credentials) => apiCall('/auth/login', 'POST', credentials),
};

// Product APIs
export const productAPI = {
  getStoreProducts: (storeSlug) => apiCall('/products', 'GET', null, storeSlug),
  getProduct: (id) => apiCall(`/products/${id}`, 'GET'),
  createProduct: (data) => apiCall('/products', 'POST', data),
  updateProduct: (id, data) => apiCall(`/products/${id}`, 'PUT', data),
  deleteProduct: (id) => apiCall(`/products/${id}`, 'DELETE'),
};

// Upload API
export const uploadAPI = {
  uploadImage: async (file) => {
    const formData = new FormData();
    formData.append('image', file);

    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/upload`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    const result = await response.json();
    if (!response.ok) throw new Error(result.message);
    return result;
  },
};

export default apiCall;