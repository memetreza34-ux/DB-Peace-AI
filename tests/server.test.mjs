import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import http from "node:http";
import os from "node:os";
import path from "node:path";

/*
 * Der Server hört nur auf 127.0.0.1 — aber jede Webseite im selben Browser
 * kann dorthin Anfragen schicken. Diese Tests spielen durch, was eine fremde
 * Seite versuchen würde, und prüfen, dass die App selbst weiter durchkommt.
 */
const verzeichnis = fs.mkdtempSync(path.join(os.tmpdir(), "db-peace-server-"));
process.env.MELDUNGEN_DB = path.join(verzeichnis, "meldungen.db");

const { anfrageBearbeiten } = await import("../server.js");

const server = http.createServer(anfrageBearbeiten);
await new Promise((fertig) => server.listen(0, "127.0.0.1", fertig));
const { port } = server.address();
test.after(() => server.close());

/* http.request statt fetch: fetch lässt den Host-Header nicht setzen. */
function anfrage({ method = "GET", pfad, headers = {}, body } = {}) {
  pfad ??= method === "GET" ? "/api/meldungen?rolle=jav" : "/api/meldungen";
  return new Promise((fertig, fehler) => {
    const req = http.request(
      { host: "127.0.0.1", port, method, path: pfad, headers: { host: `127.0.0.1:${port}`, ...headers } },
      (res) => {
        let text = "";
        res.on("data", (teil) => (text += teil));
        res.on("end", () => fertig({ status: res.statusCode, daten: text ? JSON.parse(text) : null }));
      },
    );
    req.on("error", fehler);
    if (body !== undefined) req.write(body);
    req.end();
  });
}

const MELDUNG = JSON.stringify({ empfaenger: "jav", kategorie: "Mobbing", inhalt: { beschreibung: "Test" } });
const ALS_JSON = { "content-type": "application/json" };

test("die App selbst kann melden und lesen — auch über den Vite-Proxy", async () => {
  const angelegt = await anfrage({
    method: "POST",
    headers: { ...ALS_JSON, host: "127.0.0.1:5173", origin: "http://127.0.0.1:5173" },
    body: MELDUNG,
  });
  assert.equal(angelegt.status, 201);

  const gelesen = await anfrage({ headers: { host: "localhost:5173" } });
  assert.equal(gelesen.status, 200);
  assert.ok(gelesen.daten.meldungen.some((m) => m.id === angelegt.daten.id));
});

test("eine fremde Domain, die auf 127.0.0.1 zeigt, liest nichts", async () => {
  const antwort = await anfrage({ headers: { host: `angreifer.example:${port}` } });
  assert.equal(antwort.status, 403);
  assert.equal(antwort.daten.meldungen, undefined);
});

test("eine fremde Webseite kann keine Meldung einschleusen", async () => {
  const vorher = (await anfrage()).daten.meldungen.length;

  // Das, was ein unsichtbares Formular auf einer fremden Seite schicken kann:
  const alsFormular = await anfrage({
    method: "POST",
    headers: { "content-type": "text/plain", origin: "https://angreifer.example" },
    body: MELDUNG,
  });
  assert.equal(alsFormular.status, 403);

  // Und ohne Origin, aber auch nicht als JSON:
  const ohneJson = await anfrage({ method: "POST", headers: { "content-type": "text/plain" }, body: MELDUNG });
  assert.equal(ohneJson.status, 415);

  const nullHerkunft = await anfrage({ method: "POST", headers: { ...ALS_JSON, origin: "null" }, body: MELDUNG });
  assert.equal(nullHerkunft.status, 403);

  assert.equal((await anfrage()).daten.meldungen.length, vorher);
});

test("kaputtes JSON ist ein Fehler der Anfrage, nicht des Servers", async () => {
  const antwort = await anfrage({ method: "POST", headers: ALS_JSON, body: "{kein json" });
  assert.equal(antwort.status, 400);
  assert.equal(antwort.daten.error, "ungueltiges_json");
});

test("bekannte Ablehnungen behalten ihren Code", async () => {
  const antwort = await anfrage({
    method: "POST",
    headers: ALS_JSON,
    body: JSON.stringify({ empfaenger: "vorstand", kategorie: "Mobbing" }),
  });
  assert.equal(antwort.status, 400);
  assert.equal(antwort.daten.error, "unbekannter_empfaenger");
});
