import { observable, action, makeObservable, autorun } from 'mobx';
import { auth } from '../api';

class UserStore {
  isLoggedIn = localStorage.getItem('isLoggedIn') === 'true' ? true : false;
  userData = JSON.parse(localStorage.getItem('userData'));

  constructor() {
    makeObservable(this, {
      isLoggedIn: observable,
      userData: observable,
      login: action,
      logout: action,
      clearUser: action,
    });
  }

  login({ email, password }) {
    auth
      .post('/login', { email, password })
      .then(
        action(res => {
          const { token, user } = res.data;
          // set token in LocalStorage for now.
          localStorage.setItem('token', token.token_access);
          // set user data.
          this.isLoggedIn = true;
          this.userData = user;
        })
      )
      .catch(err => {
        throw err;
      });
  }

  logout() {
    this.clearUser();
  }

  clearUser() {
    this.userData = null;
    this.isLoggedIn = false;
    localStorage.removeItem('token');
  }
}

const userStore = new UserStore();

autorun(() => {
  localStorage.setItem('userData', JSON.stringify(userStore.userData));
  localStorage.setItem('isLoggedIn', userStore.isLoggedIn);
});

export default userStore;
