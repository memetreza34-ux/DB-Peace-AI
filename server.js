import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { GoogleGenAI } from "@google/genai";
import { meldungAnlegen, meldungenFuer, statusSetzen } from "./meldungen-speicher.js";

const PORT = Number(process.env.API_PORT || 8787);
const MODEL = process.env.GEMINI_MODEL || "gemini-2.5-flash";

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
      role: message.role === "assistant" ? "model" : "user", // Gemini expects 'model' instead of 'assistant'
      parts: [{ text: String(message.content || "").slice(0, 900) }],
    }))
    .filter((message) => message.parts[0].text.trim())
    .slice(-10);
}

async function handleChat(req, res) {
  const apiKey = process.env.GEMINI_API_KEY;
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

  try {
    const ai = new GoogleGenAI({ apiKey });
    
    // We send the history and the last message
    const history = messages.slice(0, -1);
    const lastMessage = messages[messages.length - 1].parts[0].text;

    const chat = ai.chats.create({
      model: MODEL,
      config: {
        systemInstruction: systemInstructions,
        temperature: 0.7,
      },
      history: history
    });

    const response = await chat.sendMessage({ message: lastMessage });

    sendJson(res, 200, { reply: response.text || "Ich konnte gerade keine passende Antwort erzeugen." });
  } catch (error) {
    console.error("Gemini API Error:", error);
    sendJson(res, 500, { error: "api_error", reply: "Es gab einen Fehler bei der KI-Generierung." });
  }
}

async function handleQuiz(req, res) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    sendJson(res, 503, { error: "missing_api_key", questions: [] });
    return;
  }

  try {
    const ai = new GoogleGenAI({ apiKey });
    const chat = ai.chats.create({
      model: MODEL,
      config: {
        systemInstruction: "Generiere 4 realistische Wissens-Quiz-Fragen für Azubis der Deutschen Bahn zum Thema Mobbing, Diskriminierung, Konflikte am Arbeitsplatz und Rechte in der Ausbildung. Das Output MUSS reines JSON sein (ein Array aus Objekten). Die Keys für jedes Objekt MÜSSEN exakt sein: 'id' (Nummer), 'question' (String), 'answer' (Boolean), 'explanation' (String). Erfinde abwechslungsreiche und nicht immer offensichtliche Szenarien. Keine Markdown-Formatierung, nur das reine JSON-Array.",
        temperature: 0.9,
      }
    });

    const response = await chat.sendMessage({ message: "Generiere 4 neue, zufällige Fragen." });
    let text = response.text || "[]";
    
    // Clean up potential markdown formatting from the AI response
    text = text.replace(/```json/g, "").replace(/```/g, "").trim();
    
    let questions = [];
    try {
      questions = JSON.parse(text);
    } catch (e) {
      console.error("Failed to parse JSON from AI:", text);
    }

    sendJson(res, 200, { questions });
  } catch (error) {
    console.error("Gemini API Error in Quiz:", error);
    sendJson(res, 500, { error: "api_error", questions: [] });
  }
}

const server = http.createServer(async (req, res) => {
  try {
    if (req.method === "GET" && req.url === "/api/chat/status") {
      sendJson(res, 200, {
        connected: Boolean(process.env.GEMINI_API_KEY),
        model: MODEL,
      });
      return;
    }

    if (req.method === "POST" && req.url === "/api/chat") {
      await handleChat(req, res);
      return;
    }

    if (req.method === "GET" && req.url === "/api/quiz") {
      await handleQuiz(req, res);
      return;
    }

    /*
     * Meldungen. Sie landen in einer SQLite-Datei neben dem Projekt und
     * verlassen den Rechner nicht — der Server hört ohnehin nur auf 127.0.0.1.
     */
    if (req.method === "POST" && req.url === "/api/meldungen") {
      const daten = await readJson(req);
      const angelegt = meldungAnlegen({
        empfaenger: daten.empfaenger,
        kategorie: daten.kategorie,
        anonym: daten.anonym,
        inhalt: daten.inhalt,
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
    sendJson(res, status, {
      error: error.message || "server_error",
      reply: "",
    });
  }
});

server.listen(PORT, "127.0.0.1", () => {
  console.log(`DB Peace AI API proxy läuft auf http://127.0.0.1:${PORT}`);
});
