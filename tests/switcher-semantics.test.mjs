import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";

const root = path.resolve(import.meta.dirname, "..");

function read(relativePath) {
  return fs.readFileSync(path.join(root, relativePath), "utf8");
}

test("Profil- und HR-Umschalter verwenden keine unvollständigen ARIA-Tabs", () => {
  for (const file of ["src/components/ProfileView.jsx", "src/components/HRDashboard.jsx"]) {
    const source = read(file);
    assert.doesNotMatch(source, /role="tab"/);
    assert.doesNotMatch(source, /role="tabpanel"/);
    assert.match(source, /aria-pressed=\{active\}/);
    assert.match(source, /role="group"/);
  }
});
