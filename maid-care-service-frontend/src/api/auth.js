import axios from 'axios';
import axiosRetry from 'axios-retry';

// Authentication api
export const auth = axios.create({
  baseURL: '/api/auth',
  headers: { 'Content-Type': 'application/json' },
});

auth.interceptors.request.use(
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

/**
 * login user by email and password
 * @param {Object} {email, password} email and password
 * @returns {Promise} response token
 */
export const login = async ({ email, password }) => {
  return auth.post('login', { email, password });
};

/**
 * fetch user by jwt token in local storage
 * @returns Promise
 */
export const fetchCurrentUser = async () => {
  axiosRetry(auth, { retries: 3 });
  return auth.get('/user');
};

