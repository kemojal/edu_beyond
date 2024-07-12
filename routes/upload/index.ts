import { Express, NextFunction, Request, Response } from "express";
import { Code, sendResponse } from "../../utils";
import { handleFileUpload } from "../../services/upload";
import { validateFileContent } from "../../middlewares/fileValidation";
import { fileSizeLimiter } from "../../middlewares/fileSizeLimiter";

export function uploadRoutes(app: Express) {
  app.get("/", (req: Request, res: Response, next: NextFunction) => {
    sendResponse(res, Code.Ok, { success: true });
  });

  app.post(
    "/upload",
    // , rateLimiter, => moved to server.ts since it's a global middleware
    fileSizeLimiter,
    validateFileContent,
    handleFileUpload
  );
}
