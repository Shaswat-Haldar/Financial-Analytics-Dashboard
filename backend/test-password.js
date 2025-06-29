const bcrypt = require('bcryptjs');

async function testPassword() {
  const plainPassword = 'password123';
  
  // Hash the password the same way the User model does
  const salt = await bcrypt.genSalt(12);
  const hashedPassword = await bcrypt.hash(plainPassword, salt);
  
  console.log('Plain password:', plainPassword);
  console.log('Hashed password:', hashedPassword);
  
  // Test comparison
  const isValid = await bcrypt.compare(plainPassword, hashedPassword);
  console.log('Password comparison result:', isValid);
  
  // Test with the actual hashed password from the database
  const dbPassword = '$2a$12$6RVQ82qsHGE4ydbEQD21C.ASVnvhqBLXQak7Mob8o4diHt7l3TsbO';
  const isValidDb = await bcrypt.compare(plainPassword, dbPassword);
  console.log('Database password comparison result:', isValidDb);
}

testPassword().catch(console.error); 