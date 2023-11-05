import { Request, Response } from 'express';
import { BadRequestError } from '../errors/bad-request-error';
import { User } from '../models/User';

export const createUser = async (req: Request, res: Response) => {
  const { username } = req.body;

  const existingUser = await User.findOne({ username });

  if (existingUser) {
    throw new BadRequestError(`${username} already exists`);
  }

  try {
    const user = User.build({ username });
    await user.save();

    res.status(201).json(user);
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ error: 'An error occurred while creating the user' });
  }
};

export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'An error occurred while fetching users' });
  }
};
