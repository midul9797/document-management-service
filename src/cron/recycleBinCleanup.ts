import cron from 'node-cron';
import { File } from '../app/models/document.metadata.model';

// Function to run the cleanup task
const runCleanup = async () => {
  console.log('🗑️ Running recycle bin cleanup job...');

  try {
    const result = await File.deleteMany({
      isDeleted: true,
      deletedAt: {
        $lt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // older than 30 days
      },
    });

    console.log(`✅ Deleted ${result.deletedCount} expired trashed documents.`);
    return result;
  } catch (error) {
    console.error('❌ Error running cleanup job:', error);
    throw error;
  }
};

// Schedule the cron job - runs every day at midnight
const recycleBinCleanupJob = cron.schedule('0 0 * * *', runCleanup, {
  timezone: 'UTC', // Use UTC timezone
});

// Export the job and the cleanup function
export { recycleBinCleanupJob, runCleanup };

// Start the cron job
export const startRecycleBinCleanup = () => {
  recycleBinCleanupJob.start();
  console.log('🔄 Recycle bin cleanup cron job started');
};

// Stop the cron job
export const stopRecycleBinCleanup = () => {
  recycleBinCleanupJob.stop();
  console.log('🛑 Recycle bin cleanup cron job stopped');
};

// Run cleanup manually (for testing or immediate execution)
export const runRecycleBinCleanupNow = async () => {
  return await runCleanup();
};
