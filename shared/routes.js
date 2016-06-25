import { Route, IndexRoute } from 'react-router';
import React from 'react';
import App from './container/App';
import ShipmentContainer from './container/ShipmentContainer/ShipmentContainer';
import TemplatesContainer from './container/TemplatesContainer/TemplatesContainer';
import DeptContainer from './container/DeptContainer/DeptContainer';

const routes = (
  <Route path="/" component={App} >
    <IndexRoute component={DeptContainer} />
    <Route path="/shipment_history" component={ShipmentContainer} />
    <Route path="/shipment_history/:secret" component={ShipmentContainer} />
    <Route path="/shipment_templates" component={TemplatesContainer} />
  </Route>
);

export default routes;
