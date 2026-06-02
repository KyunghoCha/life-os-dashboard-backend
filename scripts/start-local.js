import { existsSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { execFileSync, spawn } from "node:child_process";

const backendDir = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const frontendDir = resolve(backendDir, "..", "frontend");
const npmCommand = process.platform === "win32" ? "npm.cmd" : "npm";
const children = [];
let shuttingDown = false;

function startProcess(name, cwd, args) {
  console.log(`[${name}] starting in ${cwd}`);
  const child = spawn(npmCommand, args, {
    cwd,
    env: process.env,
    stdio: "inherit",
  });

  children.push({ name, child });
  child.on("exit", (code) => {
    if (!shuttingDown) {
      console.log(`[${name}] exited with code ${code}`);
      shutdown(code || 0);
    }
  });
}

function stopChild(child) {
  if (child.exitCode !== null) return;
  if (process.platform === "win32") {
    try {
      execFileSync("taskkill", ["/pid", String(child.pid), "/t", "/f"], { stdio: "ignore" });
    } catch {
      // The process may have already exited between the status check and taskkill.
    }
    return;
  }
  child.kill("SIGTERM");
}

function shutdown(code = 0) {
  if (shuttingDown) return;
  shuttingDown = true;
  children.forEach(({ child }) => stopChild(child));
  process.exit(code);
}

process.on("SIGINT", () => shutdown(0));
process.on("SIGTERM", () => shutdown(0));

startProcess("backend", backendDir, ["run", "dev"]);

if (existsSync(resolve(frontendDir, "package.json"))) {
  startProcess("frontend", frontendDir, ["run", "dev", "--", "--host", "127.0.0.1", "--port", "5173", "--strictPort"]);
  console.log("frontend: http://127.0.0.1:5173/");
} else {
  console.warn(`[frontend] package.json not found at ${frontendDir}; backend only mode`);
}

console.log("backend:  http://127.0.0.1:4000/");
console.log("health:   http://127.0.0.1:4000/api/health");
