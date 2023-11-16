import { Url } from '../models/Url';

const generateRandomString = (length: number): string => {
  const characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  let result = '';
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
};

export const generateUniqueShortUrl = async (): Promise<string> => {
  const baseShortUrl = generateRandomString(6);
  const existingUrl = await Url.findOne({ short_url: baseShortUrl });

  if (existingUrl) {
    return generateUniqueShortUrl();
  }

  return baseShortUrl;
};
