/**
 * Uses Mongoose Models for db operations.
 */
import BarrelShipment from '../models/barrelShipment.model'
import sanitizeHtml from 'sanitize-html'
import { Router } from 'express'

const router = new Router()


router.get('/', function (req, res) {

    BarrelShipment.find({})
    .exec((err, docs) => {
        if (err) {
            return res.status(500).send(err);
        }

        console.log(docs);
        res.json(docs);
    });
})

export default router