import axios from 'axios';
// Promotion API
export const promotion = axios.create({
  baseURL: '/api/promotion',
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${localStorage.getItem('token')}`,
    secret: process.env.REACT_APP_SECRET || 'secret',
  },
});
