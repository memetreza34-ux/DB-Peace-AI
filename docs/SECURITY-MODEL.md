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
3. externer Google-Gemini-Dienst bei aktiviertem API-Schlüssel
4. lokale Zwischenablage und heruntergeladene Dateien
5. nicht implementierte Unternehmenssysteme außerhalb des Prototyps

## Aktueller KI-Datenfluss

Bei aktiviertem Gemini gilt für Chat und KI-Meldeanalyse:

`Browser → lokaler Node.js-Proxy → Google Gemini → lokaler Proxy → Browser`

Der lokale Proxy schützt den API-Schlüssel und begrenzt Requests, verhindert aber nicht, dass der eingegebene Text zur Modellverarbeitung an den externen Dienst übertragen wird. Deshalb sind echte sensible Daten im Demonstrationsbetrieb ausgeschlossen.

Ein Timeout bricht den lokalen SDK-Request per `AbortSignal` ab. Das ist keine Garantie, dass eine beim externen Dienst bereits laufende Operation dort sofort beendet wird.

## Aktuelle Kontrollen

- API-Schlüssel nur im lokalen Proxy
- Bindung des API-Servers an `127.0.0.1`
- Browser-Origin- und Cross-Site-Prüfung vor lokaler API-Verarbeitung
- POST-KI-Routen nur mit echtem `application/json`; Quiz nicht als einfacher GET-Aufruf
- begrenzte Request-Größe und einfaches Rate Limiting
- lokaler 20-Sekunden-KI-Timeout mit SDK-Abort
- Sicherheitsheader und `Cache-Control: no-store` für API-Antworten
- Service Worker schließt `/api/` vom Cache aus und liefert statische Assets Network-first
- Entsperrstatus der lokalen PIN nicht in Browser-Speicher persistiert
- PIN-Fehlversuche und kurze Sperrzeiten werden ohne Klartext-PIN tabübergreifend in `localStorage` gehalten, damit ein neuer Tab die Drosselung nicht zurücksetzt
- Gedächtnisprotokolle bleiben nur im React-Arbeitsspeicher der laufenden App, überstehen dort aber interne Navigation; sie werden nicht in `localStorage`, `sessionStorage` oder IndexedDB geschrieben
- Stimmungseinträge verwenden nur `sessionStorage`; keine dauerhafte Falldatenbank
- keine Dateiübertragung, Standortübertragung oder echte SSO-Anmeldung
- sichtbare Prototyp-, Datenfluss- und Datenwarnungen
- statischer Repository-Verifier gegen bekannte irreführende Aussagen

## Wesentliche Bedrohungsszenarien

### Reale sensible Daten werden in der Demo eingegeben

Folge: Übertragung an einen externen KI-Dienst oder Ablage in Exporten und Zwischenablage.

Kontrolle: klare Warnungen, explizite Gemini-Datenflussanzeige, synthetische Testdaten und keine Pilotfreigabe. Für Produktion sind Rechtsgrundlage, Datenminimierung, Anbieter-/Vertragsprüfung und technische Schutzmaßnahmen erforderlich.

### Fremde Webseite löst lokale KI-Requests aus

Folge: unnötige Nutzung eines lokal konfigurierten API-Schlüssels oder Ressourcenverbrauch.

Kontrolle: API bindet nur an Loopback, fremde Browser-Origin-/Cross-Site-Anfragen werden abgewiesen und KI-POST-Routen verlangen echtes JSON. Das Quiz wurde von GET auf POST umgestellt.

### PIN-Drosselung wird durch einen neuen Tab umgangen

Folge: Ein rein tablokaler Versuchszähler würde für dieselbe lokale PIN neue Fehlversuche ermöglichen.

Kontrolle: Fehlversuche und die kurze Sperrfrist liegen in einem origin-lokalen `localStorage`-Eintrag und werden über das `storage`-Ereignis zwischen Tabs synchronisiert. Vor jeder PIN-Prüfung wird der aktuelle Drosselungszustand erneut gelesen. Die PIN selbst wird weiterhin nicht im Klartext gespeichert und die Sperre bleibt nur ein Sichtschutz.

### Ein Demo-Ablauf wird als offizielle Meldung verstanden

Folge: Betroffene verlassen sich auf eine Übertragung, die nicht stattfindet.

Kontrolle: Entwurf-, Export- und Demo-Bezeichnungen; keine Erfolgsbestätigung ohne echte Zustellung.

### Formularannahmen werden als Nutzerfakten exportiert

Folge: Ein Entwurf enthält Aussagen, die die Person nie ausgewählt oder angegeben hat.

Kontrolle: sensible Meldungsfelder starten leer; Kategorie, Gefahr, Perspektive, Häufigkeit, Belastung und gewünschte Form müssen bewusst ausgewählt oder als „Nicht angegeben“ erfasst werden. Die lokale Einstufung `akut` entsteht nur noch durch die bewusste Auswahl `Direkte Gefahr`; historische Gefahrbegriffe überschreiben eine ausdrückliche Auswahl `Keine akute Gefahr` nicht.

### Sitzungsprotokolle gehen bei normaler interner Navigation verloren

Folge: Nutzende könnten einen bereits angelegten, noch nicht exportierten Entwurf unbeabsichtigt verlieren.

Kontrolle: Die Liste der Gedächtnisprotokolle liegt auf App-Ebene im React-Arbeitsspeicher und übersteht Wechsel zwischen den App-Bereichen. Reload, Schließen oder echtes Verlassen der App löschen diesen Zustand weiterhin.

### Veraltete Hilfe- oder Rechtsinformation

Folge: falsche Orientierung in belastenden Situationen.

Kontrolle: Primärquellen, Prüfdatum und fachliche Freigabe vor jeder echten Veröffentlichung.

### API-Schlüssel oder interne Daten werden committed

Folge: unbefugte Nutzung und Informationsabfluss.

Kontrolle: `.gitignore`, `.env.example`, Reviewregeln und Secret-Scanning als erforderliche Repository-Einstellung.

### Lokaler Browser oder Export wird von Dritten eingesehen

Folge: Offenlegung sensibler Inhalte.

Kontrolle: keine echten Daten im Prototyp. Entsperrstatus wird nicht browserseitig persistiert; eine Sichtschutz-PIN ersetzt dennoch weder Geräteverschlüsselung noch Authentifizierung.

### Veraltete PWA-Ressourcen überdecken einen neuen Release

Folge: Nutzende sehen trotz Netzverbindung eine alte Oberfläche oder alte Sicherheitstexte.

Kontrolle: statische Assets werden Network-first geladen; Cache wird nur als Offline-Fallback verwendet und nur eigene `db-peace-ai-*`-Caches werden bereinigt.

## Nichtziele des aktuellen MVP

Der aktuelle Stand bietet keine belastbare Anonymität, Ende-zu-Ende-Verschlüsselung, Identitätsprüfung, Rollenautorisierung, revisionssichere Zustellung, sichere Langzeitspeicherung oder Krisenintervention.

## Voraussetzungen für einen Pilot

- Datenfluss- und Bedrohungsanalyse mit Verantwortlichen
- Datenschutz-Folgenabschätzung und Löschkonzept
- echte Identität, Rollen und serverseitige Autorisierung
- verschlüsselte Datenhaltung und Transportabsicherung
- Anbieter-/Vertragsprüfung für externe KI-Verarbeitung
- Audit-Logs, Monitoring, Incident Response und Wiederherstellung
- geprüfte interne Zuständigkeiten und fachlich freigegebene Inhalte
- unabhängige Sicherheits- und Barrierefreiheitsprüfung
