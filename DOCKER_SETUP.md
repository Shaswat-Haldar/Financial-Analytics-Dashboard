# Docker Setup Guide

This guide explains how to run the Financial Analytics Dashboard using Docker for MongoDB.

## 🐳 Prerequisites

- Docker Desktop installed and running
- Docker Compose installed
- Node.js and npm (for running the application)

## 🚀 Quick Start with Docker

### 1. Start MongoDB Container

```bash
# Start MongoDB and Mongo Express
docker-compose up -d

# Check if containers are running
docker-compose ps
```

### 2. Verify MongoDB is Running

```bash
# Check MongoDB logs
docker-compose logs mongodb

# Access Mongo Express (optional)
# Open http://localhost:8081 in your browser
# Username: admin, Password: password123
```

### 3. Set Up Environment Variables

```bash
# Copy environment file
cp backend/env.example backend/.env
```

The `.env` file should contain:
```
MONGODB_URI=mongodb://admin:password123@localhost:27017/financial_dashboard?authSource=admin
```

### 4. Install Dependencies

```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### 5. Seed the Database

```bash
# From the backend directory
cd backend
npm run seed
```

### 6. Start the Application

```bash
# Start backend (from backend directory)
npm run dev

# Start frontend (from frontend directory, in a new terminal)
cd frontend
npm start
```

## 📊 Docker Services

### MongoDB Container
- **Image**: mongo:7.0
- **Port**: 27017
- **Credentials**: admin/password123
- **Database**: financial_dashboard
- **Data Persistence**: Docker volume `mongodb_data`

### Mongo Express Container (Optional)
- **Image**: mongo-express:1.0.0
- **Port**: 8081
- **Web Interface**: http://localhost:8081
- **Credentials**: admin/password123

## 🔧 Docker Commands

```bash
# Start all services
docker-compose up -d

# Stop all services
docker-compose down

# View logs
docker-compose logs -f mongodb

# Restart services
docker-compose restart

# Remove containers and volumes (WARNING: This will delete all data)
docker-compose down -v

# Rebuild containers
docker-compose up -d --build
```

## 🗄️ Database Management

### Access MongoDB Shell
```bash
# Connect to MongoDB container
docker exec -it financial_dashboard_mongodb mongosh -u admin -p password123 --authenticationDatabase admin

# Switch to our database
use financial_dashboard

# View collections
show collections

# View documents
db.users.find()
db.transactions.find()
```

### Backup Database
```bash
# Create backup
docker exec financial_dashboard_mongodb mongodump --username admin --password password123 --authenticationDatabase admin --db financial_dashboard --out /data/backup

# Copy backup to host
docker cp financial_dashboard_mongodb:/data/backup ./backup
```

### Restore Database
```bash
# Copy backup to container
docker cp ./backup financial_dashboard_mongodb:/data/backup

# Restore database
docker exec financial_dashboard_mongodb mongorestore --username admin --password password123 --authenticationDatabase admin --db financial_dashboard /data/backup/financial_dashboard
```

## 🔍 Troubleshooting

### MongoDB Connection Issues
```bash
# Check if MongoDB is running
docker-compose ps

# Check MongoDB logs
docker-compose logs mongodb

# Restart MongoDB
docker-compose restart mongodb
```

### Port Conflicts
If port 27017 is already in use:
```bash
# Find what's using the port
netstat -ano | findstr :27017

# Stop the conflicting service or change the port in docker-compose.yml
```

### Data Persistence Issues
```bash
# Check volume
docker volume ls

# Inspect volume
docker volume inspect financial_analytics_dashboard_mongodb_data
```

## 🧹 Cleanup

```bash
# Stop and remove containers
docker-compose down

# Remove containers, networks, and volumes
docker-compose down -v

# Remove images
docker rmi mongo:7.0 mongo-express:1.0.0
```

## 📝 Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `MONGODB_URI` | MongoDB connection string | `mongodb://admin:password123@localhost:27017/financial_dashboard?authSource=admin` |
| `MONGO_INITDB_ROOT_USERNAME` | MongoDB root username | `admin` |
| `MONGO_INITDB_ROOT_PASSWORD` | MongoDB root password | `password123` |
| `MONGO_INITDB_DATABASE` | Initial database name | `financial_dashboard` |

## 🔒 Security Notes

- Change default passwords in production
- Use environment variables for sensitive data
- Consider using Docker secrets for production
- Restrict network access as needed
- Regularly update Docker images 