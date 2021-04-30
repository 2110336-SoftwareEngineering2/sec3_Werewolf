import axios from 'axios';

// User API
export const user = axios.create({
  baseURL: '/api/users',
  headers: {
    'Content-Type': 'application/json',
  },
});

user.interceptors.request.use(
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
 *
 * @param {string} uid user id
 * @returns {Promise} Promise response user data
 */
export const fetchUserById = async (uid) => {
  return user.get(`/${uid}`);
};
