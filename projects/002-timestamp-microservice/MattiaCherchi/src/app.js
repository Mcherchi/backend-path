import path from 'path';
import express from 'express';
import 'express-async-errors';
import morgan from 'morgan';
import YAML from 'yamljs';
import swaggerUi from 'swagger-ui-express';
import { timestampRouter } from './routes/timestampRouter.js';
import { errorHandler } from './middlewares/errorHandler.js';
import { CustomError } from './errors/customError.js';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

app.use(morgan('dev'));

const swaggerDocumentPath = path.join(__dirname, 'docs', 'swagger.yaml');
const swaggerDocument = YAML.load(swaggerDocumentPath);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use(timestampRouter);

app.all('*', (req, res) => {
  throw new CustomError('Page Not Found', 404);
});

app.use(errorHandler);

export default app;
