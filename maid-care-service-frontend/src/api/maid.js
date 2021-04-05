import axios from 'axios';

// Maid API
export const maid = axios.create({
    baseURL: '/api/maids',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  
  maid.interceptors.request.use(
    config => {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
        config.headers['secret'] = process.env.REACT_APP_SECRET;
      }
      console.log('interceptor conf', config);
      return config;
    },
    error => {
      console.log('intercaptor err', error);
      throw error;
    }
  );