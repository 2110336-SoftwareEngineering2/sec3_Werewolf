import React from 'react';
import { Switch, Route, useRouteMatch } from 'react-router-dom';
import PromotionCreate from './promotion-create';

const Promotion = () => {
  const { path } = useRouteMatch();
  return (
    <Switch>
      <Route exact path={path}>
        <div>Hello Promotion</div>
      </Route>
      <Route path={`${path}/create`}>
        <PromotionCreate />
      </Route>
    </Switch>
  );
};

export default Promotion;
