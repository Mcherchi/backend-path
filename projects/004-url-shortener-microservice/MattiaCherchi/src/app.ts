import express from 'express';
import 'express-async-errors';
import { errorHandler } from './middlewares/errorHandler';
import { urlRouter } from './routes/urlRoutes';

const app = express();

app.use(express.json());

app.get('/', (req, res) => {
  res.json({ message: 'hello' });
});

app.use('/api', urlRouter);

app.use(errorHandler);
export { app };
