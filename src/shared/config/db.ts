import mongoose from 'mongoose';

const connectDb = async (): Promise<void> => {
  try {
    const mongoUri = process.env.MONGO_URI;
    if (!mongoUri) {
      throw new Error('MONGO_URI environment variable is not defined');
    }
    await mongoose.connect(mongoUri);
    console.log('MongoDB connected successfully');
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.log(error.message);
      console.error('MongoDB connection failed:', error.message);
      process.exit(1);
    } else {
      console.error('Unknown MongoDB connection error:', error);
    }
  }
};

mongoose.connection.on('error', err => {
  console.error('MongoDB connection error event', err);
});

mongoose.connection.on('disconnected', () => {
  console.warn('MongoDb disconnected event');
});

mongoose.connection.on('reconnected', () => {
  console.log('MongoDB reconnected event ');
});
export default connectDb;
