import request from "supertest";
import express from "express";
import { RateLimiter, rateLimiter } from "./../middlewares/rateLimiter";
import { MAX_REQUEST, WINDOW_SIZE_MS } from "./../utils/constants";

describe("Rate Limiter Middleware", () => {
  let app: express.Application;
  let rateLimiterInstance: RateLimiter;
  let originalDateNow: () => number;

  beforeEach(() => {
    app = express();
    rateLimiterInstance = new RateLimiter();
    app.use(rateLimiter);
    app.get("/test", (req, res) => {
      res.status(200).json({ message: "OK" });
    });

    originalDateNow = Date.now;
  });

  it("should track different IPs separately", async () => {
    const mockReq1 = {
      headers: { "x-forwarded-for": "1.1.1.1" },
      ip: "1.1.1.1",
    } as unknown as express.Request;

    const mockReq2 = {
      headers: { "x-forwarded-for": "2.2.2.2" },
      ip: "2.2.2.2",
    } as unknown as express.Request;

    const mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as express.Response;

    const mockNext = jest.fn();

    // Make MAX_REQUEST requests for IP 1
    for (let i = 0; i < MAX_REQUEST; i++) {
      rateLimiterInstance.limit(mockReq1, mockRes, mockNext);
    }

    // The next request for IP 1 should be blocked
    rateLimiterInstance.limit(mockReq1, mockRes, mockNext);
    expect(mockRes.status).toHaveBeenCalledWith(429);

    // Reset mock function calls
    mockNext.mockClear();
    (mockRes.status as jest.Mock).mockClear();

    // Make MAX_REQUEST requests for IP 2 (should be allowed)
    for (let i = 0; i < MAX_REQUEST; i++) {
      rateLimiterInstance.limit(mockReq2, mockRes, mockNext);
    }
    expect(mockNext).toHaveBeenCalledTimes(MAX_REQUEST);
  });
});
