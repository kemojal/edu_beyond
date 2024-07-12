import { Request, Response, NextFunction } from "express";


// Rate limiter
// const requestCounts: { [key: string]: { count: number; lastReset: number } } =
//   {};

// export const rateLimiter = (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   const ip = req.ip || req.socket.remoteAddress || "unknown";
//   const now = Date.now();
//   const WINDOW_SIZE_MS = 60 * 1000; // 1 minute

//   if (!requestCounts[ip]) {
//     requestCounts[ip] = { count: 1, lastReset: now };
//   } else {
//     if (now - requestCounts[ip].lastReset > WINDOW_SIZE_MS) {
//       requestCounts[ip] = { count: 1, lastReset: now };
//     } else {
//       requestCounts[ip].count++;
//       if (requestCounts[ip].count > 10) {
//         return res
//           .status(429)
//           .json({ success: false, message: "Too many requests" });
//       }
//     }
//   }

//   next();
// };

const WINDOW_SIZE_MS = 60 * 1000; // 1 minute
const MAX_REQUESTS = 10;

interface RateLimitInfo {
  count: number;
  lastReset: number;
}

class RateLimiter {
  private requestCounts: Map<string, RateLimitInfo> = new Map();

  limit = (req: Request, res: Response, next: NextFunction): void => {
    const ip = this.getClientIp(req);
    const now = Date.now();

    let rateLimitInfo = this.requestCounts.get(ip);

    if (!rateLimitInfo || now - rateLimitInfo.lastReset > WINDOW_SIZE_MS) {
      rateLimitInfo = { count: 1, lastReset: now };
    } else {
      rateLimitInfo.count++;
      if (rateLimitInfo.count > MAX_REQUESTS) {
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
