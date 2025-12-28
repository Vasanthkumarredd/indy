import express from 'express';
import Product from '../models/Product.js';

const router = express.Router();

/**
 * GET /api/alerts/low-stock
 * Get all products with low stock (quantity < minStock)
 */
router.get('/low-stock', async (req, res, next) => {
  try {
    const allProducts = await Product.find({});
    const lowStockProducts = allProducts.filter(product => product.isLowStock);

    res.json({
      success: true,
      count: lowStockProducts.length,
      data: lowStockProducts,
      message: `Found ${lowStockProducts.length} product(s) with low stock`
    });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/alerts/expiry
 * Get products with expiry alerts
 * Query params:
 * - days: number of days to check (default: 7, can be 7 or 15)
 * - expired: true/false to get expired products
 */
router.get('/expiry', async (req, res, next) => {
  try {
    const { days, expired } = req.query;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Get configurable alert window from environment
    const defaultAlertWindow = parseInt(process.env.EXPIRY_ALERT_WINDOW) || 7;
    const alertDays = days ? parseInt(days) : defaultAlertWindow;

    // Get all products with expiry dates
    const productsWithExpiry = await Product.find({
      expiryDate: { $ne: null }
    });

    let expiringProducts = [];
    let expiredProductsList = [];

    productsWithExpiry.forEach(product => {
      const expiryDate = new Date(product.expiryDate);
      expiryDate.setHours(0, 0, 0, 0);
      
      const daysUntilExpiry = Math.ceil((expiryDate - today) / (1000 * 60 * 60 * 24));

      if (daysUntilExpiry < 0) {
        expiredProductsList.push({
          ...product.toObject(),
          daysUntilExpiry: daysUntilExpiry
        });
      } else if (daysUntilExpiry <= alertDays) {
        expiringProducts.push({
          ...product.toObject(),
          daysUntilExpiry: daysUntilExpiry
        });
      }
    });

    // Sort by days until expiry (ascending)
    expiringProducts.sort((a, b) => a.daysUntilExpiry - b.daysUntilExpiry);
    expiredProductsList.sort((a, b) => a.daysUntilExpiry - b.daysUntilExpiry);

    if (expired === 'true') {
      return res.json({
        success: true,
        count: expiredProductsList.length,
        data: expiredProductsList,
        message: `Found ${expiredProductsList.length} expired product(s)`
      });
    }

    res.json({
      success: true,
      count: expiringProducts.length,
      data: expiringProducts,
      message: `Found ${expiringProducts.length} product(s) expiring within ${alertDays} days`,
      alertWindow: alertDays
    });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/alerts/expired
 * Get all expired products
 */
router.get('/expired', async (req, res, next) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const productsWithExpiry = await Product.find({
      expiryDate: { $ne: null }
    });

    const expiredProducts = productsWithExpiry
      .filter(product => {
        const expiryDate = new Date(product.expiryDate);
        expiryDate.setHours(0, 0, 0, 0);
        return expiryDate < today;
      })
      .map(product => {
        const expiryDate = new Date(product.expiryDate);
        expiryDate.setHours(0, 0, 0, 0);
        const daysSinceExpiry = Math.ceil((today - expiryDate) / (1000 * 60 * 60 * 24));
        return {
          ...product.toObject(),
          daysSinceExpiry: daysSinceExpiry
        };
      })
      .sort((a, b) => b.daysSinceExpiry - a.daysSinceExpiry);

    res.json({
      success: true,
      count: expiredProducts.length,
      data: expiredProducts,
      message: `Found ${expiredProducts.length} expired product(s)`
    });
  } catch (error) {
    next(error);
  }
});

export default router;

