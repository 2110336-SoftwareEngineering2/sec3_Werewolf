import axios from 'axios';

// Job API
export const customer = axios.create({
  baseURL: '/api/customer',
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${localStorage.getItem('token') || ''}`,
    secret: process.env.REACT_APP_SECRET || 'secret',
  },
});

export const fetchCustomerAllJobs = () => {
  return customer.get('/jobs');
};
