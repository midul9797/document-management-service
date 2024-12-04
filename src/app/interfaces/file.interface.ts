import { Model } from 'mongoose';

export type IFile = {
  _id?: string; // id of the file is optional because initially there will be no id.
  name: string; // The name of the file
  type: string; // The format of the file (e.g., .txt, .pdf, .docx)
  size: number; // The size of the file in bytes
  data: string; // File data in base64 format
  author: {
    id: string;
    name: string; //User who uploaded the file
  };
  version?: number;
  accessPermissions?: {
    view: string[]; // Array of user IDs or roles that can view the file
    edit: string[]; // Array of user IDs or roles that can edit the file
    delete: string[]; // Array of user IDs or roles that can delete the file
  };
};
export type FilesModel = Model<IFile>;
