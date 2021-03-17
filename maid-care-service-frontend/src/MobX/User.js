import { observable, action,makeObservable, autorun} from "mobx"


class UserStore{

    isLoggedIn = localStorage.getItem('isLoggedIn');
    userData = JSON.parse(localStorage.getItem('userData'));
    
    constructor(){
        makeObservable(this,{
            isLoggedIn: observable,
            userData: observable,
            login: action,
            setUser: action,
        })
    }
    
    login(){
        this.isLoggedIn = true;
    }

    setUser(data){
        this.userData = data;
    }
    
}

const userStore = new UserStore();

autorun(() => {
   localStorage.setItem("userData", JSON.stringify(userStore.userData));
   localStorage.setItem("isLoggedIn",userStore.isLoggedIn);
})

export default userStore;