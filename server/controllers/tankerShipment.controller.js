/**
 * Uses Mongoose Models for db operations.
 */
import Shipment from '../models/tankerShipment.model';
import sanitizeHtml from 'sanitize-html';
import { Router } from 'express'

const router = new Router()


router.get('/', function (req, res) {
    const rq = req.query,
          query = {};
    if (rq.company) query.company = rq.company;
    if (rq.dept) query.dept = rq.dept;

    if (rq.year && !rq.month) {
        query.date = {
            "$gte": new Date(rq.year, 0, 1),
            "$lt": new Date(rq.year, 12, 1)
        }
    } else if (rq.year && rq.month) {
        query.date = {
            "$gte": new Date(rq.year, rq.month, 1),
            "$lt": new Date(rq.year, Number(rq.month) + 1, 1)
        }
    }

    Shipment.find(query, {__v: 0, dateAdded: 0})
        .sort('-refPage refPageSeq dateAdded')
        .exec((err, docs) => {
            if (err) {
                console.log(err);
                return res.status(500).send(err);
            }
            res.json(docs);
        });
})


router.get('/pdf', function (req, res) {
    const WASTE_WATER = "廢水";
    if (!("company" in req.query && "start" in req.query && "end" in req.query)) {
        res.status(400).send({error: "'start' and 'end' dates are required."});
    }
    const company = req.query.company,
          start = new Date(req.query.start),
          end = new Date(req.query.end + " 23:59");
    if (!company) {
        res.status(400).send({error: "Error in company name."});
    }
    if (isNaN(start.getDate()) || isNaN(end.getDate())) {
        res.status(400).send({error: "Malformed dates. Check format is YYYY/MM/DD."});
    }

    const query = {
        company: company,
        date: {
            "$gte": start,
            "$lte": end
        }
    };
    if ("unit" in req.query && req.query.unit === WASTE_WATER) {
        query.unit = req.query.unit;
    }

    const monthReportSort = { refPage: 1, refPageSeq: 1, dateAdded: 1 };
    const wasteWaterSort = { date: 1 };

    // TODO: Could embed a secondary query to aggregate product totals.
    Shipment.find(query, {_id: 0, __v: 0, dateAdded: 0, note: 0})
        .sort(query.unit ? wasteWaterSort : monthReportSort)
        .exec((err, shipments) => {
            if (err) {
                console.log(err);
                return res.status(500).send(err);
            }
            res.json({
                company,
                start,
                end,
                shipments
            });
        });
})


/**
 * Server side code.
 * Adds `shipment` records to Mongo database.
 * @returns {object}   Response object with error or save confirmation.
 */
router.post('/', function (req, res) {
    let shipments = req.body.shipments;
    const existList = [ 'date', 'product', 'pn', 'amount', 'company', 'dept', 'unit', 'refPage' ];

    function validateShipment(s) {
        for (let key of existList) {
            if (!s[key]) {
                console.log('Key is missing: ' + key);
                return false;
            }
        }
        return true;
    }

    shipments = shipments.map(s => {
        if (validateShipment(s)) {
            return {
                product: s.product ? sanitizeHtml(s.product) : undefined,
                pn: s.pn ? sanitizeHtml(s.pn) : undefined,
                note: s.note ? sanitizeHtml(s.note) : "",
                company: s.company ? sanitizeHtml(s.company) : undefined,
                dept: s.dept ? sanitizeHtml(s.dept) : undefined,
                unit: s.unit ? sanitizeHtml(s.unit) : undefined,
                refPage: s.refPage,
                refPageSeq: s.refPageSeq,
                amount: s.amount,
                date: s.date,
            };
        }
        // 403 Forbidden
        return false;
    });

    if (shipments.every(each => !!each)) {
        Shipment.insertMany(shipments, (err, recs) => {
            if (err) {
                console.log(err);
                return res.status(500).send(err);
            }
            return res.json(recs);
        });
    } else res.status(403).end();
})


router.delete('/', function (req, res) {
    const { _id } = req.body;
    Shipment.findById(_id).exec((err, shipment) => {
        if (err) {
            return res.status(500).send(err);
        }

        shipment.remove(() => {
            res.status(204).end();
        });
    });
})


/**
 * Update the spec report for a shipment record.
 */
router.put('/spec/:id', function (req, res) {
    const { report } = req.body,
          { id } = req.params;

    Shipment.findById(id).exec((err, shipment) => {
        if (err) {
            return res.status(500).send(err);
        }
        console.log("report");
        console.dir(report);
        shipment.testReport = report;
        shipment.save((err, doc) => {
            if (err) {
                return res.status(500).send(err);
            }
            res.json(doc);
        })
    });
})


router.get('/specReports', function (req, res) {
    const { pn } = req.query;
    if (!pn) {
        res.status(400).end();
    }

    Shipment.aggregate([
        { $match: {
            pn: pn,
            "testReport.tests.0": {$exists: true}
        } },
//            { $sample : { size: 5 } },  // Available in version 3.2+
        { $limit : 8 },
        { $project: {
            product: 1,
            pn: 1,
            testReport: 1,
            tests: "$testReport.tests",
            _id: 0,
        } },
        { $unwind: "$tests" },
        { $group: {
            _id: "$pn",
            pn: {$first: "$pn"},
            companyHeader: {$last: "$testReport.companyHeader"},
            lotAmount: {$first: "$testReport.lotAmount"},
            sampler: {$last: "$testReport.sampler"},
            inspector: {$first: "$testReport.inspector"},
            reporter: {$last: "$testReport.reporter"},
            shelfLife: {$first: "$testReport.shelfLife"},
            result: {$last: "$testReport.result"},

            tests: {$addToSet: "$tests"},
        } },
    ]).exec((err, docs) => {
        if (err) return res.send(err);

//            console.log('reports');
//            console.dir(docs);
//            if (docs.length > 0) console.dir(docs[0].tests);

        res.json(docs.length > 0 ? docs[0] : null);
    });
})

export default router
