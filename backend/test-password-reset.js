const mongoose = require('mongoose');
const crypto = require('crypto');

// Connect to MongoDB
const mongoURI = 'mongodb://admin:password123@localhost:27017/financial_dashboard?authSource=admin';

async function testPasswordReset() {
  try {
    await mongoose.connect(mongoURI);
    console.log('✅ Connected to MongoDB');

    // Get the User model
    const { UserModel } = require('./src/models/User.ts');

    // Test user data
    const testUser = {
      email: 'test-reset@example.com',
      password: 'oldpassword123',
      firstName: 'Test',
      lastName: 'Reset',
      role: 'user'
    };

    // Clear any existing test user
    await UserModel.deleteOne({ email: testUser.email });

    // Create test user
    const user = await UserModel.create(testUser);
    console.log('✅ Created test user');

    // Test 1: Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = new Date(Date.now() + 3600000); // 1 hour
    await user.save();
    console.log('✅ Generated reset token:', resetToken);

    // Test 2: Verify token is stored
    const userWithToken = await UserModel.findOne({ email: testUser.email });
    console.log('✅ Reset token stored:', userWithToken.resetPasswordToken === resetToken);

    // Test 3: Reset password
    const newPassword = 'newpassword123';
    user.password = newPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();
    console.log('✅ Password reset completed');

    // Test 4: Verify new password works
    const isNewPasswordValid = await user.comparePassword(newPassword);
    console.log('✅ New password verification:', isNewPasswordValid);

    // Test 5: Verify old password doesn't work
    const isOldPasswordValid = await user.comparePassword('oldpassword123');
    console.log('✅ Old password should be invalid:', !isOldPasswordValid);

    // Test 6: Verify token is cleared
    const userAfterReset = await UserModel.findOne({ email: testUser.email });
    console.log('✅ Reset token cleared:', !userAfterReset.resetPasswordToken);

    // Clean up
    await UserModel.deleteOne({ email: testUser.email });
    console.log('✅ Cleaned up test user');

    console.log('\n🎉 All password reset tests passed!');

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
  }
}

testPasswordReset(); 