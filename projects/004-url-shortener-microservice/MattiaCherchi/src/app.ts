import express from 'express';
import 'express-async-errors';
import { errorHandler } from './middlewares/errorHandler';
import { urlRouter } from './routes/urlRoutes';
import { NotFoundError } from './errors/notFoundError';

const app = express();

app.use(express.json());

app.use('/api', urlRouter);

app.all('*', (req, res) => {
  throw new NotFoundError();
});

app.use(errorHandler);
export { app };
