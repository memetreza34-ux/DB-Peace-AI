import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const failures = [];

const requiredFiles = [
  "index.html",
  "package.json",
  "server.js",
  "src/main.jsx",
  "src/App.jsx",
  "public/manifest.json",
  "public/sw.js",
  ".env.example",
  "SECURITY.md",
  "docs/MVP-STATUS.md",
];

for (const relativePath of requiredFiles) {
  if (!fs.existsSync(path.join(root, relativePath))) {
    failures.push(`Pflichtdatei fehlt: ${relativePath}`);
  }
}

const textFiles = [];
walk(root);

const forbiddenPatterns = [
  {
    pattern: /CORRECT_PIN\s*=\s*["']1234["']/,
    message: "Fest codierter Demo-PIN 1234 gefunden.",
  },
  {
    pattern: /0800\s*1234567/,
    message: "Platzhalter-Telefonnummer für DB Sicherheit gefunden.",
  },
  {
    pattern: /GPS wird gesendet|Standort übermittelt\. Anruf startet/,
    message: "Nicht implementierte Standortübertragung wird behauptet.",
  },
  {
    pattern: /Live Sync API \(Stand: Heute\)/,
    message: "Statische Rechtsdaten werden als Live-Sync bezeichnet.",
  },
  {
    pattern: /Eingaben werden lokal gespeichert und später synchronisiert/,
    message: "Nicht implementierte Offline-Synchronisation wird behauptet.",
  },
];

for (const filePath of textFiles) {
  const content = fs.readFileSync(filePath, "utf8");
  for (const rule of forbiddenPatterns) {
    if (rule.pattern.test(content)) {
      failures.push(`${path.relative(root, filePath)}: ${rule.message}`);
    }
  }
}

const envExample = read(".env.example");
if (!envExample.includes("GEMINI_API_KEY")) {
  failures.push(".env.example muss GEMINI_API_KEY dokumentieren.");
}

const readme = read("README.md");
if (!readme.includes("keine offizielle Deutsche-Bahn-Anwendung")) {
  failures.push("README muss den Prototyp-Status eindeutig nennen.");
}

if (failures.length > 0) {
  console.error("\nRepository-Prüfung fehlgeschlagen:\n");
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log(`Repository-Prüfung erfolgreich: ${textFiles.length} Textdateien geprüft.`);

function read(relativePath) {
  const filePath = path.join(root, relativePath);
  return fs.existsSync(filePath) ? fs.readFileSync(filePath, "utf8") : "";
}

function walk(directory) {
  const ignored = new Set([".git", "node_modules", "dist", ".npm-cache"]);
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    if (ignored.has(entry.name) || entry.name.startsWith("backup-before-")) continue;
    const entryPath = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      walk(entryPath);
      continue;
    }
    if (/\.(?:js|jsx|mjs|json|md|html|css|yml|yaml|example)$/.test(entry.name)) {
      textFiles.push(entryPath);
    }
  }
}
