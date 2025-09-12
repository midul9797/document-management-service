import { runCleanupNow } from './index';

/**
 * Test script to run the recycle bin cleanup manually
 * This can be used to test the functionality without waiting for the scheduled time
 */
console.log('🧪 Testing recycle bin cleanup...');

// Run the cleanup immediately
runCleanupNow()
  .then(() => {
    console.log('✅ Test completed successfully');
    process.exit(0);
  })
  .catch((error: unknown) => {
    console.error('❌ Test failed:', error);
    process.exit(1);
  });
