import { Request, Response, NextFunction } from 'express';
import validator from 'validator';
import { promisify } from 'util';
import dns from 'dns';
import { BadRequestError } from '../errors/badRequestError';
import { Url } from '../models/Url';

const lookupAsync = promisify(dns.lookup);

export const validateUrl = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { original_url } = req.body;
  if (!validator.isURL(original_url)) {
    throw new BadRequestError('Invalid URL');
  }

  try {
    await lookupAsync(new URL(original_url).hostname);
  } catch (error) {
    console.log(error);
    throw new BadRequestError(`URL ${original_url} is not reachable`);
  }

  const existingUrl = await Url.findOne({ original_url });

  if (existingUrl) {
    throw new BadRequestError(`${original_url}: Already exists `);
  }

  next();
};
