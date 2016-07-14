import Shipment from '../models/shipment';
import sanitizeHtml from 'sanitize-html';

export default {
    getShipments: function (req, res) {
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

        Shipment.find(query).sort('-date').limit(Number(rq.limit))
            .exec((err, shipments) => {
                if (err) {
                    return res.status(500).send(err);
                }
                res.json({
                    shipments
                });
            });
    },
    
    shipmentsPDF: function (req, res) {
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
        }
        
        // TODO: Could embed a secondary query to aggregate product totals.
        Shipment.find(query, {_id: 0, __v: 0, dateAdded: 0})
            .sort({company: 1, refPage: 1, date: 1})
            .exec((err, shipments) => {
                if (err) {
                    return res.status(500).send(err);
                }
                res.json({
                    company,
                    start,
                    end,
                    shipments
                });
            });
    },

    /**
     * Server side code.
     * Adds `shipment` record to Mongo database.
     * @param   {object}   req [[Description]]
     * @param   {[[Type]]} res [[Description]]
     * @returns {object}   Response object with error or save confirmation.
     */
    addShipments: function (req, res) {
        let shipments = req.body.shipments;
        
        function validateShipment(s) {
            if (!s.date || !s.product || !s.pn || !s.amount 
                || !s.company || !s.dept || !s.unit) {
                return false;
            }
            return true;
        }
        
        shipments = shipments.map(s => {
            if (validateShipment(s)) {
                return {
                    product: sanitizeHtml(s.product),
                    pn: sanitizeHtml(s.pn),
                    note: sanitizeHtml(s.note || ""),
                    company: sanitizeHtml(s.company),
                    dept: sanitizeHtml(s.dept),
                    unit: sanitizeHtml(s.unit),
                    refPage: sanitizeHtml(s.refPage),
                    amount: s.amount,
                    date: s.date,
                };
            }
            return false;
        });

        function onInsert(err, recs) {
            if (err) {
                return res.status(500).send(err);
            }
            return res.json({
                shipments: recs
            });
        };
        
        if (shipments.every(each => !!each)) {
            Shipment.insertMany(shipments, onInsert);
        } else res.status(403).end();
    },

    getShipment: function (req, res) {
        const _id = req.query._id;
        Shipment.findOne(_id).exec((err, shipment) => {
            if (err) {
                return res.status(500).send(err);
            }
            res.json({
                shipment
            });
        });
    },

    deleteShipment: function (req, res) {
        const _id = req.body._id;
        Shipment.findById(_id).exec((err, shipment) => {
            if (err) {
                return res.status(500).send(err);
            }

            shipment.remove(() => {
                res.status(200).end();
            });
        });
    },
}