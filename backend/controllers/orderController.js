import Order from '../models/Order.js';
import MenuItem from '../models/MenuItem.js';

const VALID_TRANSITIONS = {
  Pending: ['Confirmed', 'Cancelled'],
  Confirmed: ['Preparing', 'Cancelled'],
  Preparing: ['Ready'],
  Ready: ['Completed'],
  Completed: [],
  Cancelled: [],
};

export const createOrder = async (req, res) => {
  const { menuItemId, quantity } = req.body;

  try {
    const menuItem = await MenuItem.findById(menuItemId);

    if (!menuItem) {
      return res.status(404).json({ message: 'Menu item not found' });
    }

    // Business Logic 1: Check availability
    if (!menuItem.availabilityStatus) {
      return res.status(400).json({ message: 'Item is currently unavailable' });
    }

    // Business Logic 2: Calculate total amount
    const totalAmount = menuItem.price * quantity;

    const order = new Order({
      user: req.user._id,
      menuItem: menuItemId,
      quantity,
      totalAmount,
      status: 'Pending',
    });

    const createdOrder = await order.save();
    const populated = await Order.findById(createdOrder._id).populate('menuItem');
    res.status(201).json(populated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).populate('menuItem');
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find({})
      .populate("user", "name email")
      .populate("menuItem");
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('user', 'name email')
      .populate('menuItem');

    if (order) {
      res.status(200).json(order);
    } else {
      res.status(404).json({ message: 'Order not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateOrderStatus = async (req, res) => {
  const { status } = req.body;
  const validStatuses = ['Pending', 'Confirmed', 'Preparing', 'Ready', 'Completed', 'Cancelled'];

  if (!validStatuses.includes(status)) {
    return res.status(400).json({ message: 'Invalid status provided' });
  }

  const order = await Order.findById(req.params.id);
  if (!order) {
    return res.status(404).json({ message: 'Order not found' });
  }

  if (!VALID_TRANSITIONS[order.status]?.includes(status)) {
    return res.status(400).json({
      message: `Cannot change status from ${order.status} to ${status}`,
    });
  }

  order.status = status;
  const updatedOrder = await order.save();
  const populated = await Order.findById(updatedOrder._id).populate('menuItem');
  res.status(200).json(populated);

  try {
    const order = await Order.findById(req.params.id);

    if (order) {
      order.status = status;
      const updatedOrder = await order.save();
      const populated = await Order.findById(updatedOrder._id).populate('menuItem');
      res.status(200).json(populated);
    } else {
      res.status(404).json({ message: 'Order not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (order) {
      // Allow deletion if the user is the order creator or an admin
      if (order.user.toString() === req.user._id.toString() || req.user.isAdmin) {
        await order.deleteOne();
        res.status(200).json({ message: 'Order cancelled' });
      } else {
        res.status(403).json({ message: 'Not authorized to delete this order' });
      }
    } else {
      res.status(404).json({ message: 'Order not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
