import axios from 'axios';

// Job API
export const job = axios.create({
  baseURL: '/api/job',
  headers: {
    'Content-Type': 'application/json',
  },
});

job.interceptors.request.use(
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

export const fetchJobById = async (id) => {
  return job.get(`/${id}`);
};

export const fetchJobsByMaidId = async (mid) => {
  return job.get(`/maid/${mid}`);
};

export const createJob = async ({ workpalceId, work, promtionCode = null }) => {
  return job.post('/', {
    workpalceId,
    work,
    promtionCode,
  });
};

export const uploadImageURL = async ({ jobId, url }) => {
  return job.post('/photo', {
    jobId,
    url,
  });
};

export const deleteImageURL = async ({ jobId, url }) => {
  return job.delete(`/photo/${url}`, {
    jobId,
    url,
  });
};
