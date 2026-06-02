import { Router } from "express";
import { asyncHandler } from "../middleware/asyncHandler.js";
import { readDashboard } from "../services/dashboardService.js";

export const dashboardRouter = Router();

dashboardRouter.get("/", asyncHandler(async (req, res) => {
  res.json({ data: readDashboard() });
}));
