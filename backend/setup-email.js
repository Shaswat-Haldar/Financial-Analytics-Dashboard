const fs = require('fs');
const path = require('path');

console.log('📧 Email Configuration Setup for Financial Dashboard');
console.log('==================================================\n');

console.log('To enable password reset emails, you need to:');
console.log('');
console.log('1. Create a .env file in the backend directory');
console.log('2. Add your email credentials to the .env file');
console.log('');
console.log('Example .env file content:');
console.log('');

const envContent = `# Server Configuration
PORT=5000
NODE_ENV=development

# MongoDB Configuration (Docker)
MONGODB_URI=mongodb://admin:password123@localhost:27017/financial_dashboard?authSource=admin

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=24h

# Email Configuration (for password reset)
# For Gmail, you need to use an App Password, not your regular password
# Go to Google Account settings > Security > 2-Step Verification > App passwords
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
FRONTEND_URL=http://localhost:3000

# CORS Configuration
CORS_ORIGIN=http://localhost:3000

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100`;

console.log(envContent);
console.log('');
console.log('📝 Instructions for Gmail:');
console.log('1. Enable 2-Step Verification on your Google account');
console.log('2. Go to Google Account settings > Security > 2-Step Verification');
console.log('3. Click on "App passwords"');
console.log('4. Generate a new app password for "Mail"');
console.log('5. Use that password as EMAIL_PASS in your .env file');
console.log('');
console.log('⚠️  Important: Never commit your .env file to version control!');
console.log('   The .env file should be in your .gitignore');
console.log('');
console.log('🔄 After creating the .env file, restart your backend server.');
console.log('');
console.log('💡 For development, if you don\'t want to set up email:');
console.log('   The app will work without email credentials - reset tokens will be logged to console.'); 