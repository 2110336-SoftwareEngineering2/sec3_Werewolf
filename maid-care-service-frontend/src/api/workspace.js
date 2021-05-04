import axios from 'axios';

// Workspace api
export const workspace = axios.create({
  baseURL: '/api/workspaces',
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${localStorage.getItem('token') || ''}`,
    secret: process.env.REACT_APP_SECRET,
  },
});
