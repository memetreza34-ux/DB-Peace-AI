import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";

const root = path.resolve(import.meta.dirname, "..");
const workflow = fs.readFileSync(path.join(root, ".github/workflows/ci.yml"), "utf8");

test("CI verwendet immutable GitHub-Action-SHAs und keine persistenten Checkout-Credentials", () => {
  assert.match(workflow, /actions\/checkout@3d3c42e5aac5ba805825da76410c181273ba90b1\s+# v7/);
  assert.match(workflow, /persist-credentials:\s*false/);
  assert.match(workflow, /actions\/setup-node@820762786026740c76f36085b0efc47a31fe5020\s+# v7/);
  assert.doesNotMatch(workflow, /actions\/checkout@v7/);
  assert.doesNotMatch(workflow, /actions\/setup-node@v7/);
  assert.match(workflow, /node-version:\s*22/);
  assert.match(workflow, /timeout-minutes:\s*10/);
});
