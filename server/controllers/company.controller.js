/**
 * Uses Mongoose Models for db operations.
 */
import Company from '../models/company.model'
import { Router } from 'express'
import * as utils from '../../shared/utils/utils'

const router = new Router()

// host:port/api/companies


/**
 * RETRIEVE LIST OF COMPANY (abbr) NAMES
 * 'distinct' returns a list of a specific field without repeated entries.
 */
router.get('/', function getCompanies(req, res) {
    Company.distinct('abbr_name')
    .exec((err, docs) => {
        if (err) {
            console.log(err);
            return res.status(500).send(err);
        }
        res.json(docs);
    });
})


router.get('/directory', function getDirectory(req, res) {
    Company.find({hidden: false}, {__v: 0, products: 0, orders: 0})
    .exec((err, docs) => {
        if (err) {
            console.log(err);
            return res.status(500).send(err);
        }
        res.json(docs);
    });
})


/**
 * CREATE ONE RECORD
 * The request 'body' is the new company document.
 */
router.post('/', function addCompany(req, res) {
    Company.create(req.body, (err, doc) => {
        if (err) {
            console.log(err);
            return res.status(500).send(err);
        }
        return res.json(doc);
    });
})


/**
 * DELETE ONE RECORD
 * Or should there not be a way to delete? Just hide?
 */
router.delete('/', function deleteCompany(req, res) {
    const { _id } = req.body;
    Company.findById(_id).exec((err, company) => {
        if (err) {
            console.log(err);
            return res.status(500).send(err);
        }

        if (company === null) {
            return res.status(404).end();
        }

        company.remove(() => {
            res.status(204).end();
        });
    });
})



export default router
