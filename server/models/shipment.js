import mongoose from 'mongoose';


export const name = 'Shipment';
export const schema = new mongoose.Schema({
    date: {
        type: 'Date',
        required: true
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
    amount: {
        type: 'Number',
        required: true
    },
    company: {
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
    refPage: {
        type: 'Number',
        required: true
    },
    note: {
        type: 'String',
        default: '',
        required: false
    },
    dateAdded: {
        type: 'Date',
        default: Date.now,
        required: true
    },
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
});

export default mongoose.model(name, schema);
