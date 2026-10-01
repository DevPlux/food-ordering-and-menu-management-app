import express from 'express';
import {
  getMenuItems,
  getMenuItemById,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem,
} from '../controllers/menuController.js';
import { protect, admin } from '../middleware/authMiddleware.js';
import upload from '../middleware/uploadMiddleware.js';
import { validateMenuItem } from '../middleware/validationMiddleware.js';

const router = express.Router();

router.route('/')
  .get(getMenuItems)
  .post(protect, admin, upload.single('image'), validateMenuItem, createMenuItem);

router.route('/:id')
  .get(getMenuItemById)
  .put(protect, admin, upload.single('image'), validateMenuItem, updateMenuItem)
  .delete(protect, admin, deleteMenuItem);

export default router;
