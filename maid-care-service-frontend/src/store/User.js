import { observable, action, makeObservable, when } from 'mobx';
import axiosRetry from 'axios-retry';
import { auth } from '../api';

class UserStore {
  userData = null;
  loading = true;
  error = false;

  constructor() {
    makeObservable(this, {
      userData: observable,
      loading: observable,
      error: observable,
      login: action,
      logout: action,
      getUserData: action,
    });

    // fetch user when authenticated
    when(
      () => this.isAuthenticated && !this.userData,
      async () => await this.getUserData()
    );
  }

  get isAuthenticated() {
    return localStorage.getItem('token') ? true : false;
  }

  async login({ email, password }) {
    return auth
      .post('/login', { email, password })
      .then(response => {
        console.log('response', response);
        const { access_token } = response.data;
        localStorage.setItem('token', access_token);

        this.getUserData();

        return response;
      })
      .catch(error => {
        this.logout();
        throw error;
      });
  }

  async getUserData() {
    this.loading = true;
    this.error = false;

    axiosRetry(auth, { retries: 3 });
    return auth
      .get('/user')
      .then(response => {
        console.log('get user res', response);
        const user = response.data;
        this.userData = user;
      })
      .catch(error => {
        console.log('get user err', error);
        this.error = error;
        this.logout();
        // throw error;
      })
      .finally(() => {
        this.loading = false;
      });
  }

  logout() {
    localStorage.removeItem('token');
    this.userData = null;
  }
}

export default UserStore;
