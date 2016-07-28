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
                unit: -1,
            })
            .exec((err, docs) => {
                if (err) {
                    return res.status(500).send(err);
                }
            
                docs.sort((a, b) => {
                    // Ensure sorted after trimming whitespace
                    if (a.company.trim() < b.company.trim()) return -1;
                    if (a.company.trim() > b.company.trim()) return 1;
                    if (a.unit.trim() < b.unit.trim()) return 1;
                    if (a.unit.trim() > b.unit.trim()) return -1;
                    const aNo = Number(a.dept.match(/\d+/)[0]),
                          bNo = Number(b.dept.match(/\d+/)[0]);
                    if (aNo !== bNo) return aNo - bNo;
                    if (a.dept.trim() < b.dept.trim()) return -1;
                    if (a.dept.trim() > b.dept.trim()) return 1;
                    return 0;
                });
            
                res.json(docs);
            });
    },

    /**
     * Returns a list of companies and their respective depts sorted.
     */
    getDepartments: function (req, res) {
        Template.aggregate([
                { $group: {
                    _id: {
                        company: "$company",
                        dept: "$dept"
                    }
                } },
                { $group: {
                    _id: {
                        company: "$_id.company",
                    },
                    departments: {$push: "$_id.dept"}
                } },
                { $project: {
                    _id: 0,
                    company: "$_id.company",
                    departments: 1
                } },
                { $sort: {
                    company: 1,
                } },
            ])
            .exec((err, recs) => {
                if (err) {
                    return res.status(500).send(err);
                }
            
                for (let co of recs) {
                    co.departments.sort(
                        (a, b) => +a.match(/\d+/)[0] - +b.match(/\d+/)[0]
                    );
                }

                res.json(recs);
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

            return res.json(savedRec);
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

    /**
     * Returns an array of unique product-pn pairs.
     */
    getProducts: function (req, res) {
        Template.aggregate([
                { $group: {
                    _id: {
                        product: "$product",
                        pn: "$pn"
                    }
                } },
                { $project: {
                    _id: 0,
                    product: "$_id.product",
                    pn: "$_id.pn",
                } },
                { $sort: {
                    pn: 1
                } },
            ])
            .exec((err, recs) => {
                if (err) {
                    return res.status(500).send(err);
                }

                res.json(recs);
            });
    }
}
