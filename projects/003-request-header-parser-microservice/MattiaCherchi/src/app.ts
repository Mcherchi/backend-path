import express from 'express';
import 'express-async-errors';
import { whoamiRouter } from './routes/whoamiRoutes';
import { NotFoundError } from './errors/notFoundError';
import { errorHandler } from './middlewares/errorHandler';

const app = express();

app.set('trust proxy', true);

app.use(whoamiRouter);

app.all('*', (req, res) => {
  throw new NotFoundError();
});

app.use(errorHandler);

export { app };
