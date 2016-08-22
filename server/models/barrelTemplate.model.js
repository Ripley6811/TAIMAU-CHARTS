import mongoose from 'mongoose'
import { trimString } from '../util/fieldTypeUtils'


export const name = 'BarrelTemplate'
export const schema = new mongoose.Schema(
    {
        company:    trimString(),
        product:    trimString(),
        pn:         trimString({ uppercase: true }),
        rtCode:     trimString({ minlength: 4, maxlength: 4, uppercase: true }),
        lotPrefix:  trimString({ minlength: 1, maxlength: 1, uppercase: true }),
        pkgQty:     trimString(),
        shelfLife:  { type: 'Number',  required: false, min: 6 },
        barcode:    { type: 'Boolean', required: true },
        datamatrix: { type: 'Boolean', required: true },
    },
    { collection: 'barrelTemplates' }
)

export default mongoose.model(name, schema)
