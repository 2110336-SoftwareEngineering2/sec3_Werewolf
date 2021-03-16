import { makeAutoObservable, observable } from 'mobx';
import { job as JobAPI } from '../api';

/**
 * @desc a customer's post that assign to the maid (current user).
 */
class Job {
  /** workspace id */
  workplaceId;
  /**
   * @schema
   * {
   *  typeOfWork: enum [House Cleaning, Dish Washing, Laundry, Gardening, Decluttering],
   *  description: string,
   *  quantity: number,
   * }
   */
  works;
  /** customer id */
  customerId;
  /** maid id */
  maidId;
  /** expiry time */
  expiryTime;
  /** state: status: [posted, matched] */
  state;
  /** rating */
  rating;
  /** review */
  review;

  static create(dto) {
    return Job(...dto);
  }

  constructor(workplaceId, works, customerId, maidId, expiryTime, state, rating, review) {
    this.workplaceId = workplaceId;
    this.works = works;
    this.customerId = customerId;
    this.maidId = maidId;
    this.expiryTime = expiryTime;
    this.state = state;
    this.rating = rating;
    this.review = review;
  }
}

class JobsStore {
  jobs;
  loading = false;
  error = false;

  constructor() {
    makeAutoObservable(this, {
      jobs: observable,
    });
  }

  async fetchAllJobs({ uid }) {
    this.loading = true;
    this.error = false;
    return JobAPI.get(`/maid/${uid}`)
      .then((response) => {
        const { data: jobs } = response;
        this.jobs = jobs.map((detail) => Job.create(detail));
        this.loading = false;
      })
      .catch((error) => {
        console.error(error);
        this.error = error;
        throw error;
      });
  }
}

export default JobsStore;
