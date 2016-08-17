import mongoose from 'mongoose'
import { trimString } from '../util/fieldTypeUtils'


export const name = 'BarrelShipment'
export const schema = new mongoose.Schema(
    {
        product:    trimString(),
        pn:         trimString(),
        orderID:    trimString({ minlength: 10, maxlength: 10 }),
        note:       trimString({ required: false, minlength: 0 }),
        formID:     trimString({ required: false, minlength: 4 }),

        makeYear:   { type: 'Number', required: false, min: 2000 },
        makeMonth:  { type: 'Number', required: false, min: 0, max: 11 },
        makeDate:   { type: 'Number', required: false, min: 1, max: 31 },
        shipYear:   { type: 'Number', required: true, min: 2000 },
        shipMonth:  { type: 'Number', required: true, min: 0, max: 11 },
        shipDate:   { type: 'Number', required: true, min: 1, max: 31 },

        lotID:      trimString({ minlength: 9, maxlength: 9, uppercase: true }),
        start:      { type: 'Number', required: true, min: 1 },
        count:      { type: 'Number', required: true, min: 1 },
        // "4219JMMS01" -> routeCode = "JMMS", routeSeq = "01", First part is ship date
        rtCode:     trimString({ minlength: 4, maxlength: 4, uppercase: true }),
        rtSeq:      { type: 'Number', required: true, min: 1 },
        orderTotal: { type: 'Number', required: false, min: 0 },

        pkgQty:     { type: 'Number', required: true, min: 0 },
        shelfLife:  { type: 'Number', required: true, min: 6 },

        barcode:    { type: 'Boolean', required: true },
        datamatrix: { type: 'Boolean', required: true },
    },
    { collection: 'barrelShipments' }
)

export default mongoose.model(name, schema)
