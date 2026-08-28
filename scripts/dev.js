import { spawn } from "node:child_process";
import path from "node:path";

const viteArgs = process.argv.slice(2);
const viteEntry = path.resolve("node_modules", "vite", "bin", "vite.js");
const commands = [
  [process.execPath, ["server.js"], "api"],
  [process.execPath, [viteEntry, ...viteArgs], "vite"],
];

let shuttingDown = false;
let requestedExitCode = 0;
let forceTimer = null;
const children = new Map();

for (const [command, args, name] of commands) startProcess(command, args, name);

function startProcess(command, args, name) {
  const child = spawn(command, args, {
    stdio: "inherit",
    shell: false,
    env: process.env,
  });
  children.set(name, child);

  child.on("error", (error) => {
    console.error(`${name} konnte nicht gestartet werden:`, error.message);
    children.delete(name);
    if (!shuttingDown) shutdown(1);
    finishIfStopped();
  });

  child.on("exit", (code, signal) => {
    children.delete(name);
    if (!shuttingDown) {
      if (code === 0) console.log(`${name} wurde beendet.`);
      else console.error(`${name} wurde unerwartet beendet (${signal || `Code ${code ?? 1}`}).`);
      shutdown(code ?? (signal ? 1 : 0));
    }
    finishIfStopped();
  });
}

function shutdown(code = 0) {
  if (shuttingDown) {
    requestedExitCode = Math.max(requestedExitCode, normalizeExitCode(code));
    return;
  }

  shuttingDown = true;
  requestedExitCode = normalizeExitCode(code);

  for (const child of children.values()) terminateChild(child, false);

  forceTimer = setTimeout(() => {
    for (const child of children.values()) terminateChild(child, true);
    setTimeout(() => process.exit(requestedExitCode), 250).unref();
  }, 2_500);
  forceTimer.unref();

  finishIfStopped();
}

function terminateChild(child, force) {
  if (!child.pid || child.exitCode !== null) return;

  if (process.platform === "win32") {
    const args = ["/PID", String(child.pid), "/T"];
    if (force) args.push("/F");
    const killer = spawn("taskkill", args, { stdio: "ignore", windowsHide: true });
    killer.on("error", () => undefined);
    return;
  }

  try {
    child.kill(force ? "SIGKILL" : "SIGTERM");
  } catch (error) {
    if (error?.code !== "ESRCH") console.error("Kindprozess konnte nicht beendet werden:", error);
  }
}

function finishIfStopped() {
  if (!shuttingDown || children.size > 0) return;
  if (forceTimer) clearTimeout(forceTimer);
  process.exit(requestedExitCode);
}

function normalizeExitCode(code) {
  return Number.isInteger(code) && code >= 0 ? code : 1;
}

process.on("SIGINT", () => shutdown(0));
process.on("SIGTERM", () => shutdown(0));
process.on("uncaughtException", (error) => {
  console.error("Unbehandelter Fehler im Entwicklungsstarter:", error);
  shutdown(1);
});
process.on("unhandledRejection", (error) => {
  console.error("Unbehandelte Promise-Ablehnung im Entwicklungsstarter:", error);
  shutdown(1);
});
