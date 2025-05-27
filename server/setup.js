const { createTables } = require('./config/init');
const { validateEnvVars } = require('./utils/helpers');

const setupDatabase = async () => {
  try {
    console.log('🔍 Validating environment variables...');
    validateEnvVars();
    
    console.log('🗄️  Creating database tables...');
    await createTables();
    
    console.log('✅ Database setup completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Database setup failed:', error.message);
    process.exit(1);
  }
};

setupDatabase();
