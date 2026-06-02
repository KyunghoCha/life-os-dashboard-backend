import { Router } from "express";
import { asyncHandler } from "../middleware/asyncHandler.js";
import { patchVaultItem, readVaultItems, unlockVault } from "../services/vaultService.js";

export const vaultRouter = Router();

vaultRouter.post("/unlock", asyncHandler(async (req, res) => {
  res.json({ data: unlockVault(req.body || {}) });
}));

vaultRouter.get("/items", asyncHandler(async (req, res) => {
  res.json({ data: readVaultItems() });
}));

vaultRouter.patch("/items/:id", asyncHandler(async (req, res) => {
  res.json({ data: patchVaultItem(req.params.id, req.body || {}) });
}));
