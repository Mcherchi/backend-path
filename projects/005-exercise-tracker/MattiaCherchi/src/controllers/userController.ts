import { Request, Response } from 'express';
import { BadRequestError } from '../errors/badRequestError';
import { User } from '../models/User';
import mongoose from 'mongoose';
import { NotFoundError } from '../errors/notFoundError';
import { Exercise } from '../models/Exercise';

export const createUser = async (req: Request, res: Response) => {
  const { username } = req.body;

  const existingUser = await User.findOne({ username });

  if (existingUser) {
    throw new BadRequestError(`user: ${username} already exists`);
  }

  try {
    const user = User.build({ username });
    await user.save();

    res.status(201).json(user);
  } catch (error) {
    console.log(error);
    throw new Error('An error occurred while creating the user');
  }
};

export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    console.log(error);
    throw new Error('An error occurred while fetching users');
  }
};

export const getUserWithExercises = async (req: Request, res: Response) => {
  const userId = req.params._id;

  if (!userId || !mongoose.Types.ObjectId.isValid(userId))
    throw new BadRequestError('Invalid id');

  const user = await User.findById(userId);
  if (!user) throw new NotFoundError();

  const fromDate = req.query.from
    ? new Date(String(req.query.from))
    : new Date(0);
  const toDate = req.query.to ? new Date(String(req.query.to)) : new Date();
  const limit = req.query.limit
    ? parseInt(req.query.limit as string)
    : undefined;

  const matchStage: any = {
    username: user.username,
    date: {
      $gte: fromDate,
      $lte: toDate,
    },
  };

  const projectStage: any = {
    description: 1,
    duration: 1,
    date: 1,
    _id: 0,
  };

  const aggregationPipeline: any = [
    { $match: matchStage },
    { $project: projectStage },
    { $sort: { date: -1 } },
    { $limit: limit ? limit : Number.MAX_SAFE_INTEGER },
  ];

  try {
    const aggregateLogs = await Exercise.aggregate(aggregationPipeline);

    const logs = aggregateLogs.map((log) => ({
      ...log,
      date: log.date.toDateString(),
    }));

    res.status(200).json({
      username: user.username,
      count: logs.length,
      _id: user._id,
      logs,
    });
  } catch (error) {
    console.log(error);
    throw new Error();
  }
};
