import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";

const root = path.resolve(import.meta.dirname, "..");

function read(relativePath) {
  return fs.readFileSync(path.join(root, relativePath), "utf8");
}

test("Gedächtnisprotokoll-Modal nutzt die gemeinsame Dialogsteuerung", () => {
  const source = read("src/components/RecordAndReportView.jsx");

  assert.match(source, /useModalDialog/);
  assert.match(source, /const dialogRef = useRef\(null\)/);
  assert.match(source, /initialFocusRef:\s*closeButtonRef/);
  assert.match(source, /ref=\{dialogRef\}/);
  assert.match(source, /aria-modal="true"/);
  assert.doesNotMatch(source, /window\.addEventListener\("keydown"/);
});
