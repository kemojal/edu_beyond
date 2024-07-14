import request from "supertest";
import app from "../app";

describe("Server API Endpoints", () => {
  let server: any;

  beforeAll((done) => {
    server = app.listen(3004, done); // Use a different port for testing
  }, 10000); // Increase the timeout to 10 seconds

  afterAll((done) => {
    server.close(done);
  });

  it("should return 200 OK", async () => {
    const res = await request(app).get("/");
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ success: true });
  });

  it("should return 404 Not Found", async () => {
    const res = await request(app).get("/undefined-route");
    expect(res.status).toBe(404);
    expect(res.body).toEqual({ code: 9 });
  });
});
