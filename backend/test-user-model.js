const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Connect to MongoDB
const mongoURI = 'mongodb://admin:password123@localhost:27017/financial_dashboard?authSource=admin';

async function testUserModel() {
  try {
    await mongoose.connect(mongoURI);
    console.log('✅ Connected to MongoDB');

    // Get the User model
    const { UserModel } = require('./src/models/User.ts');

    // Test creating a user with the User model
    const testUser = new UserModel({
      email: 'test@example.com',
      password: 'password123',
      firstName: 'Test',
      lastName: 'User',
      role: 'user'
    });

    await testUser.save();
    console.log('✅ Test user created');
    console.log('Test user password hash:', testUser.password);

    // Test password comparison
    const isValid = await testUser.comparePassword('password123');
    console.log('✅ Password comparison result:', isValid);

    // Test with wrong password
    const isInvalid = await testUser.comparePassword('wrongpassword');
    console.log('❌ Wrong password comparison result:', isInvalid);

    // Get the seeded users and test their passwords
    const seededUsers = await UserModel.find({ email: { $in: ['john@example.com', 'jane@example.com', 'admin@example.com'] } });
    
    console.log('\n🔍 Testing seeded users:');
    for (const user of seededUsers) {
      console.log(`\nUser: ${user.email}`);
      console.log(`Password hash: ${user.password}`);
      
      const testResult = await user.comparePassword('password123');
      console.log(`Password 'password123' comparison: ${testResult}`);
      
      // Try some other common passwords
      const testResult2 = await user.comparePassword('password');
      console.log(`Password 'password' comparison: ${testResult2}`);
      
      const testResult3 = await user.comparePassword('123456');
      console.log(`Password '123456' comparison: ${testResult3}`);
    }

    // Clean up test user
    await UserModel.deleteOne({ email: 'test@example.com' });
    console.log('\n🧹 Cleaned up test user');

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
  }
}

testUserModel(); 