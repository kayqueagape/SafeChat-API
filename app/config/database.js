import mongoose from 'mongoose';

/**
 * Connect to MongoDB using Mongoose
 */
export async function connectDatabase() {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    console.error('missigin MONGODB_URI in environment variables');
    process.exit(1);
  }

  try {
    mongoose.set('strictQuery', true);
    await mongoose.connect(uri, {
      autoIndex: process.env.NODE_ENV !== 'production',
    });
    console.log(' MongoDB connected successfully');
  } catch (error) {
    console.error(' MongoDB connection error:', error);
    process.exit(1);
  }
}

export default mongoose;
