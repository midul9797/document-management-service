import { NextFunction, Request, Response } from 'express';
import { AnyZodObject } from 'zod';
// Middleware function to validate the request against a Zod schema
const validateRequest =
  (schema: AnyZodObject) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Parse the request body, query, params, and cookies against the schema
      await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
        cookies: req.cookies,
      });
      // If the request is valid, proceed to the next middleware
      return next();
    } catch (error) {
      // If the request is invalid, pass the error to the error handling middleware
      next(error);
    }
  };
// Export the validateRequest middleware function
export default validateRequest;
