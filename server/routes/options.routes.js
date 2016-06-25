import { Router } from 'express';
import * as OptionsController from '../controllers/options.controller';
const router = new Router();

// Get all Options
router.route('/getOptions').get(OptionsController.getOptions);

// Get all Options using a filter (in req.body)
router.route('/getOptions').post(OptionsController.getOptions);

// Add a new option
router.route('/addShipment').post(OptionsController.addOption);

// Delete an option
router.route('/deleteOption').delete(OptionsController.deleteOption);

export default router;
