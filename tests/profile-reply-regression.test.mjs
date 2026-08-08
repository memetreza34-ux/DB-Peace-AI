import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";

const root = path.resolve(import.meta.dirname, "..");
const profile = fs.readFileSync(path.join(root, "src/components/ProfileView.jsx"), "utf8");

test("Profil-Demo löscht einen Antwortentwurf beim Fallwechsel", () => {
  assert.match(profile, /function selectTicket\(id\)/);
  assert.match(profile, /if \(id === selectedTicketId\) return;/);
  assert.match(profile, /setSelectedTicketId\(id\);\s*setReplyText\(""\);/);
  assert.match(profile, /onClick=\{\(\) => selectTicket\(ticket\.id\)\}/);
});

test("Profil-Demo löscht Antwortentwurf auch bei ungültiger Auswahl nach Datenupdate", () => {
  assert.match(profile, /if \(!tickets\.some\(\(ticket\) => ticket\.id === selectedTicketId\)\) \{\s*setSelectedTicketId\(tickets\[0\]\.id\);\s*setReplyText\(""\);/);
});
