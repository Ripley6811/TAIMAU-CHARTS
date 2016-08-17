import mongoose from 'mongoose'
import { trimString } from '../util/fieldTypeUtils'


export const name = 'BarrelTemplate'
export const schema = new mongoose.Schema(
    {
        company:    trimString(),
        product:    trimString(),
        pn:         trimString({ uppercase: true }),
        rtCode:     trimString({ minlength: 4, maxlength: 4, uppercase: true }),
        pkgQty:     { type: 'Number',  required: true, min: 0 },
        shelfLife:  { type: 'Number',  required: true, min: 6 },
        barcode:    { type: 'Boolean', required: true },
        datamatrix: { type: 'Boolean', required: true },
    },
    { collection: 'barrelTemplates' }
)

export default mongoose.model(name, schema)
