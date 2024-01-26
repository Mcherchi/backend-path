import express from 'express';
import 'express-async-errors';
import { fileMetadataRoute } from './routes/fileMetadata';
import { errorHandler } from './middlewares/errorHandler';

const app = express();

app.use(express.json());

app.use('/api', fileMetadataRoute);

app.all('*', (req, res) => {
  res.status(404).send({ message: 'Not found' });
});

app.use(errorHandler);
export { app };
