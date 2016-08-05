import mongoose from 'mongoose';


export const name = 'ShipmentTemplate';
export const schema = new mongoose.Schema({
    company: {
        type: 'String',
        required: true,
        minlength: 1,
    },
    product: {
        type: 'String',
        required: true,
        minlength: 1,
    },
    pn: {
        type: 'String',
        required: true,
        minlength: 1,
    },
    dept: {
        type: 'String',
        required: true,
        minlength: 1,
    },
    unit: {
        type: 'String',
        required: true,
        minlength: 1,
    },
}, {
    collection: 'shipmentTemplates'
});

export default mongoose.model(name, schema);
