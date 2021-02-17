import {Redirect} from 'react-router-dom'
import { observable, action, makeObservable, autorun, computed } from 'mobx';

class UserStore {
  isLoggedIn = localStorage.getItem('isLoggedIn') === 'true'? true: false;
  userData = JSON.parse(localStorage.getItem('userData'));

  constructor() {
    makeObservable(this, {
      isLoggedIn: observable,
      userData: observable,
      toggleLogin:action,
      setUser:action
    });
  }

  setUser(data){
      this.userData = data;
  }

  toggleLogin(){
      this.isLoggedIn = !this.isLoggedIn;
  }

}

const userStore = new UserStore();

autorun(() => {
  localStorage.setItem('userData', JSON.stringify(userStore.userData));
  localStorage.setItem('isLoggedIn', userStore.isLoggedIn);
});

export default userStore;
