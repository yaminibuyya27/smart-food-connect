import express from 'express'
import cors from 'cors'

import dotenv from 'dotenv';

import usersRoute from './routes/users.js';

import itemsRoute from './routes/items.js';
import donationsRoute from './routes/donations.js';
import cartsRoute from './routes/Carts.js';
import inventoryRoute from './routes/inventory.js';
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
app.use('/api/items', itemsRoute);
app.use('/api/donations', donationsRoute);
app.use('/api/carts', cartsRoute);
app.use('/api/inventory', inventoryRoute);

 
 // test route
 app.get('/', (req, res) => {
    res.send('Welcome to Smart Food Connect API!');
 });
 
 
// eslint-disable-next-line no-undef
 const PORT = process.env.PORT || 3001;
 
 app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

