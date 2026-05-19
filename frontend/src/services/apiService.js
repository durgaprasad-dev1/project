import axios from 'axios';

export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3700';

const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

const getCurrentUser = () => {
  const storedUser = localStorage.getItem('user');
  return storedUser ? JSON.parse(storedUser) : null;
};

// ============ AUTHENTICATION SERVICES ============

export const signup = async (name, email, password, confirmPassword) => {
  try {
    const response = await apiClient.post('/register', {
      name,
      email,
      password,
      confirmPassword
    });
    return response.data;
  } catch (error) {
    return error.response?.data || { success: false, message: 'Signup failed' };
  }
};

export const login = async (email, password) => {
  try {
    const response = await apiClient.post('/login', {
      email,
      password
    });
    return response.data;
  } catch (error) {
    return error.response?.data || { success: false, message: 'Login failed' };
  }
};

// ============ WEBSITE SERVICES ============

export const getWebsites = async () => {
  try {
    const user = getCurrentUser();
    if (!user) {
      return { success: false, message: 'User not authenticated' };
    }

    const response = await apiClient.get('/getmonitors', {
      params: { userId: user._id }
    });
    return response.data;
  } catch (error) {
    return error.response?.data || { success: false, message: 'Failed to fetch websites' };
  }
};

export const addWebsite = async (websiteName, websiteURL, frequency, keyword, userId) => {
  try {
    const response = await apiClient.post('/addmonitor', {
      userId,
      websiteName,
      websiteURL,
      frequency,
      keyword
    });
    return response.data;
  } catch (error) {
    return error.response?.data || { success: false, message: 'Failed to add website' };
  }
};

export const resumeUserMonitors = async (userId) => {
  try {
    const response = await apiClient.post('/resumeusermonitors', { userId });
    return response.data;
  } catch (error) {
    return error.response?.data || { success: false, message: 'Failed to resume monitors' };
  }
};

export const updateWebsite = async (id, status) => {
  try {
    const response = await apiClient.put(`/updatemonitor`, {
      id,
      status
    });
    return response.data;

  } catch (error) {
    return error.response?.data || { success: false, message: 'Failed to update website' };
  }
};

export const deleteWebsite = async (id) => {
  try {
    const response = await apiClient.delete(`/deletemonitor/?id=${id}`);
    return response.data;
  } catch (error) {
    return error.response?.data || { success: false, message: 'Failed to delete website' };
  }
};

export const getDashboardStats = async () => {
  try {
    const user = getCurrentUser();
    if (!user) {
      return { success: false, message: 'User not authenticated' };
    }

    const response = await apiClient.get('/dashboard', {
      params: { userId: user._id }
    });
    return response.data;
  } catch (error) {
    return error.response?.data || { success: false, message: 'Failed to fetch stats' };
  }
};

export default apiClient;
