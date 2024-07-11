import { Express } from "express";
import { uploadRoutes } from "./upload";

export function useRoutes(app: Express) {
  uploadRoutes(app);
  // other routes
}
