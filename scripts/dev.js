import { spawn } from "node:child_process";

const viteArgs = process.argv.slice(2);
const commands = [
  ["node", ["server.js"], "api"],
  ["npx", ["vite", ...viteArgs], "vite"],
];

const children = commands.map(([command, args, name]) => {
  const child = spawn(command, args, {
    stdio: "inherit",
    shell: process.platform === "win32",
  });

  child.on("exit", (code) => {
    if (code && !shuttingDown) {
      console.error(`${name} wurde mit Code ${code} beendet.`);
      shutdown(code);
    }
  });

  return child;
});

let shuttingDown = false;

function shutdown(code = 0) {
  shuttingDown = true;
  for (const child of children) {
    if (!child.killed) {
      child.kill("SIGTERM");
    }
  }
  process.exit(code);
}

process.on("SIGINT", () => shutdown(0));
process.on("SIGTERM", () => shutdown(0));
