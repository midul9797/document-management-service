import dotenv from 'dotenv'; // Import dotenv to load environment variables
import path from 'path'; // Import path to manipulate file paths

// Load environment variables from .env file
dotenv.config({ path: path.join(process.cwd(), '.env') });

// Export configuration object
export default {
  env: process.env.NODE_ENV, // Environment variable for Node environment
  port: process.env.PORT, // Port number for the application
  database_url: process.env.DATABASE_URL, // URL for the database
  redis: {
    url: process.env.REDIS_URL, // URL for Redis
    expires_in: process.env.REDIS_CACHE_EXPIRE, // Expiration time for Redis cache
  },
};
