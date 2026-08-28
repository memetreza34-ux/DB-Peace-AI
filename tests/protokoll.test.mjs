import test from "node:test";
import assert from "node:assert/strict";
import { eintraegeFuerSpeicher } from "../src/lib/protokoll.js";

test("Anhänge ohne Inhalt behalten nur den Namen", () => {
  const [eintrag] = eintraegeFuerSpeicher([
    {
      id: 1,
      description: "Vorfall",
      files: [{ name: "beweis.pdf", type: "application/pdf", url: "blob:egal", gespeichert: false }],
    },
  ]);

  assert.equal(eintrag.files[0].name, "beweis.pdf");
  assert.equal(eintrag.files[0].url, null, "eine nicht gespeicherte Datei darf keine tote URL behalten");
  assert.equal(eintrag.files[0].gespeichert, false);
});

test("Gespeicherte Bilder behalten ihre Data-URL", () => {
  const [eintrag] = eintraegeFuerSpeicher([
    {
      id: 2,
      description: "Vorfall mit Foto",
      files: [{ name: "foto.jpg", type: "image/jpeg", url: "data:image/jpeg;base64,AAA", gespeichert: true }],
    },
  ]);

  assert.equal(eintrag.files[0].url, "data:image/jpeg;base64,AAA");
  assert.equal(eintrag.files[0].gespeichert, true);
});

test("Einträge ohne Anhänge überstehen die Aufbereitung", () => {
  const [eintrag] = eintraegeFuerSpeicher([{ id: 3, description: "Nur Text" }]);

  assert.equal(eintrag.description, "Nur Text");
  assert.deepEqual(eintrag.files, []);
});
