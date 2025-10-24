import express from 'express'
import ItemModel from '../models/item.js'

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const items = await ItemModel.find();
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const item = new ItemModel(req.body);
    const newItem = await item.save();
    res.status(201).json(newItem);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;