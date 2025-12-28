Link for vercell app
https://test-iota-sage-59.vercel.app/

# Inventory Management System

A complete full-stack inventory management solution designed to solve inventory visibility problems for Indian material businesses. Built with Next.js (App Router), Express.js, and MongoDB.

## Features

### Authentication

- **User Registration**: Sign up with name, email, password, and role (admin/staff)
- **User Login**: Secure authentication with JWT tokens
- **Role-Based Access**: Support for admin and staff roles
- **Protected Routes**: All inventory pages require authentication
- **Session Management**: Persistent login with token storage

### Core Functionality

1. **Product Management**
   - Create, read, update, and delete products
   - Unique SKU (Stock Keeping Unit) tracking
   - Real-time quantity management
   - Price tracking
   - Minimum stock level configuration
   - Optional expiry date tracking

2. **Real-Time Inventory Tracking**
   - Automatic quantity updates when stock is added or reduced
   - Manual stock adjustment capabilities

3. **Low-Stock Alert System**
   - Automatic detection when quantity falls below minimum stock level
   - Visual indicators (yellow badges)
   - Dedicated alerts API endpoint

4. **Expiry-Based Alert System**
   - Track products with expiry dates
   - Identify products expiring within 7 or 15 days (configurable)
   - Identify already expired products
   - Visual indicators:
     - Orange for expiring soon
     - Red for expired products

5. **Dashboard**
   - Total SKUs count
   - Low-stock products summary
   - Expiring products summary
   - Expired products summary
   - Quick action buttons

## Tech Stack

- **Frontend**: Next.js 14 (App Router), React 18, Tailwind CSS
- **Backend**: Express.js, Node.js
- **Database**: MongoDB with Mongoose ODM
- **API Communication**: Axios

## Project Structure

```
sol/
├── backend/
│   ├── models/
│   │   └── Product.js          # Mongoose product schema
│   ├── routes/
│   │   ├── productRoutes.js   # Product CRUD endpoints
│   │   └── alertRoutes.js     # Alert endpoints
│   ├── middleware/
│   │   └── validation.js      # Request validation
│   ├── server.js              # Express server setup
│   ├── package.json
│   └── .env.example
├── frontend/
│   ├── app/
│   │   ├── page.js            # Dashboard
│   │   ├── products/
│   │   │   ├── page.js        # Products list
│   │   │   ├── new/
│   │   │   │   └── page.js    # Add product
│   │   │   └── [id]/
│   │   │       └── edit/
│   │   │           └── page.js # Edit product
│   │   └── alerts/
│   │       └── page.js        # Alerts page
│   ├── lib/
│   │   └── api.js             # API client functions
│   ├── package.json
│   └── .env.example
└── README.md
```

## Setup Instructions

### Prerequisites

- Node.js (v18 or higher)
- MongoDB (local installation or MongoDB Atlas account)
- npm or yarn

### Authentication Setup

1. **Create your first account**:
   - Navigate to `/signup` in your browser
   - Fill in the registration form
   - Choose your role (admin or staff)
   - After registration, you'll be automatically logged in

2. **Login**:
   - Navigate to `/login` if you're not logged in
   - Enter your email and password
   - You'll be redirected to the dashboard

**Note**: All inventory management pages require authentication. You'll be redirected to the login page if not authenticated.

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file from the example:
   ```bash
   # On Windows (PowerShell)
   Copy-Item env.example .env
   
   # On Linux/Mac
   cp env.example .env
   ```

4. Update the `.env` file with your MongoDB connection string:
   ```env
   MONGODB_URI=mongodb://localhost:27017/inventory_db
   PORT=5000
   NODE_ENV=development
   EXPIRY_ALERT_WINDOW=7
   ```

5. Start the backend server:
   ```bash
   npm run dev
   ```
   
   Or for production:
   ```bash
   npm start
   ```

   The backend will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env.local` file from the example:
   ```bash
   # On Windows (PowerShell)
   Copy-Item env.example .env.local
   
   # On Linux/Mac
   cp env.example .env.local
   ```

4. Update `.env.local` with your backend API URL:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:5000/api
   ```

5. Start the development server:
   ```bash
   npm run dev
   ```

   The frontend will run on `http://localhost:3000`

## API Endpoints

### Authentication

- `POST /api/auth/signup` - Register a new user
  - Body: `{ name, email, password, role? }`
  - Returns: `{ user, token }`
- `POST /api/auth/login` - Login user
  - Body: `{ email, password }`
  - Returns: `{ user, token }`
- `GET /api/auth/me` - Get current user info (protected)
  - Headers: `Authorization: Bearer <token>`
  - Returns: `{ user }`

### Products

