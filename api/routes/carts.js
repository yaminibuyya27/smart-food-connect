import express from 'express'
import CartModel from '../models/cart.js';

const router = express.Router();

router.get('/:userId', async (req, res) => {
    try {
        let cart = await CartModel.findOne({ user: req.params.userId });
        if (!cart) {
            cart = new CartModel({ user: req.params.userId, items: [] });
            await cart.save();
        }
        res.json(cart);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.post('/:userId/items', async (req, res) => {
    try {
        let cart = await CartModel.findOne({ user: req.params.userId });
        if (!cart) {
            cart = new CartModel({ user: req.params.userId, items: [] });
        }
        cart.items.push(req.body);
        await cart.save();
        res.json(cart);
    } catch (error) {
        console.error('Error in POST /carts/:userId/items:', error);
        res.status(500).json({ message: error.message });
    }
});

router.put('/:userId', async (req, res) => {
    try {
        let cart = await CartModel.findOne({ user: req.params.userId });
        if (!cart) {
            cart = new CartModel({ user: req.params.userId });
        }
        cart.items = req.body.items;
        await cart.save();
        res.json(cart);
    } catch (error) {
        console.error('Error in PUT /carts/:userId:', error);
        res.status(500).json({ message: error.message });
    }
});

router.delete('/:userId', async (req, res) => {
    try {
        let cart = await CartModel.findOne({ user: req.params.userId });
        if (cart) {
            cart.items = [];
            await cart.save();
        }
        res.json({ message: 'Cart cleared' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

export default router;