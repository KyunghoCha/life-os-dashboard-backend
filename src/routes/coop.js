import { Router } from "express";
import { asyncHandler } from "../middleware/asyncHandler.js";
import { readCoopStatus, syncLocalCoop } from "../services/coopService.js";

export const coopRouter = Router();

coopRouter.get("/status", asyncHandler(async (req, res) => {
  res.json({ data: readCoopStatus() });
}));

coopRouter.post("/sync", asyncHandler(async (req, res) => {
  res.json({ data: syncLocalCoop() });
}));
