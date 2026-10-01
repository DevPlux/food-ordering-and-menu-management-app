import express from 'express';
import {
  createOrder,
  getMyOrders,
  getOrderById,
  updateOrderStatus,
  deleteOrder,
  getAllOrders,
} from '../controllers/orderController.js';
import { protect, admin } from '../middleware/authMiddleware.js';
import { validateOrder, validateStatus } from '../middleware/validationMiddleware.js';

const router = express.Router();

router.route('/')
  .post(protect, validateOrder, createOrder)
  .get(protect, admin, getAllOrders);

router.route('/my')
  .get(protect, getMyOrders);

router.route('/:id')
  .get(protect, getOrderById)
  .delete(protect, deleteOrder);

router.route('/:id/status')
  .patch(protect, admin, validateStatus, updateOrderStatus);

export default router;
