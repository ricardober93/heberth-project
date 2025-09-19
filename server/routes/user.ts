import { Hono } from "hono";
import { authMiddleware } from "../auth/middleware";


export const user = new Hono()
  