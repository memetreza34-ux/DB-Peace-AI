import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { GoogleGenAI } from "@google/genai";

loadDotEnv();

const PORT = parsePort(process.env.API_PORT, 8787);
const MODEL = cleanEnvironmentValue(process.env.GEMINI_MODEL, "gemini-2.5-flash", 120);
const MAX_BODY_BYTES = 64_000;
const AI_TIMEOUT_MS = 20_000;
const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX_REQUESTS = 30;
const MAX_RATE_LIMIT_KEYS = 1_000;
const ALLOWED_BROWSER_ORIGINS = new Set([
  "http://127.0.0.1:5173",
  "http://localhost:5173",
  "http://127.0.0.1:4173",
  "http://localhost:4173",
]);
const rateLimitState = new Map();
let requestsSincePrune = 0;
let isShuttingDown = false;

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
  res.setHeader("Pragma", "no-cache");
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("Referrer-Policy", "no-referrer");
  res.setHeader("Permissions-Policy", "camera=(), microphone=(), geolocation=()");
  res.setHeader("Cross-Origin-Resource-Policy", "same-origin");
}

function sendJson(res, status, data, extraHeaders = {}) {
  if (res.writableEnded) return;
  setSecurityHeaders(res);
  for (const [name, value] of Object.entries(extraHeaders)) res.setHeader(name, value);
  res.statusCode = status;
  res.end(JSON.stringify(data));
}

function requireAllowedBrowserRequest(req) {
  const fetchSite = String(req.headers["sec-fetch-site"] || "").toLowerCase();
  if (fetchSite === "cross-site") {
    const error = new Error("cross_site_request_blocked");
    error.status = 403;
    throw error;
  }
  const origin = String(req.headers.origin || "").trim();
  if (origin && !ALLOWED_BROWSER_ORIGINS.has(origin)) {
    const error = new Error("origin_not_allowed");
    error.status = 403;
    throw error;
  }
}

function requireJsonRequest(req) {
  const contentType = String(req.headers["content-type"] || "").toLowerCase();
  if (!/^application\/json(?:\s*;|$)/.test(contentType)) {
    const error = new Error("unsupported_media_type");
    error.status = 415;
    throw error;
  }
}

async function readJson(req) {
  const declaredLength = Number(req.headers["content-length"] || 0);
  if (Number.isFinite(declaredLength) && declaredLength > MAX_BODY_BYTES) {
    const error = new Error("request_too_large");
    error.status = 413;
    throw error;
  }
  const chunks = [];
  let totalBytes = 0;
  for await (const chunk of req) {
    const buffer = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk);
    totalBytes += buffer.length;
    if (totalBytes > MAX_BODY_BYTES) {
      const error = new Error("request_too_large");
      error.status = 413;
      throw error;
    }
    chunks.push(buffer);
  }
  if (!chunks.length) return {};
  try {
    return JSON.parse(Buffer.concat(chunks, totalBytes).toString("utf8"));
  } catch {
    const error = new Error("invalid_json");
    error.status = 400;
    throw error;
  }
}

function sanitizeMessages(messages) {
  if (!Array.isArray(messages)) return [];
  const sanitized = messages
    .filter((message) => message && (message.role === "user" || message.role === "assistant"))
    .map((message) => ({
      role: message.role === "assistant" ? "model" : "user",
      parts: [{ text: cleanString(message.content, 1_200, "") }],
    }))
    .filter((message) => message.parts[0].text)
    .slice(-10);
  while (sanitized[0]?.role === "model") sanitized.shift();
  return sanitized;
}

function isRateLimited(req) {
  const key = req.socket.remoteAddress || "local";
  const now = Date.now();
  requestsSincePrune += 1;
  if (requestsSincePrune >= 100 || rateLimitState.size > MAX_RATE_LIMIT_KEYS) {
    pruneRateLimitState(now);
    requestsSincePrune = 0;
  }
  const current = rateLimitState.get(key);
  if (!current || now - current.startedAt >= RATE_LIMIT_WINDOW_MS) {
    rateLimitState.set(key, { count: 1, startedAt: now });
    return false;
  }
  current.count += 1;
  return current.count > RATE_LIMIT_MAX_REQUESTS;
}

function pruneRateLimitState(now) {
  for (const [key, value] of rateLimitState) {
    if (now - value.startedAt >= RATE_LIMIT_WINDOW_MS) rateLimitState.delete(key);
  }
  if (rateLimitState.size <= MAX_RATE_LIMIT_KEYS) return;
  const oldest = [...rateLimitState.entries()]
    .sort((left, right) => left[1].startedAt - right[1].startedAt)
    .slice(0, rateLimitState.size - MAX_RATE_LIMIT_KEYS);
  for (const [key] of oldest) rateLimitState.delete(key);
}

function createAi() {
  const apiKey = String(process.env.GEMINI_API_KEY || "").trim();
  return apiKey ? new GoogleGenAI({ apiKey }) : null;
}

