import { Router } from "express";
import { asyncHandler } from "../middleware/asyncHandler.js";
import { createManualXpEvent, readXp } from "../services/profileService.js";

export const xpRouter = Router();

xpRouter.get("/", asyncHandler(async (req, res) => {
  res.json({ data: readXp() });
}));

xpRouter.post("/events", asyncHandler(async (req, res) => {
  res.status(201).json({ data: createManualXpEvent(req.body || {}) });
}));
