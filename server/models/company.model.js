import mongoose from 'mongoose'
import { trimString } from '../util/fieldTypeUtils'


export const name = 'Company'
export const schema = new mongoose.Schema(
    {
        // Hidden from general view when no longer doing business
        hidden:         { type: 'Boolean', required: true, default: false },
        group_id:       { type: 'String', trim: true, required: false },
        abbr_name:      { type: 'String', trim: true, required: true, minlength: 2 },
        full_name:      { type: 'String', trim: true, required: false },
        eng_name:       { type: 'String', trim: true, required: false },
        tax_id:         { type: 'String', trim: true, required: false },
        note:           { type: 'String', trim: true, required: false },
        date_added:     { type: 'Date', required: true, default: Date.now },
        // Quick ref for latest shipment activity
        last_shipment:  { type: 'Date' },
        show_tax:       { type: 'Boolean', default: true },




        // TODO: Settle the arrangement below. Working on the above first.
        contacts: [{
            title:      'String',
            name:       'String',
            phone:      'String',
            email:      'String',
            type:       'String',
            address:    'String',
        }],
        products: [{
            // Hidden from general view when discontinued
            hidden:     { type: 'Boolean', required: true, default: false },
            name:       'String',    // Internal name
            label:      'String',    // Alternate name requested by customer
            english:    'String',
            unit_measure: 'String',  // lbs., kg., etc.
            unit_price: 'Number',
            sku_amt:    'Number',    // How much sold in one package. eg. 25 kg per bag.
            sku_price:  'Number',    // Price per single sku
            sku_stock:  'Number',
            ASE_PN:     'String',
            ASE_RT:     'String',
        }],
        orders: [{
            // Hidden from general view when completed
            hidden:     { type: 'Boolean', required: true, default: false },
            number:     'String',
            date:       { type: 'Date', required: true, default: Date.now },
            qty:        'Number',
            shipments: [{
                number:     'String',
                date:       { type: 'Date', required: true, default: Date.now },
                driver:     'String',
                truck:      'String',
                invoices: [{  // Can split payment among multiple companies
                    company:        'String',  // Taimau branches
                    amt:            'Number',
                    date_issued:    'Date',
                    date_paid:      'Date',
                    paid:           'Boolean',
                    check_number:   'String',
                }],
            }],
        }],
    },
    { collection: 'companies'}
)
export default mongoose.model(name, schema)
