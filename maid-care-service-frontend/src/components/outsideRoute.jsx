import { observer } from 'mobx-react-lite';
import React from 'react';
import { Redirect, Route } from 'react-router-dom';

import userStore from '../store/User';

const OutsideRoute = observer(props => {
  if (!userStore.isLoggedIn) {
    return <Route {...props} />;
  } else {
    return <Redirect to="/home" />;
  }
});

export default OutsideRoute;
