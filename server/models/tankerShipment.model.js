import mongoose from 'mongoose';
import { trimString } from '../util/fieldTypeUtils'


export const name = 'TankerShipment'
export const schema = new mongoose.Schema(
    {
        product:    trimString(),
        pn:         trimString(),
        company:    trimString(),
        dept:       trimString(),
        unit:       trimString(),
        note:       trimString({ required: false, minlength: 0, default: '' }),
        date:       { type: 'Date',   required: true },
        dateAdded:  { type: 'Date',   required: true, default: Date.now },
        amount:     { type: 'Number', required: true },
        refPage:    { type: 'Number', required: true },
        refPageSeq: { type: 'Number', required: true, default: 0 },
        testReport: {
            companyHeader: "String",
            dateProduced: "String",
            dateTested: "String",
            lotAmount: "String",
            lotID: "String",
            inspector: "String",
            sampler: "String",
            reporter: "String",
            shelfLife: "String",
            result: "String",
            tests: [{
                attr: "String",
                spec: "String",
                rslt: "String",
            }]
        },
    },
    { collection: 'tankerShipments' }
)

export default mongoose.model(name, schema)
