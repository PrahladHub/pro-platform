// API Configuration - LIVE BACKEND
const API_URL = 'https://pro-platform-backend.onrender.com/api';

// Helper function for API calls
const apiCall = async (endpoint, method = 'GET', data = null) => {
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

export default apiCall;