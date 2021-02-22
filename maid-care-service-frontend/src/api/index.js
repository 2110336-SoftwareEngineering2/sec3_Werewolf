import axios from 'axios';

axios.interceptors.request.use(config => {
  // enable cors
  config.headers['Access-Control-Allow-Origin'] = '*';
  return config;
});

const auth = axios.create({
  baseURL: '/api/auth',
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