async function handleChat(req, res) {
  const ai = createAi();
  if (!ai) {
    sendJson(res, 503, { error: "missing_api_key", reply: "", message: "Der lokale KI-Modus ist nicht eingerichtet." });
    return;
  }
  const payload = await readJson(req);
  const messages = sanitizeMessages(payload.messages);
  if (messages.length === 0 || messages.at(-1)?.role !== "user") {
    sendJson(res, 400, { error: "missing_user_message", reply: "" });
    return;
  }
  const history = messages.slice(0, -1);
  const lastMessage = messages.at(-1).parts[0].text;
  const chat = ai.chats.create({ model: MODEL, config: { systemInstruction: systemInstructions, temperature: 0.55, maxOutputTokens: 500 }, history });
  const response = await withTimeout(chat.sendMessage({ message: lastMessage }), AI_TIMEOUT_MS);
  const reply = cleanString(response.text, 4_000, "Ich konnte gerade keine passende Antwort erzeugen.");
  sendJson(res, 200, { reply, model: MODEL });
}

async function handleReportExtraction(req, res) {
  const ai = createAi();
  if (!ai) {
    sendJson(res, 503, { error: "missing_api_key", report: null });
    return;
  }
  const payload = await readJson(req);
  const sourceText = cleanString(payload.text, 4_000, "");
  if (sourceText.length < 20) {
    sendJson(res, 400, { error: "text_too_short", report: null });
    return;
  }
  const chat = ai.chats.create({
    model: MODEL,
    config: {
      systemInstruction: [
        "Du strukturierst einen vom Nutzer selbst verfassten Vorfallstext für einen lokalen Demonstrationsprototyp.",
        "Erfinde keine Fakten und keine internen DB-Regeln.",
        "Antworte ausschließlich mit einem JSON-Objekt.",
        "Keys exakt: category, description, date, time, location, witnesses, urgency, missingFields.",
        "category, description, date, time, location, witnesses und urgency sind Strings.",
        "missingFields ist ein Array aus kurzen Strings.",
        "Nutze 'Nicht angegeben', wenn eine Angabe fehlt.",
        "urgency ist nur einer der Werte: niedrig, mittel, hoch, akut.",
        "Bei Drohung, Gewalt oder unmittelbarer Gefahr urgency auf hoch oder akut setzen.",
      ].join(" "),
      temperature: 0.2,
      maxOutputTokens: 1_200,
    },
  });
  const response = await withTimeout(chat.sendMessage({ message: sourceText }), AI_TIMEOUT_MS);
  const parsed = parseJsonObject(response.text);
  if (!parsed) {
    sendJson(res, 502, { error: "invalid_model_response", report: null });
    return;
  }
  const report = {
    category: cleanString(parsed.category, 120, "Vorfall / Konflikt"),
    description: cleanString(parsed.description, 2_500, sourceText),
    date: cleanString(parsed.date, 80, "Nicht angegeben"),
    time: cleanString(parsed.time, 80, "Nicht angegeben"),
    location: cleanString(parsed.location, 180, "Nicht angegeben"),
    witnesses: cleanString(parsed.witnesses, 300, "Nicht angegeben"),
    urgency: normalizeUrgency(parsed.urgency),
    missingFields: Array.isArray(parsed.missingFields) ? parsed.missingFields.slice(0, 8).map((item) => cleanString(item, 120, "")).filter(Boolean) : [],
  };
  sendJson(res, 200, { report, model: MODEL });
}

async function handleQuiz(_req, res) {
  const ai = createAi();
  if (!ai) {
    sendJson(res, 503, { error: "missing_api_key", questions: [] });
    return;
  }
  const chat = ai.chats.create({
    model: MODEL,
    config: {
      systemInstruction: [
        "Generiere vier einfache Wissensfragen für einen lokalen Demonstrationsprototyp für Auszubildende.",
        "Themen ausschließlich: Eigenschutz bei Konflikten, sachliche Dokumentation, passende reale Hilfewege und Grenzen einer KI-Unterstützung.",
        "Erzeuge keine Frage, deren richtige Antwort einen konkreten Rechtsanspruch, eine Frist, eine Paragraphenauslegung, eine medizinische Bewertung oder eine interne DB-Regel voraussetzt.",
        "Antworte ausschließlich mit einem JSON-Array.",
        "Jedes Objekt enthält exakt: id (Nummer), question (String), answer (Boolean), explanation (String).",
        "Keine Markdown-Formatierung und keine erfundenen internen Prozesse oder Kontaktdaten.",
      ].join(" "),
      temperature: 0.65,
      maxOutputTokens: 1_500,
    },
  });
  const response = await withTimeout(chat.sendMessage({ message: "Erzeuge vier neue, eindeutig beantwortbare Sicherheits- und Orientierungsfragen." }), AI_TIMEOUT_MS);
  const parsed = parseJsonArray(response.text);
  const questions = parsed
    ? parsed.slice(0, 4).map((question, index) => ({ id: index + 1, question: cleanString(question.question, 300, ""), answer: normalizeBoolean(question.answer), explanation: cleanString(question.explanation, 600, "") })).filter((question) => question.question && question.explanation && question.answer !== null)
    : [];
  if (questions.length !== 4) {
    sendJson(res, 502, { error: "invalid_model_response", questions: [] });
    return;
  }
  sendJson(res, 200, { questions, model: MODEL });
}

