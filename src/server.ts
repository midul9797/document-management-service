/* eslint-disable no-console */
import mongoose from 'mongoose';
import config from './config';
import { Server } from 'http';
import app from './app';
let server: Server;
process.on('uncaughtException', error => {
  console.log(error);
  process.exit(1);
});
async function boostrap() {
  try {
    await mongoose.connect(config.database_url as string);
    console.log('DB connected');
    server = app.listen(config.port, () => {
      console.log(config.port);
    });
  } catch (error) {
    console.log('Failed to connect' + error);
  }
  process.on('unhandledRejection', error => {
    if (server) {
      server.close(() => {
        console.log(error);
        process.exit(1);
      });
    } else process.exit(1);
  });
}
boostrap();
process.on('SIGTERM', error => {
  console.log('SIGTERM recieved' + error);
  if (server) server.close();
});
