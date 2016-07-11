import { Route, IndexRoute } from 'react-router';
import React from 'react';
import AppLayout from './container/AppLayout';
import ShipmentsView from './container/ShipmentsView';
import TemplatesView from './container/TemplatesView';
import ChartsView from './container/ChartsView';

const routes = (
  <Route path="/" component={AppLayout} >
    <IndexRoute component={ChartsView} />
    <Route path="/shipments" component={ShipmentsView} />
    <Route path="/templates" component={TemplatesView} />
  </Route>
);

export default routes;
