// MongoDB initialization script for Docker container
// This script runs when the MongoDB container starts for the first time

db = db.getSiblingDB('financial_dashboard');

// Create collections
db.createCollection('users');
db.createCollection('transactions');

// Create indexes for better performance
db.users.createIndex({ "email": 1 }, { unique: true });
db.transactions.createIndex({ "userId": 1 });
db.transactions.createIndex({ "date": -1 });
db.transactions.createIndex({ "category": 1 });
db.transactions.createIndex({ "type": 1 });

print('MongoDB initialization completed successfully!');
print('Database: financial_dashboard');
print('Collections: users, transactions');
print('Indexes created for optimal performance'); 