import express from 'express';
import { body } from 'express-validator';
import { createUser, getAllUsers } from '../controllers/userController';
import { validateRequest } from '../middlewares/validate-request';

const router = express.Router();

router.post('/users', [
  body('username')
    .isLength({ min: 3 })
    .withMessage('The username must contain at least 3 characters'),
  validateRequest,
  createUser,
]);

router.get('/users', getAllUsers);

export { router as trackerRouter };
