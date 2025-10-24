import mongoose from 'mongoose'

const itemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  expiry: { type: Date, required: true },
  available: { type: Boolean, default: true },
  seller: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Item', itemSchema);