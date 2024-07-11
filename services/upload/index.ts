import { NextFunction, Request, Response } from "express";
import { Code, sendResponse } from "../../utils";
import { MulterError } from "multer";

import { upload } from "../../config";
import logger from "../../utils/logger";

export const handleFileUpload = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  upload(req, res, (err: any) => {
    if (err instanceof MulterError) {
      if (err.code === "LIMIT_FILE_SIZE") {
        logger.error(`💥❌ Multer error: ${err.message}`, { error: err });

        return sendResponse(res, Code.PayloadTooLarge, {
          success: false,
          message: "File too large",
        });
      }
      return sendResponse(res, Code.BadRequest, {
        success: false,
        message: err.message,
      });
    } else if (err) {
      logger.error(`💥❌ Unknown upload error: ${err.message}`, { error: err });
      return sendResponse(res, Code.BadRequest, {
        success: false,
        message: err.message,
      });
    }

    if (!req.file) {
      logger.warn("⚠️🚫 No file uploaded or invalid file type");
      return sendResponse(res, Code.BadRequest, {
        success: false,
        message: "No file uploaded or invalid file type",
      });
    }

    logger.info(`📁 🚀✨ File uploaded successfully: ${req.file.filename} 🎉`);

    return sendResponse(res, Code.Ok, {
      success: true,
      file: req.file,
    });
  });
};
