import { Request, Response, NextFunction } from "express";
import { HttpStatusCode, sendResponse, Code } from "../utils";
import { PDFDocument } from "pdf-lib";
import fs from "fs";
import path from "path";

const isValidPDFContent = async (filePath: string): Promise<boolean> => {
  try {
    const pdfBytes = fs.readFileSync(filePath);
    const pdfDoc = await PDFDocument.load(pdfBytes);
    return pdfDoc.getPages().length > 0; // PDF should have at least one page
  } catch (error) {
    console.error("Error validating PDF content:", error);
    return false;
  }
};

export const validateFileContent = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (req.file) {
    const filePath = path.join(req.file.destination, req.file.filename);
    const isValid = await isValidPDFContent(filePath);
    if (!isValid) {
      return sendResponse(res, Code.BadRequest, {
        success: false,
        message: "Invalid file content",
      });
    }
  }
  next();
};
