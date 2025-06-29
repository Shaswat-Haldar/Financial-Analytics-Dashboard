import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { UserModel } from '../src/models/User';
import { TransactionModel } from '../src/models/Transaction';
import * as fs from 'fs';
import * as path from 'path';

interface TransactionData {
  id: number;
  date: string;
  amount: number;
  category: string;
  status: string;
  user_id: string;
  user_profile: string;
}

const seedData = async () => {
  try {
    // Connect to MongoDB (Docker)
    const mongoURI = process.env.MONGODB_URI || 'mongodb://admin:password123@localhost:27017/financial_dashboard?authSource=admin';
    
    await mongoose.connect(mongoURI);
    console.log('✅ Connected to MongoDB (Docker) for seeding');

    // Drop the entire database for a clean slate
    await mongoose.connection.db.dropDatabase();
    console.log('🗑️  Dropped the entire database');

    // Clear existing data
    await UserModel.deleteMany({});
    await TransactionModel.deleteMany({});
    console.log('🗑️  Cleared existing data');

    // Create users based on the dataset
    console.log('Attempting to create users...');
    const userArray = [
      {
        firstName: 'Alex',
        lastName: 'Johnson',
        email: 'alex@example.com',
        password: 'password123',
        role: 'user',
        profileImage: 'https://thispersondoesnotexist.com/'
      },
      {
        firstName: 'Sarah',
        lastName: 'Williams',
        email: 'sarah@example.com',
        password: 'password123',
        role: 'user',
        profileImage: 'https://thispersondoesnotexist.com/'
      },
      {
        firstName: 'Michael',
        lastName: 'Brown',
        email: 'michael@example.com',
        password: 'password123',
        role: 'user',
        profileImage: 'https://thispersondoesnotexist.com/'
      },
      {
        firstName: 'Emily',
        lastName: 'Davis',
        email: 'emily@example.com',
        password: 'password123',
        role: 'user',
        profileImage: 'https://thispersondoesnotexist.com/'
      }
    ];
    console.log('User emails to be created:', userArray.map(u => u.email));
    let users = [];
    for (const user of userArray) {
      try {
        const created = await UserModel.create(user);
        users.push(created);
        console.log('Created user:', created.email);
      } catch (err) {
        console.error('❌ Error creating user:', user.email, err);
      }
    }
    console.log(`👥 Created ${users.length} users`);
    console.log('Users:', users.map(u => u.email));

    // Create user mapping
    const userMapping: { [key: string]: any } = {
      'user_001': users[0]._id,
      'user_002': users[1]._id,
      'user_003': users[2]._id,
      'user_004': users[3]._id
    };

    // Read transaction data from JSON file
    const transactionsPath = path.join(__dirname, '..', 'transactions.json');
    const transactionsData: TransactionData[] = JSON.parse(fs.readFileSync(transactionsPath, 'utf8'));

    console.log(`📊 Found ${transactionsData.length} transactions in dataset`);

    // Transform and create transactions
    const transactions = transactionsData.map((tx: TransactionData) => {
      const userId = userMapping[tx.user_id];
      if (!userId) {
        throw new Error(`User mapping not found for ${tx.user_id}`);
      }

      // Determine transaction type based on category
      const type = tx.category.toLowerCase() === 'revenue' ? 'income' : 'expense';
      
      // For expenses, make amount negative
      const amount = type === 'expense' ? -Math.abs(tx.amount) : Math.abs(tx.amount);

      // Map status to allowed values
      let status = tx.status.toLowerCase();
      if (status === 'completed') status = 'paid';

      return {
        userId: userId,
        description: `${tx.category} transaction #${tx.id}`,
        amount: amount,
        category: tx.category,
        type: type,
        date: new Date(tx.date),
        status: status,
        tags: [tx.category.toLowerCase(), type, status]
      };
    });

    // Debug: print first 10 transaction statuses
    console.log('First 10 transaction statuses after mapping:', transactions.slice(0, 10).map(t => t.status));

    await TransactionModel.create(transactions);
    console.log(`💰 Created ${transactions.length} transactions`);

    // Calculate and display statistics
    const totalIncome = transactions
      .filter(tx => tx.type === 'income')
      .reduce((sum, tx) => sum + Math.abs(tx.amount), 0);
    
    const totalExpense = transactions
      .filter(tx => tx.type === 'expense')
      .reduce((sum, tx) => sum + Math.abs(tx.amount), 0);

    console.log('✅ Database seeded successfully!');
    console.log('📊 Dataset Statistics:');
    console.log(`   Total Income: $${totalIncome.toLocaleString()}`);
    console.log(`   Total Expenses: $${totalExpense.toLocaleString()}`);
    console.log(`   Net Balance: $${(totalIncome - totalExpense).toLocaleString()}`);
    
    // Display sample login credentials
    console.log('\n🔑 Sample Login Credentials:');
    console.log('Email: alex@example.com | Password: password123');
    console.log('Email: sarah@example.com | Password: password123');
    console.log('Email: michael@example.com | Password: password123');
    console.log('Email: emily@example.com | Password: password123');

    // Display transaction distribution per user
    console.log('\n👥 Transaction Distribution:');
    for (const [userId, user] of Object.entries(userMapping)) {
      const userTransactions = transactions.filter(tx => tx.userId.toString() === user.toString());
      const userIncome = userTransactions
        .filter(tx => tx.type === 'income')
        .reduce((sum, tx) => sum + Math.abs(tx.amount), 0);
      const userExpense = userTransactions
        .filter(tx => tx.type === 'expense')
        .reduce((sum, tx) => sum + Math.abs(tx.amount), 0);
      
      console.log(`   ${userId}: ${userTransactions.length} transactions | Income: $${userIncome.toLocaleString()} | Expenses: $${userExpense.toLocaleString()}`);
    }

  } catch (error) {
    console.error('❌ Seeding error:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
  }
};

// Run seeding if this file is executed directly
if (require.main === module) {
  seedData();
}

export { seedData }; 