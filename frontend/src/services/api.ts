import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api',
  withCredentials: true,
});

// Отслеживаем только POST/PUT/PATCH/DELETE запросы
// const pendingRequests = new Set();

api.interceptors.request.use(async (config) => {
  // Исключаем CSRF и auth-запросы из проверки
  if (config.url?.includes('/csrf/') || 
      config.url?.includes('/login/') || 
      config.url?.includes('/logout/')) {
    return config;
  }

  // Для изменяющих методов добавляем CSRF
  if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(config.method?.toUpperCase() ?? '')) {
    const csrfToken = document.cookie
      .split('; ')
      .find(row => row.startsWith('csrftoken='))
      ?.split('=')[1];
      
    if (csrfToken) {
      config.headers['X-CSRFToken'] = csrfToken;
    }
  }

  return config;
});

api.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401 && !error.config.url.includes('/logout/')) {
      console.log('Redirecting to login due to 401 error');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;