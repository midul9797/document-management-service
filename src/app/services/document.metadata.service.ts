import { DocumentMetadata } from '../models/document.metadata.model';
import httpStatus from 'http-status';
import ApiError from '../../errors/ApiError';
import { RedisClient } from '../../shared/redis';
import {
  ICreateDocumentMetadata,
  IDocumentMetadata,
} from '../interfaces/document.metadata.interface';
import { s3 } from '../../shared/s3';
import { GetObjectCommand, PutObjectCommand } from '@aws-sdk/client-s3';
import { Readable } from 'stream';

/**
 * Creates a new document metadata record
 * @param payload - The document metadata to create
 * @returns Partial document metadata with selected fields
 */
const createDocumentMetadata = async (
  payload: ICreateDocumentMetadata,
): Promise<Partial<IDocumentMetadata>> => {
  const { title, type, data } = payload;

  // Handle malformed data from frontend (e.g., "dataapplication/pdfbase64JVBERi...")
  let base64Data = data;

  // If data doesn't start with "data:", it's malformed from frontend
  if (!data.startsWith('data:')) {
    // Extract base64 part after "base64" keyword
    const base64Index = data.indexOf('base64');
    if (base64Index !== -1) {
      base64Data = data.substring(base64Index + 6); // Remove "base64" part
    }
  } else {
    // If it's a proper data URL, extract the base64 part
    const commaIndex = data.indexOf(',');
    if (commaIndex !== -1) {
      base64Data = data.substring(commaIndex + 1);
    }
  }
  const fileBuffer = Buffer.from(base64Data, 'base64');
  const fileName = `${title}-${Date.now()}.${type.split('/')[1]}`;
  const uploadParams = {
    Bucket: process.env.AWS_BUCKET_NAME as string,
    Key: fileName,
    Body: fileBuffer,
    ContentType: type,
  };
  const command = new PutObjectCommand(uploadParams);
  const response = await s3.send(command);
  if (!response)
    throw new ApiError(httpStatus.BAD_REQUEST, 'Failed to upload file');
  const result = await DocumentMetadata.create({
    ...payload,
    url: `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileName}`,
    version: 0,
    accessPermissions: { edit: [], delete: [], view: [] },
  });
  if (!result)
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      'Failed to create document Metadata',
    );
  await RedisClient.setDocumentMetadataCache(
    payload.authorId,
    JSON.stringify(result),
  );
  return result;
};

/**
 * Retrieves all document metadata for a specific author
 * @param authorId - The ID of the author
 * @returns Array of partial document metadata
 */
const getAllDocumentMetadata = async (
  authorId: string,
): Promise<Partial<IDocumentMetadata>[] | null> => {
  const result = await DocumentMetadata.find({
    authorId,
    deleted: false,
  })
    .select({
      _id: 1,
      title: 1,
      version: 1,
      createdAt: 1,
      url: 1,
      author: 1,
      size: 1,
      type: 1,
      accessPermissions: 1,
    })
    .sort({ createdAt: -1 });
  if (!result)
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      'Failed to get documents metadata',
    );
  return result;
};

/**
 * Retrieves a single document metadata by ID
 * @param id - The document metadata ID
 * @returns Partial document metadata or null
 */
const getDocumentMetadata = async (
  id: string,
): Promise<Partial<IDocumentMetadata> | null> => {
  const result = await DocumentMetadata.findById({ _id: id });

  if (!result)
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      'Failed to get document metadata',
    );
  return result;
};

/**
 * Retrieves document metadata by file ID
 * @param id - The file ID
 * @returns Partial document metadata or null
 */
// const getDocumentMetadataByFileId = async (
//   id: string,
// ): Promise<Partial<DocumentMetadata> | null> => {
//   const result = await prisma.documentMetadata.findFirst({
//     where: { fileId: id },
//   });
//   if (!result)
//     throw new ApiError(
//       httpStatus.BAD_REQUEST,
//       'Failed to get document metadata',
//     );
//   return result;
// };

/**
 * Retrieves document metadata from Redis cache by ID
 * @param id - The ID to lookup in cache
 * @returns Array of partial document metadata or null
 */
const getDocumentMetadataFromRedisCache = async (
  id: string,
): Promise<Partial<IDocumentMetadata>[] | null> => {
  const result = (await RedisClient.getDocumentMetadataCache(id)) as
    | Partial<IDocumentMetadata>[]
    | null;

  if (!result)
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      'Failed to get documents metadata',
    );

  return result;
};

/**
 * Updates document metadata and increments version
 * @param id - The document metadata ID
 * @param data - The updated document metadata
 * @returns Boolean indicating success
 */
const updateDocumentMetadata = async (
  id: string,
  payload: Partial<ICreateDocumentMetadata>,
): Promise<boolean | null> => {
  const { title, type, data } = payload;
  const fileBuffer = Buffer.from(data as string, 'base64');
  const fileName = `${title}-${Date.now()}.${type?.split('/')[1]}`;
  const uploadParams = {
    Bucket: process.env.AWS_BUCKET_NAME as string,
    Key: fileName,
    Body: fileBuffer,
    ContentType: type,
  };
  const command = new PutObjectCommand(uploadParams);
  const response = await s3.send(command);
  if (!response)
    throw new ApiError(httpStatus.BAD_REQUEST, 'Failed to upload file');
  const result = await DocumentMetadata.updateOne(
    { _id: id },
    {
      ...payload,
      url: `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileName}`,
      $inc: { version: 1 },
    },
  );
  if (!result)
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      'Failed to updated document metadata',
    );
  return true;
};

