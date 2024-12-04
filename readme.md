# Document Management Service

This repository contains the backend implementation for a Document Management Service. Below is the detailed project structure.

---

## Project Structure

### Root Directory

- **`.env`**: Contains environment variables for application configuration.
- **`.eslintignore`**: Specifies files and directories ignored by ESLint.
- **`.eslintrc`**: ESLint configuration file for linting rules.
- **`.gitignore`**: Specifies files and directories ignored by Git.
- **`.prettierrc`**: Prettier configuration file for code formatting.
- **`package-lock.json`**: Automatically generated lockfile for dependencies.
- **`package.json`**: Manages project dependencies, scripts, and metadata.
- **`readme.md`**: Documentation for the project.
- **`tsconfig.json`**: TypeScript configuration file.

---

### `src/` Directory

This directory contains the core source code for the application.

#### `app/`

- **`controllers/`**
  - `file.controller.ts`: Handles incoming file-related requests and delegates to the service layer.
- **`interfaces/`**
  - `file.interface.ts`: Defines TypeScript interfaces for file entities.
- **`middlewares/`**
  - `auth.ts`: Middleware for handling authentication and user authorization.
  - `globalErrorHandler.ts`: Middleware for centralized error handling.
  - `validateRequest.ts`: Middleware for validating incoming requests against schemas.
- **`models/`**
  - `file.model.ts`: Mongoose schema and model definition for file data.
- **`routes/`**
  - `file.route.ts`: API routes for file-related operations.
  - `index.ts`: Combines and exports all routes for the application.
- **`services/`**
  - `file.service.ts`: Contains business logic for handling file operations.
- **`validations/`**
  - `file.validation.ts`: Zod schemas for validating file-related requests.

---

#### Other Key Directories and Files

- **`app.ts`**: Sets up the Express app, middlewares, and routes.
- **`config/`**
  - `index.ts`: Centralized configuration for environment variables and app settings.
- **`errors/`**
  - `ApiError.ts`: Custom error class for handling API-specific errors.
  - `handleValidationError.ts`: Utility for managing validation errors.
- **`helpers/`**
  - `jwtHelpers.ts`: Utilities for working with JSON Web Tokens (JWT) for authentication.
- **`interfaces/`**
  - `common.ts`: Shared TypeScript interfaces for general use cases.
  - `error.ts`: Interfaces for error objects and error handling logic.
- **`server.ts`**: Entry point for the application, initializes and starts the server.
- **`shared/`**
  - `catchAsync.ts`: Utility for wrapping async functions with error handling.
  - `redis.ts`: Redis integration helper for caching and other operations.
  - `sendResponse.ts`: Utility for standardizing API responses.

---

# **File Management API Documentation**

## **Overview**

The File Management API provides endpoints to manage files, including uploading, downloading, sharing, retrieving, and updating file information.

---

## **Base URL**

```
{{baseUrl}}
```

Replace `{{baseUrl}}` with your server's URL (e.g., `http://localhost:4002/api/v1`).

---

## **Authentication**

All endpoints require an `Authorization` header with a JWT token:

```
Authorization: <your-token>
```

---

## **Endpoints**

### **1. Upload File**

Uploads a file to the server.

- **Method:** `POST`
- **Endpoint:** `/file/upload`
- **Headers:**
  - `Authorization: Bearer <your-token>`
- **Body:**
  - JSON: `file` (file input)

**Request Example:**

```json
{
  "name": "new file.pdf",
  "size": 1223123,
  "type": "application/pdf",
  "data": "base64 binary string"
}
```

**Response Example:**

```json
{
  "statusCode": 200,
  "success": true,
  "message": "File uploaded successfully",
  "meta": {
    "name": "new file.pdf",
    "size": 1223123,
    "type": "application/pdf",
    "version": null
  },
  "data": {
    "name": "new file.pdf",
    "type": "application/pdf",
    "size": 1223123,
    "data": "base64 binary string",
    "author": {
      "id": "user_2pV06E4EwhAP5JWnPp6QdrhH7qr",
      "name": "Moklasur Rahman",
      "_id": "6750158f1f598db1e6522d37"
    },
    "version": 0,
    "accessPermissions": {
      "edit": [],
      "view": [],
      "delete": [],
      "_id": "6750158f1f598db1e6522d38"
    },
    "_id": "6750158f1f598db1e6522d36",
    "createdAt": "2024-12-04T08:40:47.128Z",
    "updatedAt": "2024-12-04T08:40:47.128Z",
    "__v": 0
  }
}
```

---

### **2. Download File**

Downloads a file by its ID.

- **Method:** `GET`
- **Endpoint:** `/file/download/:fileId`
- **Headers:**
  - `Authorization: <your-token>`

