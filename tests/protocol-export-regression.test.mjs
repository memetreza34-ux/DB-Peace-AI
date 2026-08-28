import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";

const root = path.resolve(import.meta.dirname, "..");
const source = fs.readFileSync(path.join(root, "src/components/RecordAndReportView.jsx"), "utf8");

test("Gedächtnisprotokoll behandelt PDF-Fehler sichtbar statt sie hochzuwerfen", () => {
  assert.match(source, /const \[exportError, setExportError\] = useState\(""\)/);
  assert.match(source, /function exportRecord\(record\) \{[\s\S]*?try \{/);
  assert.match(source, /catch \{\s*setExportError\(/s);
  assert.match(source, /Der Sitzungsentwurf wurde nicht verändert/);
  assert.match(source, /role="alert"/);
});
