import dotenv from 'dotenv';
import UserModel from './models/user.js';
import connectDB from './config/db.js';

dotenv.config();

// Static admin credentials
const ADMIN_USER = {
    name: 'Admin',
    email: 'admin@gmail.com',
    password: 'Admin@123',
    userType: 'admin'
};

const seedAdmin = async () => {
    try {
        await connectDB();

        // Check if admin already exists
        const existingAdmin = await UserModel.findOne({ email: ADMIN_USER.email });

        if (existingAdmin) {
            console.log('Admin user already exists');
            console.log('Email:', ADMIN_USER.email);
            // eslint-disable-next-line no-undef
            process.exit(0);
        }

        const admin = new UserModel(ADMIN_USER);
        await admin.save();

        console.log('Admin user created successfully!');
        console.log('Email:', ADMIN_USER.email);
        console.log('Password:', ADMIN_USER.password);
        console.log('Please change the password after first login');

        // eslint-disable-next-line no-undef
        process.exit(0);
    } catch (error) {
        console.error('Error seeding admin user:', error);
        // eslint-disable-next-line no-undef
        process.exit(1);
    }
};

seedAdmin();
