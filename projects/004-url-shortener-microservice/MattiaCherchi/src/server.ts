import mongoose from 'mongoose';
import { app } from './app';

const start = async () => {
  if (
    !process.env.MONGODB_HOST ||
    !process.env.MONGODB_PORT ||
    !process.env.MONGODB_DATABASE
  ) {
    throw new Error('Missing MongoDB environment variables.');
  }
  try {
    const MONGODB_URI = `mongodb://${process.env.MONGODB_HOST}:${process.env.MONGODB_PORT}/${process.env.MONGODB_DATABASE}`;
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');
  } catch (err) {
    console.error(`Could not connect to MongoDB`, err);
    process.exit(1);
  }

  const PORT = process.env.PORT || 8000;

  app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
  });
};

start();
