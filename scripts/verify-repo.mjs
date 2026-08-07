import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const failures = [];
const verifierPath = path.join(root, "scripts", "verify-repo.mjs");

const requiredFiles = [
  "index.html",
  "package.json",
  "package-lock.json",
  "server.js",
  "src/main.jsx",
  "src/App.jsx",
  "src/components/ContactsView.jsx",
  "src/components/EmergencyModal.jsx",
  "src/components/PrivacyCompliance.jsx",
  "src/components/TrainingMode.jsx",
  "src/components/ProjectOverview.jsx",
  "public/manifest.json",
  "public/sw.js",
  "public/icon.svg",
  ".env.example",
  ".nvmrc",
  ".npmrc",
  ".editorconfig",
  ".gitattributes",
  ".github/workflows/ci.yml",
  ".github/dependabot.yml",
  ".github/CODEOWNERS",
  "CONTRIBUTING.md",
  "LICENSE",
  "SECURITY.md",
  "CHANGELOG.md",
  "docs/ARCHITECTURE.md",
  "docs/SECURITY-MODEL.md",
  "docs/MVP-STATUS.md",
  "docs/MANUAL-TEST-CHECKLIST.md",
  "docs/RELEASE-CHECKLIST.md",
  "docs/FINAL-ACCEPTANCE.md",
  "tests/repository.test.mjs",
];

for (const relativePath of requiredFiles) {
  if (!fs.existsSync(path.join(root, relativePath))) failures.push(`Pflichtdatei fehlt: ${relativePath}`);
}

for (const entry of fs.readdirSync(root, { withFileTypes: true })) {
  if (entry.isDirectory() && entry.name.startsWith("backup-before-")) {
    failures.push(`Historisches Backup-Verzeichnis muss aus dem aktiven Repository entfernt werden: ${entry.name}`);
  }
}

const textFiles = [];
walk(root);

