import test from "node:test";
import assert from "node:assert/strict";
import { GETEILT, PERSOENLICH } from "../src/lib/geraet.js";

/**
 * Der Speicher selbst lässt sich hier nicht prüfen — dafür bräuchte es einen
 * Browser. Was sich prüfen lässt, ist die Grundannahme, auf der alles beruht.
 */

test("ohne Speicherzugriff gilt das Gerät als geteilt", async () => {
  // Die vorsichtigere Annahme muss die Voreinstellung sein: Wer nicht weiß, wem
  // das Gerät gehört, speichert nichts.
  const quelle = await import("node:fs").then((fs) =>
    fs.readFileSync(new URL("../src/lib/geraet.js", import.meta.url), "utf8")
  );

  const catchBlock = quelle.slice(quelle.indexOf("} catch {"), quelle.indexOf("export function geraetemodusSetzen"));
  assert.match(catchBlock, /return GETEILT/, "der Fehlerfall muss auf GETEILT fallen");
});

test("die beiden Modi sind unterscheidbare Werte", () => {
  assert.notEqual(PERSOENLICH, GETEILT);
  assert.ok(PERSOENLICH && GETEILT);
});

test("alles, was persönliche Inhalte speichert, geht über den Wrapper", async () => {
  const fs = await import("node:fs");
  const pfade = [
    "../src/lib/protokoll.js",
    "../src/components/FloatingChatWidget.jsx",
    "../src/components/ProjectOverview.jsx",
    "../src/components/PanicButton.jsx",
  ];

  for (const pfad of pfade) {
    const quelle = fs.readFileSync(new URL(pfad, import.meta.url), "utf8");
    assert.equal(
      /localStorage\.(get|set|remove)Item/.test(quelle),
      false,
      `${pfad} greift direkt auf localStorage zu und umgeht damit den Gerätemodus`
    );
  }
});
