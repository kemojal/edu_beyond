// import dotenv from "dotenv";
import multer from "multer";
import { pdfFilter } from "utils/file";

const config = {
  port: process.env.PORT || 3003,
  rateLimit: {
    windowMs: 1 * 60 * 1000, // 1 minute
    max: 10, // limit each IP to 10 requests per windowMs
  },
  fileUpload: {
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
    fileTypes: ["application/pdf"],
  },
};

export default config;
``;

const UPLOAD_PATH = process.env.UPLOAD_PATH || "uploads";
export const upload = multer({
  dest: `${UPLOAD_PATH}`,
  fileFilter: pdfFilter,
}).single("file");
