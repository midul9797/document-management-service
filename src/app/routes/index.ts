import express from 'express'; // Import express for routing
import { DocumentMetadataRoutes } from './document.metadata.route'; // Import FileRoutes from file.route

// Initialize the express router
const router = express.Router();

// Define routes for different modules
const moduleRoutes = [
  {
    path: '/document-metadata', // Path for file routes
    route: DocumentMetadataRoutes, // File routes
  },
];
// Iterate over moduleRoutes and use each route
moduleRoutes.forEach(route => router.use(route.path, route.route));

// Export the router for use in other modules
export default router;
