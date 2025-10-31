const request = require("supertest");
const app = require("../app");

describe("Auth endpoints", () => {
  test("GET /api should return welcome", async () => {
    const res = await request(app).get("/api");
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("message");
  });
});
