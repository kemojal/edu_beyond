import { FileFilterCallback } from "multer";

export const pdfFilter = (
  req: Express.Request,
  file: Express.Multer.File,
  cb: FileFilterCallback
) => {
  if (!file.originalname.match(/\.pdf$/)) {
    return cb(new Error("Only PDF files are allowed!") as any, false);
  }
  cb(null, true);
};
