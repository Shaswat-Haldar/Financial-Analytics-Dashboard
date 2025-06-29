import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { UserModel } from '../models/User';
import { TransactionModel } from '../models/Transaction';
import dotenv from 'dotenv';

dotenv.config();

const sampleCategories = [
  'Salary',
  'Freelance',
  'Investment',
  'Food',
  'Transportation',
  'Entertainment',
  'Shopping',
  'Healthcare',
  'Utilities',
  'Rent',
  'Insurance',
  'Education'
];

const sampleTransactions = [
  // Income transactions
  {
    title: 'Monthly Salary',
    description: 'Regular monthly salary payment',
    amount: 5000,
    type: 'income' as const,
    category: 'Salary',
    status: 'completed' as const,
    tags: ['salary', 'monthly']
  },
  {
    title: 'Freelance Project',
    description: 'Web development project for client',
    amount: 1500,
    type: 'income' as const,
    category: 'Freelance',
    status: 'completed' as const,
    tags: ['freelance', 'project']
  },
  {
    title: 'Dividend Payment',
    description: 'Quarterly dividend from investments',
    amount: 300,
    type: 'income' as const,
    category: 'Investment',
    status: 'completed' as const,
    tags: ['investment', 'dividend']
  },
  // Expense transactions
  {
    title: 'Grocery Shopping',
    description: 'Weekly grocery shopping at supermarket',
    amount: 120.50,
    type: 'expense' as const,
    category: 'Food',
    status: 'completed' as const,
    tags: ['essential', 'weekly']
  },
  {
    title: 'Gas Station',
    description: 'Fuel for car',
    amount: 45.00,
    type: 'expense' as const,
    category: 'Transportation',
    status: 'completed' as const,
    tags: ['fuel', 'car']
  },
  {
    title: 'Netflix Subscription',
    description: 'Monthly streaming service',
    amount: 15.99,
    type: 'expense' as const,
    category: 'Entertainment',
    status: 'completed' as const,
    tags: ['subscription', 'entertainment']
  },
  {
    title: 'Restaurant Dinner',
    description: 'Dinner with friends',
    amount: 85.00,
    type: 'expense' as const,
    category: 'Food',
    status: 'completed' as const,
    tags: ['dining', 'social']
  },
  {
    title: 'Clothing Purchase',
    description: 'New clothes from department store',
    amount: 200.00,
    type: 'expense' as const,
    category: 'Shopping',
    status: 'completed' as const,
    tags: ['clothing', 'personal']
  },
  {
    title: 'Doctor Visit',
    description: 'Annual health checkup',
    amount: 150.00,
    type: 'expense' as const,
    category: 'Healthcare',
    status: 'completed' as const,
    tags: ['health', 'annual']
  },
  {
    title: 'Electricity Bill',
    description: 'Monthly electricity payment',
    amount: 75.00,
    type: 'expense' as const,
    category: 'Utilities',
    status: 'completed' as const,
    tags: ['utilities', 'monthly']
  }
];

const seedDatabase = async () => {
  try {
    // Connect to MongoDB (Docker)
    const mongoURI = process.env.MONGODB_URI || 'mongodb://admin:password123@localhost:27017/financial_dashboard?authSource=admin';
    await mongoose.connect(mongoURI);
    console.log('✅ Connected to MongoDB (Docker)');

    // Clear existing data
    await UserModel.deleteMany({});
    await TransactionModel.deleteMany({});
    console.log('🗑️  Cleared existing data');

    // Create sample users with plain text passwords (will be hashed by User model)
    const users = await UserModel.create([
      {
        email: 'john@example.com',
        password: 'password123',
        firstName: 'John',
        lastName: 'Doe',
        role: 'user'
      },
      {
        email: 'jane@example.com',
        password: 'password123',
        firstName: 'Jane',
        lastName: 'Smith',
        role: 'user'
      },
      {
        email: 'admin@example.com',
        password: 'password123',
        firstName: 'Admin',
        lastName: 'User',
        role: 'admin'
      }
    ]);
    
    console.log(`👥 Created ${users.length} users`);

    // Create sample transactions for the last 6 months
    const transactions = [];
    const now = new Date();
    
    for (let i = 0; i < 50; i++) {
      const randomTransaction = sampleTransactions[Math.floor(Math.random() * sampleTransactions.length)];
      const randomDate = new Date(now.getTime() - Math.random() * 180 * 24 * 60 * 60 * 1000); // Random date within last 6 months
      let randomizedAmount = randomTransaction.amount + (Math.random() - 0.5) * 50;
      randomizedAmount = Math.max(0, randomizedAmount); // Clamp to minimum 0
      
      const user = users[Math.floor(Math.random() * users.length)];
      
      transactions.push({
        ...randomTransaction,
        userId: user._id,
        date: randomDate,
        amount: randomizedAmount
      });
    }

    await TransactionModel.insertMany(transactions);
    console.log(`💰 Created ${transactions.length} sample transactions`);

    console.log('✅ Database seeding completed successfully!');
    console.log('\n🔑 Sample Login Credentials:');
    console.log('Email: john@example.com | Password: password123');
    console.log('Email: jane@example.com | Password: password123');
    console.log('Email: admin@example.com | Password: password123');

  } catch (error) {
    console.error('❌ Error seeding database:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
  }
};

// Run the seeding script
if (require.main === module) {
  seedDatabase();
}

export default seedDatabase; 