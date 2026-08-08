import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";

const root = path.resolve(import.meta.dirname, "..");
const app = fs.readFileSync(path.join(root, "src/App.jsx"), "utf8");
const recordsView = fs.readFileSync(path.join(root, "src/components/RecordAndReportView.jsx"), "utf8");

test("Gedächtnisprotokolle leben auf App-Ebene und überstehen interne Navigation", () => {
  assert.match(app, /const \[records, setRecords\] = useState\(\[\]\)/);
  assert.match(app, /<RecordAndReportView records=\{records\} setRecords=\{setRecords\} \/>/);
  assert.match(recordsView, /export function RecordAndReportView\(\{ records, setRecords \}\)/);
  assert.doesNotMatch(recordsView, /const \[records, setRecords\] = useState\(\[\]\)/);
});

test("Gedächtnisprotokolle bleiben trotzdem reine Arbeitsspeicher-Daten", () => {
  assert.doesNotMatch(recordsView, /localStorage|sessionStorage|indexedDB/i);
  assert.doesNotMatch(app, /localStorage.*records|sessionStorage.*records|indexedDB.*records/i);
});
