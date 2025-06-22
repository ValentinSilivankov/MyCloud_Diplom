import axios from 'axios';
// import { store } from '../redux/store';

const pendingRequests = new Map();

const api = axios.create({
  baseURL: '/api',
  withCredentials: true,
})

api.interceptors.request.use(async (config) => {
  const requestKey = `${config.method?.toUpperCase()}|${config.url}|${JSON.stringify(config.params)}|${JSON.stringify(config.data)}`;

  if (pendingRequests.has(requestKey)) {
    return Promise.reject(new axios.Cancel('Duplicate request blocked'));
  }

  pendingRequests.set(requestKey, true);

  const source = axios.CancelToken.source();
  config.cancelToken = source.token;


  if (!['GET', 'HEAD', 'OPTIONS'].includes(config.method?.toLowerCase() ?? '')) {
    try {
      const csrfResponse = await axios.get('/api/csrf/', { 
        withCredentials: true 
      });
      config.headers['X-CSRFToken'] = csrfResponse.data.csrfToken
    } catch (error) {
      pendingRequests.delete(requestKey);
      source.cancel('CSRF token request failed');
      return Promise.reject(error);
    }
  }
  return config
})

api.interceptors.response.use(
  (response) => {
    const requestKey = `${response.config.method?.toUpperCase()}|${response.config.url}|${JSON.stringify(response.config.params)}|${JSON.stringify(response.config.data)}`;
    pendingRequests.delete(requestKey);
    return response;
  },
  (error) => {
    if (axios.isCancel(error)) {
      console.log('Cancelled request:', error.message);
      return Promise.reject(error);
    }

    if (error.config?.cancelToken) {
      const requestKey = `${error.config.method?.toUpperCase()}|${error.config.url}|${JSON.stringify(error.config.params)}|${JSON.stringify(error.config.data)}`;
      pendingRequests.delete(requestKey);
    }

    if (error.response?.status === 401) {
      console.log('Authentication failed, redirecting to login...');
      window.location.href = '/login';
    }

    return Promise.reject(error);
  }
);

export default api