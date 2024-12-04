/* eslint-disable @typescript-eslint/consistent-type-definitions */

import { ClerkTokenPayload } from './common';

/**
 * Global type declarations to extend Express Request interface
 * Adds user property to store Clerk authentication token payload
 */
declare global {
  namespace Express {
    interface Request {
      /**
       * Contains the decoded Clerk JWT payload with user information
       * Null if request is not authenticated
       */
      user: ClerkTokenPayload | null;
    }
  }
}
