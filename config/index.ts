// import dotenv from "dotenv";
import multer from "multer";
import { pdfFilter } from "../utils/file";
import {
  DEFAULT_PORT,
  FILE_TYPES,
  MAX_FILE_SIZE_BYTES,
  MAX_REQUEST,
} from "../utils/constants";

const config = {
  port: process.env.PORT || DEFAULT_PORT,
  rateLimit: {
    windowMs: 1 * 60 * 1000, // 1 minute
    max: MAX_REQUEST, // limit each IP to 10 requests per windowMs
  },
  fileUpload: {
    limits: { fileSize: MAX_FILE_SIZE_BYTES }, // 10MB limit
    fileTypes: [FILE_TYPES],
  },
};

export default config;
``;

const UPLOAD_PATH = process.env.UPLOAD_PATH || "uploads";
export const upload = multer({
  dest: `${UPLOAD_PATH}`,
  fileFilter: pdfFilter,
}).single("file");
