import request from "supertest";
import { app } from "../../app";

describe("signup", () => {
  it("returns a 201 on successful signup", async () => {
    const response = await request(app)
      .post("/api/users/signup")
      .send({
        email: "test@test.com",
        password: "password",
      })
      .expect(201);
    expect(response.get("Set-Cookie")).toBeDefined();
  });

  it("returns a 400 with an invalid email", async () => {
    return request(app)
      .post("/api/users/signup")
      .send({
        email: "asfd",
        password: "password",
      })
      .expect(400);
  });

  it("returns a 400 with an invalid password", async () => {
    return request(app)
      .post("/api/users/signup")
      .send({
        email: "test@gmail.com",
        password: "ab",
      })
      .expect(400);
  });

  it("only allows unique emails", async () => {
    await request(app)
      .post("/api/users/signup")
      .send({
        email: "test@gmail.com",
        password: "password",
      })
      .expect(201);

    await request(app)
      .post("/api/users/signup")
      .send({
        email: "test@gmail.com",
        password: "password",
      })
      .expect(400);
  });
});
