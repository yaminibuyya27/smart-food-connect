import express from 'express';
import InventoryModel from '../models/inventory.js';
import multer from 'multer';

const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.post('/', upload.single('image'), async (req, res) => {
    try {
        const { product, quantity, variant, additionalDetails, price, available, expiryDate, type } = req.body;
        
        const newItem = {
            product,
            quantity: Number(quantity),
            variant,
            additionalDetails,
            price: Number(price),
            available: available === 'true',
            expiryDate,
            image: req.file ? {
                data: req.file.buffer,
                contentType: req.file.mimetype
            } : undefined,
            type
        };

        const savedItem = await InventoryModel.findOneAndUpdate(
            {
                'product': product,
                'variant': variant,
                'price': price,
                'expiryDate': expiryDate,
                'type': type
            }, 
            {
                $inc: { quantity: Number(quantity) },
                $set: { 
                    available: newItem.available,
                    image: newItem.image 
                }
            }, 
            { new: true, upsert: true, setDefaultsOnInsert: true }
        );

        res.status(200).json({ message: 'Item added to inventory', item: savedItem });
    } catch (error) {
        console.error('Error adding inventory item:', error);
        res.status(500).json({ error: 'Failed to add item' });
    }
});

router.get('/image/:id', async (req, res) => {
    try {
        const item = await InventoryModel.findById(req.params.id);
        if (item?.image?.data) {
            res.set('Content-Type', item.image.contentType);
            return res.send(item.image.data);
        }
        res.status(404).send('Image not found');
    } catch (error) {
        res.status(500).send('Error retrieving image ', error);
    }
});

router.get('/', async (req, res) => {
    try {
        const items = await InventoryModel.find();
        res.status(200).json(items);
    } catch (error) {
        console.error('Error fetching inventory items:', error);
        res.status(500).json({ error: 'Failed to fetch inventory items' });
    }
 });
 
 
 router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const deletedItem = await InventoryModel.findByIdAndDelete(id);
 
 
        if (!deletedItem) {
            return res.status(404).json({ error: 'Item not found' });
        }
 
 
        res.status(200).json({ message: 'Item removed from inventory', item: deletedItem });
    } catch (error) {
        console.error('Error removing inventory item:', error);
        res.status(500).json({ error: 'Failed to remove item' });
    }
 });

 export default router;