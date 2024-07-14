import request from "supertest";
import express from "express";
import { uploadRoutes } from "./../../routes/upload";
// import { uploadRoutes } from "./../routes/upload";

describe("Upload Routes", () => {
  let app: express.Express;

  beforeEach(() => {
    app = express();
    uploadRoutes(app);
  });

  it("should respond with 200 OK on the root route", async () => {
    const response = await request(app).get("/");
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ success: true });
  });

  it("should handle file upload", async () => {
    const response = await request(app)
      .post("/upload")
      .attach("file", Buffer.from("dummy pdf content"), "test.pdf");

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.file).toBeDefined();
  });
});
