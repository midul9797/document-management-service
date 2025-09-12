import { Request, Response } from 'express';
import httpStatus from 'http-status';
import catchAsync from '../../shared/catchAsync';

import sendResponse from '../../shared/sendResponse';

import { ClerkTokenPayload } from '../../interfaces/common';
import { DocumentMetadataService } from '../services/document.metadata.service';
import { IDocumentMetadata } from '../interfaces/document.metadata.interface';

/**
 * Creates a new document metadata record
 * @param req Request object containing metadata in body and clerk user in req.user
 * @param res Response object
 */
const createDocumentMetadata = catchAsync(
  async (req: Request, res: Response) => {
    const payload = req.body;
    const { clerkId } = req.user as ClerkTokenPayload;
    const result = await DocumentMetadataService.createDocumentMetadata({
      ...payload,
      authorId: clerkId,
    });
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Document Metadata created successfully',
      data: result,
    });
  },
);

/**
 * Retrieves a specific document metadata by ID
 * @param req Request object containing documentId in params
 * @param res Response object
 */
const getDocumentMetadata = catchAsync(async (req: Request, res: Response) => {
  const { documentId } = req.params;
  const result = await DocumentMetadataService.getDocumentMetadata(documentId);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Document Metadata retrived successfully',
    data: result,
  });
});

// /**
//  * Retrieves document metadata associated with a file ID
//  * @param req Request object containing fileId in params
//  * @param res Response object
//  */
// const getDocumentMetadataByFileId = catchAsync(
//   async (req: Request, res: Response) => {
//     const { fileId } = req.params;
//     const result = await DocumentMetadataService.getDocumentMetadataByFileId(
//       fileId
//     );
//     sendResponse(res, {
//       statusCode: httpStatus.OK,
//       success: true,
//       message: 'Document Metadata retrived successfully',
//       data: result,
//     });
//   }
// );

/**
 * Retrieves all document metadata records for a specific user
 * @param req Request object containing clerk user in req.user
 * @param res Response object
 */
const getAllDocumentMetadata = catchAsync(
  async (req: Request, res: Response) => {
    const { clerkId } = req.user as ClerkTokenPayload;
    const result =
      await DocumentMetadataService.getAllDocumentMetadata(clerkId);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Documents Metadata retrived successfully',
      data: result,
    });
  },
);
/**
 * Retrieves all document metadata records for a specific user from cache
 * @param req Request object containing clerk user in req.user
 * @param res Response object
 */
const getDocumentMetadataCache = catchAsync(
  async (req: Request, res: Response) => {
    const { clerkId } = req.user as ClerkTokenPayload;
    const result =
      await DocumentMetadataService.getAllDocumentMetadata(clerkId);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Documents Metadata Cache retrived successfully',
      data: result,
    });
  },
);

/**
 * Updates a specific document metadata record
 * @param req Request object containing documentId in params and update data in body
 * @param res Response object
 */
const updateDocumentMetadata = catchAsync(
  async (req: Request, res: Response) => {
    const { documentId } = req.params;

    const result = await DocumentMetadataService.updateDocumentMetadata(
      documentId,
      req.body,
    );
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Document Metadata updated successfully',
      data: result,
    });
  },
);

/**
 * Deletes a specific document metadata record
 * @param req Request object containing documentId in params
 * @param res Response object
 */
const deleteDocumentMetadata = catchAsync(
  async (req: Request, res: Response) => {
    const { documentId } = req.params;
    const { clerkId } = req.user as ClerkTokenPayload;
    const result = await DocumentMetadataService.deleteDocumentMetadata(
      documentId,
      clerkId,
    );
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Document Metadata deleted successfully',
      data: result,
    });
  },
);

/**
 * Restores a specific document metadata record
 * @param req Request object containing documentId in params
 * @param res Response object
 */
const restoreDocumentMetadata = catchAsync(
  async (req: Request, res: Response) => {
    const { documentId } = req.params;
    const result =
      await DocumentMetadataService.restoreDocumentMetadata(documentId);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Document Metadata restored successfully',
      data: result,
    });
  },
);

/**
 * Deletes a specific document metadata record permanently
 * @param req Request object containing documentId in params
 * @param res Response object
 */
const deleteDocumentMetadataPermanently = catchAsync(
  async (req: Request, res: Response) => {
    const { documentId } = req.params;
    const result =
      await DocumentMetadataService.deleteDocumentMetadataPermanently(
        documentId,
      );
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Document Metadata deleted permanently',
      data: result,
    });
  },
);

/**
 * Retrieves all deleted document metadata records for a specific user
 * @param req Request object containing clerk user in req.user
 * @param res Response object
 */

const getAllDeletedDocumentMetadata = catchAsync(
  async (req: Request, res: Response) => {
    const { clerkId } = req.user as ClerkTokenPayload;
    const result =
      await DocumentMetadataService.getAllDeletedDocumentMetadataFromDB(
        clerkId,
      );
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Deleted Documents Metadata retrived successfully',
      data: result,
    });
  },
);

/**
 * Shares a specific document metadata record
 * @param req Request object containing documentId in body and email and types in body
 * @param res Response object
 */
const shareDocumentMetadata = catchAsync(
  async (req: Request, res: Response) => {
    const { documentId, email, types } = req.body;
    const result = await DocumentMetadataService.shareDocumentInDB(
      documentId,
      email,
      types,
    );
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Document Metadata shared successfully',
      data: result,
    });
  },
);

/**
 * Retrieves all shared document metadata records for a specific user
 * @param req Request object containing email in req.user
 * @param res Response object
 */
const getSharedDocumentMetadata = catchAsync(
  async (req: Request, res: Response) => {
    const { email } = req.user as ClerkTokenPayload;
    const result =
      await DocumentMetadataService.getSharedDocumentMetadataFromDB(email);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Shared Documents Metadata retrived successfully',
      data: result,
    });
  },
);

const downloadDocumentMetadata = catchAsync(
  async (req: Request, res: Response) => {
    const { documentId } = req.params;
    const result =
      await DocumentMetadataService.downloadDocumentMetadata(documentId);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Document Metadata downloaded successfully',
      data: result,
    });
  },
);
export const DocumentMetadataController = {
  getDocumentMetadata,
  updateDocumentMetadata,
  createDocumentMetadata,
  deleteDocumentMetadata,
  getAllDocumentMetadata,
  // getDocumentMetadataByFileId,
  getDocumentMetadataCache,
  restoreDocumentMetadata,
  deleteDocumentMetadataPermanently,
  getAllDeletedDocumentMetadata,
  shareDocumentMetadata,
  getSharedDocumentMetadata,
  downloadDocumentMetadata,
};
