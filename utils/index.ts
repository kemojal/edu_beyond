import { Response } from "express";
import { Values } from "../types";

export const HttpStatusCode = {
  OK: 200,
  Created: 201,
  Accepted: 202,
  NonAuthoritativeInformation: 203,
  NoContent: 204,
  ResetContent: 205,
  PartialContent: 206,
  MultiStatus: 207,
  AlreadyReported: 208,
  AlreadyExist: 210,
  IMUsed: 226,
  MultipleChoices: 300,
  MovedPermanently: 301,
  Found: 302,
  SeeOther: 303,
  NotModified: 304,
  UseProxy: 305,
  TemporaryRedirect: 307,
  PermanentRedirect: 308,
  BadRequest: 400,
  Unauthorized: 401,
  PaymentRequired: 402,
  Forbidden: 403,
  NotFound: 404,
  MethodNotAllowed: 405,
  NotAcceptable: 406,
  ProxyAuthenticationRequired: 407,
  RequestTimeout: 408,
  Conflict: 409,
  Gone: 410,
  LengthRequired: 411,
  PreconditionFailed: 412,
  PayloadTooLarge: 413,
  URITooLong: 414,
  UnsupportedMediaType: 415,
  RangeNotSatisfiable: 416,
  ExpectationFailed: 417,
  ImATeapot: 418,
  MisdirectedRequest: 421,
  UnprocessableEntity: 422,
  TooManyRequests: 429,
  InternalServerError: 500,
  NotImplemented: 501,
  BadGateway: 502,
  ServiceUnavailable: 503,
  GatewayTimeout: 504,
} as const;

export type HttpStatusCode = Values<typeof HttpStatusCode>;

export const HttpStatusCodes = new Set(
  Object.values(HttpStatusCode)
) as ReadonlySet<HttpStatusCode>;

export type HttpSuccessCode =
  | typeof HttpStatusCode.OK
  | typeof HttpStatusCode.Created
  | typeof HttpStatusCode.Accepted;

export const Code = {
  Ok: 0,
  ServerError: 1,
  Timeout: 2,
  Malformed: 3,
  InvalidType: 4,
  InvalidValue: 5,
  SqlError: 6,
  AmazonS3Error: 7,
  NotFound: 9,
  Unauthorized: 10,
  Forbidden: 11,
  UniqueConflict: 12,
  NotImplemented: 13,
  SendgridError: 14,
  FatalError: 15,
  TooManyRequests: 16,
  Expired: 17,
  AlreadyExists: 18,
  BadRequest: 19,
  PayloadTooLarge: 20,
} as const;
export type Code = Values<typeof Code>;

export function toHttpStatus(code: Code): HttpStatusCode {
  switch (code) {
    case Code.Ok:
      return HttpStatusCode.OK;
    case Code.Malformed:
      return HttpStatusCode.BadRequest;
    case Code.InvalidType:
    case Code.InvalidValue:
      return HttpStatusCode.UnprocessableEntity;
    case Code.UniqueConflict:
      return HttpStatusCode.Conflict;
    case Code.Expired:
      return HttpStatusCode.Gone;
    case Code.SqlError:
    case Code.AmazonS3Error:
    case Code.SendgridError:
      return HttpStatusCode.InternalServerError;
    case Code.NotFound:
      return HttpStatusCode.NotFound;
    case Code.Timeout:
      return HttpStatusCode.RequestTimeout;
    case Code.Unauthorized:
      return HttpStatusCode.Unauthorized;
    case Code.Forbidden:
      return HttpStatusCode.Forbidden;
    case Code.TooManyRequests:
      return HttpStatusCode.TooManyRequests;
    case Code.ServerError:
    case Code.FatalError:
    case Code.NotImplemented:
      return HttpStatusCode.InternalServerError;
    case Code.AlreadyExists:
      return HttpStatusCode.AlreadyExist;
    case Code.BadRequest:
      return HttpStatusCode.BadRequest;
    case Code.PayloadTooLarge:
      return HttpStatusCode.PayloadTooLarge;
  }
}

export function isHttpStatusCode(code: number): code is HttpStatusCode {
  return HttpStatusCodes.has(code as HttpStatusCode);
}

export function isHttpSuccess(code: number): code is HttpSuccessCode {
  return isHttpStatusCode(code) && code >= 200 && code < 300;
}

export function sendResponse<T = any>(res: Response, code: Code, data?: T) {
  const httpCode = toHttpStatus(code);
  if (isHttpSuccess(httpCode)) {
    if (arguments.length < 3) {
      res.status(httpCode).json(null);
    } else {
      res.status(httpCode).json(data);
    }
  } else {
    res.status(httpCode).json({ code });
  }
}
