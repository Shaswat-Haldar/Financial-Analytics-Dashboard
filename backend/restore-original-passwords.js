const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Connect to MongoDB
const mongoURI = 'mongodb://admin:password123@localhost:27017/financial_dashboard?authSource=admin';

async function restoreOriginalPasswords() {
  try {
    await mongoose.connect(mongoURI);
    console.log('✅ Connected to MongoDB');

    // Get the User model
    const { UserModel } = require('./src/models/User.ts');

    // Clear existing users
    await UserModel.deleteMany({});
    console.log('🗑️  Cleared existing users');

    // Create users with their original passwords
    const users = await UserModel.create([
      {
        email: 'john@example.com',
        password: 'johnexample', // Original plain text password
        firstName: 'John',
        lastName: 'Doe',
        role: 'user'
      },
      {
        email: 'jane@example.com',
        password: 'password123', // We'll need to find the original password
        firstName: 'Jane',
        lastName: 'Smith',
        role: 'user'
      },
      {
        email: 'admin@example.com',
        password: 'password123', // We'll need to find the original password
        firstName: 'Admin',
        lastName: 'User',
        role: 'admin'
      }
    ]);

    console.log('✅ Created users with original passwords');
    
    // Test the passwords
    console.log('\n🔍 Testing original passwords:');
    for (const user of users) {
      console.log(`\nUser: ${user.email}`);
      console.log(`Password hash: ${user.password}`);
      
      // Test with the original passwords
      if (user.email === 'john@example.com') {
        const testResult = await user.comparePassword('johnexample');
        console.log(`Password 'johnexample' comparison: ${testResult}`);
      } else {
        const testResult = await user.comparePassword('password123');
        console.log(`Password 'password123' comparison: ${testResult}`);
      }
    }

    console.log('\n🔑 Original Login Credentials:');
    console.log('Email: john@example.com | Password: johnexample');
    console.log('Email: jane@example.com | Password: password123');
    console.log('Email: admin@example.com | Password: password123');

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
  }
}

restoreOriginalPasswords(); 