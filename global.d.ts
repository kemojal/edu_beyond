import { File } from "./types";

declare namespace Express {
  export interface Request {
    fileValidationError?: string;
    file?: File;
  }
}
