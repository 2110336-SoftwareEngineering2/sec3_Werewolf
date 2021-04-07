import axios from 'axios';

// Workspace api
export const refund = axios.create({
  baseURL: '/api/refund',
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${localStorage.getItem('token') || ''}`,
    secret: process.env.REACT_APP_SECRET,
  },
});

refund.interceptors.request.use(
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
