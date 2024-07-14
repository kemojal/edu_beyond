import { Request, Response, NextFunction } from "express";
import { MAX_REQUEST, WINDOW_SIZE_MS } from "../utils/constants";
import { RateLimitInfo } from "types";

export class RateLimiter {
  private requestCounts: Map<string, RateLimitInfo> = new Map();

  limit = (req: Request, res: Response, next: NextFunction): void => {
    const ip = this.getClientIp(req);
    const now = Date.now();

    let rateLimitInfo = this.requestCounts.get(ip);

    if (!rateLimitInfo || now - rateLimitInfo.lastReset > WINDOW_SIZE_MS) {
      rateLimitInfo = { count: 1, lastReset: now };
    } else {
      rateLimitInfo.count++;
      if (rateLimitInfo.count > MAX_REQUEST) {
        const retryAfter = Math.ceil(
          (rateLimitInfo.lastReset + WINDOW_SIZE_MS - now) / 1000
        );
        res.status(429).json({
          success: false,
          message: "Too many requests",
          retryAfter,
        });
        return;
      }
    }

    this.requestCounts.set(ip, rateLimitInfo);
    next();
  };

  private getClientIp(req: Request): string {
    return (
      (req.headers["x-forwarded-for"] as string)?.split(",")[0].trim() ||
      req.ip ||
      req.socket.remoteAddress ||
      "unknown"
    );
  }
}

export const rateLimiter = new RateLimiter().limit;
