import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const shipmentSchema = new Schema({
  date: { type: 'Date', required: true },
  name: { type: 'String', required: true },
  pn: { type: 'String', required: true },
  amount: { type: 'Number', required: true },
  company: { type: 'String', required: true },
  dept: { type: 'String', required: true },
  unit: { type: 'String', required: true },
  refPage: { type: 'String' },
  note: { type: 'String', default: '', required: false },
  dateAdded: { type: 'Date', default: Date.now, required: true },
});

export default mongoose.model('Shipment', shipmentSchema);