function withTimeout(promise, timeoutMs) {
  let timer;
  const timeoutPromise = new Promise((_, reject) => {
    timer = setTimeout(() => {
      const error = new Error("upstream_timeout");
      error.status = 504;
      reject(error);
    }, timeoutMs);
    timer.unref?.();
  });
  return Promise.race([promise, timeoutPromise]).finally(() => clearTimeout(timer));
}

function parseJsonObject(value) {
  try {
    const parsed = JSON.parse(cleanJsonText(value));
    return parsed && !Array.isArray(parsed) && typeof parsed === "object" ? parsed : null;
  } catch {
    return null;
  }
}
function parseJsonArray(value) {
  try {
    const parsed = JSON.parse(cleanJsonText(value));
    return Array.isArray(parsed) ? parsed : null;
  } catch {
    return null;
  }
}
function cleanJsonText(value) { return String(value || "").replace(/```json/gi, "").replace(/```/g, "").trim(); }
function cleanString(value, maxLength, fallback) { const text = String(value ?? "").trim().slice(0, maxLength); return text || fallback; }
function cleanEnvironmentValue(value, fallback, maxLength) { const text = String(value || "").trim().slice(0, maxLength); return /^[a-zA-Z0-9._-]+$/.test(text) ? text : fallback; }
function normalizeUrgency(value) { const normalized = String(value || "").toLowerCase(); return ["niedrig", "mittel", "hoch", "akut"].includes(normalized) ? normalized : "mittel"; }
function normalizeBoolean(value) { if (value === true || value === false) return value; if (String(value).toLowerCase() === "true") return true; if (String(value).toLowerCase() === "false") return false; return null; }
function parsePort(value, fallback) { const parsed = Number(value); return Number.isInteger(parsed) && parsed >= 1 && parsed <= 65_535 ? parsed : fallback; }

const server = http.createServer(async (req, res) => {
  try {
    if (isShuttingDown) {
      sendJson(res, 503, { error: "server_shutting_down" }, { Connection: "close" });
      return;
    }
    requireAllowedBrowserRequest(req);
    if (isRateLimited(req)) {
      sendJson(res, 429, { error: "rate_limited", reply: "" }, { "Retry-After": "60" });
      return;
    }
    const url = new URL(req.url || "/", `http://${req.headers.host || "127.0.0.1"}`);
    if (req.method === "GET" && url.pathname === "/api/health") { sendJson(res, 200, { status: "ok", prototype: true }); return; }
    if (req.method === "GET" && url.pathname === "/api/chat/status") { sendJson(res, 200, { configured: Boolean(String(process.env.GEMINI_API_KEY || "").trim()), model: MODEL, prototype: true }); return; }
    if (req.method === "POST" && url.pathname === "/api/chat") { requireJsonRequest(req); await handleChat(req, res); return; }
    if (req.method === "POST" && url.pathname === "/api/report/extract") { requireJsonRequest(req); await handleReportExtraction(req, res); return; }
    if (req.method === "POST" && url.pathname === "/api/quiz") { requireJsonRequest(req); await readJson(req); await handleQuiz(req, res); return; }
    if (["/api/chat", "/api/report/extract", "/api/quiz", "/api/health", "/api/chat/status"].includes(url.pathname)) {
      sendJson(res, 405, { error: "method_not_allowed" }, { Allow: allowedMethods(url.pathname) });
      return;
    }
    sendJson(res, 404, { error: "not_found" });
  } catch (error) {
    const status = Number(error?.status) || 500;
    if (status >= 500 && status !== 504) console.error("DB Peace AI API error:", error);
    sendJson(res, status, { error: status === 504 ? "upstream_timeout" : status >= 500 ? "server_error" : error.message || "request_failed", reply: "" });
  }
});

server.requestTimeout = 30_000;
server.headersTimeout = 10_000;
server.keepAliveTimeout = 5_000;
server.maxRequestsPerSocket = 100;
server.listen(PORT, "127.0.0.1", () => { console.log(`DB Peace AI API läuft auf http://127.0.0.1:${PORT} (${MODEL})`); });
function allowedMethods(pathname) { return ["/api/chat", "/api/report/extract", "/api/quiz"].includes(pathname) ? "POST" : "GET"; }
function shutdown(signal) {
  if (isShuttingDown) return;
  isShuttingDown = true;
  console.log(`DB Peace AI API wird beendet (${signal}).`);
  const forceTimer = setTimeout(() => process.exit(1), 5_000);
  forceTimer.unref();
  server.close((error) => {
    clearTimeout(forceTimer);
    if (error) { console.error("API-Server konnte nicht sauber beendet werden:", error); process.exit(1); }
    process.exit(0);
  });
}
process.once("SIGINT", () => shutdown("SIGINT"));
process.once("SIGTERM", () => shutdown("SIGTERM"));