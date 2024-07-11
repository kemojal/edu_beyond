import { Request, Response, NextFunction } from "express";
import { HttpError } from "./errors";
import { HttpStatusCode } from "../utils/enums";
import config from "../config";
import { Code, sendResponse } from "../utils";

// PDF filter
export const pdfFilter = (
  req: Express.Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) => {
  if (!file.originalname.match(/\.pdf$/)) {
    return cb(new Error("Only PDF files are allowed!"), false);
  }
  cb(null, true);
};

export const fileSizeLimiter = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const maxSize = 10 * 1024 * 1024; // 10MB
  if (
    req.headers["content-length"] &&
    parseInt(req.headers["content-length"]) > maxSize
  ) {
    sendResponse(res, Code.PayloadTooLarge, {
      success: false,
      message: "File too large",
    });
    return res.status(413).json({ success: false, message: "File too large" });
  }
  next();
};

// Rate limiter
const requestCounts: { [key: string]: { count: number; lastReset: number } } =
  {};

export const rateLimiter = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const ip = req.ip;
  const now = Date.now();
  const windowMs = 60 * 1000; // 1 minute

  if (!requestCounts[ip]) {
    requestCounts[ip] = { count: 1, lastReset: now };
  } else {
    if (now - requestCounts[ip].lastReset > windowMs) {
      requestCounts[ip] = { count: 1, lastReset: now };
    } else {
      requestCounts[ip].count++;
      if (requestCounts[ip].count > 10) {
        return res
          .status(429)
          .json({ success: false, message: "Too many requests" });
      }
    }
  }

  next();
};
