import mongoose from 'mongoose';
import logger from '../utils/logger';

const connectDB = async () => {
  const MONGO_URI = process.env.NODE_ENV === 'production' ? process.env.MONGO_CLUSTER_URI : process.env.MONGO_URI
  try {
    await mongoose.connect(MONGO_URI!);
    logger.info('MongoDB connected');
  } catch (error) {
    logger.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

export default connectDB;