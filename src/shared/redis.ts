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
const setDocumentMetadataCache = async (
  userId: string,
  data: string,
): Promise<void> => {
  const key = `documentMetaData:${userId}`;
  await redisClient.set(key, data, { EX: Number(config.redis.expires_in) });
};

// Function to get file metadata cache
const getDocumentMetadataCache = async (
  userId: string,
): Promise<string | null> => {
  const key = `documentMetaData:${userId}`;
  return JSON.parse((await redisClient.get(key)) as string);
};

// Function to delete file metadata cache
const delDocumentMetadataCache = async (userId: string): Promise<void> => {
  const key = `documentMetaData:${userId}`;
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
  setDocumentMetadataCache,
  getDocumentMetadataCache,
  delDocumentMetadataCache,
  disconnect,
  publish: redisPubClient.publish.bind(redisPubClient),
  subscribe: redisSubClient.subscribe.bind(redisSubClient),
};
