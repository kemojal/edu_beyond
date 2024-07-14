# Beyond Server

This is the backend server for the Beyond application. It is built with Express.js and includes functionalities for file upload, validation, and rate limiting.

## Table of Contents

- [Beyond Server](#beyond-server)
  - [Table of Contents](#table-of-contents)
  - [Features](#features)
  - [Installation](#installation)
  - [Usage](#usage)
  - [API Endpoints](#api-endpoints)
    - [Health Check](#health-check)
    - [File Upload](#file-upload)
    - [Middlewares](#middlewares)
      - [Rate Limiter](#rate-limiter)
      - [File Size Limiter](#file-size-limiter)
      - [File Validation](#file-validation)
    - [Error Handling](#error-handling)

## Features

- **File Upload**: Upload files with validation for size and content.
- **Rate Limiting**: Prevent abuse by limiting the number of requests.
- **Logging**: Log errors and info using Winston.
- **CORS**: Enable Cross-Origin Resource Sharing.
- **Graceful Shutdown**: Handle uncaught exceptions gracefully.

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/yourusername/beyond-server.git
   ```

2. Navigate to the project directory:

   ```bash
   cd beyond-server
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

## Usage

1. Start the server:

   ```bash
   npm start
   ```

2. The server will start on port `3000` by default. You can change the port in the `server.ts` file.

## API Endpoints

### Health Check

- **GET /**

  Check if the server is running.

  **Response:**

  ```json
  {
    "success": true
  }
  ```

### File Upload

**POST /upload**

Upload a file with size and content validation.

**Headers:**

- `Content-Type: multipart/form-data`

**Body:**

- `file`: The file to be uploaded.

**Response:**

```json
{
  "success": true,
  "file": {
    "fieldname": "file",
    "originalname": "example.pdf",
    "encoding": "7bit",
    "mimetype": "application/pdf",
    "destination": "./uploads/",
    "filename": "example-12345.pdf",
    "path": "uploads/example-12345.pdf",
    "size": 12345
  }
}
```

### Middlewares

#### Rate Limiter

Limits the number of requests from a single IP address.

- Limits the number of requests of an IP to 10 calls per minute.

**Location:** `./middlewares/rateLimiter.ts`

**Default Configuration:**
- `MAX_REQUEST`: 10 requests
- `WINDOW_SIZE_MS`: 1 minutes


#### File Size Limiter

Restricts the size of uploaded files.limits the size of the file to 10MB

**Location:** `./middlewares/fileSizeLimiter.ts`

**Default Configuration:**
- `MAX_FILE_SIZE_BYTES`: 10 MB


#### File Validation

Validates the content of uploaded files. Ensure that the uploaded file has at least one page.

**Location:** `./middlewares/fileValidation.ts`


### Error Handling

The server gracefully handles uncaught exceptions and logs the errors using Winston.




**Location:** `./utils/logger.ts`

**Example log:**

```text
💥❌ error: File too large
origin: uncaughtException
