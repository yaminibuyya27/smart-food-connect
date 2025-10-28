import mongoose from 'mongoose'
import { Buffer } from 'buffer';

const inventorySchema = new mongoose.Schema({
    product: { type: String, required: true },
    quantity: { type: Number, required: true },
    variant: { type: String },
    additionalDetails: { type: String },
    price: { type: Number, required: true },
    available: { type: Boolean, default: true },
    expiryDate: { type: Date, required: true },
    type: { 
        type: String, 
        enum: ['shopper', 'charity'],
        default: 'shopper',
        required: true
    },
    image: {
        data: Buffer,
        contentType: String
    }
}, { timestamps: true });

export default mongoose.model('Inventory', inventorySchema);
