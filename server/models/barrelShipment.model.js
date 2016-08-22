import mongoose from 'mongoose'
import { trimString } from '../util/fieldTypeUtils'


export const name = 'BarrelShipment'
export const schema = new mongoose.Schema(
    {
        product:    trimString({ minlength: 1 }),
        pn:         trimString({ minlength: 1 }),
        company:    trimString({ minlength: 1 }),
        orderID:    trimString({ minlength: 8, maxlength: 10 }),
        note:       trimString({ required: false, default: '' }),
        formID:     trimString({ required: false, default: '' }),

        makeYear:   { type: 'Number', required: false, min: 2000 },
        makeMonth:  { type: 'Number', required: false, min: 0, max: 11 },
        makeDate:   { type: 'Number', required: false, min: 1, max: 31 },
        shipYear:   { type: 'Number', required: true, min: 2000 },
        shipMonth:  { type: 'Number', required: true, min: 0, max: 11 },
        shipDate:   { type: 'Number', required: true, min: 1, max: 31 },

        lotPrefix:  trimString({ minlength: 1, maxlength: 1, uppercase: true }),
        lotID:      trimString({ minlength: 9, maxlength: 9, uppercase: true }),
        start:      { type: 'Number', required: true, min: 1 },
        count:      { type: 'Number', required: true, min: 1 },
        // "4219JMMS01" -> routeCode = "JMMS", routeSeq = "01", First part is ship date
        rtCode:     trimString({ minlength: 4, maxlength: 4, uppercase: true }),
        rtSeq:      { type: 'Number', required: true, min: 0 },
        orderTotal: { type: 'Number', required: false, min: 0 },

        pkgQty:     { type: 'Number', required: true, min: 0 },
        shelfLife:  { type: 'Number', required: true, min: 6 },

        barcode:    { type: 'Boolean', required: true, default: false },
        datamatrix: { type: 'Boolean', required: true, default: false },

        dateAdded:  { type: 'Date', required: true, default: Date.now },
    },
    { collection: 'barrelShipments' }
)

export default mongoose.model(name, schema)
