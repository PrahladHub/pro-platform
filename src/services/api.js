const API_URL = 'http://localhost:5000/api';

// =====================================================
// HELPER FUNCTION
// =====================================================

const apiCall = async (
  endpoint,
  method = 'GET',
  data = null,
  storeSlug = null
) => {
  const options = {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
  };

  const token = localStorage.getItem('token');

  if (token) {
    options.headers.Authorization = `Bearer ${token}`;
  }

  if (storeSlug) {
    options.headers['x-store-slug'] = storeSlug;
  }

  if (data !== null) {
    options.body = JSON.stringify(data);
  }

  const response = await fetch(`${API_URL}${endpoint}`, options);

  let result;

  try {
    result = await response.json();
  } catch {
    throw new Error('Server returned an invalid response');
  }

  if (!response.ok) {
    throw new Error(
      result.message ||
        result.error ||
        'Something went wrong'
    );
  }

  return result;
};

// =====================================================
// AUTH APIs
// =====================================================

export const authAPI = {
  signup: (userData) =>
    apiCall('/auth/signup', 'POST', userData),

  login: (credentials) =>
    apiCall('/auth/login', 'POST', credentials),
};

// =====================================================
// PRODUCT APIs
// =====================================================

export const productAPI = {
  getStoreProducts: (storeSlug) =>
    apiCall('/products', 'GET', null, storeSlug),

  getProduct: (id) =>
    apiCall(`/products/${id}`, 'GET'),

  createProduct: (data) =>
    apiCall('/products', 'POST', data),

  updateProduct: (id, data) =>
    apiCall(`/products/${id}`, 'PUT', data),

  deleteProduct: (id) =>
    apiCall(`/products/${id}`, 'DELETE'),
};

// =====================================================
// ORDER APIs
// =====================================================

export const orderAPI = {
  createOrder: (data, storeSlug) =>
    apiCall('/orders', 'POST', data, storeSlug),

  getOrders: () =>
    apiCall('/orders', 'GET'),

  getOrder: (id) =>
    apiCall(`/orders/${id}`, 'GET'),

  updateOrderStatus: (id, status) =>
    apiCall(`/orders/${id}`, 'PUT', { status }),
};

// =====================================================
// WEBSITE APIs
// =====================================================

export const websiteAPI = {
  getAll: () =>
    apiCall('/websites', 'GET'),

  getOne: (id) =>
    apiCall(`/websites/${id}`, 'GET'),

  create: (data) =>
    apiCall('/websites', 'POST', data),

  update: (id, data) =>
    apiCall(`/websites/${id}`, 'PUT', data),

  publish: (id) =>
    apiCall(`/websites/${id}/publish`, 'PUT'),

  unpublish: (id) =>
    apiCall(`/websites/${id}/unpublish`, 'PUT'),

  delete: (id) =>
    apiCall(`/websites/${id}`, 'DELETE'),
};

// =====================================================
// UPLOAD API
// =====================================================

export const uploadAPI = {
  uploadImage: async (file) => {
    const formData = new FormData();

    formData.append('image', file);

    const token = localStorage.getItem('token');

    const response = await fetch(
      `${API_URL}/upload`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      }
    );

    let result;

    try {
      result = await response.json();
    } catch {
      throw new Error('Server returned an invalid response');
    }

    if (!response.ok) {
      throw new Error(
        result.message ||
          result.error ||
          'Image upload failed'
      );
    }

    return result;
  },
};

// =====================================================
// SUBSCRIPTION APIs
// =====================================================

export const subscriptionAPI = {
  getPlans: () =>
    apiCall('/subscriptions/plans', 'GET'),

  getCurrent: () =>
    apiCall('/subscriptions/current', 'GET'),

  getPaymentInfo: () =>
    apiCall('/subscriptions/payment-info', 'GET'),

  getMy: () =>
    apiCall('/subscriptions/my', 'GET'),

  submit: (data) =>
    apiCall('/subscriptions/submit', 'POST', data),
};

// =====================================================
// ADMIN APIs
// =====================================================

export const adminAPI = {
  getStats: () =>
    apiCall('/admin/stats', 'GET'),

  getStores: () =>
    apiCall('/admin/stores', 'GET'),

  getUsers: () =>
    apiCall('/admin/users', 'GET'),

  getOrders: () =>
    apiCall('/admin/orders', 'GET'),

  getSubscriptions: () =>
    apiCall('/admin/subscriptions', 'GET'),

  approveSubscription: (id) =>
    apiCall(
      `/admin/subscriptions/${id}/approve`,
      'PUT'
    ),

  rejectSubscription: (id) =>
    apiCall(
      `/admin/subscriptions/${id}/reject`,
      'PUT'
    ),
};

// =====================================================
// DEFAULT API CALL
// =====================================================

export default apiCall;