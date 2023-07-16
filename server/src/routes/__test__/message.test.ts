import request from "supertest";
import { app } from "../../app";

describe("message", () => {
  it("sent are rate limited to 5 requests per minute", async () => {
    const curUser = await signin();
    const newUser = await signin("f@test.com", "password");

    await Promise.all(
      Array.from({ length: 5 }, (_, __) =>
        request(app)
          .post("/api/messages/send-message")
          .set("Authorization", `Bearer ${curUser.access_token}`)
          .send({
            sender: curUser.id,
            receiver: newUser.id,
            message: "Sample Message",
          })
          .expect(201)
      )
    );

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

  it("should allow multiple users to send messages concurrently and preserve the order", async () => {
    const numUsers = 5;
    const aUser = await signin("a@test.com", "password");
    const bUser = await signin("b@test.com", "password");
    const cUser = await signin("c@test.com", "password");
    const dUser = await signin("d@test.com", "password");
    const eUser = await signin("e@test.com", "password");
    const users = [aUser, bUser, cUser, dUser, eUser];
    const numMessages = 1;
    const messagesSent: any = [];

    await Promise.all(
      Array.from({ length: numUsers }, (_, i) =>
        request(app)
          .post("/api/messages/send-message")
          .set("Authorization", `Bearer ${users[i].access_token}`)
          .send({
            sender: users[i].id,
            receiver: users[i === numUsers - 1 ? i - 1 : i + 1].id,
            message: "Sample Message",
          })
          .expect(201)
          .then((res) => {
            messagesSent.push(res.body);
          })
      )
    );
    expect(messagesSent).toHaveLength(numUsers * numMessages);
    Array.from({ length: numUsers }, (_, i) =>
      expect(messagesSent[i].sender === users[i].id)
    );
  });
});
