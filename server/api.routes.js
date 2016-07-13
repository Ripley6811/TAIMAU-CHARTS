/**
 * @overview Uses Express' chainable route handlers. Allows adding
 * multiple methods (GET, POST, etc.) to a route.
 * 
 * Reference: http://expressjs.com/en/4x/api.html#router.route
 */

import { Router } from 'express';
import ShipmentController from './controllers/shipment.controller';
import ShipmentTemplateController from './controllers/shipmentTemplate.controller';
const router = new Router();

/**
 * SHIPMENTS collection api
 */
router.route('/shipment')
    .get(ShipmentController.getShipments)
    .post(ShipmentController.addShipments)
    .delete(ShipmentController.deleteShipment);

router.route('/shipmentsPDF')
    .get(ShipmentController.shipmentsPDF);

/**
 * SHIPMENT TEMPLATES collection api
 */
router.route('/shipmentTemplate')
    .get(ShipmentTemplateController.getTemplates)
    .post(ShipmentTemplateController.addTemplate)
    .delete(ShipmentTemplateController.deleteTemplate);

router.route('/getDepartments')
    .get(ShipmentTemplateController.getDepartments);


export default router;