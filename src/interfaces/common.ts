import { IGenericErrorMessage } from './error';

/**
 * Represents a generic error response from the server.
 * This includes the HTTP status code, a message describing the error, and an array of error messages.
 */
export type IGenericErrorResponse = {
  statusCode: number;
  message: string;
  errorMessages: IGenericErrorMessage[];
};

/**
 * Represents a generic response from the server.
 * This includes metadata about the response (page, limit, and total) and the actual data.
 */
export type IGenericResponse<T> = {
  meta: {
    page: number; // The current page number
    limit: number; // The limit of items per page
    total: number; // The total number of items
  };
  data: T; // The actual data being returned
};

/**
 * Represents a user making a request.
 * This includes the user's unique identifier.
 */
export type IRequestUser = {
  userId: string; // The user's unique identifier
};

/**
 * Interface for Clerk authentication token payload
 * This represents the structure of the payload within a Clerk authentication token.
 */
export type ClerkTokenPayload = {
  azp: string; // Authorized party
  clerkId: string; // Unique Clerk user ID
  email: string; // User's email
  exp: number; // Token expiration timestamp
  fva: [number, number]; // Feature version array
  iat: number; // Token issued at timestamp
  iss: string; // Token issuer
  jti: string; // JWT ID
  name: string; // User's name
  nbf: number; // Not before timestamp
  sid: string; // Session ID
  sub: string; // Subject (user identifier)
};
