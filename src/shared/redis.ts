import { SetOptions, createClient } from 'redis';
import config from '../config';

// Create a Redis client for general operations
const redisClient = createClient({
  url: config.redis.url,
});

// Create a Redis client for publishing messages
const redisPubClient = createClient({
  url: config.redis.url,
});

// Create a Redis client for subscribing to messages
const redisSubClient = createClient({
  url: config.redis.url,
});

// Handle Redis client errors and connections
redisClient.on('error', error => console.log('RedisError', error));
redisClient.on('connect', error => console.log('Redis Connected'));

// Function to connect all Redis clients
const connect = async (): Promise<void> => {
  await redisClient.connect();
  await redisPubClient.connect();
  await redisSubClient.connect();
};

// Function to set file metadata cache
const setFileCache = async (userId: string, data: string): Promise<void> => {
  const key = `fileMetaData:${userId}`;
  await redisClient.set(key, data, { EX: Number(config.redis.expires_in) });
};

// Function to get file metadata cache
const getFileCache = async (userId: string): Promise<string | null> => {
  const key = `fileMetaData:${userId}`;
  return JSON.parse((await redisClient.get(key)) as string);
};

// Function to delete file metadata cache
const delFileCache = async (userId: string): Promise<void> => {
  const key = `fileMetaData:${userId}`;
  await redisClient.del(key);
};

// Function to disconnect all Redis clients
const disconnect = async (): Promise<void> => {
  await redisClient.quit();
  await redisPubClient.quit();
  await redisSubClient.quit();
};

// Export the Redis client with its methods
export const RedisClient = {
  connect,
  setFileCache,
  getFileCache,
  delFileCache,
  disconnect,
  publish: redisPubClient.publish.bind(redisPubClient),
  subscribe: redisSubClient.subscribe.bind(redisSubClient),
};
