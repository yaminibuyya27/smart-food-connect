import mongoose from 'mongoose'

const itemSchema = new mongoose.Schema({
    id: String,
    name: String,
    price: Number,
    category: String,
    description: String,
    quantity: Number,
    expiry: Date,
    available: Boolean,
    type: String,
    cartQuantity: {
        type: Number,
        default: 1
    }
}, { _id: false });

const CartSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    items: [itemSchema],
    lastUpdated: {
        type: Date,
        default: Date.now
    }
});

export default mongoose.model('Cart', CartSchema);