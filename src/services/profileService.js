import { transaction } from "../db/connection.js";
import { getProfile, updateProfile, addXp } from "../repositories/profileRepository.js";
import { createXpEvent, listXpEvents } from "../repositories/xpRepository.js";
import { optionalText, validateXpDelta } from "./validation.js";

export function readProfile() {
  return getProfile();
}

export function patchProfile(payload) {
  return updateProfile({
    displayName: optionalText(payload.displayName, "displayName"),
    avatar: optionalText(payload.avatar, "avatar"),
  });
}

export function readXp() {
  return {
    profile: getProfile(),
    events: listXpEvents(),
  };
}

export function createManualXpEvent(payload) {
  const delta = validateXpDelta(payload.delta, 0);
  return transaction(() => {
    const profile = addXp(delta);
    const event = createXpEvent({
      delta,
      reason: payload.reason || "manual adjustment",
      sourceType: "manual",
      sourceId: payload.sourceId || null,
    });
    return { profile, event };
  });
}
