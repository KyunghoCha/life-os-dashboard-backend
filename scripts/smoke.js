import { rmSync } from "node:fs";
import { resolve } from "node:path";

process.env.DB_PATH = "data/smoke.sqlite";

const smokeDb = resolve(process.env.DB_PATH);
for (const suffix of ["", "-wal", "-shm"]) {
  rmSync(`${smokeDb}${suffix}`, { force: true });
}

const { createApp } = await import("../src/app.js");
const { closeDatabase } = await import("../src/db/connection.js");
const app = createApp();
const server = app.listen(0, "127.0.0.1");
await new Promise((resolveListen) => server.once("listening", resolveListen));

try {
  const { port } = server.address();
  const baseUrl = `http://127.0.0.1:${port}`;

  async function request(path, options = {}) {
    const response = await fetch(`${baseUrl}${path}`, {
      headers: { "Content-Type": "application/json", ...(options.headers || {}) },
      ...options,
    });
    const body = await response.json();
    if (!response.ok) {
      throw new Error(`${options.method || "GET"} ${path} failed: ${JSON.stringify(body)}`);
    }
    return body.data;
  }

  const health = await request("/api/health");
  if (health.status !== "ok") throw new Error("health status mismatch");

  const dashboard = await request("/api/dashboard");
  if (!dashboard.profile || dashboard.bugs.length === 0) {
    throw new Error("dashboard seed data missing");
  }

  const bug = await request("/api/bugs", {
    method: "POST",
    body: JSON.stringify({ text: "smoke test bug", severity: "low" }),
  });

  const resolved = await request(`/api/bugs/${bug.id}/resolve`, {
    method: "POST",
    body: JSON.stringify({ xpDelta: 120 }),
  });
  if (resolved.profile.xp <= dashboard.profile.xp) {
    throw new Error("XP did not increase after resolving bug");
  }

  const advice = await request("/api/ai/advice", {
    method: "POST",
    body: JSON.stringify({ topic: "✨ MVP 전략" }),
  });
  if (advice.mode !== "static") throw new Error("AI advice mode mismatch");

  const vault = await request("/api/vault/unlock", { method: "POST", body: JSON.stringify({}) });
  if (vault.mode !== "demo") throw new Error("vault mode mismatch");

  console.log("smoke ok");
} finally {
  await new Promise((resolveClose) => server.close(resolveClose));
  closeDatabase();
  for (const suffix of ["", "-wal", "-shm"]) {
    rmSync(`${smokeDb}${suffix}`, { force: true });
  }
}
