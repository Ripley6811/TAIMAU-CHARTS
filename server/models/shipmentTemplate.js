import mongoose from 'mongoose';
const Schema = mongoose.Schema;

export default mongoose.model('ShipmentTemplate', new Schema({
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
}), 'shipmentTemplates');
