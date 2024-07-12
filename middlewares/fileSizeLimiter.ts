import { Request, Response, NextFunction } from "express";
import { Code, sendResponse } from "../utils";

const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024; // 10MB
// const MAX_FILE_SIZE_MB = MAX_FILE_SIZE_BYTES / (1024 * 1024);

export const createFileSizeLimiter = (
  maxSizeBytes: number = MAX_FILE_SIZE_BYTES
) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const contentLength = req.headers["content-length"];

    if (!contentLength) {
      sendResponse(res, Code.BadRequest, {
        success: false,
        message: "Content-Length header is missing",
      });
      return;
    }

    const size = parseInt(contentLength, 10);

    if (isNaN(size)) {
      sendResponse(res, Code.BadRequest, {
        success: false,
        message: "Invalid Content-Length header",
      });
      return;
    }

    if (size > maxSizeBytes) {
      const maxSizeMB = maxSizeBytes / (1024 * 1024);
      sendResponse(res, Code.PayloadTooLarge, {
        success: false,
        message: `File too large. Maximum size is ${maxSizeMB} MB.`,
      });
      return;
    }

    next();
  };
};

export const fileSizeLimiter = createFileSizeLimiter();
