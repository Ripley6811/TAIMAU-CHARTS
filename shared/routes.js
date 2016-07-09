import { Route, IndexRoute } from 'react-router';
import React from 'react';
import AppLayout from './container/AppLayout';
import ShipmentsView from './container/ShipmentsView';
import TemplatesView from './container/TemplatesView';
import DeptContainer from './container/DeptContainer/DeptContainer';

const routes = (
  <Route path="/" component={AppLayout} >
    <IndexRoute component={DeptContainer} />
    <Route path="/shipments" component={ShipmentsView} />
    <Route path="/templates" component={TemplatesView} />
  </Route>
);

export default routes;
