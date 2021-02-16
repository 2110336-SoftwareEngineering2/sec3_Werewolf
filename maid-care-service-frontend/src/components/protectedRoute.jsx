import React from "react";
import {Redirect,Route} from "react-router-dom";

import userStore from "./../MobX/User";

const ProtectedRoute = (props) => {
    
    if(localStorage.getItem('isLoggedIn')){
        return(<Route {...props} />)
    }
    else{
        return(<Redirect to="/login" />)
    }
}

export default ProtectedRoute;