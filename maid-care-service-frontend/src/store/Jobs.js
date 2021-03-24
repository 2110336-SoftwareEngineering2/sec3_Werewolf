import { action, makeAutoObservable, observable, toJS } from 'mobx';
import { job as JobAPI } from '../api';
import { MATCHED } from '../constants/post-state';

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
    });
  }

  async fetchAllJobs() {
    this.loading = true;
    this.error = false;
    const user = this.userStore.userData;
    const uid = user._id;
    return JobAPI.get(`/maid/${uid}`)
      .then((response) => {
        const { data: jobs } = response;
        this.jobs = jobs;
        // if current job is existed, assume that there is only one job
        const cur = jobs.filter((job) => job.state === MATCHED);
        if (cur.length >= 0) this.currentJob = cur[0];
        console.log(toJS(this.currentJob));
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
}

export default JobsStore;
