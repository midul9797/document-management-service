import {
  recycleBinCleanupJob,
  runRecycleBinCleanupNow,
  startRecycleBinCleanup,
  stopRecycleBinCleanup,
} from './recycleBinCleanup';

// Export all cron jobs and their management functions
export {
  recycleBinCleanupJob,
  runRecycleBinCleanupNow,
  startRecycleBinCleanup,
  stopRecycleBinCleanup,
};

// Function to start all cron jobs
export const startCronJobs = () => {
  console.log('🚀 Starting cron jobs...');

  // Start recycle bin cleanup
  startRecycleBinCleanup();

  console.log('✅ All cron jobs started successfully');
};

// Function to stop all cron jobs
export const stopCronJobs = () => {
  console.log('🛑 Stopping cron jobs...');

  // Stop recycle bin cleanup
  stopRecycleBinCleanup();

  console.log('✅ All cron jobs stopped successfully');
};

// Function to run cleanup manually (for testing)
export const runCleanupNow = async () => {
  console.log('🧹 Running cleanup manually...');
  return await runRecycleBinCleanupNow();
};
