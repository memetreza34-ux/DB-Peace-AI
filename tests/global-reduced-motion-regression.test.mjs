import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";

const root = path.resolve(import.meta.dirname, "..");
const main = fs.readFileSync(path.join(root, "src/main.jsx"), "utf8");

test("alle Framer-Motion-Oberflächen erben die Nutzerpräferenz für reduzierte Bewegung", () => {
  assert.match(main, /import \{ MotionConfig \} from "framer-motion"/);
  assert.match(main, /<MotionConfig reducedMotion="user">/);
  assert.match(main, /<AppErrorBoundary>[\s\S]*?<App \/>[\s\S]*?<\/AppErrorBoundary>[\s\S]*?<\/MotionConfig>/);
});