const forbiddenPatterns = [
  [/CORRECT_PIN\s*=\s*["']1234["']/, "Fest codierter Demo-PIN 1234 gefunden."],
  [/0800[\s-]*123[\s-]*4567/, "Platzhalter-Telefonnummer für DB Sicherheit gefunden."],
  [/GPS wird gesendet|Standort übermittelt\. Anruf startet/i, "Nicht implementierte Standortübertragung wird behauptet."],
  [/Live Sync API(?: \(Stand: Heute\))?/i, "Statische Daten werden als Live-Sync bezeichnet."],
  [/Eingaben werden lokal gespeichert und später synchronisiert/i, "Nicht implementierte Offline-Synchronisation wird behauptet."],
  [/Mit DB Azure AD anmelden/i, "Simulierte Unternehmensanmeldung wird als echte Anmeldung dargestellt."],
  [/HSMS Verschlüsselt|AGG-Geprüft/i, "Unbelegte Sicherheits- oder Compliance-Aussage gefunden."],
  [/Sicher\s*&\s*verschlüsselt anhängen/i, "Nicht implementierte verschlüsselte Dateiübertragung wird behauptet."],
  [/Deine DB-Profildaten werden.*mitgesendet/i, "Nicht vorhandene DB-Profilintegration wird behauptet."],
  [/lokal verschlüsselt und nur für dich sichtbar/i, "Nicht implementierte lokale Verschlüsselung wird behauptet."],
  [/DEUTSCHE BAHN AG\s*-\s*BILDUNGSZERTIFIKAT/i, "Fake-Unternehmenszertifikat gefunden."],
  [/Offizieller Nachweis für die Personalakte/i, "Ein Demo-Dokument wird als offizieller Personalnachweis dargestellt."],
  [/KI generiert neue Quiz-Fragen/i, "Statisches Laden wird als KI-Generierung dargestellt."],
  [/Neue, endlose Fragen laden/i, "Begrenztes statisches Quiz wird als endlos dargestellt."],
  [/Über 150 offizielle Weiterbildungsangebote/i, "Ungeprüfter Kurskatalog wird als offiziell dargestellt."],
  [/Die Veranstaltung ist eine anerkannte Weiterbildung/i, "Kursanerkennung wird ohne Prüfung behauptet."],
  [/Die Gespräche sind absolut vertraulich/i, "Absolute Vertraulichkeitsgarantie gefunden."],
  [/\+50 DB Peace Points/i, "Erfundene Produktpunkte gefunden."],
  [/Demo-Zertifikat/i, "Ein Training erzeugt weiterhin ein Zertifikat oder Zertifikatsversprechen."],
  [/KI-Trainingsmodus/i, "Statisches Szenario wird als KI-Training dargestellt."],
  [/Projekt veröffentlichen/i, "Ein lokaler Ideenentwurf wird als Veröffentlichung dargestellt."],
  [/Anfrage gesendet \(Ausstehend\)/i, "Eine nicht versendete Projektanfrage wird als gesendet dargestellt."],
  [/Teilnahme bestätigt!/i, "Eine nicht vorhandene Projektteilnahme wird als bestätigt dargestellt."],
  [/Du \(Dein DB-Profil\)/i, "Eine nicht vorhandene DB-Profilintegration wird im Projektbereich dargestellt."],
  [/Vorfall offiziell melden/i, "Ein Entwurf wird als offizielle Meldung bezeichnet."],
  [/sicher und vertraulich melden/i, "Eine nicht vorhandene sichere Übermittlung wird behauptet."],
];

for (const filePath of textFiles) {
  if (filePath === verifierPath) continue;
  const content = fs.readFileSync(filePath, "utf8");
  for (const [pattern, message] of forbiddenPatterns) {
    if (pattern.test(content)) failures.push(`${path.relative(root, filePath)}: ${message}`);
  }
}

verifyLocalImports();

const envExample = read(".env.example");
if (!envExample.includes("GEMINI_API_KEY")) failures.push(".env.example muss GEMINI_API_KEY dokumentieren.");
if (envExample.includes("OPENAI_API_KEY")) failures.push(".env.example darf keinen veralteten OpenAI-Schlüssel dokumentieren.");

const gitignore = read(".gitignore");
for (const ignoredPath of ["node_modules", "dist", ".env"]) {
  if (!gitignore.includes(ignoredPath)) failures.push(`.gitignore muss ${ignoredPath} ausschließen.`);
}

const readme = read("README.md");
if (!readme.includes("keine offizielle Deutsche-Bahn-Anwendung")) failures.push("README muss den Prototyp-Status eindeutig nennen.");
if (!readme.includes("docs/MANUAL-TEST-CHECKLIST.md")) failures.push("README muss die manuelle Abnahmecheckliste verlinken.");
if (!readme.includes("/api/report/extract")) failures.push("README muss die tatsächlich implementierte Report-Route dokumentieren.");

const packageJson = parseJson("package.json");
const packageLock = parseJson("package-lock.json");
if (packageJson?.scripts?.test !== "node --test tests/*.test.mjs") failures.push("package.json muss den Node-Testlauf enthalten.");
if (packageJson?.scripts?.check !== "npm run verify && npm test && npm run build") failures.push("package.json muss Verify, Tests und Build kombinieren.");
if (packageJson?.engines?.node !== ">=22 <23") failures.push("package.json muss Node.js 22 als unterstützte Laufzeit festlegen.");
if (packageJson?.engines?.npm !== ">=10 <12") failures.push("package.json muss npm 10 oder 11 als unterstützte Laufzeit festlegen.");
if (packageLock?.version !== packageJson?.version || packageLock?.packages?.[""]?.version !== packageJson?.version) {
  failures.push("Versionen in package.json und package-lock.json müssen übereinstimmen.");
}
verifyDependencyMap("dependencies", packageJson, packageLock);
verifyDependencyMap("devDependencies", packageJson, packageLock);

const reportRoute = "/api/report/extract";
if (!read("server.js").includes(reportRoute)) failures.push("server.js muss die dokumentierte Report-Route bereitstellen.");
if (!read("src/components/AISmartReport.jsx").includes(reportRoute)) failures.push("AISmartReport muss dieselbe Report-Route wie der Server verwenden.");

const manifest = parseJson("public/manifest.json");
if (manifest?.start_url !== "/" || manifest?.scope !== "/") failures.push("PWA-Manifest muss start_url und scope auf / setzen.");
if (!Array.isArray(manifest?.icons) || manifest.icons.length === 0) failures.push("PWA-Manifest muss mindestens ein Icon enthalten.");

const serviceWorker = read("public/sw.js");
if (!serviceWorker.includes('request.method !== "GET"')) failures.push("Der Service Worker darf nur GET-Anfragen behandeln.");
if (!serviceWorker.includes('url.pathname.startsWith("/api/")')) failures.push("Der Service Worker muss API-Antworten ausdrücklich vom Cache ausschließen.");

const contacts = read("src/components/ContactsView.jsx");
for (const requiredNumber of ["110", "112", "116 123", "116 016", "0800 546 546 5"]) {
  if (!contacts.includes(requiredNumber)) failures.push(`ContactsView muss die geprüfte Hilfsnummer ${requiredNumber} enthalten.`);
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

function parseJson(relativePath) {
  try {
    return JSON.parse(read(relativePath));
  } catch {
    failures.push(`Ungültiges JSON: ${relativePath}`);
    return null;
  }
}

function verifyDependencyMap(key, packageJson, packageLock) {
  const expected = packageJson?.[key] || {};
  const locked = packageLock?.packages?.[""]?.[key] || {};
  if (JSON.stringify(expected) !== JSON.stringify(locked)) {
    failures.push(`${key} in package.json und package-lock.json müssen übereinstimmen.`);
  }
}

function verifyLocalImports() {
  const sourceFiles = textFiles.filter((filePath) => /\.(?:js|jsx|mjs)$/.test(filePath));
  for (const filePath of sourceFiles) {
    const content = fs.readFileSync(filePath, "utf8");
    for (const specifier of localImportSpecifiers(content)) {
      if (!resolveImport(filePath, specifier)) {
        failures.push(`${path.relative(root, filePath)}: Lokaler Import fehlt: ${specifier}`);
      }
    }
  }
}

function localImportSpecifiers(content) {
  const specifiers = [];
  const patterns = [
    /(?:import|export)\s+(?:[^"']*?\s+from\s+)?["'](\.{1,2}\/[^"']+)["']/g,
    /import\(\s*["'](\.{1,2}\/[^"']+)["']\s*\)/g,
  ];
  for (const pattern of patterns) {
    for (const match of content.matchAll(pattern)) specifiers.push(match[1]);
  }
  return specifiers;
}

function resolveImport(importer, specifier) {
  const clean = specifier.split(/[?#]/, 1)[0];
  const base = path.resolve(path.dirname(importer), clean);
  return [
    base,
    `${base}.js`,
    `${base}.jsx`,
    `${base}.mjs`,
    `${base}.json`,
    path.join(base, "index.js"),
    path.join(base, "index.jsx"),
    path.join(base, "index.mjs"),
  ].some((candidate) => fs.existsSync(candidate));
}

function walk(directory) {
  const ignored = new Set([".git", "node_modules", "dist", ".npm-cache"]);
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    if (ignored.has(entry.name)) continue;
    const entryPath = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      if (entry.name.startsWith("backup-before-")) continue;
      walk(entryPath);
      continue;
    }
    if (/\.(?:js|jsx|mjs|json|md|html|css|yml|yaml|example|svg)$/.test(entry.name)) textFiles.push(entryPath);
  }
}
