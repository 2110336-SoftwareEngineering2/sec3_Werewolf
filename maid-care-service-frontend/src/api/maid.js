import axios from 'axios';

// User API
export const maid = axios.create({
  baseURL: '/api/maids',
  headers: {
    'Content-Type': 'application/json',
  },
});

maid.interceptors.request.use(
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
export const fetchMaidById = async (uid) => {
  return maid.get(`/${uid}`);
};

export const setAvailability = async (status) => {
  return maid.put(`/availability/${status}`)
}