import { Router } from "express";
import { asyncHandler } from "../middleware/asyncHandler.js";
import { createAdvice, readTopics } from "../services/aiService.js";

export const aiRouter = Router();

aiRouter.get("/topics", asyncHandler(async (req, res) => {
  res.json({ data: readTopics() });
}));

aiRouter.post("/advice", asyncHandler(async (req, res) => {
  res.json({ data: createAdvice(req.body || {}) });
}));
