// Assuming this is in mongoose.js
import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    // Remove the useCreateIndex option from this call
    await mongoose.connect('mongodb+srv://hieuthanhtran12:LsTCYoP3gQBYGQct@cluster0.j0vyd.mongodb.net/ParkingLot?retryWrites=true&w=majority&appName=Cluster0');
    console.log('MongoDB Connected...');
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;