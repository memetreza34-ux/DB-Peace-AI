import { spawn } from "node:child_process";

const viteArgs = process.argv.slice(2);
const commands = [
  [process.execPath, ["server.js"], "api"],
  [process.platform === "win32" ? "npx.cmd" : "npx", ["vite", ...viteArgs], "vite"],
];

let shuttingDown = false;
let exitCode = 0;
const children = [];

for (const [command, args, name] of commands) {
  const child = spawn(command, args, {
    stdio: "inherit",
    shell: false,
    env: process.env,
  });

  child.on("error", (error) => {
    if (shuttingDown) return;
    console.error(`${name} konnte nicht gestartet werden:`, error.message);
    shutdown(1);
  });

  child.on("exit", (code, signal) => {
    if (shuttingDown) return;
    if (code === 0) {
      console.log(`${name} wurde beendet.`);
      shutdown(0);
      return;
    }

    console.error(`${name} wurde unerwartet beendet (${signal || `Code ${code ?? 1}`}).`);
    shutdown(code ?? 1);
  });

  children.push(child);
}

function shutdown(code = 0) {
  if (shuttingDown) return;
  shuttingDown = true;
  exitCode = Number.isInteger(code) ? code : 1;

  for (const child of children) {
    if (!child.killed && child.exitCode === null) child.kill("SIGTERM");
  }

  const forceTimer = setTimeout(() => {
    for (const child of children) {
      if (!child.killed && child.exitCode === null) child.kill("SIGKILL");
    }
  }, 2_000);
  forceTimer.unref();

  setTimeout(() => process.exit(exitCode), 100).unref();
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
