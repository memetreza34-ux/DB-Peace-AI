/*
 * Lokaler Server für DB Peace.
 *
 * Bis zum 6.9.2026 war das ein Proxy für ein Sprachmodell. Der Chat-Assistent
 * ist raus — die Pilot-Checkliste empfahl das ohnehin für den ersten Betrieb,
 * und ohne ihn gibt es weniger zu erklären, weniger zu prüfen und keinen
 * Schlüssel zu verwalten.
 *
 * Geblieben ist, was die App wirklich braucht: die Ablage für abgeschickte
 * Meldungen und Gesprächswünsche. Sie hört nur auf 127.0.0.1 und schreibt in
 * eine SQLite-Datei neben dem Projekt.
 *
 * „Nur 127.0.0.1" heißt nicht „nur diese App". Jede Webseite, die im selben
 * Browser offen ist, kann Anfragen an 127.0.0.1 schicken. Deshalb prüft der
 * Server seit dem 25.9.2026 drei Dinge, bevor er etwas tut:
 * - Host: nur localhost oder 127.0.0.1. Sonst könnte eine fremde Domain, die
 *   auf 127.0.0.1 zeigt (DNS-Rebinding), das Postfach lesen.
 * - Origin: Schickt der Browser eine mit, muss sie ebenfalls lokal sein.
 * - Content-Type: Schreibende Anfragen nur als JSON. Ein einfaches Formular
 *   einer fremden Seite könnte sonst ohne Rückfrage Meldungen einschleusen.
 */
import http from "node:http";
import { pathToFileURL } from "node:url";
import { meldungAnlegen, meldungenFuer, statusSetzen } from "./meldungen-speicher.js";

const PORT = Number(process.env.API_PORT || 8787);
const LOKALE_HOSTS = new Set(["localhost", "127.0.0.1", "[::1]"]);

function sendJson(res, status, data) {
  res.writeHead(status, {
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store",
  });
  res.end(JSON.stringify(data));
}

function abgelehnt(status, code) {
  const fehler = new Error(code);
  fehler.status = status;
  return fehler;
}

function istLokalerHost(host) {
  if (!host) return false;
  try {
    return LOKALE_HOSTS.has(new URL(`http://${host}`).hostname);
  } catch {
    return false;
  }
}

function istLokaleHerkunft(origin) {
  try {
    const url = new URL(origin);
    return (url.protocol === "http:" || url.protocol === "https:") && LOKALE_HOSTS.has(url.hostname);
  } catch {
    return false;
  }
}

function absenderPruefen(req) {
  if (!istLokalerHost(req.headers.host)) throw abgelehnt(403, "fremder_host");
  const origin = req.headers.origin;
  if (origin !== undefined && !istLokaleHerkunft(origin)) throw abgelehnt(403, "fremde_herkunft");
  if (req.method === "POST" || req.method === "PATCH") {
    const typ = (req.headers["content-type"] || "").split(";")[0].trim().toLowerCase();
    if (typ !== "application/json") throw abgelehnt(415, "nur_json");
  }
}

async function readJson(req) {
  let body = "";
  for await (const chunk of req) {
    body += chunk;
    if (body.length > 64_000) {
      throw abgelehnt(413, "request_too_large");
    }
  }
  if (!body) return {};
  try {
    return JSON.parse(body);
  } catch {
    throw abgelehnt(400, "ungueltiges_json");
  }
}

export async function anfrageBearbeiten(req, res) {
  try {
    absenderPruefen(req);

    if (req.method === "POST" && req.url === "/api/meldungen") {
      const daten = await readJson(req);
      const angelegt = meldungAnlegen({
        empfaenger: daten.empfaenger,
        kategorie: daten.kategorie,
        anonym: daten.anonym,
        inhalt: daten.inhalt,
        art: daten.art,
      });
      sendJson(res, 201, angelegt);
      return;
    }

    if (req.method === "GET" && req.url?.startsWith("/api/meldungen")) {
      const rolle = new URL(req.url, "http://127.0.0.1").searchParams.get("rolle");
      sendJson(res, 200, { meldungen: rolle ? meldungenFuer(rolle) : [] });
      return;
    }

    if (req.method === "PATCH" && req.url?.startsWith("/api/meldungen/")) {
      const id = decodeURIComponent(req.url.slice("/api/meldungen/".length).split("?")[0]);
      const daten = await readJson(req);
      const geaendert = statusSetzen(id, daten.status);
      sendJson(res, geaendert ? 200 : 404, { geaendert });
      return;
    }

    sendJson(res, 404, { error: "not_found" });
  } catch (error) {
    // Bekannte Ablehnungen tragen einen Status und einen festen Code. Alles
    // andere ist ein Fehler im Server; seine Meldung (etwa aus SQLite) geht
    // nur ins Protokoll, nicht an den Browser.
    if (error.status) {
      sendJson(res, error.status, { error: error.message });
    } else {
      console.error(error);
      sendJson(res, 500, { error: "server_error" });
    }
  }
}

// Nur starten, wenn die Datei direkt ausgeführt wird — Tests binden
// anfrageBearbeiten an einen eigenen Port.
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  http.createServer(anfrageBearbeiten).listen(PORT, "127.0.0.1", () => {
    console.log(`DB Peace AI — Meldungs-Ablage läuft auf http://127.0.0.1:${PORT}`);
  });
}
