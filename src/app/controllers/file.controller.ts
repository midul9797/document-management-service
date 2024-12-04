import { Request, Response } from 'express';
import catchAsync from '../../shared/catchAsync';
import sendResponse from '../../shared/sendResponse';
import httpStatus from 'http-status';
import { IFile } from '../interfaces/file.interface';
import { fileServices } from '../services/file.service';
import { ClerkTokenPayload } from '../../interfaces/common';

// Controller function to upload a file
const uploadFile = catchAsync(async (req: Request, res: Response) => {
  const file = req.body;
  const { clerkId, name } = req.user as ClerkTokenPayload;
  const result = await fileServices.uploadFileInDB({
    ...file,
    version: 0,
    author: { id: clerkId, name },
    accessPermissions: { edit: [], delete: [], view: [] },
  });
  sendResponse<IFile>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'File uploaded successfully',
    data: result,
    meta: {
      name: result?.name || '',
      size: result?.size || NaN,
      type: result?.type || '',
      version: result?.version || NaN,
    },
  });
});

// Controller function to download a file
const downloadFile = catchAsync(async (req: Request, res: Response) => {
  const { fileId } = req.params;
  const result = await fileServices.downloadFileFromDB(fileId);
  if (result) {
    res.set({
      'Content-Type': result.type,
      'Content-Disposition': `attachment; filename="${result.name}"`,
    });
  }
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'File downloaded successfully!!!',
    data: result?.data || null,
    meta: {
      name: result?.name || '',
      size: result?.size || NaN,
      type: result?.type || '',
      version: result?.version || NaN,
    },
  });
});

// Controller function to get a file
const getFile = catchAsync(async (req: Request, res: Response) => {
  const { fileId } = req.params;
  const result = await fileServices.getFileFromDB(fileId);
  sendResponse<IFile>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'File retrived successfully!!!',
    data: result || null,
    meta: {
      name: result?.name || '',
      size: result?.size || NaN,
      type: result?.type || '',
      version: result?.version || NaN,
    },
  });
});

// Controller function to get all files
const getFiles = catchAsync(async (req: Request, res: Response) => {
  const { clerkId } = req.user as ClerkTokenPayload;
  const result = await fileServices.getFilesFromDB(clerkId);
  sendResponse<IFile[]>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'File retrived successfully!!!',
    data: result || null,
  });
});

// Controller function to update a file
const updateFile = catchAsync(async (req: Request, res: Response) => {
  const data = req.body;
  const { fileId } = req.params;
  const result = await fileServices.updateFileInDB(data, fileId);
  sendResponse<IFile>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: result,
  });
});

// Controller function to delete a file
const deleteFile = catchAsync(async (req: Request, res: Response) => {
  const { fileId } = req.params;
  const result = await fileServices.deleteFileFromDB(fileId);
  sendResponse<IFile>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'File deleted successfully!!!',
  });
});

// Controller function to share a file
const shareFile = catchAsync(async (req: Request, res: Response) => {
  const { fileId, email, types } = req.body;
  const result = await fileServices.shareFileInDB(fileId, email, types);
  sendResponse<IFile>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'File shared successfully!!!',
  });
});

// Controller function to get all shared files
const getSharedFiles = catchAsync(async (req: Request, res: Response) => {
  console.log(req.user, req.headers);
  const { email } = req.user as ClerkTokenPayload;
  const result = await fileServices.getSharedFilesFromDB(email);
  sendResponse<IFile[]>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Shared files retrived successfully!!!',
    data: result,
  });
});

// Exporting all the file controller functions
export const fileController = {
  uploadFile,
  downloadFile,
  deleteFile,
  updateFile,
  shareFile,
  getFile,
  getFiles,
  getSharedFiles,
};
