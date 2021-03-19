import axios from 'axios';
import { login, fetchCurrentUser, registerMaid } from './auth';
import { workspace } from './workspace';
import { user, fetchUserById } from './user';
import { promotion } from './promotion';
import { job } from './job';
// use cors
axios.interceptors.request.use((config) => {
  // enable cors
  config.headers['Access-Control-Allow-Origin'] = '*';
  return config;
});

export { login, fetchCurrentUser, registerMaid };
export { user, fetchUserById };
export { workspace };
export { promotion };

const job = axios.create({
  baseURL: '/api/job',
  headers: {
    'Content-Type': 'application/json',
  },
});

job.interceptors.request.use(
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
export { postjob };
export { job };
