import { Schema, model } from 'mongoose';
import { IFile, FilesModel } from '../interfaces/file.interface';

const fileSchema = new Schema<IFile, FilesModel>(
  {
    name: { type: String, required: true },
    type: { type: String, required: true },
    size: { type: Number, required: true },
    data: { type: String, required: true },
    author: { type: { id: String, name: String }, required: true },
    version: { type: Number },
    accessPermissions: {
      type: {
        edit: { type: [String] },
        view: { type: [String] },
        delete: { type: [String] },
      },
    },
  },
  { timestamps: true },
);
export const File = model<IFile, FilesModel>('file', fileSchema);
