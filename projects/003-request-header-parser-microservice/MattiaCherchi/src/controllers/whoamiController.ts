import { Request, Response } from 'express';

export const whoamiController = (req: Request, res: Response) => {
  const userIp = req.ip;
  const userLanguage = req.headers['accept-language']?.split(',')[0];
  const userSoftware = req.headers['user-agent'];

  res.json({
    ipAddress: userIp,
    language: userLanguage,
    software: userSoftware,
  });
};
