import { createFileSizeLimiter } from "./../middlewares/fileSizeLimiter";
import { Request, Response } from "express";
import * as utils from "../utils";

jest.mock("../utils");

describe("File Size Limiter Middleware", () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let nextFunction: jest.Mock;
  let sendResponseMock: jest.Mock;

  beforeEach(() => {
    mockRequest = {};
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    nextFunction = jest.fn();
    sendResponseMock = jest.fn();
    (utils.sendResponse as jest.Mock) = sendResponseMock;
  });

  it("should call next() for files within size limit", () => {
    mockRequest.headers = { "content-length": "1000000" }; // 1MB
    const fileSizeLimiter = createFileSizeLimiter(2000000); // 2MB limit

    fileSizeLimiter(
      mockRequest as Request,
      mockResponse as Response,
      nextFunction
    );

    expect(nextFunction).toHaveBeenCalled();
    expect(sendResponseMock).not.toHaveBeenCalled();
  });

  it("should return an error for files exceeding size limit", () => {
    mockRequest.headers = { "content-length": "3000000" }; // 3MB
    const fileSizeLimiter = createFileSizeLimiter(2000000); // 2MB limit

    fileSizeLimiter(
      mockRequest as Request,
      mockResponse as Response,
      nextFunction
    );

    expect(sendResponseMock).toHaveBeenCalledWith(
      mockResponse,
      utils.Code.PayloadTooLarge,
      expect.objectContaining({
        success: false,
        message: expect.stringContaining("File too large"),
      })
    );
    expect(nextFunction).not.toHaveBeenCalled();
  });

  it("should return an error when Content-Length header is missing", () => {
    mockRequest.headers = {};
    const fileSizeLimiter = createFileSizeLimiter(2000000);

    fileSizeLimiter(
      mockRequest as Request,
      mockResponse as Response,
      nextFunction
    );

    expect(sendResponseMock).toHaveBeenCalledWith(
      mockResponse,
      utils.Code.BadRequest,
      expect.objectContaining({
        success: false,
        message: "Content-Length header is missing",
      })
    );
    expect(nextFunction).not.toHaveBeenCalled();
  });

  it("should return an error when Content-Length header is invalid", () => {
    mockRequest.headers = { "content-length": "not-a-number" };
    const fileSizeLimiter = createFileSizeLimiter(2000000);

    fileSizeLimiter(
      mockRequest as Request,
      mockResponse as Response,
      nextFunction
    );

    expect(sendResponseMock).toHaveBeenCalledWith(
      mockResponse,
      utils.Code.BadRequest,
      expect.objectContaining({
        success: false,
        message: "Invalid Content-Length header",
      })
    );
    expect(nextFunction).not.toHaveBeenCalled();
  });
});
