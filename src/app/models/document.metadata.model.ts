import { Schema, model } from 'mongoose'; // Import mongoose for schema and model creation
import {
  IDocumentMetadata,
  DocumentMetadataModel,
} from '../interfaces/document.metadata.interface'; // Import document metadata interface for type definitions

// Define the schema for the DocumentMetadata model
const documentMetadataSchema = new Schema<
  IDocumentMetadata,
  DocumentMetadataModel
>(
  {
    title: { type: String, required: true }, // File title as a string, required
    type: { type: String, required: true }, // File type as a string, required
    size: { type: Number, required: true }, // File size as a number, required
    url: { type: String, required: true }, // File URL as a string, required
    authorId: { type: String, required: true }, // Author ID as a string, required
    author: { type: String, required: true }, // Author as an object, required
    version: { type: Number }, // File version number, optional
    accessPermissions: {
      type: {
        view: { type: [String] }, // Array of strings for view permissions
        edit: { type: [String] }, // Array of strings for edit permissions
        delete: { type: [String] }, // Array of strings for delete permissions
      },
    },
    deleted: { type: Boolean, default: false }, // Flag to indicate if the file is deleted
    deletedAt: { type: Date }, // Date and time when the file was deleted
    deletedBy: { type: String }, // ID of user who deleted the file
  },
  { timestamps: true }, // Include timestamps for creation and modification dates
);
// Create and export the DocumentMetadata model
export const DocumentMetadata = model<IDocumentMetadata, DocumentMetadataModel>(
  'documentMetadata',
  documentMetadataSchema,
);
