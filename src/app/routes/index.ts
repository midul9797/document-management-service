import express from 'express';
import { FileRoutes } from './file.route';

const router = express.Router();

const moduleRoutes = [
  {
    path: '/file',
    route: FileRoutes,
  },
];
moduleRoutes.forEach(route => router.use(route.path, route.route));

export default router;
