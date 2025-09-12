/* eslint-disable no-console */
import mongoose from 'mongoose';
import config from './config';
import { Server } from 'http';
import app from './app';
import { RedisClient } from './shared/redis';
import { startCronJobs } from './cron';

// Global server instance
let server: Server;

// Handle uncaught exceptions
process.on('uncaughtException', error => {
  console.log(error);
  process.exit(1);
});

// Bootstrap function to initialize database and server
async function boostrap() {
  try {
    // Connect to MongoDB database
    await mongoose.connect(config.database_url as string);
    console.log('DB connected');

    // Connect to Redis
    await RedisClient.connect();
    startCronJobs();
    // Start Express server
    server = app.listen(config.port, () => {
      console.log(config.port);
    });
  } catch (error) {
    console.log('Failed to connect' + error);
  }

  // Handle promise rejections
  process.on('unhandledRejection', error => {
    if (server) {
      // Gracefully close server before exiting
      server.close(() => {
        console.log(error);
        process.exit(1);
      });
    } else process.exit(1);
  });
}

// Initialize application
boostrap();

// Handle termination signal
process.on('SIGTERM', error => {
  console.log('SIGTERM recieved' + error);
  if (server) server.close();
});
