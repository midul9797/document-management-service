import mongoose from 'mongoose'; // Import mongoose for error handling
import { IGenericErrorMessage } from '../interfaces/error'; // Import generic error message interface
import { IGenericErrorResponse } from '../interfaces/common'; // Import generic error response interface

// Function to handle validation errors and return a formatted error response
const handleValidationError = (
  error: mongoose.Error.ValidationError, // The validation error to be handled
): IGenericErrorResponse => {
  // Map over the error's errors object to extract path and message for each error
  const errors: IGenericErrorMessage[] = Object.values(error.errors).map(
    (el: mongoose.Error.ValidatorError | mongoose.Error.CastError) => {
      return { path: el?.path, message: el?.message }; // Return an object with path and message
    },
  );
  // Define the HTTP status code for the error response
  const statusCode = 400;
  // Return the formatted error response
  return {
    statusCode,
    message: 'Validation Error', // General message for validation errors
    errorMessages: errors, // Array of error messages
  };
};
// Export the handleValidationError function for use in other modules
export default handleValidationError;
