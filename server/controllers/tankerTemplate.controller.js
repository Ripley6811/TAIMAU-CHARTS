/**
 * Uses Mongoose Models for db operations.
 */
import Template from '../models/tankerTemplate.model';
import BarrelTemplate from '../models/barrelTemplate.model';
import sanitizeHtml from 'sanitize-html';
import { Router } from 'express'

const router = new Router()


router.get('/', function (req, res) {
    Template.find({}, {__v: 0})
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
                const aNo = Number(a.dept.match(/\d+/)[0]),
                      bNo = Number(b.dept.match(/\d+/)[0]);
                if (aNo !== bNo) return aNo - bNo;
                if (a.dept.trim() < b.dept.trim()) return -1;
                if (a.dept.trim() > b.dept.trim()) return 1;
                const aUnit = a.unit.trim().split("-")[0],
                      bUnit = b.unit.trim().split("-")[0];
                if (aUnit < bUnit) return 1;
                if (aUnit > bUnit) return -1;
                return 0;
            });

            res.json(docs);
        });
})

/**
 * Returns a list of companies and their respective depts sorted.
 */
router.get('/departments', function (req, res) {
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

            // Sort each set of departments
            for (let co of recs) {
                co.departments.sort((a, b) => {
                    const aNo = +a.match(/\d+/)[0],
                          bNo = +b.match(/\d+/)[0];
                    if (aNo !== bNo) return aNo - bNo;
                    if (a.trim() < b.trim()) return -1;
                    if (a.trim() > b.trim()) return 1;
                    return 0;
                });
            }

            const coList = recs.map(ea => ea.company);

            BarrelTemplate.aggregate([
                { $match: {
                    company: {
                        $ne: null
                    }
                } },
                { $group: {
                    _id: '$company'
                } },
            ])
            .exec((err, barreldocs) => {
                if (err) {
                    console.log(err);
                    return res.status(500).send(err);
                }

                barreldocs.forEach(co => {
                    if (coList.indexOf(co._id) < 0) recs.unshift({company: co._id, departments: []});
                })
                res.json(recs);
            })
        });
})

router.post('/', function (req, res) {
    const newTemplate = {
        company: req.body.company ? sanitizeHtml(req.body.company) : undefined,
        dept: req.body.dept ? sanitizeHtml(req.body.dept) : undefined,
        unit: req.body.unit ? sanitizeHtml(req.body.unit) : undefined,
        product: req.body.product ? sanitizeHtml(req.body.product) : undefined,
        pn: req.body.pn ? sanitizeHtml(req.body.pn) : undefined,
    };

    // Ensure all keys have values
    for (let key in newTemplate) {
        if (!newTemplate[key]) {
            // 403 Forbidden
            return res.status(403).end();
        }
    }

    // Each option should be unique
    new Template(newTemplate).save((err, savedRec) => {
        if (err) {
            // 409 Conflict
            return res.status(409).send(err);
        }

        return res.json(savedRec);
    });
})

router.delete('/', function (req, res) {
    const _id = req.body._id;

    Template.findById(_id).exec((err, template) => {
        if (err) {
            return res.status(500).send(err);
        }

        template.remove(() => {
            // 204 No Content
            res.status(204).end();
        });
    });
})

/**
 * Returns an array of unique product-pn pairs.
 */
router.get('/products', function (req, res) {
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
})

export default router
