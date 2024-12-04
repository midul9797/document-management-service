import { NextFunction, RequestHandler, Response, Request } from 'express';

// catchAsync is a higher-order function that wraps an Express middleware function
// to catch any errors that might occur during its execution and pass them to the next middleware.
const catchAsync =
  (fn: RequestHandler) =>
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      // Attempt to execute the wrapped middleware function
      await fn(req, res, next);
    } catch (error) {
      // If an error occurs, pass it to the next middleware in the stack
      next(error);
    }
  };

export default catchAsync;
