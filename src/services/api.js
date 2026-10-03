// API Configuration - LIVE BACKEND
const API_URL = 'https://pro-platform-backend.onrender.com/api';

const apiCall = async (endpoint, method = 'GET', data = null, storeSlug = null) => {
  const options = {
    method,
    headers: { 'Content-Type': 'application/json' },
  };

  const token = localStorage.getItem('token');
  if (token) options.headers.Authorization = `Bearer ${token}`;
  if (storeSlug) options.headers['x-store-slug'] = storeSlug;
  if (data) options.body = JSON.stringify(data);

  const response = await fetch(`${API_URL}${endpoint}`, options);
  const result = await response.json();

  if (!response.ok) throw new Error(result.message || 'Something went wrong');
  return result;
};

export const authAPI = {
  signup: (userData) => apiCall('/auth/signup', 'POST', userData),
  login: (credentials) => apiCall('/auth/login', 'POST', credentials),
};

export const productAPI = {
  getStoreProducts: (storeSlug) => apiCall('/products', 'GET', null, storeSlug),
  getProduct: (id) => apiCall(`/products/${id}`, 'GET'),
  createProduct: (data) => apiCall('/products', 'POST', data),
  updateProduct: (id, data) => apiCall(`/products/${id}`, 'PUT', data),
  deleteProduct: (id) => apiCall(`/products/${id}`, 'DELETE'),
};

export const uploadAPI = {
  uploadImage: async (file) => {
    const formData = new FormData();
    formData.append('image', file);
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/upload`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.message);
    return result;
  },
};

// Subscription APIs
export const subscriptionAPI = {
  getPlans: () => apiCall('/subscriptions/plans', 'GET'),
  getCurrent: () => apiCall('/subscriptions/current', 'GET'),
  getMy: () => apiCall('/subscriptions/my', 'GET'),
  submit: (data) => apiCall('/subscriptions/submit', 'POST', data),
};

export default apiCall;