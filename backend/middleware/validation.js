/**
 * Validation middleware for product creation and updates
 */

/**
 * Validate product data for creation
 */
export const validateProduct = (req, res, next) => {
  const { name, sku, quantity, price, minStock, expiryDate } = req.body;
  const errors = [];

  // Required fields validation
  if (!name || typeof name !== 'string' || name.trim().length === 0) {
    errors.push('Product name is required and must be a non-empty string');
  }

  if (!sku || typeof sku !== 'string' || sku.trim().length === 0) {
    errors.push('SKU is required and must be a non-empty string');
  }

  if (quantity === undefined || quantity === null) {
    errors.push('Quantity is required');
  } else if (typeof quantity !== 'number' || quantity < 0) {
    errors.push('Quantity must be a non-negative number');
  }

  if (price === undefined || price === null) {
    errors.push('Price is required');
  } else if (typeof price !== 'number' || price < 0) {
    errors.push('Price must be a non-negative number');
  }

  if (minStock === undefined || minStock === null) {
    errors.push('Minimum stock level is required');
  } else if (typeof minStock !== 'number' || minStock < 0) {
    errors.push('Minimum stock must be a non-negative number');
  }

  // Optional expiry date validation
  if (expiryDate !== undefined && expiryDate !== null) {
    const expiry = new Date(expiryDate);
    if (isNaN(expiry.getTime())) {
      errors.push('Expiry date must be a valid date');
    }
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors
    });
  }

  next();
};

/**
 * Validate product data for updates (all fields optional)
 */
export const validateUpdateProduct = (req, res, next) => {
  const { name, sku, quantity, price, minStock, expiryDate } = req.body;
  const errors = [];

  // Validate only provided fields
  if (name !== undefined) {
    if (typeof name !== 'string' || name.trim().length === 0) {
      errors.push('Product name must be a non-empty string');
    }
  }

  if (sku !== undefined) {
    if (typeof sku !== 'string' || sku.trim().length === 0) {
      errors.push('SKU must be a non-empty string');
    }
  }

  if (quantity !== undefined) {
    if (typeof quantity !== 'number' || quantity < 0) {
      errors.push('Quantity must be a non-negative number');
    }
  }

  if (price !== undefined) {
    if (typeof price !== 'number' || price < 0) {
      errors.push('Price must be a non-negative number');
    }
  }

  if (minStock !== undefined) {
    if (typeof minStock !== 'number' || minStock < 0) {
      errors.push('Minimum stock must be a non-negative number');
    }
  }

  if (expiryDate !== undefined && expiryDate !== null) {
    const expiry = new Date(expiryDate);
    if (isNaN(expiry.getTime())) {
      errors.push('Expiry date must be a valid date');
    }
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors
    });
  }

  next();
};

