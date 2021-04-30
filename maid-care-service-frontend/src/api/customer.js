import axios from 'axios';

// Job API
export const customer = axios.create({
  baseURL: '/api/customer',
  headers: {
    'Content-Type': 'application/json',
  },
});

customer.interceptors.request.use(
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

export const fetchCustomerAllJobs = () => {
  return customer.get('/jobs');
};
