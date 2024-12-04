import { SetOptions, createClient } from 'redis';
import config from '../config';
import { IFile } from '../app/interfaces/file.interface';

const redisClient = createClient({
  url: config.redis.url,
});

const redisPubClient = createClient({
  url: config.redis.url,
});

const redisSubClient = createClient({
  url: config.redis.url,
});

redisClient.on('error', error => console.log('RedisError', error));
redisClient.on('connect', error => console.log('Redis Connected'));

const connect = async (): Promise<void> => {
  await redisClient.connect();
  await redisPubClient.connect();
  await redisSubClient.connect();
};

const setFileCache = async (userId: string, data: string): Promise<void> => {
  const key = `fileMetaData:${userId}`;
  await redisClient.set(key, data, { EX: Number(config.redis.expires_in) });
};

const getFileCache = async (userId: string): Promise<string | null> => {
  const key = `fileMetaData:${userId}`;
  return JSON.parse((await redisClient.get(key)) as string);
};

const delFileCache = async (userId: string): Promise<void> => {
  const key = `fileMetaData:${userId}`;
  await redisClient.del(key);
};

const disconnect = async (): Promise<void> => {
  await redisClient.quit();
  await redisPubClient.quit();
  await redisSubClient.quit();
};

export const RedisClient = {
  connect,
  setFileCache,
  getFileCache,
  delFileCache,
  disconnect,
  publish: redisPubClient.publish.bind(redisPubClient),
  subscribe: redisSubClient.subscribe.bind(redisSubClient),
};
