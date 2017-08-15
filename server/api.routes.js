/**
 * @overview Uses Express' chainable route handlers. Allows adding
 * multiple methods (GET, POST, etc.) to a route.
 *
 * Reference: http://expressjs.com/en/4x/api.html#router.route
 */

import { Router } from 'express'
import BarrelShipmentController from './controllers/barrelShipment.controller'
import BarrelTemplateController from './controllers/barrelTemplate.controller'
import TankerShipmentController from './controllers/tankerShipment.controller'
import TankerTemplateController from './controllers/tankerTemplate.controller'
import CompanyController from './controllers/company.controller'

const router = new Router()

router.use('/barrelShipment', BarrelShipmentController)
router.use('/barrelTemplate', BarrelTemplateController)
router.use('/tankerShipment', TankerShipmentController)
router.use('/tankerTemplate', TankerTemplateController)
router.use('/companies', CompanyController)

export default router
