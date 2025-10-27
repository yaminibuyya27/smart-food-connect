import mongoose from 'mongoose'

const donationSchema = new mongoose.Schema({
  name: { type: String, required: true },
  quantity: { type: String, required: true },
  expiry: { type: Date, required: true },
  available: { type: Boolean, default: true },
  donor: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Donation', donationSchema);