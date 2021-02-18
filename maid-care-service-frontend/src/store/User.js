import { observable, action, makeObservable, autorun, runInAction, computed, toJS } from 'mobx';
import { auth } from '../api';

class UserStore {
  isLoggedIn = localStorage.getItem('isLoggedIn') === 'true' ? true : false;
  userData = JSON.parse(localStorage.getItem('userData'));
  errors = [];

  constructor() {
    makeObservable(this, {
      isLoggedIn: observable,
      userData: observable,
      errors: observable,
      login: action,
      logout: action,
      clearUser: action,
      error_message: computed,
    });
  }

  async login({ email, password }) {
    try {
      const res = await auth.post('/login', { email, password });
      const { token, user } = res.data;
      // set user
      this.userData = user;
      this.isLoggedIn = true;
      this.errors = [];

      localStorage.setItem('token', token.access_token);
    } catch (error) {
      if (error.response) {
        this.errors.push(error.response.data);
      }
    }
  }

  logout() {
    this.clearUser();
    this.errors = [];
  }

  clearUser() {
    this.userData = null;
    this.isLoggedIn = false;
    localStorage.removeItem('token');
  }

  get error_message() {
    if (this.errors.length) {
      const lastError = toJS(this.errors[this.errors.length - 1]);
      console.log(lastError.statusCode);
      if (lastError.statusCode === 401) {
        return 'Invalid Email or Password';
      } else {
        return 'Internal Server Error';
      }
    }
    return 'No Errors';
  }
}

const userStore = new UserStore();

autorun(() => {
  localStorage.setItem('userData', JSON.stringify(userStore.userData));
  localStorage.setItem('isLoggedIn', userStore.isLoggedIn);
});

export default userStore;
