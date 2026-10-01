import MenuItem from '../models/MenuItem.js';

export const getMenuItems = async (req, res) => {
  try {
    const menuItems = await MenuItem.find({});
    res.status(200).json(menuItems);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getMenuItemById = async (req, res) => {
  try {
    const menuItem = await MenuItem.findById(req.params.id);
    if (menuItem) {
      res.status(200).json(menuItem);
    } else {
      res.status(404).json({ message: 'Menu item not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createMenuItem = async (req, res) => {
  const { name, description, price, category, availabilityStatus } = req.body;

  let imageUrl = '';
  if (req.file) {
    imageUrl = req.file.path;
  }

  if (!imageUrl) {
    return res.status(400).json({ message: 'Image is required' });
  }

  try {
    const menuItem = new MenuItem({
      name,
      description,
      price,
      category,
      availabilityStatus: availabilityStatus || 'Available',
      imageUrl,
    });

    const createdMenuItem = await menuItem.save();
    res.status(201).json(createdMenuItem);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateMenuItem = async (req, res) => {
  const { name, description, price, category, availabilityStatus } = req.body;

  try {
    const menuItem = await MenuItem.findById(req.params.id);

    if (menuItem) {
      menuItem.name = name || menuItem.name;
      menuItem.description = description || menuItem.description;
      menuItem.price = price || menuItem.price;
      menuItem.category = category || menuItem.category;

      if (availabilityStatus !== undefined) {
        if (!['Available', 'Unavailable'].includes(availabilityStatus)) {
          return res.status(400).json({ message: 'availabilityStatus must be Available or Unavailable' });
        }
        menuItem.availabilityStatus = availabilityStatus;
      }

      if (req.file) {
        menuItem.imageUrl = req.file.path;
      }

      const updatedMenuItem = await menuItem.save();
      res.status(200).json(updatedMenuItem);
    } else {
      res.status(404).json({ message: 'Menu item not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteMenuItem = async (req, res) => {
  try {
    const menuItem = await MenuItem.findById(req.params.id);

    if (menuItem) {
      await menuItem.deleteOne();
      res.status(200).json({ message: 'Menu item removed' });
    } else {
      res.status(404).json({ message: 'Menu item not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
