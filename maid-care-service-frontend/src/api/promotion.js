import axios from 'axios';
// Promotion API
export const promotion = axios.create({
  baseURL: '/api/promotion',
  headers: {
    'Content-Type': 'application/json',
  },
});

promotion.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
      config.headers['secret'] = process.env.REACT_APP_SECRET;
    }
    console.log('interceptor conf', config);
    return config;
  },
  (error) => {
    console.log('intercaptor err', error);
    throw error;
  }
);
