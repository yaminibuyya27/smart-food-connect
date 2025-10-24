import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const connectDB = async () => {
  try {
    // eslint-disable-next-line no-undef
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB!');
  } catch (err) {
    console.error('Unable to connect to MongoDB:', err.message);
    // eslint-disable-next-line no-undef
    process.exit(1); // exit process on failure
  }
};

export default connectDB;
