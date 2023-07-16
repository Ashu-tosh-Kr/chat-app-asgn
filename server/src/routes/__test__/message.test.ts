import request from "supertest";
import { app } from "../../app";

describe("message", () => {
  it("sent are rate limited to 5 requests per minute", async () => {
    const curUser = await signin();
    const newUser = await signin("d@test.com", "password");

    await request(app)
      .post("/api/messages/send-message")
      .set("Authorization", `Bearer ${curUser.access_token}`)
      .send({
        sender: curUser.id,
        receiver: newUser.id,
        message: "Sample Message",
      })
      .expect(201);

    await request(app)
      .post("/api/messages/send-message")
      .set("Authorization", `Bearer ${curUser.access_token}`)
      .send({
        sender: curUser.id,
        receiver: newUser.id,
        message: "Sample Message",
      })
      .expect(201);
    await request(app)
      .post("/api/messages/send-message")
      .set("Authorization", `Bearer ${curUser.access_token}`)
      .send({
        sender: curUser.id,
        receiver: newUser.id,
        message: "Sample Message",
      })
      .expect(201);
    await request(app)
      .post("/api/messages/send-message")
      .set("Authorization", `Bearer ${curUser.access_token}`)
      .send({
        sender: curUser.id,
        receiver: newUser.id,
        message: "Sample Message",
      })
      .expect(201);
    await request(app)
      .post("/api/messages/send-message")
      .set("Authorization", `Bearer ${curUser.access_token}`)
      .send({
        sender: curUser.id,
        receiver: newUser.id,
        message: "Sample Message",
      })
      .expect(201);
    await request(app)
      .post("/api/messages/send-message")
      .set("Authorization", `Bearer ${curUser.access_token}`)
      .send({
        sender: curUser.id,
        receiver: newUser.id,
        message: "Sample Message",
      })
      .expect(429);
  });
});
