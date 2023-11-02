import mongoose from 'mongoose';

const exerciseSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  duration: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: () => new Date(),
  },
});

const Exercise = mongoose.model('Exercise', exerciseSchema);

export default Exercise;
