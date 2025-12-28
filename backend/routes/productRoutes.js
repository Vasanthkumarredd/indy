import express from 'express';
import Product from '../models/Product.js';
import { validateProduct, validateUpdateProduct } from '../middleware/validation.js';

const router = express.Router();

/**
 * POST /api/products
 * Create a new product
 */
router.post('/', validateProduct, async (req, res, next) => {
  try {
    const product = new Product(req.body);
    const savedProduct = await product.save();
    res.status(201).json({
      success: true,
      data: savedProduct,
      message: 'Product created successfully'
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'SKU already exists. Please use a unique SKU.'
      });
    }
    next(error);
  }
});

/**
 * GET /api/products
 * Get all products with optional filtering
 */
router.get('/', async (req, res, next) => {
  try {
    const { lowStock, expiringSoon, expired } = req.query;
    let query = {};

    // Filter by low stock
    if (lowStock === 'true') {
      const products = await Product.find({});
      const lowStockProducts = products.filter(p => p.isLowStock);
      return res.json({
        success: true,
        count: lowStockProducts.length,
        data: lowStockProducts
      });
    }

    // Filter by expiry status
    if (expiringSoon === 'true' || expired === 'true') {
      const products = await Product.find({ expiryDate: { $ne: null } });
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const alertWindow = parseInt(process.env.EXPIRY_ALERT_WINDOW) || 7;
      const alertDate = new Date(today);
      alertDate.setDate(alertDate.getDate() + alertWindow);

      if (expired === 'true') {
        const expiredProducts = products.filter(p => {
          const expiry = new Date(p.expiryDate);
          expiry.setHours(0, 0, 0, 0);
          return expiry < today;
        });
        return res.json({
          success: true,
          count: expiredProducts.length,
          data: expiredProducts
        });
      }

      if (expiringSoon === 'true') {
        const expiringProducts = products.filter(p => {
          const expiry = new Date(p.expiryDate);
          expiry.setHours(0, 0, 0, 0);
          return expiry >= today && expiry <= alertDate;
        });
        return res.json({
          success: true,
          count: expiringProducts.length,
          data: expiringProducts
        });
      }
    }

    const products = await Product.find(query).sort({ createdAt: -1 });
    res.json({
      success: true,
      count: products.length,
      data: products
    });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/products/:id
 * Get a single product by ID
 */
router.get('/:id', async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    res.json({
      success: true,
      data: product
    });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid product ID'
      });
    }
    next(error);
  }
});

/**
 * PUT /api/products/:id
 * Update a product
 */
router.put('/:id', validateUpdateProduct, async (req, res, next) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    res.json({
      success: true,
      data: product,
      message: 'Product updated successfully'
    });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid product ID'
      });
    }
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'SKU already exists. Please use a unique SKU.'
      });
    }
    next(error);
  }
});

/**
 * DELETE /api/products/:id
 * Delete a product
 */
router.delete('/:id', async (req, res, next) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    res.json({
      success: true,
      message: 'Product deleted successfully'
    });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid product ID'
      });
    }
    next(error);
  }
});

export default router;

