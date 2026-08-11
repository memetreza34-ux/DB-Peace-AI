/**
 * Lokale Gerätesperre für DB Peace.
 *
 * Wichtig zur Einordnung: Das hier sperrt den *Zugang zur Oberfläche* auf diesem
 * Gerät. Es ist keine Verschlüsselung der gespeicherten Daten — bei einer vier-
 * stelligen PIN wäre das ohnehin Sicherheitstheater. Die App sagt deshalb an
 * keiner Stelle, dass Inhalte verschlüsselt seien.
 *
 * Die PIN wird nicht im Klartext gespeichert, sondern als PBKDF2-Hash mit
 * zufälligem Salt. Fehlversuche werden gezählt und gedrosselt.
 */

const SPEICHER_SCHLUESSEL = "db-peace-lock";
const ITERATIONEN = 210000;
const MAX_VERSUCHE = 5;
const SPERRE_MS = 60_000;

function zuHex(buffer) {
  return [...new Uint8Array(buffer)].map((b) => b.toString(16).padStart(2, "0")).join("");
}

function vonHex(hex) {
  const bytes = new Uint8Array(hex.length / 2);
  for (let i = 0; i < bytes.length; i++) bytes[i] = parseInt(hex.slice(i * 2, i * 2 + 2), 16);
  return bytes;
}

async function ableiten(pin, salt) {
  const basis = await crypto.subtle.importKey("raw", new TextEncoder().encode(pin), "PBKDF2", false, [
    "deriveBits"
  ]);
  const bits = await crypto.subtle.deriveBits(
    { name: "PBKDF2", salt, iterations: ITERATIONEN, hash: "SHA-256" },
    basis,
    256
  );
  return zuHex(bits);
}

function lesen() {
  try {
    const roh = localStorage.getItem(SPEICHER_SCHLUESSEL);
    return roh ? JSON.parse(roh) : null;
  } catch {
    return null;
  }
}

function schreiben(daten) {
  try {
    localStorage.setItem(SPEICHER_SCHLUESSEL, JSON.stringify(daten));
  } catch {
    /* Speicher blockiert (z. B. privater Modus) — Sperre gilt dann nur für diese Sitzung */
  }
}

/** Ist auf diesem Gerät schon eine PIN eingerichtet? */
export function pinEingerichtet() {
  const d = lesen();
  return Boolean(d?.hash && d?.salt);
}

/** Richtet eine neue PIN ein (überschreibt eine vorhandene). */
export async function pinEinrichten(pin) {
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const hash = await ableiten(pin, salt);
  schreiben({ hash, salt: zuHex(salt), fehlversuche: 0, gesperrtBis: 0 });
}

/**
 * Wie lange ist die Eingabe noch gesperrt (in ms)? 0 = nicht gesperrt.
 */
export function sperreRestMs() {
  const d = lesen();
  if (!d?.gesperrtBis) return 0;
  return Math.max(0, d.gesperrtBis - Date.now());
}

/**
 * Prüft eine PIN.
 * @returns {Promise<{ok: true} | {ok: false, grund: "falsch"|"gesperrt", restMs?: number, verbleibend?: number}>}
 */
export async function pinPruefen(pin) {
  const d = lesen();
  if (!d) return { ok: false, grund: "falsch", verbleibend: MAX_VERSUCHE };

  const rest = sperreRestMs();
  if (rest > 0) return { ok: false, grund: "gesperrt", restMs: rest };

  const hash = await ableiten(pin, vonHex(d.salt));

  if (hash === d.hash) {
    schreiben({ ...d, fehlversuche: 0, gesperrtBis: 0 });
    return { ok: true };
  }

  const fehlversuche = (d.fehlversuche || 0) + 1;
  const gesperrtBis = fehlversuche >= MAX_VERSUCHE ? Date.now() + SPERRE_MS : 0;
  schreiben({ ...d, fehlversuche: gesperrtBis ? 0 : fehlversuche, gesperrtBis });

  return gesperrtBis
    ? { ok: false, grund: "gesperrt", restMs: SPERRE_MS }
    : { ok: false, grund: "falsch", verbleibend: MAX_VERSUCHE - fehlversuche };
}

/** Entfernt die Gerätesperre samt Fehlversuchszähler. */
export function pinZuruecksetzen() {
  try {
    localStorage.removeItem(SPEICHER_SCHLUESSEL);
  } catch {
    /* ignorieren */
  }
}
