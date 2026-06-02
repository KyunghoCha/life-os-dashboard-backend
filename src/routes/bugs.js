import { Router } from "express";
import { asyncHandler } from "../middleware/asyncHandler.js";
import { addBug, patchBug, readBugs, removeBug, resolveBugAndAwardXp } from "../services/bugService.js";

export const bugsRouter = Router();

bugsRouter.get("/", asyncHandler(async (req, res) => {
  res.json({ data: readBugs(req.query) });
}));

bugsRouter.post("/", asyncHandler(async (req, res) => {
  res.status(201).json({ data: addBug(req.body || {}) });
}));

bugsRouter.patch("/:id", asyncHandler(async (req, res) => {
  res.json({ data: patchBug(req.params.id, req.body || {}) });
}));

bugsRouter.post("/:id/resolve", asyncHandler(async (req, res) => {
  res.json({ data: resolveBugAndAwardXp(req.params.id, req.body || {}) });
}));

bugsRouter.delete("/:id", asyncHandler(async (req, res) => {
  res.json({ data: removeBug(req.params.id) });
}));
