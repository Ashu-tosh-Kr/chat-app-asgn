import request from "supertest";
import { app } from "../../app";

describe("signin", () => {
  it("returns a 200 on successful signin", async () => {
    await request(app)
      .post("/api/users/signup")
      .send({
        email: "test@test.com",
        password: "password",
      })
      .expect(201);

    const response = await request(app)
      .post("/api/users/signin")
      .send({
        email: "test@test.com",
        password: "password",
      })
      .expect(200);
    expect(response.get("Set-Cookie")).toBeDefined();
  });

  it("returns a 400 with an invalid email", async () => {
    return request(app)
      .post("/api/users/signin")
      .send({
        email: "asfd",
        password: "password",
      })
      .expect(400);
  });

  it("returns a 400 on incorrect password", async () => {
    await request(app)
      .post("/api/users/signup")
      .send({
        email: "test@test.com",
        password: "password",
      })
      .expect(201);

    const response = await request(app)
      .post("/api/users/signin")
      .send({
        email: "test@test.com",
        password: "passwordd",
      })
      .expect(401);
    expect(response.get("Set-Cookie")).toBeUndefined();
  });
});
