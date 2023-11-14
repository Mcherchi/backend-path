import express from 'express';
import { body } from 'express-validator';
import {
  createUser,
  getAllUsers,
  getUserWithExercises,
} from '../controllers/userController';
import { validateRequest } from '../middlewares/validateRequest';
import { createExercise } from '../controllers/exercisesController';

const router = express.Router();

router.post('/users', [
  body('username')
    .isLength({ min: 3 })
    .withMessage('The username must contain at least 3 characters'),
  validateRequest,
  createUser,
]);

router.get('/users', getAllUsers);

router.post(
  '/users/:_id/exercises',
  [
    body('description')
      .isString()
      .notEmpty()
      .withMessage('The description field is required and must be a string.'),
    body('duration')
      .isNumeric()
      .notEmpty()
      .withMessage('The duration field is required and must be a number.'),
    body('date')
      .optional()
      .isISO8601()
      .withMessage('The date field must be a valid date.'),
  ],
  validateRequest,
  createExercise
);

router.get('/users/:_id/logs', getUserWithExercises);

export { router as trackerRouter };
