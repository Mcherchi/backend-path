import { Request, Response } from 'express';
import { BadRequestError } from '../errors/badRequestError';
import { User } from '../models/User';
import { Exercise } from '../models/Exercise';
import mongoose from 'mongoose';
import { NotFoundError } from '../errors/notFoundError';

export const createExercise = async (req: Request, res: Response) => {
  const { description, duration, date } = req.body;

  const userId = req.params._id;
  if (!userId || !mongoose.Types.ObjectId.isValid(userId))
    throw new BadRequestError('Invalid id');

  const user = await User.findById(userId);
  if (!user) throw new NotFoundError();

  try {
    const exercise = Exercise.build({
      username: user.username,
      description,
      duration,
      date: date ? new Date(date) : undefined,
    });
    await exercise.save();

    res.status(200).json({
      username: user.username,
      description,
      duration,
      date: exercise.date?.toDateString(),
      _id: user._id,
    });
  } catch (error) {
    console.log(error);
    throw new Error('Error in adding the exercise.');
  }
};
