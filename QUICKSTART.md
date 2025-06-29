# Quick Start Guide

Get the Financial Analytics Dashboard up and running in 5 minutes!

## Prerequisites

- Node.js (v16 or higher)
- Docker Desktop (for MongoDB) - **Recommended**
- npm or yarn

## Quick Setup

### Option 1: Using Docker (Recommended)

1. **Start MongoDB with Docker**
   ```bash
   docker-compose up -d
   ```

2. **Install dependencies**
   ```bash
   npm run install:all
   ```

3. **Set up environment**
   ```bash
   # Copy the example environment file
   cp backend/env.example backend/.env
   ```

4. **Seed the database with sample data**
   ```bash
   cd backend
   npm run seed
   ```

5. **Start the application**
   ```bash
   # From root directory - starts both frontend and backend
   npm run dev
   ```

6. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000
   - Mongo Express: http://localhost:8081 (admin/password123)

### Option 2: Local MongoDB Installation

1. **Install dependencies**
   ```bash
   npm run install:all
   ```

2. **Set up environment**
   ```bash
   # Copy the example environment file
   cp backend/env.example backend/.env
   ```

3. **Start MongoDB**
   ```bash
   # Start MongoDB service (adjust command for your OS)
   mongod
   ```

4. **Seed the database with sample data**
   ```bash
   cd backend
   npm run seed
   ```

5. **Start the application**
   ```bash
   # From root directory - starts both frontend and backend
   npm run dev
   ```

6. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000

## Demo Credentials

After running the seed script, you can login with:

**Regular Users:**
- Email: `john@example.com` | Password: `password123`
- Email: `jane@example.com` | Password: `password123`

**Admin User:**
- Email: `admin@example.com` | Password: `password123`

## What's Included

The seed script creates:
- 3 users (2 regular, 1 admin)
- 50 sample transactions across different categories
- 6 months of transaction history
- Various transaction types (income/expense)

## Features to Try

1. **Dashboard Overview**
   - View summary cards with total revenue, expenses, and net income
   - Interactive charts showing monthly trends and category breakdown

2. **Transaction Management**
   - Browse transactions with advanced filtering
   - Search across transaction fields
   - Sort by any column

3. **CSV Export**
   - Select specific columns to export
   - Apply filters before export
   - Automatic file download

4. **Authentication**
   - Register new users
   - Secure login/logout
   - JWT token management

## Docker Commands

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

## Troubleshooting

**Docker Issues:**
- Ensure Docker Desktop is running
- Check container status: `docker-compose ps`
- View logs: `docker-compose logs mongodb`

**MongoDB Connection Issues:**
- For Docker: Ensure containers are running: `docker-compose up -d`
- For Local: Ensure MongoDB is running: `mongod`
- Check connection string in `backend/.env`

**Port Conflicts:**
- Frontend runs on port 3000
- Backend runs on port 5000
- MongoDB runs on port 27017
- Mongo Express runs on port 8081
- Change ports in respective configuration files if needed

**Build Issues:**
- Clear node_modules and reinstall: `rm -rf node_modules && npm install`
- Check Node.js version: `node --version`

## Next Steps

- Customize the dashboard with your own data
- Add new transaction categories
- Implement additional features
- Deploy to production

For detailed documentation, see [README.md](./README.md) and [DOCKER_SETUP.md](./DOCKER_SETUP.md). 