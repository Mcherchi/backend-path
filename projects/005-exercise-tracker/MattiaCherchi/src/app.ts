import express from 'express';
import 'express-async-errors';
import { errorHandler } from './middlewares/errorHandler';
import { trackerRouter } from './routes/trackerRoutes';
import { NotFoundError } from './errors/notFoundError';

const app = express();

app.use(express.json());

app.use('/api', trackerRouter);

app.all('*', async (req, res) => {
  throw new NotFoundError();
});

app.use(errorHandler);

export { app };
