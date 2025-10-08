import { Router } from 'express';
import { authenticate, authorizeRoles } from '../middleware/auth.js';
import { getUsers, getUserById, updateUser } from '../controllers/userController.js';

const router = Router();

router.get('/', authenticate, authorizeRoles('admin'), getUsers);
router.get('/:id', authenticate, getUserById);
router.put('/:id', authenticate, updateUser);

export default router;




