# Financial Analytics Dashboard

A full-stack financial application with dynamic data visualization, advanced filtering, and configurable CSV export functionality.

## Features

### 🔐 Authentication & Security
- JWT-based login/logout system
- Secure API endpoints with token validation
- Password hashing with bcrypt
- Role-based access control

### 📊 Financial Dashboard
- **Visualizations**: Revenue vs expenses trends, category breakdowns, summary metrics
- **Transaction Table**: Paginated display with responsive design
- **Filtering**: Multi-field filters (Date, Amount, Category, Status, Type)
- **Sorting**: Column-based sorting with visual indicators
- **Search**: Real-time search across transaction fields

### 📁 CSV Export System
- **Column Configuration**: User selects which fields to export
- **Filter Integration**: Apply same filters as dashboard
- **Auto-download**: Automatic file download when ready

## Tech Stack

### Frontend
- **Framework**: React.js with TypeScript
- **UI Library**: Material-UI (MUI)
- **Charts**: Recharts
- **State Management**: React Context API
- **Routing**: React Router DOM
- **HTTP Client**: Axios

### Backend
- **Server**: Node.js with Express and TypeScript
- **Database**: MongoDB with Mongoose ODM (Docker support)
- **Authentication**: JWT (JSON Web Tokens)
- **File Processing**: CSV generation with csv-writer
- **Security**: Helmet, CORS, Rate limiting

## Project Structure

```
Financial Analytics Dashboard/
├── backend/                 # Backend API server
│   ├── src/
│   │   ├── config/         # Database configuration
│   │   ├── controllers/    # Route controllers
│   │   ├── middleware/     # Authentication middleware
│   │   ├── models/         # Mongoose models
│   │   ├── routes/         # API routes
│   │   ├── types/          # TypeScript type definitions
│   │   └── index.ts        # Server entry point
│   ├── scripts/            # Database scripts
│   ├── package.json
│   └── tsconfig.json
├── frontend/               # React frontend application
│   ├── public/            # Static files
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── contexts/      # React contexts
│   │   ├── services/      # API services
│   │   ├── types/         # TypeScript type definitions
│   │   ├── App.tsx        # Main app component
│   │   └── index.tsx      # Entry point
│   ├── package.json
│   └── tsconfig.json
├── docker-compose.yml      # Docker configuration
├── package.json           # Root package.json
├── README.md
└── DOCKER_SETUP.md        # Docker setup guide
```

## Prerequisites

- Node.js (v16 or higher)
- Docker Desktop (for MongoDB)
- npm or yarn

## Quick Start

### Option 1: Using Docker (Recommended)

1. **Start MongoDB with Docker**
   ```bash
   docker-compose up -d
   ```

2. **Install dependencies**
   ```bash
   # Install root dependencies
   npm install
   
   # Install backend dependencies
   cd backend
   npm install
   
   # Install frontend dependencies
   cd ../frontend
   npm install
   ```

3. **Set up environment**
   ```bash
   # Copy environment file
   cp backend/env.example backend/.env
   ```

4. **Seed the database**
   ```bash
   cd backend
   npm run seed
   ```

5. **Start the application**
   ```bash
   # From root directory - runs both frontend and backend
   npm run dev
   ```

### Option 2: Local MongoDB Installation

1. **Install MongoDB locally**
   - Follow [MongoDB installation guide](https://docs.mongodb.com/manual/installation/)
   - Start MongoDB service

2. **Install dependencies**
   ```bash
   # Install root dependencies
   npm install
   
   # Install backend dependencies
   cd backend
   npm install
   
   # Install frontend dependencies
   cd ../frontend
   npm install
   ```

3. **Environment Setup**

   Create `.env` file in the backend directory:
   ```env
   # Server Configuration
   PORT=5000
   NODE_ENV=development
   
   # MongoDB Configuration (Local)
   MONGODB_URI=mongodb://localhost:27017/financial_dashboard
   
   # JWT Configuration
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   JWT_EXPIRES_IN=24h
   
   # CORS Configuration
   CORS_ORIGIN=http://localhost:3000
   
   # Rate Limiting
   RATE_LIMIT_WINDOW_MS=900000
   RATE_LIMIT_MAX_REQUESTS=100
   ```

4. **Seed the database**
   ```bash
   cd backend
   npm run seed
   ```

5. **Run the application**
   ```bash
   # From root directory - runs both frontend and backend
   npm run dev
   ```

## Docker Setup

For detailed Docker setup instructions, see [DOCKER_SETUP.md](./DOCKER_SETUP.md).

### Quick Docker Commands

```bash
# Start MongoDB
docker-compose up -d

# Check status
docker-compose ps

# View logs
docker-compose logs mongodb

# Stop services
docker-compose down

# Access MongoDB shell
docker exec -it financial_dashboard_mongodb mongosh -u admin -p password123 --authenticationDatabase admin
```

## Access Points

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **Mongo Express**: http://localhost:8081 (admin/password123)

## Sample Login Credentials

After seeding the database:
- Email: `john@example.com` | Password: `password123`
- Email: `jane@example.com` | Password: `password123`
- Email: `admin@example.com` | Password: `password123`

## API Documentation

### Authentication Endpoints

#### POST /api/auth/register
Register a new user.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "firstName": "John",
  "lastName": "Doe"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "token": "jwt-token-here",
    "user": {
      "_id": "user-id",
      "email": "user@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "role": "user"
    }
  }
}
```

#### POST /api/auth/login
Login with existing credentials.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

#### GET /api/auth/profile
Get current user profile (requires authentication).

### Transaction Endpoints

#### GET /api/transactions
Get paginated transactions with filtering.

**Query Parameters:**
- `page` (number): Page number (default: 1)
- `limit` (number): Items per page (default: 10)
- `sortBy` (string): Sort field (default: 'date')
- `sortOrder` (string): 'asc' or 'desc' (default: 'desc')
- `startDate` (string): Start date filter
- `endDate` (string): End date filter
- `minAmount` (number): Minimum amount filter
- `maxAmount` (number): Maximum amount filter
- `category` (string): Category filter
- `status` (string): Status filter
- `type` (string): Type filter ('income' or 'expense')
- `search` (string): Text search

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "_id": "transaction-id",
      "title": "Salary",
      "amount": 5000,
      "type": "income",
      "category": "Salary",
      "status": "completed",
      "date": "2024-01-15T00:00:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 100,
    "totalPages": 10
  }
}
```

