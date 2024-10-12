// Assuming this is in mongoose.js
import mongoose from 'mongoose';
import { env } from './enviroment.js';

const connectDB = async () => {
  try {
    // Remove the useCreateIndex option from this call
    await mongoose.connect(env.MONGODB_URI);
    console.log('MongoDB Connected...');
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;