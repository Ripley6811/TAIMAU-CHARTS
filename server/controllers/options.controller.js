/**
 * Uses Mongoose Models for db operations.
 */
import Options from '../models/options';
import sanitizeHtml from 'sanitize-html';

/**
 * Expects a filter in the body of a POST method.
 * GET method retrieves all records.
 */
export function getOptions(req, res) {
  Options.find(req.method === 'POST' ? req.body : {})
      .sort({company: 1, dept: 1, unit: 1})
      .exec((err, options) => {
    if (err) {
      return res.status(500).send(err);
    }
    res.json({ options });
  });
}

export function addOption(req, res) {
    const newOption = {
        name: req.body.name,
        pn: req.body.pn,
        company: req.body.company,
        dept: req.body.dept,
        unit: req.body.unit
    }
    
    // Ensure all keys have values
    for (let key in newOption) {
        if (!newOption[key]) {
            return res.status(403).end();
        }
    }
    
    // Each option should be unique
    Options.update(newOption, newOption, {upsert: true}, (err, savedRec) => {
        if (err) {
            return res.status(500).send(err);
        }
        
        return res.json({option: savedRec});
    });
}

export function deleteOption(req, res) {
    const _id = req.body._id;
    Options.findById(_id).exec((err, option) => {
        if (err) {
            return res.status(500).send(err);
        }
        
        option.remove(() => {
            res.status(200).end();
        });
    });
}