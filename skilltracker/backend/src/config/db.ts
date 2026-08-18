import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { setMongoConnected } from '../utils/mockDb';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/careerverse';

export const connectDB = async (): Promise<void> => {
  try {
    // Disable buffering so queries fail immediately if connection is lost, triggering mock database fallback
    mongoose.set('bufferCommands', false);
    
    console.log(`Attempting connection to MongoDB at: ${MONGODB_URI}`);
    await mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 3000 // wait 3 seconds max before timeout
    });
    setMongoConnected(true);
    console.log('Successfully connected to MongoDB Atlas / Local Instance.');
  } catch (error) {
    setMongoConnected(false);
    console.warn('Mongoose connection error: Local/Atlas MongoDB is offline.');
    console.log('--- CAREERVERSE RUNNING IN IN-MEMORY MOCK DATABASE MODE ---');
    console.log('To run on a real database, start a local MongoDB or configure MONGODB_URI in backend/.env');
  }
};

mongoose.connection.on('disconnected', () => {
  setMongoConnected(false);
  console.log('Mongoose connection disconnected. Switched to Mock Database Mode.');
});

mongoose.connection.on('connected', () => {
  setMongoConnected(true);
  console.log('Mongoose connection restored. Switched to MongoDB Mode.');
});
