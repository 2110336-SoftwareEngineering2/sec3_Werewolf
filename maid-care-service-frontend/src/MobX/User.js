import { observable,makeObservable} from "mobx"


class UserStore{

    isLoggedIn = false;
    userData = null;
    
    constructor(){
        makeObservable(this,{
            isLoggedIn: observable,
            userData: observable,
        })
    }    
    
}

const userStore = new UserStore();

export default userStore;
