const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Connect to MongoDB
const mongoURI = 'mongodb://admin:password123@localhost:27017/financial_dashboard?authSource=admin';

async function updateMongoExpressPasswords() {
  try {
    await mongoose.connect(mongoURI);
    console.log('✅ Connected to MongoDB');

    // Get the User model
    const { UserModel } = require('./src/models/User.ts');

    // Clear existing users first
    await UserModel.deleteMany({});
    console.log('🗑️  Cleared existing users');

    // Create users with the passwords changed in MongoDB Express
    const users = await UserModel.create([
      {
        email: 'john@example.com',
        password: 'johnexample', // Will be hashed by User model
        firstName: 'John',
        lastName: 'Doe',
        role: 'user'
      },
      {
        email: 'jane@example.com',
        password: 'janeexample', // Will be hashed by User model
        firstName: 'Jane',
        lastName: 'Smith',
        role: 'user'
      },
      {
        email: 'admin@example.com',
        password: 'adminexample', // Will be hashed by User model
        firstName: 'Admin',
        lastName: 'User',
        role: 'admin'
      }
    ]);

    console.log('✅ Updated users with MongoDB Express passwords');
    
    // Test the passwords
    console.log('\n🔍 Testing MongoDB Express passwords:');
    for (const user of users) {
      console.log(`\nUser: ${user.email}`);
      console.log(`Password hash: ${user.password}`);
      
      // Test with the correct passwords
      let testPassword;
      if (user.email === 'john@example.com') {
        testPassword = 'johnexample';
      } else if (user.email === 'jane@example.com') {
        testPassword = 'janeexample';
      } else if (user.email === 'admin@example.com') {
        testPassword = 'adminexample';
      }
      
      const testResult = await user.comparePassword(testPassword);
      console.log(`Password '${testPassword}' comparison: ${testResult}`);
    }

    console.log('\n🔑 MongoDB Express Login Credentials:');
    console.log('Email: john@example.com | Password: johnexample');
    console.log('Email: jane@example.com | Password: janeexample');
    console.log('Email: admin@example.com | Password: adminexample');

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
  }
}

updateMongoExpressPasswords(); 