#### POST /api/transactions
Create a new transaction (requires authentication).

**Request Body:**
```json
{
  "title": "Grocery Shopping",
  "description": "Weekly groceries",
  "amount": 150.50,
  "type": "expense",
  "category": "Food",
  "status": "completed",
  "date": "2024-01-15T00:00:00.000Z",
  "tags": ["essential", "weekly"]
}
```

#### PUT /api/transactions/:id
Update a transaction (requires authentication).

#### DELETE /api/transactions/:id
Delete a transaction (requires authentication).

#### GET /api/transactions/stats
Get dashboard statistics (requires authentication).

**Response:**
```json
{
  "success": true,
  "data": {
    "totalRevenue": 25000,
    "totalExpenses": 15000,
    "netIncome": 10000,
    "transactionCount": 150,
    "categoryBreakdown": [
      {
        "category": "Salary",
        "amount": 20000,
        "count": 12
      }
    ],
    "monthlyTrends": [
      {
        "month": "January",
        "revenue": 5000,
        "expenses": 3000
      }
    ]
  }
}
```

#### POST /api/transactions/export
Export transactions to CSV (requires authentication).

**Request Body:**
```json
{
  "columns": ["title", "amount", "type", "category", "date"],
  "filters": {
    "startDate": "2024-01-01",
    "endDate": "2024-01-31",
    "type": "expense"
  },
  "format": "csv"
}
```

## CSV Export Format

The CSV export includes headers and properly formatted data:

```csv
Title,Amount,Type,Category,Date
Salary,5000.00,income,Salary,01/15/2024
Grocery Shopping,150.50,expense,Food,01/15/2024
Gas Station,45.00,expense,Transportation,01/16/2024
```

## Usage Examples

### 1. User Registration and Login
```javascript
// Register a new user
const response = await fetch('/api/auth/register', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'user@example.com',
    password: 'password123',
    firstName: 'John',
    lastName: 'Doe'
  })
});

// Login
const loginResponse = await fetch('/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'user@example.com',
    password: 'password123'
  })
});
```

### 2. Fetching Transactions with Filters
```javascript
// Get transactions with filters
const transactions = await fetch('/api/transactions?page=1&limit=10&type=expense&startDate=2024-01-01', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
});
```

### 3. Creating a Transaction
```javascript
// Create new transaction
const newTransaction = await fetch('/api/transactions', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify({
    title: 'Coffee',
    amount: 5.50,
    type: 'expense',
    category: 'Food',
    status: 'completed',
    date: new Date().toISOString()
  })
});
```

## Development

### Backend Development
```bash
cd backend
npm run dev  # Start development server with nodemon
npm run build  # Build for production
npm start  # Start production server
```

### Frontend Development
```bash
cd frontend
npm start  # Start development server
npm run build  # Build for production
npm test  # Run tests
```

### Database Seeding
You can add sample data by creating a seeding script in the backend:

```javascript
// backend/src/scripts/seed.js
const { UserModel, TransactionModel } = require('../models');

const seedData = async () => {
  // Create sample user
  const user = await UserModel.create({
    email: 'demo@example.com',
    password: 'password123',
    firstName: 'Demo',
    lastName: 'User'
  });

  // Create sample transactions
  await TransactionModel.create([
    {
      userId: user._id,
      title: 'Salary',
      amount: 5000,
      type: 'income',
      category: 'Salary',
      status: 'completed',
      date: new Date()
    },
    // Add more sample transactions...
  ]);
};
```

## Deployment

### Backend Deployment
1. Set environment variables for production
2. Build the TypeScript code: `npm run build`
3. Start the production server: `npm start`

### Frontend Deployment
1. Build the React app: `npm run build`
2. Deploy the `build` folder to your hosting service

### Environment Variables for Production
```env
NODE_ENV=production
MONGODB_URI=your-production-mongodb-uri
JWT_SECRET=your-production-jwt-secret
CORS_ORIGIN=your-frontend-domain
```

## Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: Bcrypt for password security
- **CORS Protection**: Configured for specific origins
- **Rate Limiting**: Prevents abuse of API endpoints
- **Input Validation**: Express-validator for request validation
- **Helmet**: Security headers for Express
- **MongoDB Injection Protection**: Mongoose provides built-in protection

## Performance Optimizations

- **Database Indexing**: Optimized indexes for common queries
- **Pagination**: Server-side pagination for large datasets
- **Compression**: Gzip compression for API responses
- **Caching**: Ready for Redis integration
- **Lazy Loading**: Frontend components loaded on demand

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support and questions, please open an issue in the repository. 