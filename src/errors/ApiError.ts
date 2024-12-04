// ApiError class extends the built-in Error class to provide additional properties and functionality
class ApiError extends Error {
  // statusCode property to hold the HTTP status code of the error
  statusCode: number;
  // Constructor to initialize the ApiError object
  constructor(statusCode: number, message: string | undefined, stack = '') {
    // Call the parent Error constructor with the provided message
    super(message);
    // Assign the statusCode to the instance
    this.statusCode = statusCode;
    // If a stack trace is provided, use it; otherwise, capture the stack trace
    if (stack) this.stack = stack;
    else Error.captureStackTrace(this, this.constructor);
  }
}
// Export the ApiError class for use in other modules
export default ApiError;
