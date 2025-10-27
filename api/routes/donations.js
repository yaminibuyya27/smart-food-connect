import express from 'express'
import DonationModel from '../models/donation.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const donations = await DonationModel.find();
    res.json(donations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const donation = new DonationModel(req.body);
    const newDonation = await donation.save();
    res.status(201).json(newDonation);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;