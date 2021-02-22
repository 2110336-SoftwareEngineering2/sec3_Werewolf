import { observable, action, makeObservable, when } from 'mobx';
import { auth } from '../api';

class UserStore {
  userData = null;

  constructor() {
    makeObservable(this, {
      userData: observable,
      login: action,
      logout: action,
      getUserData: action,
    });

    // fetch user when authenticated
    when(
      () => this.isAuthenticated,
      () => this.getUserData(),
      {
        timeout: 3000,
        onError: err => {
          localStorage.removeItem('token');
        },
      }
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
        return response;
      })
      .catch(error => {
        this.logout();
        throw error;
      });
  }

  async getUserData() {
    return auth
      .get('/get-user')
      .then(response => {
        console.log('get user res', response);
        const user = response.data;
        this.userData = user;
      })
      .catch(error => {
        console.log('get user err', error);
        // throw error;
      });
  }

  logout() {
    localStorage.removeItem('token');
  }
}

export default UserStore;
