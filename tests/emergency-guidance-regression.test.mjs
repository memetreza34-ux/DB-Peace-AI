import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";

const root = path.resolve(import.meta.dirname, "..");

function read(relativePath) {
  return fs.readFileSync(path.join(root, relativePath), "utf8");
}

test("110 wird in Hilfeoberflächen auf akute Gefahrenlagen begrenzt", () => {
  const support = read("src/components/SupportPage.jsx");
  const emergency = read("src/components/EmergencyModal.jsx");

  assert.match(support, /Bei akuter Bedrohung, Gewalt oder einer unmittelbar gefährlichen Situation\./);
  assert.match(emergency, /Bei akuter Bedrohung, Gewalt oder einer unmittelbar gefährlichen Situation\./);
  assert.doesNotMatch(support, /Bei akuter Bedrohung, Gewalt oder einer Straftat\./);
  assert.doesNotMatch(emergency, /Wenn eine Straftat oder unmittelbare Gefahr besteht\./);
});

test("Startseite beschreibt die Anrufbestätigung nur für 110 und 112", () => {
  const home = read("src/components/DashboardHome.jsx");

  assert.match(home, /110 und 112 mit klarer Anrufbestätigung; TelefonSeelsorge als direkter Telefon-App-Link\./);
  assert.doesNotMatch(home, /110, 112 und TelefonSeelsorge mit klarer Anrufbestätigung/);
});

test("lokaler Chat macht aus historischer Suizid-Erwähnung nicht automatisch eine akute Krise", () => {
  const chat = read("src/components/FloatingChatWidget.jsx");

  assert.match(chat, /Wenn es um dich oder jemand anderen aktuell geht und Selbstverletzung oder Suizid eine Rolle spielt/);
  assert.match(chat, /vergangenen Vorfall sprichst, bedeutet die Erwähnung allein nicht automatisch eine aktuelle Krise/);
  assert.doesNotMatch(chat, /Das klingt nach einer akuten Krise/);
});

test("Gemini-Chatprompt unterscheidet aktuelle von vergangenen Gefahren", () => {
  const server = read("server.js");

  assert.match(server, /Bei gegenwärtiger Gefahr, akuter Drohung oder laufender Gewalt/);
  assert.match(server, /Vergangene Drohung oder Gewalt ohne aktuell beschriebene Gefahr nicht automatisch als akuten Notfall darstellen/);
  assert.match(server, /Bei aktuell beschriebener Selbstverletzungs- oder Suizidgefahr oder akuter Krise/);
  assert.match(server, /historische Erwähnung von Selbstverletzung oder Suizid nicht automatisch als aktuelle akute Krise darstellen/);
  assert.doesNotMatch(server, /Bei Selbstverletzung, Suizid oder akuter Krise: sofort reale Hilfe/);
});
