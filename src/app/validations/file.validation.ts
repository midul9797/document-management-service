import { z } from 'zod';

const uploadFileZodSchema = z.object({
  body: z.object({
    name: z.string(),
    size: z.number(),
    type: z.string(),
    data: z.string(),
  }),
});
const updateFileZodSchema = z.object({
  body: z.object({
    name: z.string().optional(),
    size: z.number().optional(),
    type: z.string().optional(),
    data: z.string().optional(),
  }),
});
const shareFileZodSchema = z.object({
  body: z.object({
    fileId: z.string(),
    email: z.string(),
    types: z.array(z.string()),
  }),
});

export const fileValidation = {
  uploadFileZodSchema,
  updateFileZodSchema,
  shareFileZodSchema,
};
