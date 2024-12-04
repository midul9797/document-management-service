import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import httpStatus from 'http-status';
import globalErrorHandler from './app/middlewares/globalErrorHandler';
import router from './app/routes';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
const app: Application = express();
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use(
  cors({
    // origin: 'https://shohojogi.vercel.app',
    origin: '*',
    credentials: true,
  })
);
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/v1', router);
app.use(globalErrorHandler);
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
