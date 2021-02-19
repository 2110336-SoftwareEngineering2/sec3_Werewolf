import axios from 'axios';
import { baseURL } from './baseURL';

const auth = axios.create({
  baseURL: baseURL + '/auth', // use proxy for baseURL
  headers: { 'Content-Type': 'application/json' },
});

auth.interceptors.request.use(
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

export { auth };
