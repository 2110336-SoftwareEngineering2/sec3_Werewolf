import axios from 'axios';

// Job API
export const job = axios.create({
  baseURL: '/api/job',
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${localStorage.getItem('token') || ''}`,
    secret: process.env.REACT_APP_SECRET || 'secret',
  },
});

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
