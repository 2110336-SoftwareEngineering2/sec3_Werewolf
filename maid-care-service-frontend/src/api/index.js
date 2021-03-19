import axios from 'axios';

// use cors
axios.interceptors.request.use(config => {
  // enable cors
  config.headers['Access-Control-Allow-Origin'] = '*';
  return config;
});

// Authentication api
const auth = axios.create({
  baseURL: '/api/auth',
  headers: { 'Content-Type': 'application/json' },
});

auth.interceptors.request.use(
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

// Workspace api
const workspace = axios.create({
  baseURL: '/api/workspaces',
  headers: { 'Content-Type': 'application/json' },
});

workspace.interceptors.request.use(
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



export { auth, workspace };
// Promotion API
const promotion = axios.create({
  baseURL: '/api/promotion',
  headers: {
    'Content-Type': 'application/json',
  },
});

promotion.interceptors.request.use(
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
export { job };
