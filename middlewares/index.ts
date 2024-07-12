import { Request, Response, NextFunction } from "express";
import type { FileFilterCallback } from "multer";
import { Code, sendResponse } from "../utils";

// export const pdfFilter = (
//   req: Express.Request,
//   file: Express.Multer.File,
//   cb: FileFilterCallback
// ) => {
//   if (!file.originalname.match(/\.pdf$/)) {
//     return cb(new Error("Only PDF files are allowed!") as any, false);
//   }
//   cb(null, true);
// };
