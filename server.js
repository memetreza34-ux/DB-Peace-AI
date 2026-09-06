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
 */
import http from "node:http";
import { meldungAnlegen, meldungenFuer, statusSetzen } from "./meldungen-speicher.js";

const PORT = Number(process.env.API_PORT || 8787);

function sendJson(res, status, data) {
  res.writeHead(status, {
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store",
  });
  res.end(JSON.stringify(data));
}

async function readJson(req) {
  let body = "";
  for await (const chunk of req) {
    body += chunk;
    if (body.length > 64_000) {
      throw new Error("request_too_large");
    }
  }
  return body ? JSON.parse(body) : {};
}

const server = http.createServer(async (req, res) => {
  try {
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
    const status = Number(error.status) || (error.message === "request_too_large" ? 413 : 500);
    sendJson(res, status, { error: error.message || "server_error" });
  }
});

server.listen(PORT, "127.0.0.1", () => {
  console.log(`DB Peace AI — Meldungs-Ablage läuft auf http://127.0.0.1:${PORT}`);
});
