import request from "supertest";
import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import { app, redisClient } from "../app";

declare global {
  var signin: (
    email?: string,
    password?: string
  ) => Promise<{
    id: string;
    email: string;
    username: string;
    access_token: string;
  }>;
}

let mongo: any;

beforeAll(async () => {
  process.env.JWT_KEY = "asdf";
  mongo = await MongoMemoryServer.create();
  const mongoUri = mongo.getUri();
  await mongoose.connect(mongoUri, {});
});

beforeEach(async () => {
  const connections = await mongoose.connection.db.collections();
  for (let collection of connections) {
    await collection.deleteMany({});
  }
  const keys = await redisClient.keys("*");

  if (keys.length === 0) {
    console.log("No IP addresses found in Redis.");
    return;
  }

  await redisClient.del(keys);
});

afterAll(async () => {
  if (mongo) {
    await mongo.stop();
  }
  await mongoose.connection.close();
});

global.signin = async (email = "t@test.com", password = "password") => {
  const response = await request(app)
    .post("/api/auth/register")
    .send({
      email,
      password,
    })
    .expect(201);

  const user = response.body;
  return user;
};
