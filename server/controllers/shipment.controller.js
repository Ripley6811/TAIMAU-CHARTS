import Shipment from '../models/shipment';
import Options from '../models/options';
import sanitizeHtml from 'sanitize-html';

export function getShipments(req, res) {
    const query = {};
    if (req.query.company && req.query.dept) {
        query.company = req.query.company;
        query.dept = req.query.dept;
    }
  Shipment.find(query).sort('-date').limit(Number(req.query.limit)).exec((err, shipments) => {
    if (err) {
      return res.status(500).send(err);
    }
    res.json({ shipments });
  });
}

/**
 * Server side code.
 * Adds `shipment` record to Mongo database.
 * @param   {object}   req [[Description]]
 * @param   {[[Type]]} res [[Description]]
 * @returns {object}   Response object with error or save confirmation.
 */
export function addShipment(req, res) {
  if (!req.body.date || !req.body.name || !req.body.pn || !req.body.amount
      || !req.body.company || !req.body.dept || !req.body.unit) {
    return res.status(403).end();
  }
    
  const newShipment = new Shipment(req.body);

  // Let's sanitize inputs
  newShipment.name = sanitizeHtml(newShipment.name);
  newShipment.pn = sanitizeHtml(newShipment.pn);
  newShipment.note = sanitizeHtml(newShipment.note);
  newShipment.company = sanitizeHtml(newShipment.company);
  newShipment.dept = sanitizeHtml(newShipment.dept);
  newShipment.unit = sanitizeHtml(newShipment.unit);

  newShipment.save((err, savedRec) => {
    if (err) {
      return res.status(500).send(err);
    }
      // Adds signature to options.
      const newOption = new Options(req.body).toObject();
      delete newOption._id;
      Options.update(newOption, newOption, {upsert: true}, (err, raw) => {
        return res.json({ shipment: savedRec });
      });
  });
}

export function getShipment(req, res) {
  const _id = req.query._id;
  Shipment.findOne(_id).exec((err, shipment) => {
    if (err) {
      return res.status(500).send(err);
    }
    res.json({ shipment });
  });
}

export function deleteShipment(req, res) {
  const _id = req.body._id;
  Shipment.findById(_id).exec((err, shipment) => {
    if (err) {
      return res.status(500).send(err);
    }

    shipment.remove(() => {
      res.status(200).end();
    });
  });
}
