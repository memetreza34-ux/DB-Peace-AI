import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

/**
 * Fängt fehlende Imports von JSX-Komponenten ab.
 *
 * Hintergrund: Ein einziges nicht importiertes Icon (ShieldAlert in SupportPage)
 * hat die komplette App mit einer weißen Seite lahmgelegt — und `vite build` lief
 * trotzdem fehlerfrei durch, weil der Fehler erst zur Laufzeit auftritt.
 */

const SRC = path.join(path.dirname(fileURLToPath(import.meta.url)), "..", "src");

function jsxDateien(verzeichnis) {
  const gefunden = [];
  for (const eintrag of fs.readdirSync(verzeichnis, { withFileTypes: true })) {
    const p = path.join(verzeichnis, eintrag.name);
    if (eintrag.isDirectory()) gefunden.push(...jsxDateien(p));
    else if (p.endsWith(".jsx")) gefunden.push(p);
  }
  return gefunden;
}

function unbekannteKomponenten(quelltext) {
  const bekannt = new Set(["React", "Fragment"]);

  // alles was importiert wird — benannt, umbenannt und default
  for (const m of quelltext.matchAll(/import\s+([^;]+?)\s+from\s+['"][^'"]+['"]/g)) {
    const klausel = m[1];
    for (const benannt of klausel.matchAll(/\{([^}]*)\}/g)) {
      for (const teil of benannt[1].split(",")) {
        const name = teil.trim().split(/\s+as\s+/).pop().trim();
        if (name) bekannt.add(name);
      }
    }
    const standard = klausel.replace(/\{[^}]*\}/g, "").replace(/,/g, "").trim();
    if (/^[A-Za-z_$][\w$]*$/.test(standard)) bekannt.add(standard);
  }

  // lokal definiert
  for (const m of quelltext.matchAll(/(?:const|let|var|function|class)\s+([A-Z][\w$]*)/g)) {
    bekannt.add(m[1]);
  }

  // Destrukturierungen liefern ebenfalls gültige Namen — aber nur dort, wo
  // wirklich destrukturiert wird. `{ icon: ShieldAlert }` in einem Objekt-Literal
  // ist eine Verwendung und darf hier nicht als Definition durchgehen, sonst
  // übersieht der Test genau den Fehler, für den er geschrieben wurde.
  const destrukturierungen = [
    /\(\s*\{([^}]*)\}[^)]*\)\s*=>/g, // ({ icon: Icon }, index) => …
    /(?:const|let|var)\s*\{([^}]*)\}\s*=/g, // const { icon: Icon } = …
    /function\s+\w*\s*\(\s*\{([^}]*)\}/g, // function X({ icon: Icon })
    /\(\s*\[([^\]]*)\][^)]*\)\s*=>/g, // ([title, text, Icon]) => …
    /(?:const|let|var)\s*\[([^\]]*)\]\s*=/g // const [A, B] = …
  ];

  const ausgenommen = [];
  for (const muster of destrukturierungen) {
    for (const m of quelltext.matchAll(muster)) {
      ausgenommen.push([m.index, m.index + m[0].length]);
      for (const teil of m[1].split(",")) {
        const name = teil.includes(":") ? teil.split(":").pop().trim() : teil.trim();
        if (/^[A-Z][\w$]*$/.test(name)) bekannt.add(name);
      }
    }
  }

  const inDestrukturierung = (i) => ausgenommen.some(([von, bis]) => i >= von && i < bis);

  const fehlend = new Map();
  const merken = (name, index) => {
    if (bekannt.has(name) || fehlend.has(name) || inDestrukturierung(index)) return;
    fehlend.set(name, quelltext.slice(0, index).split("\n").length);
  };

  for (const m of quelltext.matchAll(/<([A-Z][\w$]*)[\s/>]/g)) merken(m[1], m.index);
  for (const m of quelltext.matchAll(/\bicon:\s*([A-Z][\w$]*)/g)) merken(m[1], m.index);

  return fehlend;
}

test("jede in JSX verwendete Komponente ist importiert oder definiert", () => {
  const probleme = [];

  for (const datei of jsxDateien(SRC)) {
    const fehlend = unbekannteKomponenten(fs.readFileSync(datei, "utf8"));
    for (const [name, zeile] of fehlend) {
      probleme.push(`${path.relative(SRC, datei)}:${zeile} — ${name} ist nicht importiert`);
    }
  }

  assert.deepEqual(probleme, [], `\n${probleme.join("\n")}\n`);
});
