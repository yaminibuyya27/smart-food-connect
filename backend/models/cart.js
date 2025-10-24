import mongoose from 'mongoose'

const CartSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    items: [{
        id: Number,
        name: String,
        price: Number,
        quantity: {
            type: Number,
            default: 1
        },
        expiry: Date,
        description: String
    }],
    lastUpdated: {
        type: Date,
        default: Date.now
    }
});

export default mongoose.model('Cart', CartSchema);