**Request Example:**

```
GET /file/download/674f1052a30eb739be0b5651
```

**Response Example:**  
Binary file data for the specified `fileId`.

---

### **3. Get File Details**

Retrieves details of a specific file by its ID.

- **Method:** `GET`
- **Endpoint:** `/file/:fileId`
- **Headers:**
  - `Authorization: <your-token>`

**Request Example:**

```
GET /file/674f1052a30eb739be0b5651
```

**Response Example:**

```json
{
  "statusCode": 200,
  "success": true,
  "message": "File retrived successfully!!!",
  "meta": {
    "name": "Shohojogi SRS (221012412).pdf",
    "size": 1127228,
    "type": "application/pdf",
    "version": null
  },
  "data": {
    "_id": "674f1052a30eb739be0b5651",
    "name": "Shohojogi SRS (221012412).pdf",
    "type": "application/pdf",
    "size": 1127228,
    "data": "data:application/pdf;base64,JVBERi0xLjQKJdPr6eEKMSAwIG9iago8P...",
    "author": {
      "id": "user_2pLMsgwdPWvMljf2XkxuqQMHoWN",
      "name": "Mr midul",
      "_id": "674f1052a30eb739be0b5652"
    },
    "version": 0,
    "accessPermissions": {
      "edit": ["moklasurrahman9797@gmail.com"],
      "view": ["moklasurrahman9797@gmail.com"],
      "delete": [],
      "_id": "674f1052a30eb739be0b5653"
    },
    "createdAt": "2024-12-03T14:06:10.522Z",
    "updatedAt": "2024-12-03T14:08:35.712Z",
    "__v": 1
  }
}
```

---

### **4. Update File**

Updates the details of a specific file by its ID.

- **Method:** `PATCH`
- **Endpoint:** `/file/:fileId`
- **Headers:**
  - `Authorization: <your-token>`
- **Body:** JSON payload for file updates.

**Request Example:**

```json
{
  "name": "new name"
}
```

**Response Example:**

```json
{
  "statusCode": 200,
  "success": true,
  "message": "File updated successfully",
  "data": null
}
```

---

### **5. Get Shared Files**

Retrieves a list of files that have been shared.

- **Method:** `GET`
- **Endpoint:** `/file/share`
- **Headers:**
  - `Authorization: <your-token>`

**Request Example:**

```
GET /file/share
```

**Response Example:**

```json
{
  "statusCode": 200,
  "success": true,
  "message": "Shared files retrived successfully!!!",
  "data": [
    {
      "_id": "674f013aa30eb739be0b5645",
      "name": "Image-based facial emotion recognition using convolutional neural network on emognition dataset.pdf",
      "type": "application/pdf",
      "size": 4790742,
      "data": "data:application/pdf;base64......,",
      "author": {
        "id": "user_2pLMsgwdPWvMljf2XkxuqQMHoWN",
        "name": "Mr midul",
        "_id": "674f1052a30eb739be0b5652"
      },
      "version": 0,
      "accessPermissions": {
        "edit": ["moklasurrahman9797@gmail.com"],
        "view": ["moklasurrahman9797@gmail.com"],
        "delete": [],
        "_id": "674f1052a30eb739be0b5653"
      },
      "createdAt": "2024-12-03T14:06:10.522Z",
      "updatedAt": "2024-12-03T14:08:35.712Z",
      "__v": 1
    }
  ]
}
```

---

### **6. Share File**

Shares a file with specific users.

- **Method:** `PATCH`
- **Endpoint:** `/file/share`
- **Headers:**
  - `Authorization: <your-token>`
- **Body:** JSON payload specifying the file to share and the users to share it with and permission types.

**Request Example:**

```json
{
  "fileId": "674f1052a30eb739be0b5651",
  "email": "moklasurrahman9797@gmail.com",
  "types": ["edit", "view"]
}
```

**Response Example:**

```json
{
  "statusCode": 200,
  "success": true,
  "message": "File shared successfully!!!",
  "data": null
}
```

---

### **7. Delete File**

Deletes a file by its ID.

- **Method:** `DELETE`
- **Endpoint:** `/file/:fileId`
- **Headers:**
  - `Authorization: <your-token>`

**Request Example:**

```
DELETE /file/file_123
```

**Response Example:**

```json
{
  "statusCode": 200,
  "success": true,
  "message": "File deleted successfully!!!",
  "data": null
}
```

---

## Complete Endpoint Summary

