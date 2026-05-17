import apiClient from './apiService';

const getCurrentUser = () => {
  const storedUser = localStorage.getItem('user');
  return storedUser ? JSON.parse(storedUser) : null;
};

export const uploadAvatar = async (file) => {
  try {
    const user = getCurrentUser();
    if (!user) {
      return { success: false, message: 'User not authenticated' };
    }

    const formData = new FormData();
    formData.append('avatar', file);
    formData.append('userId', user._id);

    const response = await apiClient.post('/upload-avatar', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });

    return response.data;
  } catch (error) {
    return error.response?.data || { success: false, message: 'Failed to upload avatar' };
  }
};

export const getAvatar = async () => {
  try {
    const user = getCurrentUser();
    if (!user) {
      return { success: false, message: 'User not authenticated' };
    }

    const response = await apiClient.get('/avatar', {
      params: { userId: user._id }
    });
    return response.data;
  } catch (error) {
    return error.response?.data || { success: false, message: 'Failed to fetch avatar' };
  }
};
