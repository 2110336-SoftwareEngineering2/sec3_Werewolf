import axios from 'axios';

// Workspace api
export const review = axios.create({
  baseURL: '/api/review',
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${localStorage.getItem('token') || ''}`,
    secret: process.env.REACT_APP_SECRET,
  },
});
