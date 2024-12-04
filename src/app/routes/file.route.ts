import express from 'express';
import validateRequest from '../middlewares/validateRequest';
import { fileValidation } from '../validations/file.validation';
import { fileController } from '../controllers/file.controller';
import auth from '../middlewares/auth';
// import auth from '../../middlewares/auth';
const router = express.Router();

router
  .post(
    '/upload',
    auth(),
    validateRequest(fileValidation.uploadFileZodSchema),
    fileController.uploadFile,
  )

  .get('/download/:fileId', auth(), fileController.downloadFile)
  .get('/share', auth(), fileController.getSharedFiles)
  .get('/:fileId', auth(), fileController.getFile)
  .get('/', auth(), fileController.getFiles)
  .patch('/share', auth(), fileController.shareFile)
  .patch(
    '/:fileId',
    auth(),
    validateRequest(fileValidation.updateFileZodSchema),

    fileController.updateFile,
  )
  .delete('/:fileId', auth(), fileController.deleteFile);

export const FileRoutes = router;
