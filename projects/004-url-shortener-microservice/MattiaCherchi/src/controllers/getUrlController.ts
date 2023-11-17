import { Request, Response } from 'express';
import { Url } from '../models/Url';
import { NotFoundError } from '../errors/notFoundError';

export const getOriginalUrl = async (req: Request, res: Response) => {
  const { short_url } = req.params;

  const existingUrl = await Url.findOne({ short_url });

  if (!existingUrl) {
    throw new NotFoundError();
  }

  res.json({ original_url: existingUrl.original_url });
};

export const getAllUrls = async (req: Request, res: Response) => {
  const urls = await Url.find();

  res.json(urls);
};
