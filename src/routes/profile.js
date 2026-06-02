import { Router } from "express";
import { asyncHandler } from "../middleware/asyncHandler.js";
import { patchProfile, readProfile } from "../services/profileService.js";

export const profileRouter = Router();

profileRouter.get("/", asyncHandler(async (req, res) => {
  res.json({ data: readProfile() });
}));

profileRouter.patch("/", asyncHandler(async (req, res) => {
  res.json({ data: patchProfile(req.body || {}) });
}));
