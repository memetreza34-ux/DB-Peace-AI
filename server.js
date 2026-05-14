import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import OpenAI from "openai";

const PORT = Number(process.env.API_PORT || 8787);
const MODEL = process.env.OPENAI_MODEL || "gpt-5.4-mini";

loadDotEnv();

const systemInstructions = `
Du bist "Azubi-Begleiter" in DB Peace AI, einem lokalen Innovationsprototyp.
Du hilfst Auszubildenden auf Deutsch bei Sorgen, Stress, Ausbildung, Arbeitsplatzkonflikten,
Mobbing, Diskriminierung, Meldungsvorbereitung und nächsten Schritten.

Ton:
- ruhig, freundlich, praktisch
- wie ein unterstützender älterer Azubi oder Coach
- kurze Antworten, meist unter 120 Wörter
- keine langen Rechts-/HR-/Medizin-Texte
- stelle höchstens eine hilfreiche Rückfrage

Regeln:
- Behaupte keine offizielle DB-Freigabe und keinen Zugriff auf DB-Systeme.
- Behaupte nicht, interne DB-Einzelfallregeln zu kennen.
- Du bist nicht HR, Arzt/Ärztin, Anwalt/Anwältin, Therapeut:in oder Notfallstelle.
- Keine Rechtsberatung, medizinische Beratung, psychologische Beratung oder Finanzberatung.
- Bei Geldsorgen: nur Orientierung, keine Leistungsversprechen; Beratungs-/Vertrauensperson empfehlen.
- Bei Konflikten: konkrete Beispiele dokumentieren und zuständige/vertrauenswürdige Personen einbeziehen.
- Bei Mobbing/Diskriminierung: ernst nehmen, Dokumentation und Unterstützung vorschlagen.
- Bei Gefahr/Drohung/Gewalt: Sicherheit zuerst, echte Hilfe sofort, nicht allein konfrontieren.
- Bei Selbstverletzung/Suizid/Krise: sofort reale Hilfe, Vertrauensperson und Notfallhilfe empfehlen.
- "Menschen entscheiden, nicht die KI" nur sagen, wenn es passt.
- Überfordere nicht.
`.trim();

function loadDotEnv() {
  const envPath = path.resolve(process.cwd(), ".env");
  if (!fs.existsSync(envPath)) return;

  const lines = fs.readFileSync(envPath, "utf8").split(/\r?\n/);
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const index = trimmed.indexOf("=");
    if (index === -1) continue;
    const key = trimmed.slice(0, index).trim();
    const value = trimmed.slice(index + 1).trim().replace(/^['"]|['"]$/g, "");
    if (key && process.env[key] === undefined) {
      process.env[key] = value;
    }
  }
}

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

function sanitizeMessages(messages) {
  if (!Array.isArray(messages)) return [];

  return messages
    .filter((message) => message && (message.role === "user" || message.role === "assistant"))
    .map((message) => ({
      role: message.role,
      content: String(message.content || "").slice(0, 900),
    }))
    .filter((message) => message.content.trim())
    .slice(-10);
}

function toResponsesInput(messages) {
  return messages.map((message) => ({
    role: message.role,
    content: message.content,
  }));
}

function extractReply(data) {
  if (typeof data.output_text === "string" && data.output_text.trim()) {
    return data.output_text.trim();
  }

  const parts = [];
  for (const item of data.output || []) {
    for (const content of item.content || []) {
      if (typeof content.text === "string") {
        parts.push(content.text);
      }
    }
  }
  return parts.join("\n").trim();
}

async function handleChat(req, res) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    sendJson(res, 503, { error: "missing_api_key", reply: "" });
    return;
  }

  const payload = await readJson(req);
  const messages = sanitizeMessages(payload.messages);
  if (messages.length === 0) {
    sendJson(res, 400, { error: "missing_messages", reply: "" });
    return;
  }

  const client = new OpenAI({ apiKey });
  const data = await client.responses.create({
    model: process.env.OPENAI_MODEL || MODEL,
    instructions: systemInstructions,
    input: toResponsesInput(messages),
    store: false,
    max_output_tokens: 280,
  });

  sendJson(res, 200, { reply: extractReply(data) || "Ich konnte gerade keine passende Antwort erzeugen." });
}

const server = http.createServer(async (req, res) => {
  try {
    if (req.method === "GET" && req.url === "/api/chat/status") {
      sendJson(res, 200, {
        connected: Boolean(process.env.OPENAI_API_KEY),
        model: process.env.OPENAI_MODEL || MODEL,
      });
      return;
    }

    if (req.method === "POST" && req.url === "/api/chat") {
      await handleChat(req, res);
      return;
    }

    sendJson(res, 404, { error: "not_found" });
  } catch (error) {
    const status = Number(error.status) || (error.message === "request_too_large" ? 413 : 500);
    sendJson(res, status, {
      error: error.message || "server_error",
      reply: "",
    });
  }
});

server.listen(PORT, "127.0.0.1", () => {
  console.log(`DB Peace AI API proxy läuft auf http://127.0.0.1:${PORT}`);
});