| Method   | Endpoint                 | Description                     |
| -------- | ------------------------ | ------------------------------- |
| `POST`   | `/file/upload`           | Upload a new file               |
| `GET`    | `/file/download/:fileId` | Download a file by its ID       |
| `GET`    | `/file/share`            | Retrieve shared files           |
| `GET`    | `/file/:fileId`          | Retrieve file details by its ID |
| `PATCH`  | `/file/share`            | Share a file with users         |
| `PATCH`  | `/file/:fileId`          | Update file details             |
| `DELETE` | `/file/:fileId`          | Delete a file by its ID         |

---

# File Services Unit Test Cases

## `uploadFileInDB` Service Tests

### Positive Test Cases

1. **Successful File Upload**
   - Input: Valid file payload with all required fields
   - Expected Outcome:
     - File created in database
     - Correct file details returned
     - Redis cache set with file metadata

### Negative Test Cases

3. **File Upload Failure**
   - Input: Incomplete or invalid file payload
   - Expected Outcome:
     - `ApiError` thrown with status `BAD_REQUEST`
     - No file created in database

## `downloadFileFromDB` Service Tests

### Positive Test Cases

4. **Successful File Download**
   - Input: Valid existing file ID
   - Expected Outcome:
     - Correct file document returned
     - All file details match database record

### Negative Test Cases

5. **Non-Existent File Download**
   - Input: Non-existing file ID
   - Expected Outcome:
     - `ApiError` thrown with status `BAD_REQUEST`
     - Error message: "Failed to download"

## `getFileFromDB` Service Tests

### Positive Test Cases

6. **Retrieve Existing File**
   - Input: Valid file ID
   - Expected Outcome:
     - Correct file document returned
     - All file details intact

### Negative Test Cases

7. **Retrieve Non-Existent File**
   - Input: Non-existing file ID
   - Expected Outcome:
     - `ApiError` thrown with status `BAD_REQUEST`
     - Error message: "Failed to get file"

## `getFilesFromDB` Service Tests

### Positive Test Cases

8. **Retrieve User's Files**

   - Input: Valid user ID with multiple files
   - Expected Outcome:
     - Array of files returned
     - All returned files match user ID
     - Correct number of files returned

9. **Retrieve User's Empty File List**
   - Input: User ID with no files
   - Expected Outcome:
     - Empty array returned
     - No errors thrown

### Negative Test Cases

10. **Invalid User ID Retrieval**
    - Input: Invalid or non-existent user ID
    - Expected Outcome:
      - `ApiError` thrown with status `BAD_REQUEST`
      - Error message: "Failed to get files"

## `shareFileInDB` Service Tests

### Positive Test Cases

11. **Share File with New Email for View**

    - Input:
      - Existing file ID
      - New email
      - Permission type: "view"
    - Expected Outcome:
      - Email added to view permissions
      - File version incremented
      - File saved successfully

12. **Share File with Existing Email**
    - Input:
      - Existing file with existing permissions
      - Email already in one permission type
    - Expected Outcome:
      - No duplicate email entries
      - Permissions remain consistent

### Negative Test Cases

13. **Share Non-Existent File**
    - Input: Non-existing file ID
    - Expected Outcome:
      - `ApiError` thrown with status `BAD_REQUEST`
      - Error message: "Failed to find file"

## `getSharedFilesFromDB` Service Tests

### Positive Test Cases

14. **Retrieve Shared Files**

    - Input: Email with multiple shared files
    - Expected Outcome:
      - Array of shared files returned
      - Files match permission criteria (view/edit/delete)

15. **No Shared Files**
    - Input: Email with no shared files
    - Expected Outcome:
      - Empty array returned
      - No errors thrown

### Negative Test Cases

16. **Invalid Email Shared Files Retrieval**
    - Input: Invalid email format
    - Expected Outcome:
      - `ApiError` thrown with status `BAD_REQUEST`
      - Error message: "Failed to get shared files"

## `updateFileInDB` Service Tests

### Positive Test Cases

17. **Successful File Update**
    - Input:
      - Valid file ID
      - Partial update payload
    - Expected Outcome:
      - File updated successfully
      - Version incremented
      - Updated fields reflect changes

### Negative Test Cases

18. **Update Non-Existent File**
    - Input: Non-existing file ID
    - Expected Outcome:
      - `ApiError` thrown with status `BAD_REQUEST`
      - Error message: "Failed to get file"

## `deleteFileFromDB` Service Tests

### Positive Test Cases

19. **Successful File Deletion**
    - Input: Valid file ID
    - Expected Outcome:
      - File removed from database
      - Deleted file document returned

### Negative Test Cases

20. **Delete Non-Existent File**
    - Input: Non-existing file ID
    - Expected Outcome:
      - `ApiError` thrown with status `BAD_REQUEST`
      - Error message: "Failed to delete"