- `POST /api/products` - Create a new product
- `GET /api/products` - Get all products
  - Query params: `?lowStock=true`, `?expiringSoon=true`, `?expired=true`
- `GET /api/products/:id` - Get a single product
- `PUT /api/products/:id` - Update a product
- `DELETE /api/products/:id` - Delete a product

### Alerts

- `GET /api/alerts/low-stock` - Get all low-stock products
- `GET /api/alerts/expiry` - Get products expiring soon
  - Query params: `?days=7` or `?days=15`, `?expired=true`
- `GET /api/alerts/expired` - Get all expired products

### Health Check

- `GET /api/health` - Check API status

## Product Schema

```javascript
{
  name: String (required),
  sku: String (required, unique, indexed),
  quantity: Number (required, min: 0),
  price: Number (required, min: 0),
  minStock: Number (required, min: 0),
  expiryDate: Date (optional, indexed),
  createdAt: Date,
  updatedAt: Date
}
```

## Environment Variables

### Backend (.env)

- `MONGODB_URI` - MongoDB connection string
- `PORT` - Server port (default: 5000)
- `NODE_ENV` - Environment (development/production)
- `EXPIRY_ALERT_WINDOW` - Days before expiry to trigger alert (default: 7)
- `JWT_SECRET` - Secret key for JWT token signing (change in production!)

### Frontend (.env.local)

- `NEXT_PUBLIC_API_URL` - Backend API base URL

## Features in Detail

### Low-Stock Alerts

Products are automatically flagged as "Low Stock" when:
- `quantity < minStock`

The system provides:
- Visual yellow badges on product listings
- Dedicated low-stock alerts page
- Dashboard summary count

### Expiry Alerts

Products with expiry dates are monitored for:
- **Expiring Soon**: Products expiring within the configured alert window (default: 7 days)
- **Expired**: Products past their expiry date

Visual indicators:
- Orange badges for expiring soon
- Red badges for expired products

### Real-Time Updates

- Quantity changes are immediately reflected across the system
- Alerts update automatically based on current stock levels
- Dashboard statistics refresh on page load

## Usage Examples

### Adding a Product

1. Navigate to "Products" → "Add Product"
2. Fill in:
   - Product Name (e.g., "Steel Rods")
   - SKU (e.g., "STEEL-001")
   - Current Quantity (e.g., 100)
   - Price (e.g., 500.00)
   - Minimum Stock Level (e.g., 20)
   - Expiry Date (optional, e.g., "2024-12-31")
3. Click "Create Product"

### Viewing Alerts

1. Navigate to "Alerts" page
2. Switch between tabs:
   - **Low Stock**: Products below minimum stock
   - **Expiring Soon**: Products expiring within alert window
   - **Expired**: Products past expiry date
3. Click on any product to edit

### Updating Stock

1. Go to "Products" page
2. Click "Edit" on any product
3. Update the quantity field
4. Save changes

## Assumptions

1. **Authentication**: The system includes:
   - JWT-based authentication
   - Role-based access control (admin, staff)
   - Session management with localStorage
   - Protected routes for all inventory pages

2. **Single Currency**: Prices are displayed in Indian Rupees (₹). The system can be extended to support multiple currencies.

3. **Manual Stock Updates**: Stock additions/reductions are done manually through the edit form. The system can be extended with:
   - Stock movement history
   - Automatic stock adjustments from sales
   - Bulk import/export functionality

4. **Alert Window**: Default expiry alert window is 7 days, configurable via environment variable.

5. **No Soft Deletes**: Product deletion is permanent. Consider implementing soft deletes for production.

## Production Considerations

Before deploying to production:

1. **Change JWT Secret**: Update `JWT_SECRET` in `.env` with a strong, random key
2. **Add Input Sanitization**: Use libraries like `express-validator` for robust validation
3. **Add Rate Limiting**: Protect APIs from abuse
4. **Add Logging**: Implement proper logging (Winston, Morgan)
5. **Add Error Tracking**: Integrate error tracking (Sentry)
6. **Add Database Indexing**: Ensure proper indexes for performance
7. **Add CORS Configuration**: Configure CORS properly for production domains
8. **Add HTTPS**: Use HTTPS in production
9. **Add Backup Strategy**: Implement database backups
10. **Add Testing**: Add unit and integration tests

## Troubleshooting

### Backend won't start

- Check if MongoDB is running
- Verify MongoDB connection string in `.env`
- Check if port 5000 is available

### Frontend can't connect to backend

- Verify backend is running on the correct port
- Check `NEXT_PUBLIC_API_URL` in `.env.local`
- Check CORS settings in backend

### Products not showing

- Verify MongoDB connection
- Check browser console for errors
- Verify API endpoints are accessible

## License

This project is open source and available for use.

## Support

For issues or questions, please check the code comments or create an issue in the repository.

