import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Product name is required'],
    trim: true,
    maxlength: [200, 'Product name cannot exceed 200 characters']
  },
  sku: {
    type: String,
    required: [true, 'SKU is required'],
    unique: true,
    trim: true,
    uppercase: true,
    index: true
  },
  quantity: {
    type: Number,
    required: [true, 'Quantity is required'],
    min: [0, 'Quantity cannot be negative'],
    default: 0
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: [0, 'Price cannot be negative']
  },
  minStock: {
    type: Number,
    required: [true, 'Minimum stock level is required'],
    min: [0, 'Minimum stock cannot be negative'],
    default: 0
  },
  expiryDate: {
    type: Date,
    default: null,
    index: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: false // We're managing timestamps manually
});

// Update the updatedAt field before saving
productSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Virtual for checking if product is low stock
productSchema.virtual('isLowStock').get(function() {
  return this.quantity < this.minStock;
});

// Virtual for checking expiry status
productSchema.virtual('expiryStatus').get(function() {
  if (!this.expiryDate) return null;
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const expiry = new Date(this.expiryDate);
  expiry.setHours(0, 0, 0, 0);
  
  const daysUntilExpiry = Math.ceil((expiry - today) / (1000 * 60 * 60 * 24));
  
  if (daysUntilExpiry < 0) return 'expired';
  if (daysUntilExpiry <= 7) return 'expiring_soon_7';
  if (daysUntilExpiry <= 15) return 'expiring_soon_15';
  return 'valid';
});

// Ensure virtuals are included in JSON output
productSchema.set('toJSON', { virtuals: true });
productSchema.set('toObject', { virtuals: true });

const Product = mongoose.model('Product', productSchema);

export default Product;

