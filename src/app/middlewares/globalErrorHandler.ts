import { ErrorRequestHandler } from 'express';
import { IGenericErrorMessage } from '../../interfaces/error';
import handleValidationError from '../../errors/handleValidationError';
import ApiError from '../../errors/ApiError';
import config from '../../config';

// Define the global error handler function
const globalErrorHandler: ErrorRequestHandler = (error, req, res, next) => {
  // Initialize default error response values
  let statusCode = 500;
  let message = 'Something went wrong';
  let errorMessages: IGenericErrorMessage[] = [];

  // Handle ValidationError
  if (error?.name === 'ValidationError') {
    const simplifiedError = handleValidationError(error);
    statusCode = simplifiedError.statusCode;
    message = simplifiedError.message;
    errorMessages = simplifiedError.errorMessages;
  }
  // Handle ApiError
  else if (error instanceof ApiError) {
    statusCode = error?.statusCode;
    message = error.message;
    errorMessages = error?.message
      ? [{ path: '', message: error?.message }]
      : [];
  }
  // Handle general Error
  else if (error instanceof Error) {
    message = error?.message;
    errorMessages = error?.message
      ? [{ path: '', message: error?.message }]
      : [];
  }

  // Send error response
  res.status(statusCode).json({
    success: false,
    message,
    errorMessages,
    // Include error stack in development environment
    stack: config.env !== 'production' ? error?.stack : undefined,
  });

  // Continue the error handling process
  next();
};
export default globalErrorHandler;
