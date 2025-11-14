import express from 'express'
import cors from 'cors'

import dotenv from 'dotenv';

import usersRoute from './routes/users.js';
import adminRoute from './routes/admin.js';
import itemsRoute from './routes/items.js';
import donationsRoute from './routes/donations.js';
import cartsRoute from './routes/carts.js';
import inventoryRoute from './routes/inventory.js';
import notificationRoute from './routes/notification.js';
import ordersRoute from './routes/orders.js';
import connectDB from './config/db.js';


dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

//MongoDb Connection
connectDB();
    

// Routes
app.use('/api/users', usersRoute);
app.use('/api/admin', adminRoute);
app.use('/api/items', itemsRoute);
app.use('/api/donations', donationsRoute);
app.use('/api/carts', cartsRoute);
app.use('/api/inventory', inventoryRoute);
app.use('/api/notification', notificationRoute);
app.use('/api/orders', ordersRoute);

 
 // test route
 app.get('/api', (req, res) => {
    res.send('Welcome to Smart Food Connect API!');
 });
 
 
// Only listen when running locally
// eslint-disable-next-line no-undef
if (process.env.NODE_ENV !== 'production') {
    // eslint-disable-next-line no-undef
    const PORT = process.env.PORT || 3001;
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
}

export default app;

