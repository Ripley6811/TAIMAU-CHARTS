import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const optionsSchema = new Schema({
  company: { type: 'String', required: true },
  name: { type: 'String', required: true },
  pn: { type: 'String', required: true },
  dept: { type: 'String', required: true },
  unit: { type: 'String', required: true },
});

export default mongoose.model('Options', optionsSchema);
