import request from "supertest";
import { app } from "../index";

describe("Testing the endpoint /api/scrape", () => {
  it("Should return products for the keyword 'cozinha'", async () => {
    const res = await request(app).get("/api/scrape?keyword=cozinha");

    expect(res.status).toBe(200);

    // Check if the response is an array of products
    expect(Array.isArray(res.body)).toBe(true);

    expect(res.body.length).toBeGreaterThan(0);

    // Check if the product data is in the expected format
    expect(res.body[0]).toHaveProperty("title");
    expect(res.body[0]).toHaveProperty("rating");
    expect(res.body[0]).toHaveProperty("numReviews");
    expect(res.body[0]).toHaveProperty("imageUrl");
  });

  it("Should return products for the keyword 'lapis'", async () => {
    const res = await request(app).get("/api/scrape?keyword=lapis");

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
  });

  it("Should return error if keyword is less than 2 characters", async () => {
    const res = await request(app).get("/api/scrape?keyword=a");

    expect(res.status).toBe(400);
    expect(res.body.error).toBe(
      "A palavra-chave deve ter pelo menos 2 caracteres!"
    );
  });
});
