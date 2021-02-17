import React from "react";
import {Redirect,Route} from "react-router-dom";

import userStore from "./../MobX/User";

const OutsideRoute = (props) => {
    if(!userStore.isLoggedIn){
        console.log(userStore.isLoggedIn)
        return(<Route {...props} />)
    }
    else{
        return(<Redirect to="/home" />)
    }
}

export default OutsideRoute;