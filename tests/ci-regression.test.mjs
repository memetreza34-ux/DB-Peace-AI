import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";

const root = path.resolve(import.meta.dirname, "..");
const workflow = fs.readFileSync(path.join(root, ".github/workflows/ci.yml"), "utf8");

test("CI verwendet aktuelle GitHub-Action-Runtimes und keine persistenten Checkout-Credentials", () => {
  assert.match(workflow, /actions\/checkout@v7/);
  assert.match(workflow, /persist-credentials:\s*false/);
  assert.match(workflow, /actions\/setup-node@v7/);
  assert.match(workflow, /node-version:\s*22/);
  assert.match(workflow, /timeout-minutes:\s*10/);
});
