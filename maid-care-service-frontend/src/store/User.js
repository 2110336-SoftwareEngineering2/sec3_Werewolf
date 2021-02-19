import { createContext } from 'react';
import { observable, action, makeObservable, computed } from 'mobx';
import { auth } from '../api';

class UserStore {
  userData = null;

  constructor() {
    makeObservable(this, {
      userData: observable,
      isAuthenticated: computed,
      login: action,
      logout: action,
    });
  }

  async login({ email, password }) {
    return auth
      .post('/login', { email, password })
      .then(res => {
        const { token, user } = res.data;
        localStorage.setItem('token', token.access_token);
        this.userData = user;
        return res;
      })
      .catch(error => {
        console.log('error!');
        this.logout();
        throw error;
      });
  }

  logout() {
    localStorage.removeItem('token');
    this.userData = null;
  }

  get isAuthenticated() {
    return localStorage.getItem('token');
  }
}

const userStore = createContext(new UserStore());

export default userStore;
