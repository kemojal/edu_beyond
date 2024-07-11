import { Request, Response, NextFunction } from "express";
import { HttpStatusCode } from "../../utils/enums";
class HttpError extends Error {
  statusCode: HttpStatusCode;

  constructor(message: string, statusCode: HttpStatusCode) {
    super(message);
    this.statusCode = statusCode;
  }
}

const errorHandler = (
  err: HttpError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const statusCode = err.statusCode || HttpStatusCode.INTERNAL_SERVER_ERROR;
  const message = err.message || "Internal Server Error";

  res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
};

export { HttpError, errorHandler };
