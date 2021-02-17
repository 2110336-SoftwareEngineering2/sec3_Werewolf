import axios from 'axios';
import { baseURL } from '../baseURL';

axios.interceptors.response.use(
  response => {
    return response;
  },
  error => {
    console.log(error);
    if (error.response.status === 401) {
      throw new Error(401);
    }
    return error;
  }
);

const auth = axios.create({
  baseURL: baseURL + '/auth', // use proxy for baseURL
  headers: { 'Content-Type': 'application/json' },
});

export { auth };
