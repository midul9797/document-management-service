import { z } from 'zod'; // Import zod for schema validation

// Define the schema for uploading a file
const uploadFileZodSchema = z.object({
  body: z.object({
    name: z.string(), // File name as a string
    size: z.number(), // File size as a number
    type: z.string(), // File type as a string
    data: z.string(), // File data as a string
  }),
});

// Define the schema for updating a file
const updateFileZodSchema = z.object({
  body: z.object({
    name: z.string().optional(), // File name as a string (optional)
    size: z.number().optional(), // File size as a number (optional)
    type: z.string().optional(), // File type as a string (optional)
    data: z.string().optional(), // File data as a string (optional)
  }),
});

// Define the schema for sharing a file
const shareFileZodSchema = z.object({
  body: z.object({
    fileId: z.string(), // File ID as a string
    email: z.string(), // Email as a string
    types: z.array(z.string()), // Array of types as strings
  }),
});

// Export the file validation schemas
export const fileValidation = {
  uploadFileZodSchema,
  updateFileZodSchema,
  shareFileZodSchema,
};
