import json

def generate_unique_laws():
    laws_db = {
        "bundesgesetze": [],
        "dbRichtlinien": []
    }

    laws_db["bundesgesetze"] = [
        # AGG
        {
            "id": "agg_1",
            "title": "Allgemeines Gleichbehandlungsgesetz (AGG)",
            "subtitle": "Schutz vor rassistischer Diskriminierung",
            "icon": "Scale",
            "color": "red",
            "paragraph": "§ 1 AGG",
            "officialText": "Ziel des Gesetzes ist, Benachteiligungen aus Gründen der Rasse oder wegen der ethnischen Herkunft, des Geschlechts, der Religion oder Weltanschauung, einer Behinderung, des Alters oder der sexuellen Identität zu verhindern oder zu beseitigen.",
            "translation": "Niemand darf dich wegen deiner Herkunft, Hautfarbe oder Religion schlechter behandeln. Wenn jemand einen rassistischen 'Witz' macht, ist das kein Spaß, sondern ein Verstoß gegen Bundesrecht.",
            "actionTip": "Melde solche Vorfälle! Der Arbeitgeber MUSS laut AGG einschreiten und Täter abmahnen oder kündigen."
        },
        {
            "id": "agg_7",
            "title": "Allgemeines Gleichbehandlungsgesetz (AGG)",
            "subtitle": "Das Benachteiligungsverbot",
            "icon": "AlertCircle",
            "color": "red",
            "paragraph": "§ 7 Abs. 1 AGG",
            "officialText": "Beschäftigte dürfen nicht wegen eines in § 1 genannten Grundes benachteiligt werden. Bestimmungen in Vereinbarungen, die gegen das Benachteiligungsverbot verstoßen, sind unwirksam.",
            "translation": "Dein Chef darf dir nicht kündigen oder dir einen schlechteren Job geben, nur weil du (als Beispiel) homosexuell bist oder eine andere Religion hast.",
            "actionTip": "Sammle Beweise (Mails, Zeugen), wenn du bei Schichtplänen oder Aufgaben systematisch benachteiligt wirst."
        },
        {
            "id": "agg_12",
            "title": "Allgemeines Gleichbehandlungsgesetz (AGG)",
            "subtitle": "Pflichten des Arbeitgebers",
            "icon": "Building2",
            "color": "red",
            "paragraph": "§ 12 Abs. 1 & 3 AGG",
            "officialText": "Der Arbeitgeber ist verpflichtet, die erforderlichen Maßnahmen zum Schutz vor Benachteiligungen zu treffen. Verstoßen Beschäftigte gegen das Benachteiligungsverbot, hat der Arbeitgeber die im Einzelfall geeigneten, erforderlichen und angemessenen Maßnahmen wie Abmahnung, Umsetzung, Versetzung oder Kündigung zu ergreifen.",
            "translation": "Dein Chef kann nicht sagen 'Klärt das unter euch'. Er MUSS handeln. Wenn ein Kollege dich wegen deiner Herkunft beleidigt, ist der Chef gesetzlich verpflichtet, diesen Kollegen mindestens abzumahnen.",
            "actionTip": "Erinnere deinen Vorgesetzten an seine Pflicht nach § 12 AGG, wenn er bei Mobbing untätig bleibt."
        },
        {
            "id": "agg_13",
            "title": "Allgemeines Gleichbehandlungsgesetz (AGG)",
            "subtitle": "Dein formelles Beschwerderecht",
            "icon": "BookText",
            "color": "red",
            "paragraph": "§ 13 Abs. 1 AGG",
            "officialText": "Die Beschäftigten haben das Recht, sich bei den zuständigen Stellen des Betriebs zu beschweren, wenn sie sich im Zusammenhang mit ihrem Beschäftigungsverhältnis vom Arbeitgeber, Vorgesetzten, anderen Beschäftigten oder Dritten wegen eines in § 1 genannten Grundes benachteiligt fühlen. Die Beschwerde ist zu prüfen.",
            "translation": "Du hast das garantierte Recht, eine offizielle Beschwerde bei HR einzureichen. Sie dürfen diese Beschwerde nicht einfach in den Papierkorb werfen – sie MÜSSEN sie untersuchen.",
            "actionTip": "Nutze das AGG-Beschwerdeformular (oder diese App), um den Fall hochoffiziell zu machen."
        },
        {
            "id": "agg_16",
            "title": "Allgemeines Gleichbehandlungsgesetz (AGG)",
            "subtitle": "Keine Rache für Beschwerden",
            "icon": "CheckCircle2",
            "color": "red",
            "paragraph": "§ 16 AGG - Maßregelungsverbot",
            "officialText": "Der Arbeitgeber darf Beschäftigte nicht wegen der Inanspruchnahme von Rechten nach diesem Abschnitt oder wegen der Weigerung, eine gegen diesen Abschnitt verstoßende Anweisung auszuführen, benachteiligen.",
            "translation": "Wenn du dich über Diskriminierung beschwerst, darf der Chef dich dafür NICHT bestrafen (z.B. mit einer schlechten Bewertung im Zeugnis oder Kündigung).",
            "actionTip": "Das Gesetz schützt dich vor 'Racheaktionen'. Du kannst dich absolut sicher beschweren."
        },
        
        # BBiG
        {
            "id": "bbig_14",
            "title": "Berufsbildungsgesetz (BBiG)",
            "subtitle": "Kaffee kochen ist nicht deine Aufgabe",
            "icon": "BookOpen",
            "color": "emerald",
            "paragraph": "§ 14 Abs. 3 BBiG",
            "officialText": "Auszubildenden dürfen nur Aufgaben übertragen werden, die dem Ausbildungszweck dienen und ihren körperlichen Kräften angemessen sind.",
            "translation": "Du bist zum Lernen im Betrieb, nicht als billige Hilfskraft für unbeliebte Aufgaben. Monatelang nur Akten schreddern oder das Auto vom Meister waschen ist illegal.",
            "actionTip": "Führe dein Berichtsheft gewissenhaft. Wenn du nur fachfremde Aufgaben machst, zeig das Heft der JAV."
        },
        {
            "id": "bbig_14_5",
            "title": "Berufsbildungsgesetz (BBiG)",
            "subtitle": "Die Fürsorgepflicht deines Ausbilders",
            "icon": "Building2",
            "color": "emerald",
            "paragraph": "§ 14 Abs. 1 Nr. 5 BBiG",
            "officialText": "Ausbildende haben dafür zu sorgen, dass Auszubildende charakterlich gefördert sowie sittlich und körperlich nicht gefährdet werden.",
            "translation": "Dein Meister ist verpflichtet, gut auf dich aufzupassen. Das gilt nicht nur für einen Schutzhelm auf der Baustelle, sondern auch für deine Psyche. Wenn er Mobbing zulässt, bricht er das Gesetz.",
            "actionTip": "Konfrontiere deinen Ausbilder direkt mit seiner Fürsorgepflicht, wenn er Mobbing durch andere Kollegen ignoriert."
        },
        {
            "id": "bbig_15",
            "title": "Berufsbildungsgesetz (BBiG)",
            "subtitle": "Freistellung für die Berufsschule",
            "icon": "Scale",
            "color": "emerald",
            "paragraph": "§ 15 Abs. 1 BBiG",
            "officialText": "Ausbildende dürfen Auszubildende vor einem vor 9 Uhr beginnenden Berufsschulunterricht nicht beschäftigen. Sie haben Auszubildende freizustellen für die Teilnahme am Berufsschulunterricht.",
            "translation": "Die Berufsschule geht vor! Dein Ausbilder kann nicht von dir verlangen, dass du vor der Schule (wenn sie vor 9 Uhr startet) noch kurz im Betrieb aushilfst.",
            "actionTip": "Berufsschulzeit ist Ausbildungszeit. Dein Gehalt wird für diese Zeit ganz normal weitergezahlt."
        },
        {
            "id": "bbig_17",
            "title": "Berufsbildungsgesetz (BBiG)",
            "subtitle": "Angemessene Ausbildungsvergütung",
            "icon": "CheckCircle2",
            "color": "emerald",
            "paragraph": "§ 17 Abs. 1 BBiG",
            "officialText": "Ausbildende haben Auszubildenden eine angemessene Vergütung zu gewähren. Sie ist nach dem Lebensalter der Auszubildenden so zu bemessen, dass sie mit fortschreitender Berufsausbildung, mindestens jährlich, ansteigt.",
            "translation": "Du darfst nicht als kostenlose Arbeitskraft ausgebeutet werden. Deine Vergütung muss angemessen sein und muss sich jedes Ausbildungsjahr automatisch erhöhen.",
            "actionTip": "Prüfe deinen Vertrag. Wenn dein Gehalt im zweiten Jahr nicht gestiegen ist, fordere es sofort ein (rückwirkend)."
        },
        
        # JArbSchG
        {
            "id": "jarbschg_8",
            "title": "Jugendarbeitsschutzgesetz (JArbSchG)",
            "subtitle": "Maximale Arbeitszeit für Minderjährige",
            "icon": "AlertCircle",
            "color": "purple",
            "paragraph": "§ 8 Abs. 1 JArbSchG",
            "officialText": "Jugendliche dürfen nicht mehr als acht Stunden täglich und nicht mehr als 40 Stunden wöchentlich beschäftigt werden.",
            "translation": "Bist du unter 18? Dann ist nach exakt 8 Stunden Arbeitszeit (ohne Pausen) am Tag rigoros Schluss. Es gibt absolut keine Ausnahme für dauerhafte 9- oder 10-Stunden-Schichten.",
            "actionTip": "Lass dir keine Überstunden aufzwingen. Zeige auf die Uhr und sage, dass du nach § 8 JArbSchG Feierabend hast."
        },
        {
            "id": "jarbschg_11",
            "title": "Jugendarbeitsschutzgesetz (JArbSchG)",
            "subtitle": "Dein Recht auf Pausen",
            "icon": "BookOpen",
            "color": "purple",
            "paragraph": "§ 11 JArbSchG",
            "officialText": "Jugendlichen müssen im Voraus feststehende Ruhepausen von angemessener Dauer gewährt werden. Die Ruhepausen müssen mindestens betragen: 30 Minuten bei einer Arbeitszeit von mehr als viereinhalb bis zu sechs Stunden, 60 Minuten bei einer Arbeitszeit von mehr als sechs Stunden.",
            "translation": "Wer mehr als 6 Stunden arbeitet, MUSS als Minderjähriger eine ganze Stunde Pause machen. Und der Chef muss vorher sagen, wann die Pause ist. Einfach 'durcharbeiten' ist illegal.",
            "actionTip": "Pausen sind Erholung, du musst in der Zeit keine Anrufe annehmen oder 'kurz mal mit anpacken'."
        },
        {
            "id": "jarbschg_14",
            "title": "Jugendarbeitsschutzgesetz (JArbSchG)",
            "subtitle": "Nachtruhe ist heilig",
            "icon": "Scale",
            "color": "purple",
            "paragraph": "§ 14 JArbSchG",
            "officialText": "Jugendliche dürfen nur in der Zeit von 6 bis 20 Uhr beschäftigt werden.",
            "translation": "Bist du unter 18, darfst du in den meisten Berufen (außer z.B. Gastro/Bäckerei) nicht nachts arbeiten. Um 20 Uhr ist endgültig Feierabend.",
            "actionTip": "Sollte man dich für eine Spätschicht bis 22 Uhr einteilen wollen, verweigere dies mit Hinweis auf § 14 JArbSchG."
        },
        {
            "id": "jarbschg_22",
            "title": "Jugendarbeitsschutzgesetz (JArbSchG)",
            "subtitle": "Sittliche Gefährdung (Sexuelle Belästigung)",
            "icon": "AlertCircle",
            "color": "purple",
            "paragraph": "§ 22 Abs. 1 Nr. 3 JArbSchG",
            "officialText": "Der Arbeitgeber hat Vorkehrungen und Maßnahmen zu treffen, die zum Schutz der Jugendlichen gegen physische, psychische sowie sittliche Gefahren erforderlich sind. Insbesondere hat er sie vor Belästigungen am Arbeitsplatz zu schützen.",
            "translation": "Der Arbeitgeber ist bei Minderjährigen unter absolutem Sonderschutz. Wenn du durch ältere Kollegen sexuell belästigt oder gemobbt wirst ('sittliche Gefahr'), muss der Arbeitgeber extrem schnell und hart durchgreifen.",
            "actionTip": "Betone bei einer Meldung an HR immer, dass du noch minderjährig bist. Das erhöht den Druck massiv."
        },
        
        # StGB
        {
            "id": "stgb_185",
            "title": "Strafgesetzbuch (StGB)",
            "subtitle": "Beleidigung ist kein Kavaliersdelikt",
            "icon": "AlertCircle",
            "color": "orange",
            "paragraph": "§ 185 StGB",
            "officialText": "Die Beleidigung wird mit Freiheitsstrafe bis zu einem Jahr oder mit Geldstrafe und, wenn die Beleidigung mittels einer Tätlichkeit begangen wird, mit Freiheitsstrafe bis zu zwei Jahren oder mit Geldstrafe bestraft.",
            "translation": "Dich am Arbeitsplatz oder in einer WhatsApp-Gruppe massiv zu beleidigen, ist nicht nur gemein, es ist eine echte Straftat. Das kann für den Täter vor Gericht enden.",
            "actionTip": "Mache Screenshots von Beleidigungen in Chats. Zeige Täter bei schwerwiegenden Fällen direkt bei der Polizei an."
        },
        {
            "id": "stgb_186",
            "title": "Strafgesetzbuch (StGB)",
            "subtitle": "Üble Nachrede & Lästern",
            "icon": "Scale",
            "color": "orange",
            "paragraph": "§ 186 StGB",
            "officialText": "Wer in Beziehung auf einen anderen eine Tatsache behauptet oder verbreitet, welche denselben verächtlich zu machen oder in der öffentlichen Meinung herabzuwürdigen geeignet ist, wird bestraft, wenn nicht diese Tatsache erweislich wahr ist.",
            "translation": "Wenn Kollegen gezielt Lügen über dich verbreiten, um deinen Ruf im Betrieb zu zerstören, machen sie sich strafbar. Du musst das nicht aushalten.",
            "actionTip": "Notiere dir genau, wer wem welche Lügen über dich erzählt hat. Frage Kollegen, ob sie das bezeugen können."
        },
        {
            "id": "stgb_240",
            "title": "Strafgesetzbuch (StGB)",
            "subtitle": "Nötigung am Arbeitsplatz",
            "icon": "CheckCircle2",
            "color": "orange",
            "paragraph": "§ 240 StGB",
            "officialText": "Wer einen Menschen rechtswidrig mit Gewalt oder durch Drohung mit einem empfindlichen Übel zu einer Handlung, Duldung oder Unterlassung nötigt, wird mit Freiheitsstrafe bis zu drei Jahren oder mit Geldstrafe bestraft.",
            "translation": "Wenn ein Kollege oder Ausbilder dir droht ('Wenn du das nicht für mich machst, sorge ich dafür, dass du durchfällst'), ist das strafbare Nötigung.",
            "actionTip": "Erpressung und Nötigung solltest du sofort bei HR und der JAV melden. Das ist ein sofortiger Kündigungsgrund für den Täter."
        },

        # BetrVG
        {
            "id": "betrvg_84",
            "title": "Betriebsverfassungsgesetz (BetrVG)",
            "subtitle": "Dein allgemeines Beschwerderecht",
            "icon": "Building2",
            "color": "blue",
            "paragraph": "§ 84 BetrVG",
            "officialText": "Jeder Arbeitnehmer hat das Recht, sich bei den zuständigen Stellen des Betriebs zu beschweren, wenn er sich vom Arbeitgeber oder von Arbeitnehmern des Betriebs benachteiligt oder ungerecht behandelt fühlt. Ihm dürfen aus der Erhebung einer Beschwerde keine Nachteile entstehen.",
            "translation": "Gefällt dir nicht, wie du behandelt wirst? Du darfst dich JEDERZEIT beim Betriebsrat beschweren, ohne dass dir jemand daraus einen Strick drehen darf.",
            "actionTip": "Lass dich nicht einschüchtern. Das Beschwerderecht ist fundamental und gesetzlich geschützt."
        },
        {
            "id": "betrvg_104",
            "title": "Betriebsverfassungsgesetz (BetrVG)",
            "subtitle": "Rauswurf von Rassisten & Mobbern",
            "icon": "Scale",
            "color": "blue",
            "paragraph": "§ 104 BetrVG",
            "officialText": "Hat ein Arbeitnehmer durch gesetzwidriges Verhalten oder durch grobe Verletzung der in § 75 Abs. 1 enthaltenen Grundsätze, insbesondere durch rassistische oder fremdenfeindliche Betätigungen, den Betriebsfrieden wiederholt ernstlich gestört, so kann der Betriebsrat vom Arbeitgeber die Entlassung oder Versetzung verlangen.",
            "translation": "Der Betriebsrat (oder die JAV) hat eine unglaubliche Macht: Er kann vom Chef fordern, dass ein Kollege gefeuert wird, wenn dieser rassistisch ist oder durch Mobbing den Frieden zerstört.",
            "actionTip": "Wenn der Chef wegsieht, schalte den Betriebsrat ein. Dieser kann den Rauswurf des Täters erzwingen."
        },

        # ArbZG
        {
            "id": "arbzg_3",
            "title": "Arbeitszeitgesetz (ArbZG)",
            "subtitle": "Überstunden für volljährige Azubis",
            "icon": "BookOpen",
            "color": "teal",
            "paragraph": "§ 3 ArbZG",
            "officialText": "Die werktägliche Arbeitszeit der Arbeitnehmer darf acht Stunden nicht überschreiten. Sie kann auf bis zu zehn Stunden nur verlängert werden, wenn innerhalb von sechs Kalendermonaten im Durchschnitt acht Stunden werktäglich nicht überschritten werden.",
            "translation": "Bist du über 18, darfst du zwar ab und zu 10 Stunden arbeiten, aber das MUSS durch Freizeit wieder ausgeglichen werden. Dauerhaft 10 Stunden am Tag sind strikt verboten.",
            "actionTip": "Führe ein eigenes Stundenbuch. Die Bahn bezahlt Überstunden oder gibt dir dafür freie Tage."
        },
        {
            "id": "arbzg_5",
            "title": "Arbeitszeitgesetz (ArbZG)",
            "subtitle": "Ruhezeiten zwischen Schichten",
            "icon": "BookText",
            "color": "teal",
            "paragraph": "§ 5 ArbZG",
            "officialText": "Die Arbeitnehmer müssen nach Beendigung der täglichen Arbeitszeit eine ununterbrochene Ruhezeit von mindestens elf Stunden haben.",
            "translation": "Du kannst nicht um 22 Uhr Feierabend machen und um 6 Uhr morgens wieder in der Schicht stehen. Dazwischen müssen mindestens 11 Stunden liegen, in denen du schlafen und dich erholen kannst.",
            "actionTip": "Wenn der Schichtplan diese 11 Stunden nicht einhält, ist er rechtswidrig. Teile das dem Planer sofort mit."
        },

        # BUrlG
        {
            "id": "burlg_7",
            "title": "Bundesurlaubsgesetz (BUrlG)",
            "subtitle": "Dein Urlaubsanspruch",
            "icon": "BookOpen",
            "color": "emerald",
            "paragraph": "§ 7 BUrlG",
            "officialText": "Bei der zeitlichen Festlegung des Urlaubs sind die Urlaubswünsche des Arbeitnehmers zu berücksichtigen, es sei denn, dass ihrer Berücksichtigung dringende betriebliche Belange oder Urlaubswünsche anderer Arbeitnehmer entgegenstehen.",
            "translation": "Grundsätzlich darfst du bestimmen, wann du in den Urlaub gehst. Der Chef kann nicht pauschal 'Nein' sagen, außer es brennt wortwörtlich die Hütte (Personalmangel allein reicht oft nicht als Ausrede).",
            "actionTip": "Reiche deinen Urlaub so früh wie möglich schriftlich ein. Wenn er grundlos abgelehnt wird, gehe zur JAV."
        },

        # ArbSchG
        {
            "id": "arbschg_4",
            "title": "Arbeitsschutzgesetz (ArbSchG)",
            "subtitle": "Schutz vor psychischem Stress",
            "icon": "Scale",
            "color": "teal",
            "paragraph": "§ 4 Nr. 1 ArbSchG",
            "officialText": "Der Arbeitgeber hat bei Maßnahmen des Arbeitsschutzes von folgenden allgemeinen Grundsätzen auszugehen: Die Arbeit ist so zu gestalten, dass eine Gefährdung für das Leben sowie die physische und die psychische Gesundheit möglichst vermieden wird.",
            "translation": "Dein Chef muss dafür sorgen, dass du auf der Arbeit nicht seelisch kaputt gehst. Dauerhafter extremer Stress, ständiges Anschreien durch Vorgesetzte oder Mobbing sind Verstöße gegen den Arbeitsschutz.",
            "actionTip": "Bei dauerhafter psychischer Belastung kannst du eine sogenannte 'Gefährdungsanzeige' stellen."
        },

        # BGB
        {
            "id": "bgb_823",
            "title": "Bürgerliches Gesetzbuch (BGB)",
            "subtitle": "Schmerzensgeld bei Mobbing",
            "icon": "AlertCircle",
            "color": "red",
            "paragraph": "§ 823 Abs. 1 BGB",
            "officialText": "Wer vorsätzlich oder fahrlässig das Leben, den Körper, die Gesundheit, die Freiheit, das Eigentum oder ein sonstiges Recht eines anderen widerrechtlich verletzt, ist dem anderen zum Ersatz des daraus entstehenden Schadens verpflichtet.",
            "translation": "Wenn dich jemand im Betrieb systematisch in den Burnout oder die Depression treibt (Mobbing/Bossing), kannst du den Täter zivilrechtlich auf Schmerzensgeld verklagen.",
            "actionTip": "Lass dich krankschreiben und vom Psychologen dokumentieren, dass die Arbeit der Auslöser ist. Das ist entscheidend für spätere Klagen."
        }
    ]

    laws_db["dbRichtlinien"] = [
        {
            "id": "kbv_1",
            "title": "Konzernbetriebsvereinbarung (KBV)",
            "subtitle": "Null Toleranz bei Mobbing",
            "icon": "BookText",
            "color": "amber",
            "paragraph": "DB Grundsatz",
            "officialText": "Mobbing, sexuelle Belästigung und Diskriminierung werden im DB Konzern nicht toleriert. Führungskräfte sind verpflichtet, jedem Hinweis unverzüglich nachzugehen. Zuwiderhandlungen stellen eine Verletzung arbeitsvertraglicher Pflichten dar.",
            "translation": "Die Deutsche Bahn hat sich selbst knallharte Regeln auferlegt. Wer mobbt oder diskriminiert, verstößt gegen seinen Arbeitsvertrag. Dein Chef macht sich selbst strafbar, wenn er deine Meldung ignoriert.",
            "actionTip": "Nutze das anonyme Meldewesen der App, wenn dein direkter Chef nichts unternimmt."
        },
        {
            "id": "coc_1",
            "title": "DB Verhaltenskodex (Code of Conduct)",
            "subtitle": "So gehen wir miteinander um",
            "icon": "CheckCircle2",
            "color": "amber",
            "paragraph": "Präambel / Grundsätze",
            "officialText": "Wir begegnen einander mit Respekt, Vertrauen und Fairness. Wir schätzen Vielfalt und setzen uns für ein offenes, tolerantes Arbeitsumfeld ein. Jede Form von Benachteiligung, Belästigung oder Ausgrenzung lehnen wir strikt ab.",
            "translation": "Das ist kein Werbetext, das ist die offizielle Regel für alle 300.000 Mitarbeiter der DB. Wer sich rassistisch verhält oder andere ausgrenzt, passt nicht ins Unternehmen.",
            "actionTip": "Berufe dich in Feedback-Gesprächen aktiv auf den Code of Conduct, wenn der Umgangston nicht stimmt."
        },
        {
            "id": "charta_1",
            "title": "Charta der Vielfalt",
            "subtitle": "Öffentliches Commitment der Bahn",
            "icon": "Scale",
            "color": "blue",
            "paragraph": "Unternehmensurkunde",
            "officialText": "Mit der Unterzeichnung verpflichten wir uns, ein Arbeitsumfeld zu schaffen, das frei von Vorurteilen ist. Alle Beschäftigten erfahren Wertschätzung – unabhängig von Geschlecht und geschlechtlicher Identität, Nationalität, ethnischer Herkunft, Religion oder Weltanschauung, Behinderung, Alter, sexueller Orientierung.",
            "translation": "Die DB hat diese offizielle Urkunde der Bundesregierung unterschrieben. Damit ist es hochoffiziell: Rassismus, Homophobie und Sexismus haben im Konzern keinen Platz.",
            "actionTip": "Argumentiere mit der Charta, wenn Vorgesetzte 'Sprüche' als 'harmlosen Spaß' abtun."
        },
        {
            "id": "hr_leitfaden",
            "title": "DB HR Handlungsleitfaden",
            "subtitle": "Der Prozess nach einer Meldung",
            "icon": "AlertCircle",
            "color": "red",
            "paragraph": "Eskalationsprozess",
            "officialText": "Bei Verdacht auf Mobbing oder sexuelle Belästigung greift ein standardisierter Eskalationsprozess. Dieser sieht die sofortige Anhörung beider Parteien unter Einbeziehung des Betriebsrats sowie die Einleitung disziplinarischer Maßnahmen bis hin zur fristlosen Kündigung vor.",
            "translation": "Die Personalabteilung (HR) hat eine exakte Checkliste, was sie tun muss, wenn du Mobbing meldest. Sie MÜSSEN den Fall prüfen, Zeugen befragen und den Täter anhören. Sie können den Fall nicht einfach ignorieren.",
            "actionTip": "Hab keine Angst, HR einzuschalten. Die haben einen festen Leitfaden, an den sie sich halten müssen, um dich zu schützen."
        },
        {
            "id": "it_richtlinie",
            "title": "DB Richtlinie zur IT-Nutzung",
            "subtitle": "Cybermobbing & Chat-Regeln",
            "icon": "AlertCircle",
            "color": "amber",
            "paragraph": "Kommunikationsrichtlinie",
            "officialText": "Die Nutzung der IT-Systeme und sozialen Netzwerke im dienstlichen Kontext muss stets den Grundsätzen eines fairen und respektvollen Miteinanders entsprechen. Cybermobbing, diffamierende Äußerungen oder das Teilen von unangebrachten Inhalten wird arbeitsrechtlich geahndet.",
            "translation": "WhatsApp-Gruppen der Abteilung oder Teams-Chats sind kein rechtsfreier Raum. Wer hier Kollegen ausschließt, heimlich veralbert oder beleidigt, riskiert eine sofortige Abmahnung durch die DB.",
            "actionTip": "Cybermobbing hinterlässt digitale Spuren. Melde solche Vorfälle direkt mit Screenshots."
        },
        {
            "id": "uebernahme_vertrag",
            "title": "DB Tarifvertrag / Übernahme",
            "subtitle": "Deine Jobsicherheit nach der Ausbildung",
            "icon": "BookOpen",
            "color": "teal",
            "paragraph": "Übernahmegarantie",
            "officialText": "Auszubildende, die ihre Abschlussprüfung erfolgreich bestehen, werden in der Regel unbefristet in ein Arbeitsverhältnis übernommen, sofern personenbedingte oder verhaltensbedingte Gründe nicht entgegenstehen.",
            "translation": "Die Bahn garantiert dir bei guten Leistungen und bestandenem Abschluss im Normalfall einen festen Job. Das nimmt dir den extremen Druck und die Existenzangst im dritten Lehrjahr.",
            "actionTip": "Lass dich nicht unterkriegen. Ein guter Abschluss bei der DB ist eine Eintrittskarte für einen sicheren Job!"
        }
    ]

    with open("/Users/arman/.gemini/antigravity/scratch/DB-Peace-AI/src/data/lawsData.json", "w", encoding="utf-8") as f:
        json.dump(laws_db, f, indent=2, ensure_ascii=False)

    print(f"Successfully generated lawsData.json with {len(laws_db['bundesgesetze']) + len(laws_db['dbRichtlinien'])} highly detailed, unique entries!")

if __name__ == "__main__":
    generate_unique_laws()
