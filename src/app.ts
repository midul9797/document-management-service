// Import required dependencies
import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import httpStatus from 'http-status';
import globalErrorHandler from './app/middlewares/globalErrorHandler';
import router from './app/routes';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';

// Initialize express application
const app: Application = express();

// Configure body-parser middleware for handling large payloads
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

// Configure CORS middleware
app.use(
  cors({
    origin: '*', // Allow all origins
    credentials: true, // Allow credentials
  }),
);

// Configure middleware for parsing cookies and JSON payloads
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configure API routes
app.use('/api/v1', router);

// Configure error handling middleware
app.use(globalErrorHandler);

// Handle 404 Not Found errors
app.use((req: Request, res: Response) => {
  res.status(httpStatus.NOT_FOUND).json({
    success: false,
    message: 'Not Found',
    errorMessages: [
      {
        path: '.',
        message: 'API not found',
      },
    ],
  });
});

export default app;
