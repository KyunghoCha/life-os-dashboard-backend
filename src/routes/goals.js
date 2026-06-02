import { Router } from "express";
import { asyncHandler } from "../middleware/asyncHandler.js";
import { addGoal, patchGoal, readGoals } from "../services/goalService.js";

export const goalsRouter = Router();

goalsRouter.get("/", asyncHandler(async (req, res) => {
  res.json({ data: readGoals() });
}));

goalsRouter.post("/", asyncHandler(async (req, res) => {
  res.status(201).json({ data: addGoal(req.body || {}) });
}));

goalsRouter.patch("/:id", asyncHandler(async (req, res) => {
  res.json({ data: patchGoal(req.params.id, req.body || {}) });
}));
