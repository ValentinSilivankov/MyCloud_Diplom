import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  withCredentials: true,
});


api.interceptors.request.use(async (config) => {
  if (!['get', 'head', 'options'].includes(config.method?.toLowerCase() ?? '')) {
    try {
      const response = await axios.get('/api/csrf/', {
        withCredentials: true,
      });
      config.headers['X-CSRFToken'] = response.data.csrfToken;
    } catch (error) {
      console.error('Failed to get CSRF token:', error);
    }
  }
  return config;
});

export default api;