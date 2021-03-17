import axios from 'axios';

axios.interceptors.request.use((config) => {
  // enable cors
  config.headers['Access-Control-Allow-Origin'] = '*';
  return config;
});

const auth = axios.create({
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

// User API
const users = axios.create({
  baseURL: '/api/users',
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${localStorage.getItem('token') || ''}`,
    secret: process.env.REACT_APP_SECRET || 'secret',
  },
});

/**
 *
 * @param {string} uid
 * @returns Promise<user>
 */
export const fetchUserById = async (uid) => {
  return users.get(`/${uid}`);
};

// Promotion API
const promotion = axios.create({
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

// Job API
const job = axios.create({
  baseURL: '/api/job',
  headers: {
    'Content-Type': 'application/json',
  },
});

job.interceptors.request.use(
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

export { auth, promotion, job };
