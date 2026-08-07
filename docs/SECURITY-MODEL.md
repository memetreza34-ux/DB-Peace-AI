# Sicherheitsmodell

## Schutzgüter

- Texte zu Konflikten, Diskriminierung, Belastung oder Gewalt
- mögliche Personen-, Beschäftigten- und Kontaktdaten
- API-Schlüssel und lokale Konfiguration
- exportierte PDF- und Textentwürfe
- Integrität von Notfall-, Rechts- und Hilfeinformationen

## Vertrauensgrenzen

1. Browser und React-Oberfläche
2. lokaler Node.js-Proxy auf `127.0.0.1`
3. externer Gemini-Dienst bei aktiviertem API-Schlüssel
4. lokale Zwischenablage und heruntergeladene Dateien
5. nicht implementierte Unternehmenssysteme außerhalb des Prototyps

## Aktuelle Kontrollen

- API-Schlüssel nur im lokalen Proxy
- begrenzte Request-Größe und einfaches Rate Limiting
- Sicherheitsheader und `Cache-Control: no-store` für API-Antworten
- Service Worker schließt `/api/` vom Cache aus
- Sitzungsdaten statt dauerhafter Fallspeicherung
- keine Dateiübertragung, Standortübertragung oder echte SSO-Anmeldung
- sichtbare Prototyp- und Datenwarnungen
- statischer Repository-Verifier gegen bekannte irreführende Aussagen

## Wesentliche Bedrohungsszenarien

### Reale sensible Daten werden in der Demo eingegeben

Folge: Übertragung an einen externen KI-Dienst oder Ablage in Exporten und Zwischenablage.

Kontrolle: klare Warnungen, synthetische Testdaten und keine Pilotfreigabe. Für Produktion sind Einwilligung beziehungsweise Rechtsgrundlage, Datenminimierung, Auftragsverarbeitung und technische Schutzmaßnahmen erforderlich.

### Ein Demo-Ablauf wird als offizielle Meldung verstanden

Folge: Betroffene verlassen sich auf eine Übertragung, die nicht stattfindet.

Kontrolle: Entwurf-, Export- und Demo-Bezeichnungen; keine Erfolgsbestätigung ohne echte Zustellung.

### Veraltete Hilfe- oder Rechtsinformation

Folge: falsche Orientierung in belastenden Situationen.

Kontrolle: Primärquellen, Prüfdatum und fachliche Freigabe vor jeder echten Veröffentlichung.

### API-Schlüssel oder interne Daten werden committed

Folge: unbefugte Nutzung und Informationsabfluss.

Kontrolle: `.gitignore`, `.env.example`, Reviewregeln und Secret-Scanning als erforderliche Repository-Einstellung.

### Lokaler Browser oder Export wird von Dritten eingesehen

Folge: Offenlegung sensibler Inhalte.

Kontrolle: keine echten Daten im Prototyp. Eine Sichtschutz-PIN ersetzt weder Geräteverschlüsselung noch Authentifizierung.

## Nichtziele des aktuellen MVP

Der aktuelle Stand bietet keine belastbare Anonymität, Ende-zu-Ende-Verschlüsselung, Identitätsprüfung, Rollenautorisierung, revisionssichere Zustellung, sichere Langzeitspeicherung oder Krisenintervention.

## Voraussetzungen für einen Pilot

- Datenfluss- und Bedrohungsanalyse mit Verantwortlichen
- Datenschutz-Folgenabschätzung und Löschkonzept
- echte Identität, Rollen und serverseitige Autorisierung
- verschlüsselte Datenhaltung und Transportabsicherung
- Audit-Logs, Monitoring, Incident Response und Wiederherstellung
- geprüfte interne Zuständigkeiten und fachlich freigegebene Inhalte
- unabhängige Sicherheits- und Barrierefreiheitsprüfung
