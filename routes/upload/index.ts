import { Express, NextFunction, Request, Response } from "express";
import { fileSizeLimiter, rateLimiter } from "../../middlewares";
// import * as path from "path";
import { Code, sendResponse } from "../../utils";
import { handleFileUpload } from "../../services/upload";
import { validateFileContent } from "../../middlewares/fileValidation";

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
