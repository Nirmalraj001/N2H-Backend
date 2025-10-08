import { Router } from 'express';
import { body } from 'express-validator';
import { login, register, forgotPassword } from '../controllers/authController.js';

const router = Router();

router.post(
  '/register',
  [
    body('name').notEmpty().withMessage('Name required'),
    body('email').isEmail().withMessage('Valid email required'),
    body('password').isLength({ min: 6 }).withMessage('Password min 6 chars'),
  ],
  register
);

router.post(
  '/login',
  [body('email').isEmail(), body('password').notEmpty()],
  login
);

router.post('/forgot-password', forgotPassword);

export default router;




