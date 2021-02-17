import React from 'react';
import { Redirect, Route } from 'react-router-dom';

import userStore from '../store/User';

const ProtectedRoute = props => {
  if (userStore.isLoggedIn) {
    console.log(userStore.isLoggedIn);
    return <Route {...props} />;
  } else {
    return <Redirect to="/login" />;
  }
};

export default ProtectedRoute;
