/**
 * @overview Uses Express' chainable route handlers. Allows adding
 * multiple methods (GET, POST, etc.) to a route.
 * 
 * e.g. router.route('/shipment').get(...).put(...).post(...).delete(...);
 * 
 * Reference: http://expressjs.com/en/4x/api.html#router.route
 */
import { Router } from 'express';
import * as ShipmentController from '../controllers/shipment.controller';
const router = new Router();

// Get all Shipments
router.route('/getShipments').get(ShipmentController.getShipments);

// Get one Shipment
router.route('/getShipment').get(ShipmentController.getShipment);

// Add a new Shipment
router.route('/addShipment').post(ShipmentController.addShipment);

// Delete a Shipment
router.route('/deleteShipment').delete(ShipmentController.deleteShipment);

export default router;
