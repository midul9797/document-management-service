import { Response } from 'express';

// Define the structure of the API response
type IApiResponse<T> = {
  statusCode: number; // HTTP status code
  success: boolean; // Indicates if the request was successful
  message?: string | null; // Optional message to be sent with the response
  meta?: {
    name: string; // Name of the metadata
    size: number; // Size of the metadata
    type: string; // Type of the metadata
    version: number; // Version of the metadata
  }; // Optional metadata
  data?: T | null; // Optional data to be sent with the response
};

// Function to send a response to the client
const sendResponse = <T>(res: Response, data: IApiResponse<T>): void => {
  // Prepare the response data by ensuring all optional fields are properly handled
  const responseData: IApiResponse<T> = {
    statusCode: data.statusCode,
    success: data.success,
    message: data.message || null, // Ensure message is null if not provided
    meta: data.meta || undefined, // Ensure meta is undefined if not provided
    data: data.data || null, // Ensure data is null if not provided
  };
  // Send the response to the client with the appropriate status code and data
  res.status(data.statusCode).json(responseData);
};
export default sendResponse;
