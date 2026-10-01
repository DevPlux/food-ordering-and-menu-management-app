export const validateRegister = (req, res, next) => {
  const { name, email, password } = req.body;

  if (!name || name.trim() === '') {
    return res.status(400).json({ message: 'Name is required' });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || !emailRegex.test(email)) {
    return res.status(400).json({ message: 'A valid email is required' });
  }

  if (!password || password.length < 6) {
    return res.status(400).json({ message: 'Password must be at least 6 characters long' });
  }

  next();
};

export const validateLogin = (req, res, next) => {
  const { email, password } = req.body;

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || !emailRegex.test(email)) {
    return res.status(400).json({ message: 'A valid email is required' });
  }

  if (!password) {
    return res.status(400).json({ message: 'Password is required' });
  }

  next();
};

export const validateMenuItem = (req, res, next) => {
  const { name, description, price, category } = req.body;

  if (!name || name.trim() === '') {
    return res.status(400).json({ message: 'Name is required' });
  }

  if (!description || description.trim() === '') {
    return res.status(400).json({ message: 'Description is required' });
  }

  if (!price || isNaN(Number(price)) || Number(price) <= 0) {
    return res.status(400).json({ message: 'Price must be a valid number greater than 0' });
  }

  if (!category || category.trim() === '') {
    return res.status(400).json({ message: 'Category is required' });
  }

  next();
};

export const validateOrder = (req, res, next) => {
  const { menuItemId, quantity } = req.body;

  if (!menuItemId || menuItemId.trim() === '') {
    return res.status(400).json({ message: 'Menu Item ID is required' });
  }

  if (!quantity || isNaN(Number(quantity)) || Number(quantity) < 1) {
    return res.status(400).json({ message: 'Quantity must be a valid number greater than or equal to 1' });
  }

  next();
};

export const validateStatus = (req, res, next) => {
  const { status } = req.body;
  const validStatuses = ['Pending', 'Confirmed', 'Preparing', 'Ready', 'Completed', 'Cancelled'];

  if (!status || !validStatuses.includes(status)) {
    return res.status(400).json({ message: 'Status must be one of: Pending, Confirmed, Preparing, Ready, Completed, Cancelled' });
  }

  next();
};
