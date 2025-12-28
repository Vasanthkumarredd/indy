# Inventory Management System

<<<<<<< HEAD
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

=======


## Getting started

To make it easy for you to get started with GitLab, here's a list of recommended next steps.

Already a pro? Just edit this README.md and make it your own. Want to make it easy? [Use the template at the bottom](#editing-this-readme)!

## Add your files

* [Create](https://docs.gitlab.com/ee/user/project/repository/web_editor.html#create-a-file) or [upload](https://docs.gitlab.com/ee/user/project/repository/web_editor.html#upload-a-file) files
* [Add files using the command line](https://docs.gitlab.com/topics/git/add_files/#add-files-to-a-git-repository) or push an existing Git repository with the following command:

```
cd existing_repo
git remote add origin https://gitlab.com/shreevyshnavia.btech22/inventory-management-system.git
git branch -M main
git push -uf origin main
```

## Integrate with your tools

* [Set up project integrations](https://gitlab.com/shreevyshnavia.btech22/inventory-management-system/-/settings/integrations)

## Collaborate with your team

* [Invite team members and collaborators](https://docs.gitlab.com/ee/user/project/members/)
* [Create a new merge request](https://docs.gitlab.com/ee/user/project/merge_requests/creating_merge_requests.html)
* [Automatically close issues from merge requests](https://docs.gitlab.com/ee/user/project/issues/managing_issues.html#closing-issues-automatically)
* [Enable merge request approvals](https://docs.gitlab.com/ee/user/project/merge_requests/approvals/)
* [Set auto-merge](https://docs.gitlab.com/user/project/merge_requests/auto_merge/)

## Test and Deploy

Use the built-in continuous integration in GitLab.

* [Get started with GitLab CI/CD](https://docs.gitlab.com/ee/ci/quick_start/)
* [Analyze your code for known vulnerabilities with Static Application Security Testing (SAST)](https://docs.gitlab.com/ee/user/application_security/sast/)
* [Deploy to Kubernetes, Amazon EC2, or Amazon ECS using Auto Deploy](https://docs.gitlab.com/ee/topics/autodevops/requirements.html)
* [Use pull-based deployments for improved Kubernetes management](https://docs.gitlab.com/ee/user/clusters/agent/)
* [Set up protected environments](https://docs.gitlab.com/ee/ci/environments/protected_environments.html)

***

# Editing this README

When you're ready to make this README your own, just edit this file and use the handy template below (or feel free to structure it however you want - this is just a starting point!). Thanks to [makeareadme.com](https://www.makeareadme.com/) for this template.

## Suggestions for a good README

Every project is different, so consider which of these sections apply to yours. The sections used in the template are suggestions for most open source projects. Also keep in mind that while a README can be too long and detailed, too long is better than too short. If you think your README is too long, consider utilizing another form of documentation rather than cutting out information.

## Name
Choose a self-explaining name for your project.

## Description
Let people know what your project can do specifically. Provide context and add a link to any reference visitors might be unfamiliar with. A list of Features or a Background subsection can also be added here. If there are alternatives to your project, this is a good place to list differentiating factors.

## Badges
On some READMEs, you may see small images that convey metadata, such as whether or not all the tests are passing for the project. You can use Shields to add some to your README. Many services also have instructions for adding a badge.

## Visuals
Depending on what you are making, it can be a good idea to include screenshots or even a video (you'll frequently see GIFs rather than actual videos). Tools like ttygif can help, but check out Asciinema for a more sophisticated method.

## Installation
Within a particular ecosystem, there may be a common way of installing things, such as using Yarn, NuGet, or Homebrew. However, consider the possibility that whoever is reading your README is a novice and would like more guidance. Listing specific steps helps remove ambiguity and gets people to using your project as quickly as possible. If it only runs in a specific context like a particular programming language version or operating system or has dependencies that have to be installed manually, also add a Requirements subsection.

## Usage
Use examples liberally, and show the expected output if you can. It's helpful to have inline the smallest example of usage that you can demonstrate, while providing links to more sophisticated examples if they are too long to reasonably include in the README.

## Support
Tell people where they can go to for help. It can be any combination of an issue tracker, a chat room, an email address, etc.

## Roadmap
If you have ideas for releases in the future, it is a good idea to list them in the README.

## Contributing
State if you are open to contributions and what your requirements are for accepting them.

For people who want to make changes to your project, it's helpful to have some documentation on how to get started. Perhaps there is a script that they should run or some environment variables that they need to set. Make these steps explicit. These instructions could also be useful to your future self.

You can also document commands to lint the code or run tests. These steps help to ensure high code quality and reduce the likelihood that the changes inadvertently break something. Having instructions for running tests is especially helpful if it requires external setup, such as starting a Selenium server for testing in a browser.

## Authors and acknowledgment
Show your appreciation to those who have contributed to the project.

## License
For open source projects, say how it is licensed.

## Project status
If you have run out of energy or time for your project, put a note at the top of the README saying that development has slowed down or stopped completely. Someone may choose to fork your project or volunteer to step in as a maintainer or owner, allowing your project to keep going. You can also make an explicit request for maintainers.
>>>>>>> 7555c4f3e046f75085d2614444ece82ba65f9d3b
