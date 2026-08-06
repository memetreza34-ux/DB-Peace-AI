import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { GoogleGenAI } from "@google/genai";

loadDotEnv();

const PORT = Number(process.env.API_PORT || 8787);
const MODEL = process.env.GEMINI_MODEL || "gemini-2.5-flash";
const MAX_BODY_BYTES = 64_000;
const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX_REQUESTS = 30;
const rateLimitState = new Map();

const systemInstructions = `
Du bist "Azubi-Begleiter" in DB Peace AI, einem lokalen Innovationsprototyp.
Du hilfst Auszubildenden auf Deutsch bei Sorgen, Stress, Ausbildung, Arbeitsplatzkonflikten,
Mobbing, Diskriminierung, Meldungsvorbereitung und nächsten Schritten.

Ton:
- ruhig, respektvoll und praktisch
- kurze Antworten, meist unter 120 Wörter
- stelle höchstens eine hilfreiche Rückfrage
- keine langen Rechts-, HR- oder Medizintexte

Regeln:
- Behaupte keine offizielle DB-Freigabe und keinen Zugriff auf DB-Systeme.
- Behaupte nicht, interne DB-Einzelfallregeln oder Kontaktdaten zu kennen.
- Du bist nicht HR, Arzt/Ärztin, Anwalt/Anwältin, Therapeut:in oder Notfallstelle.
- Gib keine Rechtsberatung, Diagnose oder Therapieanweisung.
- Bei Konflikten: konkrete Beispiele dokumentieren und vertrauenswürdige Menschen einbeziehen.
- Bei Mobbing oder Diskriminierung: ernst nehmen, Dokumentation und Unterstützung vorschlagen.
- Bei Gefahr, Drohung oder Gewalt: Sicherheit zuerst, reale Hilfe sofort, nicht allein konfrontieren.
- Bei Selbstverletzung, Suizid oder akuter Krise: sofort reale Hilfe und eine anwesende Vertrauensperson empfehlen.
- Erkläre bei passenden Fragen, dass Menschen entscheiden und die KI nur Orientierung gibt.
- Frage nicht nach Klarnamen, Personalnummern oder anderen unnötigen Identifikationsdaten.
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
    if (key && process.env[key] === undefined) process.env[key] = value;
  }
}

function setSecurityHeaders(res) {
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.setHeader("Cache-Control", "no-store");
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("Referrer-Policy", "no-referrer");
  res.setHeader("Permissions-Policy", "camera=(), microphone=(), geolocation=()");
}

function sendJson(res, status, data) {
  setSecurityHeaders(res);
  res.statusCode = status;
  res.end(JSON.stringify(data));
}

async function readJson(req) {
  let body = "";
  for await (const chunk of req) {
    body += chunk;
    if (Buffer.byteLength(body, "utf8") > MAX_BODY_BYTES) {
      const error = new Error("request_too_large");
      error.status = 413;
      throw error;
    }
  }

  if (!body) return {};
  try {
    return JSON.parse(body);
  } catch {
    const error = new Error("invalid_json");
    error.status = 400;
    throw error;
  }
}

function sanitizeMessages(messages) {
  if (!Array.isArray(messages)) return [];

  return messages
    .filter((message) => message && (message.role === "user" || message.role === "assistant"))
    .map((message) => ({
      role: message.role === "assistant" ? "model" : "user",
      parts: [{ text: String(message.content || "").trim().slice(0, 1_200) }],
    }))
    .filter((message) => message.parts[0].text)
    .slice(-10);
}

function isRateLimited(req) {
  const key = req.socket.remoteAddress || "local";
  const now = Date.now();
  const current = rateLimitState.get(key);

  if (!current || now - current.startedAt >= RATE_LIMIT_WINDOW_MS) {
    rateLimitState.set(key, { count: 1, startedAt: now });
    return false;
  }

  current.count += 1;
  return current.count > RATE_LIMIT_MAX_REQUESTS;
}

async function handleChat(req, res) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    sendJson(res, 503, {
      error: "missing_api_key",
      reply: "",
      message: "Der lokale KI-Modus ist nicht eingerichtet.",
    });
    return;
  }

  const payload = await readJson(req);
  const messages = sanitizeMessages(payload.messages);
  if (messages.length === 0) {
    sendJson(res, 400, { error: "missing_messages", reply: "" });
    return;
  }

  const ai = new GoogleGenAI({ apiKey });
  const history = messages.slice(0, -1);
  const lastMessage = messages.at(-1).parts[0].text;
  const chat = ai.chats.create({
    model: MODEL,
    config: {
      systemInstruction: systemInstructions,
      temperature: 0.55,
    },
    history,
  });

  const response = await chat.sendMessage({ message: lastMessage });
  const reply = String(response.text || "").trim();
  sendJson(res, 200, {
    reply: reply || "Ich konnte gerade keine passende Antwort erzeugen.",
    model: MODEL,
  });
}

async function handleQuiz(_req, res) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    sendJson(res, 503, { error: "missing_api_key", questions: [] });
    return;
  }

  const ai = new GoogleGenAI({ apiKey });
  const chat = ai.chats.create({
    model: MODEL,
    config: {
      systemInstruction: [
        "Generiere vier realistische Wissensfragen für Auszubildende.",
        "Themen: Mobbing, Diskriminierung, Konflikte am Arbeitsplatz und Rechte in der Ausbildung.",
        "Antworte ausschließlich mit einem JSON-Array.",
        "Jedes Objekt enthält exakt: id (Nummer), question (String), answer (Boolean), explanation (String).",
        "Keine Markdown-Formatierung und keine erfundenen internen DB-Regeln.",
      ].join(" "),
      temperature: 0.8,
    },
  });

  const response = await chat.sendMessage({ message: "Erzeuge vier neue Fragen." });
  const text = String(response.text || "[]")
    .replace(/```json/gi, "")
    .replace(/```/g, "")
    .trim();

  let parsed;
  try {
    parsed = JSON.parse(text);
  } catch {
    sendJson(res, 502, { error: "invalid_model_response", questions: [] });
    return;
  }

  const questions = Array.isArray(parsed)
    ? parsed.slice(0, 4).map((question, index) => ({
        id: Number(question.id) || index + 1,
        question: String(question.question || "").slice(0, 300),
        answer: Boolean(question.answer),
        explanation: String(question.explanation || "").slice(0, 600),
      })).filter((question) => question.question && question.explanation)
    : [];

  sendJson(res, 200, { questions });
}

const server = http.createServer(async (req, res) => {
  try {
    if (isRateLimited(req)) {
      sendJson(res, 429, { error: "rate_limited", reply: "" });
      return;
    }

    const url = new URL(req.url || "/", `http://${req.headers.host || "127.0.0.1"}`);

    if (req.method === "GET" && url.pathname === "/api/health") {
      sendJson(res, 200, { status: "ok" });
      return;
    }

    if (req.method === "GET" && url.pathname === "/api/chat/status") {
      sendJson(res, 200, {
        connected: Boolean(process.env.GEMINI_API_KEY),
        model: MODEL,
        prototype: true,
      });
      return;
    }

    if (req.method === "POST" && url.pathname === "/api/chat") {
      await handleChat(req, res);
      return;
    }

    if (req.method === "GET" && url.pathname === "/api/quiz") {
      await handleQuiz(req, res);
      return;
    }

    sendJson(res, 404, { error: "not_found" });
  } catch (error) {
    const status = Number(error.status) || 500;
    if (status >= 500) console.error("DB Peace AI API error:", error);
    sendJson(res, status, {
      error: error.message || "server_error",
      reply: "",
    });
  }
});

server.listen(PORT, "127.0.0.1", () => {
  console.log(`DB Peace AI API läuft auf http://127.0.0.1:${PORT} (${MODEL})`);
});
