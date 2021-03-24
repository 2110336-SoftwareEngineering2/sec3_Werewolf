import axios from 'axios';

// User API
export const maid = axios.create({
  baseURL: '/api/maids',
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${localStorage.getItem('token') || ''}`,
    secret: process.env.REACT_APP_SECRET || 'secret',
  },
});

/**
 *
 * @param {string} uid user id
 * @returns {Promise} Promise response user data
 */
export const fetchMaidById = async (uid) => {
  return maid.get(`/${uid}`);
};