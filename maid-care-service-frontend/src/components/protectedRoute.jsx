import { toJS } from 'mobx';
import { observer } from 'mobx-react-lite';
import React from 'react';
import { Redirect, Route } from 'react-router-dom';
import { useStores } from '../hooks/use-stores';

const ProtectedRoute = observer(({ component: Component, ...rest }) => {
  const { userStore } = useStores();
  return (
    <Route
      {...rest}
      render={props =>
        userStore.isAuthenticated ? (
          <Component {...rest} {...props} />
        ) : (
          <Redirect to={{ pathname: '/login', state: { from: props.location } }} />
        )
      }
    />
  );
});

export default ProtectedRoute;
