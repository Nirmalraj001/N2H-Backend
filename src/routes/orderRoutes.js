import { Router } from 'express';
import { authenticate, authorizeRoles } from '../middleware/auth.js';
import { getOrders, getOrderById, createOrder, updateOrderStatus } from '../controllers/orderController.js';

const router = Router();

router.get('/', authenticate, authorizeRoles('admin'), getOrders);
router.get('/:id', authenticate, getOrderById);
router.post('/', authenticate, createOrder);
router.put('/:id', authenticate, authorizeRoles('admin'), updateOrderStatus);

export default router;




