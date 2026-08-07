import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";

const root = path.resolve(import.meta.dirname, "..");
const html = fs.readFileSync(path.join(root, "index.html"), "utf8");

test("Dokument-CSP erlaubt keine Inline-Skripte oder ungenutzten Google-Font-Ursprünge", () => {
  assert.match(html, /script-src 'self'/);
  assert.doesNotMatch(html, /script-src[^;]*'unsafe-inline'/);
  assert.doesNotMatch(html, /fonts\.googleapis\.com|fonts\.gstatic\.com/);
  assert.match(html, /meta name="referrer" content="no-referrer"/);
});