/**
 * Deletes document metadata by ID or file ID
 * @param id - The document metadata ID or file ID
 * @returns Boolean indicating success
 */
const deleteDocumentMetadata = async (
  id: string,
  userId: string,
): Promise<boolean | null> => {
  const result = await DocumentMetadata.updateMany(
    { $or: [{ _id: id }] },
    { deleted: true, deletedAt: new Date(), deletedBy: userId },
  );
  if (!result)
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      'Failed to delete document metadata',
    );
  return true;
};

/**
 * Restores document metadata by ID or file ID
 * @param id - The document metadata ID or file ID
 * @returns Boolean indicating success
 */
const restoreDocumentMetadata = async (id: string): Promise<boolean | null> => {
  const result = await DocumentMetadata.updateMany(
    {
      $or: [{ _id: id }],
    },
    { deleted: false, deletedAt: null, deletedBy: null },
  );
  if (!result)
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      'Failed to restore document metadata',
    );
  return true;
};
/**
 * Permanently deletes document metadata by ID
 * @param id - The document metadata ID
 * @returns Boolean indicating success
 */
const deleteDocumentMetadataPermanently = async (
  id: string,
): Promise<boolean | null> => {
  const result = await DocumentMetadata.deleteOne({
    _id: id,
  });
  if (!result)
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      'Failed to delete document metadata permanently',
    );
  return true;
};
/**
 * Retrieves all deleted document metadata records for a specific user from database
 * @param userId - The user ID (clerkId) to fetch deleted documents for
 * @returns Array of deleted document metadata records or null
 */

const getAllDeletedDocumentMetadataFromDB = async (
  userId: string,
): Promise<Partial<IDocumentMetadata>[] | null> => {
  const result = await DocumentMetadata.find({
    deletedBy: userId,
    deleted: true,
  });
  if (!result)
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      'Failed to get deleted document metadata',
    );
  return result;
};
// Function to share a file in the database
const shareDocumentInDB = async (
  id: string,
  email: string,
  types: string[],
): Promise<IDocumentMetadata | null> => {
  const documentMetadata = await DocumentMetadata.findOne({ _id: id });
  if (!documentMetadata)
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      'Failed to find document metadata',
    );

  // Update access permissions for the file
  if (documentMetadata.accessPermissions !== undefined) {
    types.map(type => {
      if (
        !documentMetadata.accessPermissions?.[
          type as keyof typeof documentMetadata.accessPermissions
        ]?.includes(email)
      )
        documentMetadata.accessPermissions?.[
          type as keyof typeof documentMetadata.accessPermissions
        ].push(email);
    });
    if (documentMetadata.isModified('accessPermissions')) {
      try {
        await documentMetadata.save();
      } catch (error) {
        console.log(error);
      }
    }
  }
  return documentMetadata;
};

// Function to get all shared files from the database for a given email
const getSharedDocumentMetadataFromDB = async (
  email: string,
): Promise<IDocumentMetadata[] | null> => {
  const files = await DocumentMetadata.find({
    $or: [
      { 'accessPermissions.view': { $in: [email] } },
      { 'accessPermissions.edit': { $in: [email] } },
      { 'accessPermissions.delete': { $in: [email] } },
    ],
  });

  if (!files)
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      'Failed to get shared document metadata',
    );
  return files;
};

const downloadDocumentMetadata = async (id: string): Promise<string | null> => {
  const result = await DocumentMetadata.findById({ _id: id });
  if (!result)
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      'Failed to get document metadata',
    );
  const command = new GetObjectCommand({
    Bucket: process.env.AWS_BUCKET_NAME as string,
    Key: result.url.split('/').pop(),
  });
  const response = await s3.send(command);

  // response.Body is a ReadableStream
  const stream = response.Body as Readable;

  const chunks: Uint8Array[] = [];
  for await (const chunk of stream) {
    chunks.push(chunk as Uint8Array);
  }
  const base64Data = Buffer.concat(chunks).toString('base64');

  // Get the content type from the S3 response or default to application/pdf
  const contentType = response.ContentType || 'application/pdf';

  // Return as proper data URL format: data:[<mediatype>][;base64],<data>
  return `data:${contentType};base64,${base64Data}`;
};

// Export all document metadata service functions
export const DocumentMetadataService = {
  getDocumentMetadata,
  updateDocumentMetadata,
  createDocumentMetadata,
  deleteDocumentMetadata,
  getAllDocumentMetadata,
  // getDocumentMetadataByFileId,
  getDocumentMetadataFromRedisCache,
  restoreDocumentMetadata,
  deleteDocumentMetadataPermanently,
  getAllDeletedDocumentMetadataFromDB,
  shareDocumentInDB,
  getSharedDocumentMetadataFromDB,
  downloadDocumentMetadata,
};
