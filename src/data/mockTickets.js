// Erfundene Demonstrationsdaten für den HR-Prototyp.
// Keine Verbindung zu DB-Systemen, keine echten Meldungen und keine dauerhafte Speicherung.

export const mockTicketsData = [
  {
    id: "DEMO-8392",
    status: "in-progress",
    date: "Beispiel: heute, 09:14 Uhr",
    category: "Mobbing / Ausgrenzung",
    risk: "Medium",
    summary: "Erfundener Beispielfall: Eine Person berichtet von wiederholter Ausgrenzung im Team und fehlenden Informationen.",
    messages: [
      {
        id: 1,
        sender: "system",
        text: "Dieser erfundene Fall demonstriert den möglichen Eingang eines strukturierten Meldungsentwurfs.",
        timestamp: "09:14",
      },
      {
        id: 2,
        sender: "hr",
        text: "Demo-Antwort: Danke für die Schilderung. Für eine menschliche Prüfung wären konkrete Daten, Situationen und mögliche Zeug:innen hilfreich.",
        timestamp: "10:30",
      },
      {
        id: 3,
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
        id: 1,
        sender: "system",
        text: "Dieser erfundene Fall wurde für die Dashboard-Demonstration angelegt.",
        timestamp: "14:20",
      },
      {
        id: 2,
        sender: "hr",
        text: "Demo-Antwort: Die Angaben müssten fachlich geprüft und mit Einsatzplan, Alter, Pausen und tatsächlicher Arbeitszeit abgeglichen werden.",
        timestamp: "15:10",
      },
      {
        id: 3,
        sender: "system",
        text: "Demo-Status: Der Beispielfall wurde als abgeschlossen markiert.",
        timestamp: "08:00",
      },
    ],
  },
];

export const subscribeToTickets = (callback) => {
  if (!window.__dbPeaceDemoTicketSubscribers) window.__dbPeaceDemoTicketSubscribers = [];
  window.__dbPeaceDemoTicketSubscribers.push(callback);

  return () => {
    window.__dbPeaceDemoTicketSubscribers = window.__dbPeaceDemoTicketSubscribers.filter((entry) => entry !== callback);
  };
};

export const updateTickets = (newTickets) => {
  mockTicketsData.length = 0;
  mockTicketsData.push(...newTickets);

  if (window.__dbPeaceDemoTicketSubscribers) {
    window.__dbPeaceDemoTicketSubscribers.forEach((callback) => callback([...mockTicketsData]));
  }
};
