import express, { Request, Response, NextFunction } from "express";
import redis from "redis";
import { redisClient } from "../app";
import { RateLimitExceededError } from "../errors/rate-limit-exceeded-error";

export function rateLimiter({
  secondsWindow,
  allowedHits,
}: {
  secondsWindow: number;
  allowedHits: number;
}) {
  return async function (req: Request, res: Response, next: NextFunction) {
    const ip: any = req.socket.remoteAddress;

    const requests = await redisClient.incr(ip);
    let ttl;
    if (requests === 1) {
      await redisClient.expire(ip, secondsWindow);
      ttl = 60;
    } else {
      ttl = await redisClient.ttl(ip);
    }

    if (requests > allowedHits) {
      throw new RateLimitExceededError();
    } else next();
  };
}
