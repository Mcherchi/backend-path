import { Request, Response } from 'express';
import { Url } from '../models/Url';
import { generateUniqueShortUrl } from '../utils/utils';

export const generateShortUrl = async (req: Request, res: Response) => {
  const { original_url } = req.body;

  const short_url = await generateUniqueShortUrl();

  try {
    const url = Url.build({
      original_url,
      short_url,
    });
    await url.save();

    res.json({ original_url: url.original_url, short_url: url.short_url });
  } catch (errors) {
    console.error(errors);
    throw new Error();
  }
};
