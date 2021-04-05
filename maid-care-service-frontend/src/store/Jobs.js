import { action, makeAutoObservable, observable, toJS } from 'mobx';
import { job as JobAPI } from '../api';
import { CANCELED, CONFIRMED, DONE, MATCHED, POSTED, REVIEWED } from '../constants/post-state';

class JobsStore {
  jobs = [];
  currentJob = null;
  loading = false;
  error = false;

  constructor({ userStore }) {
    this.userStore = userStore;
    makeAutoObservable(this, {
      jobs: observable,
      currentJob: observable,
      fetchAllJobs: action,
      accept: action,
      reject: action,
      done: action,
      discard: action,
    });
  }

  async fetchAllJobs() {
    /** test state */
    // let test_state = CONFIRMED;

    this.loading = true;
    this.error = false;
    const user = this.userStore.userData;
    const uid = user._id;
    return JobAPI.get(`/maid/${uid}`)
      .then((response) => {
        const { data: jobs } = response;
        this.jobs = jobs;
        this.currentJob = this.getCurrentJobFromJobList({ jobs });
        this.loading = false;
      })
      .catch((error) => {
        console.error(error);
        this.error = error;
        this.loading = false;
        throw error;
      });
  }

  getCurrentJobFromJobList({ jobs }) {
    const filteredJobs = jobs.filter((job) => ![POSTED, REVIEWED, CANCELED].includes(job.state));
    if (filteredJobs.length <= 0) return null;
    return filteredJobs[0];
  }

  async accept({ jobId }) {
    this.loading = true;
    this.error = false;
    return JobAPI.put(`/${jobId}/accept`)
      .then((response) => {
        this.currentJob = response.data;
        this.loading = false;
        this.fetchAllJobs();
      })
      .catch((error) => {
        console.error(error);
        this.error = error;
        this.loading = false;
        throw error;
      });
  }

  async reject({ jobId }) {
    this.loading = true;
    this.error = false;
    return JobAPI.put(`/${jobId}/reject`)
      .then((response) => {
        this.currentJob = null;
        this.loading = false;
        this.fetchAllJobs();
      })
      .catch((error) => {
        console.error(error);
        this.error = error;
        this.loading = false;
        throw error;
      });
  }

  async done({ jobId }) {
    this.loading = true;
    this.error = false;
    return JobAPI.put(`/${jobId}/done`)
      .then((response) => {
        this.currentJob = null;
        this.loading = false;
        this.fetchAllJobs();
      })
      .catch((error) => {
        console.error(error);
        this.error = error;
        this.loading = false;
        throw error;
      });
  }

  async discard({ jobId }) {
    this.loading = true;
    this.error = false;
    return JobAPI.put(`/${jobId}/maid-cancel-job`)
      .then((response) => {
        this.currentJob = null;
        this.loading = false;
        this.fetchAllJobs();
      })
      .catch((error) => {
        console.error(error);
        this.error = error;
        this.loading = false;
        throw error;
      });
  }
}

export default JobsStore;
