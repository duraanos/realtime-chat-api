const mongoose = require('mongoose');

const connectDb = async (): Promise<void> => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB connected successfully');
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('MongoDB connection failed:', error.message);
    } else {
      console.error('Unknown MongoDB connection error:', error);
    }
  }
};

export default connectDb;
