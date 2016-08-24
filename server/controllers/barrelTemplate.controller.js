/**
 * Uses Mongoose Models for db operations.
 */
import Template from '../models/barrelTemplate.model';
import sanitizeHtml from 'sanitize-html';
import { Router } from 'express'

const router = new Router()


router.get('/', function (req, res) {

    Template.find({})
    .exec((err, docs) => {
        if (err) {
            console.log(err);
            return res.status(500).send(err);
        }

        res.json(docs);
    });
})


router.post('/', function (req, res) {
    // Each option should be unique
    new Template(req.body).save((err, savedRec) => {
        if (err) {
            // 409 Conflict
            console.log(err);
            return res.status(409).send(err);
        }

        return res.json(savedRec);
    });
})


router.delete('/', function (req, res) {
    const { _id } = req.body;
    Template.findById(_id).exec((err, doc) => {
        if (err) {
            console.log(err);
            return res.status(500).send(err);
        }

        doc.remove(() => {
            res.status(204).end();
        });
    });
})


router.put('/', function (req, res) {
    const { template } = req.body;
    Template.findById(template._id).exec((err, doc) => {
        if (err) {
            console.log(err);
            return res.status(500).send(err);
        }

        Object.assign(doc, template);
        doc.save((err, doc) => {
            if (err) {
                console.log(err);
                return res.status(500).send(err);
            }
            res.json(doc);
        })
    });
})


export default router
