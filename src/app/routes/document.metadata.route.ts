import express from 'express';
import { DocumentMetadataController } from '../controllers/document.metadata.controller';
import auth from '../middlewares/auth';
import validateRequest from '../middlewares/validateRequest';
import { DocumentMetadataValidation } from '../validations/document.metadata.validation';

// Create Express router instance
const router = express.Router();

router

  // Get document metadata by file ID
  .get('/shared', auth(), DocumentMetadataController.getSharedDocumentMetadata)
  //Get document metadata from cache
  .get('/cache', auth(), DocumentMetadataController.getDocumentMetadataCache)
  .get(
    '/download/:documentId',
    auth(),
    DocumentMetadataController.downloadDocumentMetadata,
  )
  //Get all deleted document metadata
  .get(
    '/deleted',
    auth(),
    DocumentMetadataController.getAllDeletedDocumentMetadata,
  )
  // Get specific document metadata by ID
  .get('/:documentId', auth(), DocumentMetadataController.getDocumentMetadata)
  // Get all document metadata
  .get('/', auth(), DocumentMetadataController.getAllDocumentMetadata)
  // Create new document metadata
  .post(
    '/',
    auth(),
    validateRequest(DocumentMetadataValidation.create),
    DocumentMetadataController.createDocumentMetadata,
  )
  // Update existing document metadata
  .patch('/share', auth(), DocumentMetadataController.shareDocumentMetadata)
  .patch(
    '/delete/:documentId',
    auth(),
    DocumentMetadataController.deleteDocumentMetadata,
  )
  .patch(
    '/restore/:documentId',
    auth(),
    DocumentMetadataController.restoreDocumentMetadata,
  )
  .patch(
    '/:documentId',
    auth(),
    validateRequest(DocumentMetadataValidation.update),
    DocumentMetadataController.updateDocumentMetadata,
  )
  .delete(
    '/:documentId',
    auth(),
    DocumentMetadataController.deleteDocumentMetadataPermanently,
  );

export const DocumentMetadataRoutes = router;
