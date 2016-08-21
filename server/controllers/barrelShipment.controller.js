/**
 * Uses Mongoose Models for db operations.
 */
import Shipment from '../models/barrelShipment.model'
import sanitizeHtml from 'sanitize-html'
import { Router } from 'express'
import * as utils from '../../shared/utils/utils'

const router = new Router()


router.get('/', function getShipments(req, res) {
    const rq = req.query,
          query = {};
    if (rq.company) query.company = rq.company;
    if (rq.year) query.shipYear = rq.year;
    if (rq.month) query.shipMonth = rq.month;


    Shipment.find(query, {__v: 0, dateAdded: 0})
    .sort('-shipYear -shipMonth -shipDate -dateAdded')
    .exec((err, docs) => {
        if (err) {
            console.log(err);
            return res.status(500).send(err);
        }

        res.json(docs);
    });
})


router.get('/companies', function getCompanyList(req, res) {
    Shipment.aggregate([
        { $match: {
            company: {
                $ne: null
            }
        } },
        { $group: {
            _id: '$company'
        } },
    ])
    .exec((err, docs) => {
        if (err) {
            console.log(err);
            return res.status(500).send(err);
        }

        res.json(docs.map(ea => ea._id));
    })
})


router.get('/latest/:company/:limit', function getLatest(req, res) {
    const company = req.params.company;
    const limit = Number(req.params.limit);
    
    Shipment.find({ company }, { _id: 0, __v: 0, dateAdded: 0 })
    .sort('-shipYear -shipMonth -shipDate -dateAdded')
    .limit(limit)
    .exec((err, docs) => {
        if (err) {
            console.log(err);
            return res.status(500).send(err);
        }

        docs.map(each => {
            each.rtCode = utils.getRoute(each);
            each.rtSeq = undefined;
        })

        res.json(docs);
    })
})


/**
 * Adds a shipment to database.
 */
router.post('/', function addShipment(req, res) {
    const { shipment } = req.body;
    Shipment.create(shipment, (err, doc) => {
        if (err) {
            console.log(err);
            return res.status(500).send(err);
        }
        return res.json(doc);
    });
})


/**
 * Updates an existing shipment.
 */
router.put('/', function updateShipment(req, res) {
    const { shipment } = req.body;

    Shipment.findById(shipment._id).exec((err, doc) => {
        if (err) {
            console.log(err);
            return res.status(500).send(err);
        }

        Object.assign(doc, shipment);
        doc.save((err, doc) => {
            if (err) {
                console.log(err);
                return res.status(500).send(err);
            }
            res.json(doc);
        })
    });
})


router.delete('/', function deleteShipment(req, res) {
    const { _id } = req.body;
    Shipment.findById(_id).exec((err, shipment) => {
        if (err) {
            console.log(err);
            return res.status(500).send(err);
        }

        shipment.remove(() => {
            res.status(204).end();
        });
    });
})

export default router
