import { Route, IndexRoute } from 'react-router';
import React from 'react';
import AppLayout from './container/AppLayout';
import ShipmentsView from './container/ShipmentsView';
import ShipmentTemplates from './container/ShipmentTemplates';
import DeptContainer from './container/DeptContainer/DeptContainer';

const routes = (
  <Route path="/" component={AppLayout} >
    <IndexRoute component={DeptContainer} />
    <Route path="/shipment_history" component={ShipmentsView} />
    <Route path="/shipment_history/:secret" component={ShipmentsView} />
    <Route path="/shipment_templates" component={ShipmentTemplates} />
  </Route>
);

export default routes;
