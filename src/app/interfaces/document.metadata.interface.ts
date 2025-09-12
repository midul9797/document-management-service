import { Model } from 'mongoose';

export type IDocumentMetadata = {
  _id?: string; // id of the file is optional because initially there will be no id.
  title: string; // The name of the file
  type: string; // The format of the file (e.g., .txt, .pdf, .docx)
  size: number; // The size of the file in bytes
  url: string; // File data in base64 format
  authorId: string; // Author ID
  author: string; // Author as a string
  deletedAt?: Date;
  deleted?: boolean;
  deletedBy?: string;
  version?: number;
  accessPermissions?: {
    view: string[]; // Array of user IDs or roles that can view the file
    edit: string[]; // Array of user IDs or roles that can edit the file
    delete: string[]; // Array of user IDs or roles that can delete the file
  };
};
export type ICreateDocumentMetadata = {
  title: string; // Document title
  type: string; // Document type
  data: string; // Document data
  authorId: string; // Author ID
  size: number; // Document size
};
export type DocumentMetadataModel = Model<IDocumentMetadata>;
