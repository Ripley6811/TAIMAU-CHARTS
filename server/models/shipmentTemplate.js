import mongoose from 'mongoose';
const Schema = mongoose.Schema;

export default mongoose.model('ShipmentTemplate', new Schema({
  company: { type: 'String', required: true },
  product: { type: 'String', required: true },
  pn: { type: 'String', required: true },
  dept: { type: 'String', required: true },
  unit: { type: 'String', required: true },
}), 'shipmentTemplates');
