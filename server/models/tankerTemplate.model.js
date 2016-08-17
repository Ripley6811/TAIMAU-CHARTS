import mongoose from 'mongoose'
import { trimString } from '../util/fieldTypeUtils'


export const name = 'TankerTemplate'
export const schema = new mongoose.Schema(
    {
        company: trimString(),
        product: trimString(),
        pn:      trimString({ uppercase: true }),
        dept:    trimString(),
        unit:    trimString(),
    },
    { collection: 'tankerTemplates' }
)

export default mongoose.model(name, schema)
