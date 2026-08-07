// Erfundene Demonstrationsdaten für den HR-Prototyp.
// Keine Verbindung zu DB-Systemen, keine echten Meldungen und keine dauerhafte Speicherung.

const INITIAL_TICKETS = [
  {
    id: "DEMO-8392",
    status: "in-progress",
    date: "Beispiel: heute, 09:14 Uhr",
    category: "Mobbing / Ausgrenzung",
    risk: "Medium",
    summary: "Erfundener Beispielfall: Eine Person berichtet von wiederholter Ausgrenzung im Team und fehlenden Informationen.",
    messages: [
      {
        id: "demo-8392-system-1",
        sender: "system",
        text: "Dieser erfundene Fall demonstriert den möglichen Eingang eines strukturierten Meldungsentwurfs.",
        timestamp: "09:14",
      },
      {
        id: "demo-8392-hr-1",
        sender: "hr",
        text: "Demo-Antwort: Danke für die Schilderung. Für eine menschliche Prüfung wären konkrete Daten, Situationen und mögliche Zeug:innen hilfreich.",
        timestamp: "10:30",
      },
      {
        id: "demo-8392-user-1",
        sender: "azubi",
        text: "Demo-Antwort: Es gab mehrere Situationen bei der Einsatzplanung. Zwei weitere Personen waren anwesend.",
        timestamp: "10:45",
      },
    ],
  },
  {
    id: "DEMO-7104",
    status: "closed",
    date: "Beispiel: gestern, 14:20 Uhr",
    category: "Arbeitszeit / Ausbildung",
    risk: "High",
    summary: "Erfundener Beispielfall: Eine minderjährige Person berichtet von wiederholt sehr langen Einsätzen und unklaren Pausenregelungen.",
    messages: [
      {
        id: "demo-7104-system-1",
        sender: "system",
        text: "Dieser erfundene Fall wurde für die Dashboard-Demonstration angelegt.",
        timestamp: "14:20",
      },
      {
        id: "demo-7104-hr-1",
        sender: "hr",
        text: "Demo-Antwort: Die Angaben müssten fachlich geprüft und mit Einsatzplan, Alter, Pausen und tatsächlicher Arbeitszeit abgeglichen werden.",
        timestamp: "15:10",
      },
      {
        id: "demo-7104-system-2",
        sender: "system",
        text: "Demo-Status: Der Beispielfall wurde als abgeschlossen markiert.",
        timestamp: "08:00",
      },
    ],
  },
];

const subscribers = new Set();

export const mockTicketsData = cloneTickets(INITIAL_TICKETS);

export function subscribeToTickets(callback) {
  if (typeof callback !== "function") return () => undefined;
  subscribers.add(callback);
  callback(cloneTickets(mockTicketsData));
  return () => subscribers.delete(callback);
}

export function updateTickets(newTickets) {
  if (!Array.isArray(newTickets)) return false;
  const safeTickets = cloneTickets(newTickets);
  mockTicketsData.splice(0, mockTicketsData.length, ...safeTickets);
  notifySubscribers();
  return true;
}

export function resetTickets() {
  return updateTickets(INITIAL_TICKETS);
}

export function createDemoMessageId(prefix = "demo-message") {
  return globalThis.crypto?.randomUUID?.() || `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

function notifySubscribers() {
  const snapshot = cloneTickets(mockTicketsData);
  for (const callback of subscribers) {
    try {
      callback(cloneTickets(snapshot));
    } catch (error) {
      console.error("Demo-Ticket-Subscriber fehlgeschlagen:", error);
    }
  }
}

function cloneTickets(value) {
  if (typeof structuredClone === "function") return structuredClone(value);
  return JSON.parse(JSON.stringify(value));
}
