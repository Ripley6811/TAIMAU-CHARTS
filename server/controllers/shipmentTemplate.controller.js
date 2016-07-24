/**
 * Uses Mongoose Models for db operations.
 */
import Template from '../models/shipmentTemplate';
import sanitizeHtml from 'sanitize-html';


export default {
    getTemplates: function (req, res) {
        Template.find()
            .sort({
                company: 1,
                dept: 1,
                unit: 1
            })
            .exec((err, templates) => {
                if (err) {
                    return res.status(500).send(err);
                }
                res.json({
                    templates
                });
            });
    },

    getDepartments: function (req, res) {
        Template.aggregate({
                $group: {
                    "_id": {
                        company: "$company",
                        dept: "$dept"
                    }
                }
            })
            .sort({
                "_id.company": 1,
                "_id.dept": 1
            })
            .exec((err, recs) => {
                if (err) {
                    return res.status(500).send(err);
                }

                res.json({
                    records: recs.map(rec => rec._id)
                });
            });
    },

    /**
     * Expects a filter in the body of a POST method.
     * GET method retrieves all records.
     */
    getTemplate: function (req, res) {
        Template.find(req.method === 'POST' ? req.body : {})
            .sort({
                company: 1,
                dept: 1,
                unit: 1
            })
            .exec((err, templates) => {
                if (err) {
                    return res.status(500).send(err);
                }
                res.json({
                    templates
                });
            });
    },

    addTemplate: function (req, res) {
        const newTemplate = {
            company: sanitizeHtml(req.body.company),
            dept: sanitizeHtml(req.body.dept),
            unit: sanitizeHtml(req.body.unit),
            product: sanitizeHtml(req.body.product),
            pn: sanitizeHtml(req.body.pn),
        };

        // Ensure all keys have values
        for (let key in newTemplate) {
            if (!newTemplate[key]) {
                return res.status(403).end();
            }
        }

        // Each option should be unique
        new Template(newTemplate).save((err, savedRec) => {
            if (err) {
                return res.status(500).send(err);
            }

            return res.json({
                savedRec
            });
        });
    },

    deleteTemplate: function (req, res) {
        const _id = req.body._id;
        Template.findById(_id).exec((err, template) => {
            if (err) {
                return res.status(500).send(err);
            }

            template.remove(() => {
                res.status(200).end();
            });
        });
    },

    getProducts: function (req, res) {
        Template.aggregate({
                $group: {
                    "_id": {
                        product: "$product",
                        pn: "$pn"
                    }
                }
            })
            .sort({
                "_id.pn": 1,
            })
            .exec((err, recs) => {
                if (err) {
                    return res.status(500).send(err);
                }
                console.log("Showing recs object after aggregation.")
                console.dir(recs);
                res.json({
                    records: recs.map(rec => rec._id)
                });
            });
    }
}
