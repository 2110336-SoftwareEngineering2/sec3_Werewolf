import { action, makeAutoObservable, observable, toJS } from 'mobx';
import { job as JobAPI } from '../api';
import { CONFIRMED, MATCHED } from '../constants/post-state';

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
    /** test state */
    let test_state = CONFIRMED;

    this.loading = true;
    this.error = false;
    const user = this.userStore.userData;
    const uid = user._id;
    return JobAPI.get(`/maid/${uid}`)
      .then((response) => {
        // const { data: jobs } = response;
        let { data: jobs } = response;
        /** test state */
        jobs = jobs.map((job) => {
          if (job.state === MATCHED) return { ...job, state: test_state };
          return job;
        });

        this.jobs = jobs;

        // if current job is existed, assume that there is only one job
        const cur = jobs.filter((job) => job.state === test_state);
        // if (cur.length >= 0) this.currentJob = { ...cur[0] };

        /** test state */
        if (cur.length > 0) this.currentJob = { ...cur[0], state: test_state };
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

  async discard({ jobId }) {
    // TODO: Maid Discard Current Job
  }
}

export default JobsStore;
