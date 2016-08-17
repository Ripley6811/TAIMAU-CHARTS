import { Route, IndexRoute } from 'react-router'
import React from 'react'
// Page components
import AppLayout from './modules/AppLayout'
import ShipmentsView from './modules/Shipment/ShipmentsView'
import BarrelShipmentsView from './modules/BarrelShipment/BarrelShipment.view'
import TemplatesView from './modules/Template/TemplatesView'
import ChartsView from './modules/ChartView/ChartsView'
import SettingsView from './modules/Settings/SettingsView'

export default
<Route path="/" component={AppLayout} >
    <IndexRoute component={ChartsView} />
    <Route path="/shipments" component={ShipmentsView} />
    <Route path="/templates" component={TemplatesView} />
    <Route path="/settings" component={SettingsView} />
    <Route path="/barrels" component={BarrelShipmentsView} />
</Route>
