import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";

const root = path.resolve(import.meta.dirname, "..");
const source = fs.readFileSync(path.join(root, "src/components/AISmartReport.jsx"), "utf8");

test("KI-Meldungsanalyse setzt Mounted-Status bei jedem Effect-Setup neu", () => {
  assert.match(source, /const isMountedRef = useRef\(false\)/);
  assert.match(source, /useEffect\(\(\) => \{\s*isMountedRef\.current = true;/s);
  assert.match(source, /return \(\) => \{\s*isMountedRef\.current = false;/s);
});
