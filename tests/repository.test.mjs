import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";

const root = path.resolve(import.meta.dirname, "..");

function read(relativePath) {
  return fs.readFileSync(path.join(root, relativePath), "utf8");
}

function json(relativePath) {
  return JSON.parse(read(relativePath));
}

test("package.json und Lockfile sind synchron", () => {
  const packageJson = json("package.json");
  const packageLock = json("package-lock.json");
  const lockRoot = packageLock.packages[""];

  assert.equal(packageLock.version, packageJson.version);
  assert.equal(lockRoot.version, packageJson.version);
  assert.deepEqual(lockRoot.dependencies || {}, packageJson.dependencies || {});
  assert.deepEqual(lockRoot.devDependencies || {}, packageJson.devDependencies || {});
});

test("dokumentierte API-Routen sind implementiert und verwendet", () => {
  const server = read("server.js");
  const readme = read("README.md");
  const report = read("src/components/AISmartReport.jsx");
  const quiz = read("src/components/QuizWidget.jsx");

  for (const route of ["/api/health", "/api/chat/status", "/api/chat", "/api/report/extract", "/api/quiz"]) {
    assert.match(server, new RegExp(route.replaceAll("/", "\\/")));
  }
  assert.match(readme, /\/api\/report\/extract/);
  assert.match(report, /\/api\/report\/extract/);
  assert.match(quiz, /\/api\/quiz/);
});

test("alle lokalen JavaScript-Importe können aufgelöst werden", () => {
  const sourceFiles = collectFiles("src", /\.(?:js|jsx|mjs)$/);
  sourceFiles.push(path.join(root, "vite.config.js"));

  for (const filePath of sourceFiles) {
    const content = fs.readFileSync(filePath, "utf8");
    for (const specifier of localImportSpecifiers(content)) {
      assert.ok(resolveImport(filePath, specifier), `${path.relative(root, filePath)}: ${specifier} fehlt`);
    }
  }
});

test("PWA-Manifest verweist auf vorhandene lokale Ressourcen", () => {
  const manifest = json("public/manifest.json");
  assert.equal(manifest.start_url, "/");
  assert.equal(manifest.scope, "/");
  assert.ok(["standalone", "minimal-ui", "browser"].includes(manifest.display));
  assert.ok(Array.isArray(manifest.icons) && manifest.icons.length > 0);

  for (const icon of manifest.icons) {
    assert.ok(icon.src.startsWith("/"));
    assert.ok(fs.existsSync(path.join(root, "public", icon.src.slice(1))), `Manifest-Ressource fehlt: ${icon.src}`);
  }
});

test("historische Backup-Verzeichnisse sind nicht Teil des aktiven Repositorys", () => {
  const names = fs.readdirSync(root);
  assert.equal(names.some((name) => name.startsWith("backup-before-")), false);
});

function collectFiles(relativeDirectory, pattern) {
  const result = [];
  const directory = path.join(root, relativeDirectory);
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const entryPath = path.join(directory, entry.name);
    if (entry.isDirectory()) result.push(...collectFiles(path.relative(root, entryPath), pattern));
    else if (pattern.test(entry.name)) result.push(entryPath);
  }
  return result;
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
  ].find((candidate) => fs.existsSync(candidate));
}
