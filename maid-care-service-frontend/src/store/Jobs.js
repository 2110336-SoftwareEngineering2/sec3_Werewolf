import { action, makeAutoObservable, observable } from 'mobx';
import { job as JobAPI } from '../api';

class JobsStore {
  jobs = [];
  currentJob = null;
  loading = false;
  error = false;

  constructor() {
    makeAutoObservable(this, {
      jobs: observable,
      currentJob: observable,
      fetchAllJobs: action,
      accept: action,
      reject: action,
    });
  }

  async fetchAllJobs(uid) {
    this.loading = true;
    this.error = false;
    return JobAPI.get(`/maid/${uid}`)
      .then((response) => {
        const { data: jobs } = response;
        this.jobs = jobs;
        this.loading = false;
      })
      .catch((error) => {
        console.error(error);
        this.error = error;
        this.loading = false;
        throw error;
      });
  }

  async accept({ jobId }) {
    this.loading = true;
    this.error = false;
    return JobAPI.put(`/${jobId}/accept`)
      .then((response) => {
        this.currentJob = response.data;
        this.loading = false;
      })
      .catch((error) => {
        console.error(error);
        this.error = error;
        this.loading = false;
        throw error;
      })
      .finally(() => {
        this.fetchAllJobs();
      });
  }

  async reject({ jobId }) {
    this.loading = true;
    this.error = false;
    return JobAPI.put(`/${jobId}/reject`)
      .then((response) => {
        this.currentJob = null;
        this.loading = false;
      })
      .catch((error) => {
        console.error(error);
        this.error = error;
        this.loading = false;
        throw error;
      })
      .finally(() => {
        this.fetchAllJobs();
      });
  }
}

export default JobsStore;
