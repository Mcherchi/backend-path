import express from 'express';
import { CustomError } from '../errors/customError.js';

const router = express.Router();

router.get('/api/:date?', (req, res) => {
  const dateParam = req.params.date;
  let date;

  if (!dateParam) {
    date = new Date();
  } else if (/^\d+$/.test(dateParam)) {
    date = new Date(parseInt(dateParam));
  } else {
    date = new Date(dateParam);
  }

  if (isNaN(date.getTime())) {
    throw new CustomError('Invalid Date', 400);
  }
  res.status(200).send({
    unix: date.getTime(),
    utc: date.toUTCString(),
  });
});

export { router as timestampRouter };
