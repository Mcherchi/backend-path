import express from 'express';
import { whoamiController } from '../controllers/whoamiController';

const router = express.Router();

router.get('/api/whoami', whoamiController);

export { router as whoamiRouter };
