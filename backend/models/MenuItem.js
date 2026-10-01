import mongoose from 'mongoose';

const menuItemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  availabilityStatus: {
    type: String,
    enum: ['Available', 'Unavailable'],
    default: 'Available',
  },
  imageUrl: {
    type: String,
    required: true,
  },
}, {
  timestamps: true
});

const MenuItem = mongoose.model('MenuItem', menuItemSchema);
export default MenuItem;
