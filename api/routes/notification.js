import express from 'express'
import nodemailer from 'nodemailer'
import NotificationModel from '../models/notification.js';
import UserModel from '../models/user.js';

const router = express.Router();
 
router.get('/user/:userId', async (req, res) => {
    try {
        const { userId } = req.params;

        if (!userId) {
            return res.status(400).json({ error: 'User ID is required.' });
        }

        const notifications = await NotificationModel.find({ userId });

        res.status(200).json({ notifications });
    } catch (error) {
        console.error('Error fetching notifications:', error);
        res.status(500).json({ error: 'Failed to fetch notifications.' });
    }
});

router.post('/', async (req, res) => {
    // eslint-disable-next-line no-undef
    const email_user = process.env.EMAIL_USER;
    // eslint-disable-next-line no-undef
    const email_pass = process.env.EMAIL_PASS;

    const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        // eslint-disable-next-line no-undef
        user: email_user,
        // eslint-disable-next-line no-undef
        pass: email_pass,
    },
});

    try {
        const { userId, subject, message, itemId } = req.body;

        if (!userId || !subject || !message || !itemId) {
            return res.status(400).json({ error: 'User ID, subject, message, and item ID are required.' });
        }

        const user = await UserModel.findById(userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found.' });
        }

        if (!user.email) {
            return res.status(400).json({ error: 'User email is missing.' });
        }

        const notification = new NotificationModel({
            userId,
            itemId,
            email: user.email
        });
        await notification.save();

        const mailOptions = {
            // eslint-disable-next-line no-undef
            from: email_user,
            to: user.email,
            subject,
            text: message,
        };
        await transporter.sendMail(mailOptions);

        res.status(200).json({ message: `Notification sent for ${user.email}` });
    } catch (error) {
        console.error('Error setting notification:', error);
        res.status(500).json({ error: 'Failed to set notification.' });
    }
});

export default router;