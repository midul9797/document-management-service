/* eslint-disable no-console */
import httpStatus from 'http-status';
import ApiError from '../../errors/ApiError';
import { IFile } from '../interfaces/file.interface';
import { File } from '../models/file.model';
import { RedisClient } from '../../shared/redis';

// Function to upload a file to the database
const uploadFileInDB = async (payload: IFile): Promise<IFile | null> => {
  const createdFile = await File.create(payload);
  if (!createdFile)
    throw new ApiError(httpStatus.BAD_REQUEST, 'Failed to upload file');
  return createdFile;
};

// Function to download a file from the database
const downloadFileFromDB = async (fileId: string): Promise<IFile | null> => {
  const result = await File.findOne({ _id: fileId });
  if (!result) throw new ApiError(httpStatus.BAD_REQUEST, 'Failed to download');
  return result;
};

// Function to get a file from the database
const getFileFromDB = async (fileId: string): Promise<IFile | null> => {
  const file = await File.findOne({ _id: fileId });
  if (!file) throw new ApiError(httpStatus.BAD_REQUEST, 'Failed to get file');
  return file;
};

// Function to get all files from the database for a given user
const getFilesFromDB = async (userId: string): Promise<IFile[] | null> => {
  const files = await File.find({ 'author.id': userId });
  if (!files) throw new ApiError(httpStatus.BAD_REQUEST, 'Failed to get files');
  return files;
};

// Function to share a file in the database
const shareFileInDB = async (
  fileId: string,
  email: string,
  types: string[],
): Promise<IFile | null> => {
  const file = await File.findOne({ _id: fileId });
  if (!file) throw new ApiError(httpStatus.BAD_REQUEST, 'Failed to find file');

  // Update access permissions for the file
  if (file.accessPermissions !== undefined) {
    types.map(type => {
      if (
        !file.accessPermissions?.[
          type as keyof typeof file.accessPermissions
        ]?.includes(email)
      )
        file.accessPermissions?.[
          type as keyof typeof file.accessPermissions
        ].push(email);
    });
    if (file.isModified('accessPermissions')) await file.save();
  }
  return file;
};

// Function to get all shared files from the database for a given email
const getSharedFilesFromDB = async (email: string): Promise<IFile[] | null> => {
  const files = await File.find({
    $or: [
      { 'accessPermissions.view': { $in: [email] } },
      { 'accessPermissions.edit': { $in: [email] } },
      { 'accessPermissions.delete': { $in: [email] } },
    ],
  });

  if (!files)
    throw new ApiError(httpStatus.BAD_REQUEST, 'Failed to get shared files');
  return files;
};

// Function to update a file in the database
const updateFileInDB = async (
  payload: Partial<IFile>,
  fileId: string,
): Promise<string | null> => {
  const result = await File.updateOne(
    {
      _id: fileId,
    },
    {
      $set: { ...payload },
      $inc: { version: 1 },
    },
  );
  if (!result) throw new ApiError(httpStatus.BAD_REQUEST, 'Failed to get file');
  return 'File updated successfully';
};

// Function to delete a file from the database
const deleteFileFromDB = async (fileId: string): Promise<IFile | null> => {
  const result = await File.findOneAndDelete({ _id: fileId });
  if (!result) throw new ApiError(httpStatus.BAD_REQUEST, 'Failed to delete');
  return result;
};

export const fileServices = {
  uploadFileInDB,
  downloadFileFromDB,
  getFileFromDB,
  deleteFileFromDB,
  updateFileInDB,
  getFilesFromDB,
  getSharedFilesFromDB,
  shareFileInDB,
};
