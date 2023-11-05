import mongoose from 'mongoose';

interface Attrs {
  username: string;
  description: string;
  duration: number;
  date?: Date;
}

interface ExerciseDoc extends mongoose.Document {
  username: string;
  description: string;
  duration: number;
  date?: Date;
}

interface ExerciseModel extends mongoose.Model<ExerciseDoc> {
  build(attrs: Attrs): ExerciseDoc;
}

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
    type: Number,
    required: true,
  },
  date: {
    type: Date,
    default: () => new Date(),
  },
});

exerciseSchema.statics.build = (attrs: Attrs) => {
  return new Exercise(attrs);
};

const Exercise = mongoose.model<ExerciseDoc, ExerciseModel>(
  'Exercise',
  exerciseSchema
);

export default Exercise;
