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

test("alte Teil-Fehlversuche verfallen statt unbegrenzt gespeichert zu bleiben", () => {
  const lock = read("src/components/AppLock.jsx");

  assert.match(lock, /ATTEMPT_WINDOW_MS\s*=\s*5 \* 60_000/);
  assert.match(lock, /attemptsExpireAt/);
  assert.match(lock, /parsed\.attemptsExpireAt > now/);
  assert.match(lock, /failedAttempts > 0 \? Date\.now\(\) \+ ATTEMPT_WINDOW_MS : 0/);
});

test("bereits geöffneter Setup-Tab darf eine später eingerichtete PIN nicht überschreiben", () => {
  const lock = read("src/components/AppLock.jsx");

  assert.match(lock, /const \[mode, setMode\] = useState/);
  assert.match(lock, /event\.key === LOCK_STORAGE_KEY/);
  assert.match(lock, /function syncLockConfig\(\)/);
  assert.match(lock, /if \(readLockConfig\(\)\) \{[\s\S]*?bereits eine lokale PIN eingerichtet/s);
  assert.match(lock, /const verifier = await createVerifier\(pin, salt\);[\s\S]*?if \(readLockConfig\(\)\)/s);
  assert.match(lock, /const storedConfig = readLockConfig\(\)/);
  assert.match(lock, /storedConfig\.salt !== salt \|\| storedConfig\.verifier !== verifier/);
});

test("laufende PIN-Prüfung verwirft ein Ergebnis wenn die Konfiguration parallel geändert wurde", () => {
  const lock = read("src/components/AppLock.jsx");

  assert.match(lock, /const currentConfig = readLockConfig\(\)/);
  assert.match(lock, /!sameLockConfig\(config, currentConfig\)/);
  assert.match(lock, /function sameLockConfig\(left, right\)/);
});

test("Schnell-Verlassen leert und sperrt den App-Zustand vor externer Navigation", () => {
  const app = read("src/App.jsx");
  const panic = read("src/components/PanicButton.jsx");

  assert.match(app, /function performQuickExitCleanup\(\)/);
  assert.match(app, /function prepareQuickExit\(\)/);
  assert.match(app, /sessionStorage\.removeItem\("db-peace-mood-session"\)/);
  assert.match(app, /setRecords\(\[\]\)/);
  assert.match(app, /resetTickets\(\)/);
  assert.match(app, /setIsEmergencyOpen\(false\)/);
  assert.match(app, /setIsSearchOpen\(false\)/);
  assert.match(app, /setIsSSOOpen\(false\)/);
  assert.match(app, /setIsHRMode\(false\)/);
  assert.match(app, /setIsLocked\(true\)/);
  assert.match(app, /<PanicButton onBeforeExit=\{prepareQuickExit\} \/>/);
  assert.match(panic, /onBeforeExit\?\.\(\)/);
  assert.match(panic, /window\.setTimeout\(\(\) => \{[\s\S]*?window\.location\.replace/s);
  assert.match(panic, /sessionStorage\.removeItem\("db-peace-mood-session"\)/);
});

test("Schnell-Verlassen signalisiert andere offene Tabs und sperrt sie ebenfalls", () => {
  const app = read("src/App.jsx");

  assert.match(app, /QUICK_EXIT_CHANNEL\s*=\s*"db-peace-quick-exit"/);
  assert.match(app, /QUICK_EXIT_STORAGE_KEY\s*=\s*"db-peace-quick-exit-signal"/);
  assert.match(app, /new BroadcastChannel\(QUICK_EXIT_CHANNEL\)/);
  assert.match(app, /event\.data\?\.type === "quick-exit"/);
  assert.match(app, /event\.key === QUICK_EXIT_STORAGE_KEY && event\.newValue/);
  assert.match(app, /window\.addEventListener\("storage",\s*handleStorage\)/);
  assert.match(app, /postMessage\(\{ type: "quick-exit" \}\)/);
  assert.match(app, /localStorage\.setItem\(QUICK_EXIT_STORAGE_KEY, signal\)/);
  assert.match(app, /localStorage\.removeItem\(QUICK_EXIT_STORAGE_KEY\)/);
});

test("Schnell-Verlassen bleibt auch im HR-Demo-Modus verfügbar", () => {
  const app = read("src/App.jsx");

  assert.match(app, /if \(isHRMode\) \{[\s\S]*?<HRDashboard[\s\S]*?<PanicButton onBeforeExit=\{prepareQuickExit\}/s);
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
