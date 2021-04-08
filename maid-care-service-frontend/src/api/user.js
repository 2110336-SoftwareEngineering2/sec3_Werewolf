import axios from 'axios';

// User API
export const user = axios.create({
  baseURL: '/api/users',
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${localStorage.getItem('token')}`,
    secret: process.env.REACT_APP_SECRET || 'secret',
  },
});

/**
 *
 * @param {string} uid user id
 * @returns {Promise} Promise response user data
 */
export const fetchUserById = async (uid) => {
  return user.get(`/${uid}`);
};
