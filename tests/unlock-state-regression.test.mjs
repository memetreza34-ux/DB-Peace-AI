import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";

const root = path.resolve(import.meta.dirname, "..");

function read(relativePath) {
  return fs.readFileSync(path.join(root, relativePath), "utf8");
}

test("Entsperrstatus wird nicht in localStorage oder sessionStorage persistiert", () => {
  const lock = read("src/components/AppLock.jsx");
  const panic = read("src/components/PanicButton.jsx");

  assert.doesNotMatch(lock, /db-peace-unlocked/);
  assert.doesNotMatch(panic, /db-peace-unlocked/);
  assert.doesNotMatch(lock, /SESSION_UNLOCK_KEY/);
  assert.match(lock, /Nach Neuladen oder Öffnen in einem neuen Tab/);
});

test("PIN-Fehlversuche und Sperrzeit gelten tabübergreifend", () => {
  const lock = read("src/components/AppLock.jsx");

  assert.match(lock, /safeStorageGet\("local",\s*THROTTLE_STORAGE_KEY\)/);
  assert.match(lock, /safeStorageSet\(\s*"local",\s*THROTTLE_STORAGE_KEY/);
  assert.match(lock, /safeStorageRemove\("local",\s*THROTTLE_STORAGE_KEY\)/);
  assert.match(lock, /window\.addEventListener\("storage",\s*handleStorage\)/);
  assert.match(lock, /const latestThrottle = readThrottle\(\)/);
  assert.match(lock, /Neuladen oder ein weiterer Tab setzen diese Pause nicht zurück/);
});

test("PIN-Sperrbildschirm respektiert reduzierte Bewegung", () => {
  const lock = read("src/components/AppLock.jsx");

  assert.match(lock, /useReducedMotion/);
  assert.match(lock, /initial=\{reduceMotion \? false/);
});

test("Schnell-Verlassen bleibt über kritischen App-Dialogen anklickbar", () => {
  const panic = read("src/components/PanicButton.jsx");
  const emergency = read("src/components/EmergencyModal.jsx");

  assert.match(panic, /z-\[140\]/);
  assert.match(emergency, /z-\[100\]/);
});
