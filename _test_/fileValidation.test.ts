import { validateFileContent } from "./../middlewares/fileValidation";
import { Request, Response } from "express";
import * as utils from "../utils";

import fs from "fs";
import { PDFDocument } from "pdf-lib";

jest.mock("fs");
jest.mock("pdf-lib");
jest.mock("../utils");

describe("File Content Validation Middleware", () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let nextFunction: jest.Mock;
  let sendResponseMock: jest.Mock;

  beforeEach(() => {
    mockRequest = {
      file: {
        fieldname: "file",
        originalname: "test.pdf",
        encoding: "7bit",
        mimetype: "application/pdf",
        destination: "/tmp",
        filename: "test.pdf",
        path: "/tmp/test.pdf",
        size: 1024,
        buffer: Buffer.from("dummy pdf content"),
      } as Express.Multer.File,
    };
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    nextFunction = jest.fn();
    sendResponseMock = jest.fn();
    (utils.sendResponse as jest.Mock) = sendResponseMock;

    (fs.readFileSync as jest.Mock).mockReturnValue(
      Buffer.from("dummy pdf content")
    );
    (PDFDocument.load as jest.Mock).mockResolvedValue({
      getPages: jest.fn().mockReturnValue([{}]),
    });
  });

  it("should call next() for valid PDF files", async () => {
    await validateFileContent(
      mockRequest as Request,
      mockResponse as Response,
      nextFunction
    );
    expect(nextFunction).toHaveBeenCalled();
    expect(sendResponseMock).not.toHaveBeenCalled();
  });

  it("should return an error for invalid PDF files", async () => {
    (PDFDocument.load as jest.Mock).mockRejectedValue(new Error("Invalid PDF"));
    await validateFileContent(
      mockRequest as Request,
      mockResponse as Response,
      nextFunction
    );
    expect(sendResponseMock).toHaveBeenCalledWith(
      mockResponse,
      utils.Code.BadRequest,
      expect.objectContaining({
        success: false,
        message: "Invalid file content",
      })
    );
    expect(nextFunction).not.toHaveBeenCalled();
  });
});
