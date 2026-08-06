import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const failures = [];
const verifierPath = path.join(root, "scripts", "verify-repo.mjs");

const requiredFiles = [
  "index.html",
  "package.json",
  "server.js",
  "src/main.jsx",
  "src/App.jsx",
  "public/manifest.json",
  "public/sw.js",
  "public/icon.svg",
  ".env.example",
  "SECURITY.md",
  "docs/MVP-STATUS.md",
];

for (const relativePath of requiredFiles) {
  if (!fs.existsSync(path.join(root, relativePath))) failures.push(`Pflichtdatei fehlt: ${relativePath}`);
}

const textFiles = [];
walk(root);

const forbiddenPatterns = [
  [/CORRECT_PIN\s*=\s*["']1234["']/, "Fest codierter Demo-PIN 1234 gefunden."],
  [/0800\s*1234567/, "Platzhalter-Telefonnummer für DB Sicherheit gefunden."],
  [/GPS wird gesendet|Standort übermittelt\. Anruf startet/i, "Nicht implementierte Standortübertragung wird behauptet."],
  [/Live Sync API(?: \(Stand: Heute\))?/i, "Statische Daten werden als Live-Sync bezeichnet."],
  [/Eingaben werden lokal gespeichert und später synchronisiert/i, "Nicht implementierte Offline-Synchronisation wird behauptet."],
  [/Mit DB Azure AD anmelden/i, "Simulierte Unternehmensanmeldung wird als echte Anmeldung dargestellt."],
  [/HSMS Verschlüsselt|AGG-Geprüft/i, "Unbelegte Sicherheits- oder Compliance-Aussage gefunden."],
  [/Sicher\s*&\s*verschlüsselt anhängen/i, "Nicht implementierte verschlüsselte Dateiübertragung wird behauptet."],
  [/Deine DB-Profildaten werden.*mitgesendet/i, "Nicht vorhandene DB-Profilintegration wird behauptet."],
  [/lokal verschlüsselt und nur für dich sichtbar/i, "Nicht implementierte lokale Verschlüsselung wird behauptet."],
];

for (const filePath of textFiles) {
  if (filePath === verifierPath) continue;
  const content = fs.readFileSync(filePath, "utf8");
  for (const [pattern, message] of forbiddenPatterns) {
    if (pattern.test(content)) failures.push(`${path.relative(root, filePath)}: ${message}`);
  }
}

const envExample = read(".env.example");
if (!envExample.includes("GEMINI_API_KEY")) failures.push(".env.example muss GEMINI_API_KEY dokumentieren.");

const readme = read("README.md");
if (!readme.includes("keine offizielle Deutsche-Bahn-Anwendung")) {
  failures.push("README muss den Prototyp-Status eindeutig nennen.");
}

const serviceWorker = read("public/sw.js");
if (!serviceWorker.includes('url.pathname.startsWith("/api/")')) {
  failures.push("Der Service Worker muss API-Antworten ausdrücklich vom Cache ausschließen.");
}

if (failures.length > 0) {
  console.error("\nRepository-Prüfung fehlgeschlagen:\n");
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log(`Repository-Prüfung erfolgreich: ${textFiles.length - 1} Textdateien geprüft.`);

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
    if (/\.(?:js|jsx|mjs|json|md|html|css|yml|yaml|example|svg)$/.test(entry.name)) textFiles.push(entryPath);
  }
}
