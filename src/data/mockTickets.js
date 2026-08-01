// A simple global state for the prototype so that messages sent in HR mode
// are visible in Azubi mode and vice versa without needing React Context.

export const mockTicketsData = [
  {
    id: "TCK-8392",
    status: "in-progress", // 'open', 'in-progress', 'closed'
    date: "Heute, 09:14 Uhr",
    category: "Mobbing / Ausgrenzung",
    risk: "Medium",
    summary: "Der Nutzer berichtet von systematischer Ausgrenzung in der Abteilung. Er/Sie wird wiederholt nicht zu wichtigen Team-Meetings eingeladen und Informationen werden absichtlich zurückgehalten. In der WhatsApp-Gruppe gab es zudem abwertende Kommentare bezüglich der Arbeitsleistung.",
    messages: [
      {
        id: 1,
        sender: "system",
        text: "Fall wurde anonym über das System eingereicht und der Personalabteilung zugewiesen.",
        timestamp: "09:14"
      },
      {
        id: 2,
        sender: "hr",
        text: "Hallo, ich bin Sarah aus der Personalabteilung und habe deinen Fall übernommen. Es tut mir sehr leid zu hören, wie du aktuell behandelt wirst. Um dir helfen zu können: Weißt du, ob noch andere Azubis in deiner Abteilung ähnlich behandelt werden?",
        timestamp: "10:30"
      },
      {
        id: 3,
        sender: "azubi",
        text: "Hallo Sarah. Danke für die schnelle Rückmeldung. Ja, einem anderen Azubi aus dem 2. Lehrjahr geht es ähnlich. Wir werden oft einfach bei der Schichtplanung übergangen.",
        timestamp: "10:45"
      }
    ]
  },
  {
    id: "TCK-7104",
    status: "closed",
    date: "Gestern, 14:20 Uhr",
    category: "Verstoß gegen Arbeitszeitgesetz",
    risk: "High",
    summary: "Bericht über massive Überschreitung der gesetzlichen Arbeitszeiten. Der jugendliche Auszubildende musste an 4 Tagen in Folge 10-Stunden-Schichten ohne angemessene Pausen absolvieren.",
    messages: [
      {
        id: 1,
        sender: "system",
        text: "Fall wurde anonym über das System eingereicht.",
        timestamp: "14:20"
      },
      {
        id: 2,
        sender: "hr",
        text: "Vielen Dank für die mutige Meldung. Solche Schichten sind für Minderjährige absolut illegal (Verstoß gegen JArbSchG). Wir werden die Einsatzplanung in deiner Region sofort anonymisiert auditieren.",
        timestamp: "15:10"
      },
      {
        id: 3,
        sender: "system",
        text: "Der Fall wurde erfolgreich abgeschlossen. Es wurden Maßnahmen eingeleitet.",
        timestamp: "Heute, 08:00"
      }
    ]
  }
];

export const subscribeToTickets = (callback) => {
  // Very simple observer pattern for the prototype
  if (!window.__ticketSubscribers) window.__ticketSubscribers = [];
  window.__ticketSubscribers.push(callback);
  
  return () => {
    window.__ticketSubscribers = window.__ticketSubscribers.filter(cb => cb !== callback);
  };
};

export const updateTickets = (newTickets) => {
  mockTicketsData.length = 0;
  mockTicketsData.push(...newTickets);
  
  if (window.__ticketSubscribers) {
    window.__ticketSubscribers.forEach(cb => cb([...mockTicketsData]));
  }
};
