import axios from 'axios';

// Workspace api
export const workspace = axios.create({
  baseURL: '/api/workspaces',
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${localStorage.getItem('token')}`,
    secret: process.env.REACT_APP_SECRET,
  },
});

workspace.interceptors.request.use(
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

export const fetchWorkspaceById = (wid) => {
  return workspace.get(`/${wid}`);
};
