import { Request, Response } from 'express';
import { BadRequestError } from '../errors/badRequestError';

export const getFileSpecs = (req: Request, res: Response) => {
  if (!req.file) {
    throw new BadRequestError('File not found');
  }

  const { originalname, mimetype, size } = req.file;

  res.status(200).json({
    filename: originalname,
    type: mimetype,
    size,
  });
};
