import { db } from "../db/connection.js";
import { nowIso } from "../utils/time.js";

function toProfile(row) {
  if (!row) return null;
  return {
    id: row.id,
    displayName: row.display_name,
    avatar: row.avatar,
    tier: row.tier,
    level: row.level,
    xp: row.xp,
    xpTarget: row.xp_target,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export function getProfile() {
  return toProfile(db.prepare("SELECT * FROM profiles WHERE id = ?").get("local-user"));
}

export function updateProfile({ displayName, avatar }) {
  const current = getProfile();
  const updated = {
    displayName: displayName ?? current.displayName,
    avatar: avatar ?? current.avatar,
  };

  db.prepare(`
    UPDATE profiles
    SET display_name = ?, avatar = ?, updated_at = ?
    WHERE id = ?
  `).run(updated.displayName, updated.avatar, nowIso(), current.id);

  return getProfile();
}

export function addXp(delta) {
  const current = getProfile();
  const nextXp = Math.max(0, Math.min(current.xpTarget, current.xp + delta));
  db.prepare("UPDATE profiles SET xp = ?, updated_at = ? WHERE id = ?").run(nextXp, nowIso(), current.id);
  return getProfile();
}
