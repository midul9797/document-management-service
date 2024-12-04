import { Schema, model } from 'mongoose'; // Import mongoose for schema and model creation
import { IFile, FilesModel } from '../interfaces/file.interface'; // Import file interface for type definitions

// Define the schema for the File model
const fileSchema = new Schema<IFile, FilesModel>(
  {
    name: { type: String, required: true }, // File name as a string, required
    type: { type: String, required: true }, // File type as a string, required
    size: { type: Number, required: true }, // File size as a number, required
    data: { type: String, required: true }, // File data as a string, required
    author: { type: { id: String, name: String }, required: true }, // Author details, required
    version: { type: Number }, // File version number, optional
    accessPermissions: {
      type: {
        edit: { type: [String] }, // Array of strings for edit permissions
        view: { type: [String] }, // Array of strings for view permissions
        delete: { type: [String] }, // Array of strings for delete permissions
      },
    },
  },
  { timestamps: true }, // Include timestamps for creation and modification dates
);
// Create and export the File model
export const File = model<IFile, FilesModel>('file', fileSchema);
