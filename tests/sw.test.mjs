import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import { fileURLToPath } from "node:url";

/*
 * Der Service Worker hat bis zum 24.9.2026 jede GET-Antwort abgelegt — auch die
 * Meldungen aus den Rollen-Postfächern. Dieser Test lädt public/sw.js in einer
 * Sandbox und fragt die Filterfunktion direkt.
 */
const DATEI = path.join(path.dirname(fileURLToPath(import.meta.url)), "..", "public", "sw.js");
const ORIGIN = "http://127.0.0.1:5173";

function serviceWorkerLaden() {
  const kontext = {
    URL,
    self: { addEventListener() {}, location: { origin: ORIGIN } },
  };
  vm.createContext(kontext);
  vm.runInContext(fs.readFileSync(DATEI, "utf8"), kontext);
  // const-Deklarationen hängen nicht am globalen Objekt, sind aber im selben
  // Kontext noch sichtbar.
  return vm.runInContext("({ CACHE_NAME, ASSETS_TO_CACHE, darfInDenCache })", kontext);
}

const anfrage = (url, method = "GET") => ({ url, method });

test("Meldungen aus der API landen nie im Cache", () => {
  const { darfInDenCache } = serviceWorkerLaden();
  assert.equal(darfInDenCache(anfrage(`${ORIGIN}/api/meldungen?rolle=jav`)), false);
  assert.equal(darfInDenCache(anfrage(`${ORIGIN}/api/meldungen/JAV-123456`)), false);
});

test("die App selbst wird für den Offline-Betrieb abgelegt", () => {
  const { darfInDenCache } = serviceWorkerLaden();
  assert.equal(darfInDenCache(anfrage(`${ORIGIN}/`)), true);
  assert.equal(darfInDenCache(anfrage(`${ORIGIN}/assets/index.js`)), true);
});

test("fremde Adressen und schreibende Anfragen bleiben draußen", () => {
  const { darfInDenCache } = serviceWorkerLaden();
  assert.equal(darfInDenCache(anfrage("https://fonts.googleapis.com/css")), false);
  assert.equal(darfInDenCache(anfrage(`${ORIGIN}/`, "POST")), false);
});

test("der Cache hat eine neue Version, damit der alte gelöscht wird", () => {
  const { CACHE_NAME } = serviceWorkerLaden();
  assert.notEqual(CACHE_NAME, "db-peace-ai-v1");
});

test("jede vorab geladene Datei gibt es wirklich", () => {
  const { ASSETS_TO_CACHE } = serviceWorkerLaden();
  const oeffentlich = path.join(path.dirname(DATEI));
  for (const datei of ASSETS_TO_CACHE) {
    if (datei === "/" || datei === "/index.html") continue;
    assert.ok(fs.existsSync(path.join(oeffentlich, datei)), `${datei} fehlt in public/`);
  }
});
