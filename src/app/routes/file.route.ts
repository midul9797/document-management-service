import express from 'express'; // Import express for routing
import validateRequest from '../middlewares/validateRequest'; // Middleware for request validation
import { fileValidation } from '../validations/file.validation'; // File validation schemas
import { fileController } from '../controllers/file.controller'; // File controller for handling file operations
import auth from '../middlewares/auth'; // Middleware for authentication

// Initialize the express router
const router = express.Router();

// Define routes for file operations
router
  .post(
    '/upload', // Route for uploading a file
    auth(), // Authenticate the request
    validateRequest(fileValidation.uploadFileZodSchema), // Validate the request against the upload schema
    fileController.uploadFile, // Handle the file upload
  )

  .get('/download/:fileId', auth(), fileController.downloadFile) // Route for downloading a file
  .get('/share', auth(), fileController.getSharedFiles) // Route for getting shared files
  .get('/:fileId', auth(), fileController.getFile) // Route for getting a specific file
  .get('/', auth(), fileController.getFiles) // Route for getting all files
  .patch('/share', auth(), fileController.shareFile) // Route for sharing a file
  .patch(
    '/:fileId', // Route for updating a file
    auth(), // Authenticate the request
    validateRequest(fileValidation.updateFileZodSchema), // Validate the request against the update schema
    fileController.updateFile, // Handle the file update
  )
  .delete('/:fileId', auth(), fileController.deleteFile); // Route for deleting a file

// Export the file routes
export const FileRoutes = router;
