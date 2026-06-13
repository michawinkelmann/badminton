/** Ausführliche Beschreibungen & Skizzen — Taktik Einzel (te) und Doppel (td). */
import type { UebungsDetails } from './typen'

export const taktikEinzelDetails: Record<string, UebungsDetails> = {
  'te-01': {
    beschreibung: [
      'Lang-kurz ist das Grundmuster des Einzels: Der Gegner wird mit hohen, langen Bällen an die Grundlinie geschickt und mit Drops wieder nach vorn gezogen — wer dieses Wechselspiel beherrscht, kontrolliert den Ballwechsel. In dieser Übung wird das Muster kooperativ und mit fester Rollenverteilung gespielt, damit es viele Wiederholungen ohne Chaos gibt.',
      'Person A spielt ausschließlich lang (Clear und Lob), Person B antwortet im festen Muster: auf hohe Bälle Drop, auf kurze Bälle Lob. So läuft B das komplette Lang-kurz-Programm, während A Länge und Höhe trainiert. Nach fünf Minuten werden die Rollen getauscht; die freien Schlussminuten zeigen, ob das Muster schon ins Spiel sickert.',
    ],
    skizze: {
      spieler: [
        { pos: { x: 2.6, y: 3.05 }, label: 'A' },
        { pos: { x: 10.6, y: 3.05 }, label: 'B', partei: 'b' },
      ],
      shuttlewege: [
        { von: { x: 2.8, y: 2.6 }, bis: { x: 12.6, y: 2.6 } },
        { von: { x: 11.5, y: 3.5 }, bis: { x: 6.1, y: 3.5 } },
        { von: { x: 6.0, y: 2.3 }, bis: { x: 12.6, y: 2.2 } },
      ],
      hinweis:
        'A spielt nur lang (Clear/Lob), B antwortet mit Drop auf hohe und Lob auf kurze Bälle — das Lang-kurz-Karussell läuft.',
    },
  },
  'te-02': {
    beschreibung: [
      'Taktisch gute Einzelspieler:innen spielen nicht zum Gegner, sondern von ihm weg — in die Ecke, die am weitesten entfernt ist. Diese Übung macht aus dem Prinzip eine Regel: Jeder Schlag MUSS in die vom Gegner entfernteste Ecke; ein bequemer Ball auf den Gegner gibt den Punkt ab.',
      'Damit verschiebt sich die Aufmerksamkeit vom eigenen Schlag zur Wahrnehmung: Vor jedem Schlag muss die Position des Gegners registriert werden („Kopf hoch"). Das Feedback des Partners nach jedem Ballwechsel — welche Ecke wäre frei gewesen? — beschleunigt den Lernprozess enorm.',
    ],
    skizze: {
      spieler: [
        { pos: { x: 3.35, y: 3.05 }, label: 'A' },
        { pos: { x: 9.4, y: 1.6 }, label: 'B', partei: 'b' },
      ],
      zonen: [{ x: 12.3, y: 4.4, b: 1.1, h: 1.2, label: 'frei' }],
      shuttlewege: [{ von: { x: 3.6, y: 3.0 }, bis: { x: 12.7, y: 4.9 } }],
      hinweis:
        'B steht vorn links — also ist hinten rechts die entfernteste Ecke: Genau dorthin muss der nächste Ball.',
    },
  },
  'te-03': {
    beschreibung: [
      'Aufschlag und dritter Ball gehören zusammen: Wer nur aufschlägt und dann abwartet, verschenkt die Eröffnung. In dieser Übung werden feste Ketten einstudiert — zum Beispiel kurzer Aufschlag, Return auf das Netz, geplanter Netzdrop oder Lob je nach Return-Höhe. Die Kette gibt dem dritten Ball einen Plan, bevor der Ballwechsel beginnt.',
      'Der Returnspieler verhält sich zunächst kooperativ und wird dann variabler, sodass die Kette unter realistischem Druck bestehen muss. Die Auswertung am Ende — welche Kette liefert die meisten neutralen oder vorteilhaften dritten Bälle? — macht aus der Übung ein kleines Taktiklabor für das eigene Aufschlagspiel.',
    ],
    skizze: {
      spieler: [
        { pos: { x: 4.0, y: 1.9 }, label: 'A' },
        { pos: { x: 9.2, y: 2.4 }, label: 'B', partei: 'b' },
      ],
      shuttlewege: [
        { von: { x: 4.3, y: 1.9 }, bis: { x: 8.8, y: 2.7 } },
        { von: { x: 8.9, y: 2.2 }, bis: { x: 6.1, y: 2.0 } },
        { von: { x: 6.0, y: 2.3 }, bis: { x: 8.4, y: 4.2 } },
      ],
      hinweis:
        'Kette: ① kurzer Aufschlag, ② Return ans Netz, ③ geplanter dritter Ball — hier der Netzdrop hinter den nachrückenden Gegner.',
    },
  },
  'te-04': {
    beschreibung: [
      'Diese Spielform reduziert das Einzel auf eine einzige Qualität: Länge. Gespielt wird auf dem längs halbierten Feld, und nur Bälle, die hinter der Aufschlaglinie landen, sind erlaubt — alles Kürzere gibt den Punkt ab. Wer unter Ermüdung flach wird, verliert; genau das trainiert Geduld und Clear-Qualität.',
      'Die schmale Bahn nimmt dem Spiel die seitlichen Ausweichmöglichkeiten, sodass sich alles um Höhe, Länge und Position dreht. Die Mini-Analyse zwischen den Sätzen — wer hat zuerst die Länge verloren, und warum? — schärft den Blick für den Zusammenhang von Müdigkeit, Stellung und Schlagqualität.',
    ],
    skizze: {
      spieler: [
        { pos: { x: 2.6, y: 1.7 }, label: 'A' },
        { pos: { x: 10.8, y: 1.7 }, label: 'B', partei: 'b' },
      ],
      zonen: [
        { x: 0.46, y: 0.46, b: 4.26, h: 2.59, label: 'lang' },
        { x: 8.68, y: 0.46, b: 4.26, h: 2.59, label: 'lang' },
      ],
      shuttlewege: [{ von: { x: 2.9, y: 1.5 }, bis: { x: 12.4, y: 1.5 } }],
      hinweis:
        'Einzel auf der halben Feldbreite: Nur Bälle in den hinteren Zonen (hinter der Aufschlaglinie) zählen — alles Kurze gibt den Punkt ab.',
    },
  },
  'te-05': {
    beschreibung: [
      'Ein kurzer Ball ohne Nachrücken ist nur ein halber Angriff: Erst wer nach dem eigenen Drop ans Netz folgt, setzt den Gegner wirklich unter Druck — jeder schwache Return wird dann sofort getötet. Diese Spielform macht das Nachrücken zur Pflicht: Nach jedem eigenen kurzen Ball muss der Fuß an die T-Linie.',
      'Der Partner versucht, sich mit Lob oder Gegen-Drop zu befreien, der Punkt wird normal ausgespielt. Wer hinten stehen bleibt, verliert den Punkt automatisch — diese harte Regel verankert das Bewegungsmuster schneller als jede Ermahnung. Wichtig beim Nachrücken: Der Schlägerkopf bleibt über Netzkante, sonst fehlt die Kill-Drohung.',
    ],
    skizze: {
      spieler: [
        { pos: { x: 3.0, y: 3.05 }, label: 'A' },
        { pos: { x: 10.6, y: 3.05 }, label: 'B', partei: 'b' },
      ],
      laufwege: [{ von: { x: 3.0, y: 3.05 }, bis: { x: 4.6, y: 3.05 } }],
      shuttlewege: [{ von: { x: 3.2, y: 2.6 }, bis: { x: 7.3, y: 2.6 } }],
      hinweis:
        'Nach jedem eigenen Drop rückt A bis zur T-Linie nach (Schläger oben) — Druck aufs Vorfeld statt Zuschauen.',
    },
  },
  'te-06': {
    beschreibung: [
      'Wer angegriffen wird, hat mehr Optionen als den hohen Befreiungsball: Der flache Konter — Block-Drive ins Mittelfeld oder Konter-Drive die Linie entlang — nimmt dem Angreifer die Zeit und oft auch die Angriffsposition. Diese Übung trainiert genau diesen Mut zur flachen Antwort.',
      'Person A greift durchgehend an (Smash und Drop aus dem Hinterfeld), Person B verteidigt mit dem Auftrag, jeden zweiten Ball flach zu kontern. Die wichtigste Regel dabei: Konter nur bei hüfthohem Treffpunkt — tiefe Bälle werden weiterhin hoch befreit, sonst landet der Konter im Netz. Die Auswertung fragt nach dem taktischen Effekt: Nach welchen Kontern musste A den Angriff aufgeben?',
    ],
    skizze: {
      spieler: [
        { pos: { x: 3.8, y: 3.05 }, label: 'B' },
        { pos: { x: 11.2, y: 3.05 }, label: 'A', partei: 'b' },
      ],
      shuttlewege: [
        { von: { x: 11.0, y: 2.7 }, bis: { x: 4.1, y: 2.7 } },
        { von: { x: 4.0, y: 3.4 }, bis: { x: 9.6, y: 3.6 } },
      ],
      hinweis:
        'A smasht aus dem Hinterfeld, B kontert jeden zweiten Ball flach ins Mittelfeld bzw. die Linie entlang — statt nur hoch zu befreien.',
    },
  },
  'te-07': {
    beschreibung: [
      'Diese Spielform bringt das Gegner-Lesen ins Training: Beide ziehen verdeckt einen Taktik-Auftrag („Greife nur über die Rückhandseite an", „Spiele jeden dritten Ball kurz") und versuchen, ihn im Satz unauffällig umzusetzen. Nach dem Satz wird geraten — wer den gegnerischen Auftrag erkennt, bekommt Bonuspunkte.',
      'Der doppelte Lerneffekt: Die Aufträge zwingen, das eigene Spiel bewusst zu steuern statt nur zu reagieren — und das Raten schult den Blick für Muster im gegnerischen Spiel. Die Kunst liegt im Timing: Wer seinen Auftrag mit der Brechstange erzwingt, verrät sich sofort; gute Spieler:innen weben ihn in normale Spielzüge ein.',
    ],
  },
  'te-08': {
    beschreibung: [
      'Präzision gewinnt Spiele — aber nur, wenn sie auch unter Druck abrufbar ist. Das Zonen-Einzel belohnt sie direkt: In beiden Feldern sind die vier Ecken markiert, und ein Ballwechsel, der direkt mit einem Treffer in einer Zone endet, zählt doppelt. Plötzlich lohnt es sich, den Ball zwei Handbreit genauer zu spielen.',
      'Gleichzeitig lehrt die Spielform kluges Risiko: Wer nur noch auf die Zonen jagt, produziert Ausbälle — die Variante mit Minuspunkt für Aus macht diesen Zielkonflikt explizit. So entsteht genau die Abwägung, die auch im Wettkampf zu treffen ist: Sicherheit gegen Punktgewinn.',
    ],
    skizze: {
      spieler: [
        { pos: { x: 3.35, y: 3.05 }, label: 'A' },
        { pos: { x: 10.0, y: 3.05 }, label: 'B', partei: 'b' },
      ],
      zonen: [
        { x: 12.74, y: 0.46, b: 0.6, h: 0.6, label: '2×' },
        { x: 12.74, y: 5.04, b: 0.6, h: 0.6, label: '2×' },
        { x: 6.8, y: 0.46, b: 0.6, h: 0.6, label: '2×' },
        { x: 6.8, y: 5.04, b: 0.6, h: 0.6, label: '2×' },
      ],
      hinweis:
        'Die vier Ecken (in beiden Feldern markiert) zählen doppelt, wenn der Ballwechsel direkt dort endet — Präzision wird belohnt.',
    },
  },
}

export const taktikDoppelDetails: Record<string, UebungsDetails> = {
  'td-01': {
    beschreibung: [
      'Die Formationsfrage entscheidet jedes Doppel: Im Angriff steht das Paar hintereinander (vorne/hinten), in der Abwehr nebeneinander — und der Wechsel zwischen beiden Formationen muss automatisch ablaufen. Die Grundregel: Wer den Shuttle hochspielt, gibt den Angriff ab und stellt sofort auf nebeneinander um; wer den hohen Ball bekommt, übernimmt die Angriffsformation.',
      'In dieser Übung spielen zwei Paare kooperativ und wechseln die Formationen im Dauerbetrieb, anfangs ohne Punkte und mit lauten Ansagen („Angriff!" / „Abwehr!"). Die Kommandos wirken zunächst übertrieben, verankern die Umschaltmomente aber zuverlässig — bis die Rotation auch im freien Spiel ohne Nachdenken läuft.',
    ],
    skizze: {
      spieler: [
        { pos: { x: 5.0, y: 3.05 }, label: 'A1' },
        { pos: { x: 2.2, y: 3.05 }, label: 'A2' },
        { pos: { x: 10.3, y: 1.7 }, label: 'B1', partei: 'b' },
        { pos: { x: 10.3, y: 4.4 }, label: 'B2', partei: 'b' },
      ],
      laufwege: [
        { von: { x: 5.0, y: 3.05 }, bis: { x: 3.6, y: 1.8 }, gebogen: true },
        { von: { x: 2.2, y: 3.05 }, bis: { x: 3.6, y: 4.3 }, gebogen: true },
      ],
      hinweis:
        'Paar A greift an (vorne/hinten), Paar B verteidigt (nebeneinander). Hebt A den Shuttle, wechselt A sofort in die Abwehrformation (Pfeile).',
    },
  },
  'td-02': {
    beschreibung: [
      'Der Ball durch die Mitte ist im Doppel der häufigste „Geschenkpunkt": Beide schlagen gleichzeitig — oder beide lassen. Die Lösung ist eine klare Regel plus Kommunikation: In der Abwehr nimmt grundsätzlich die Person, auf deren VORHANDseite der Shuttle kommt, und die Ansage „mein!" fällt VOR dem Treffpunkt.',
      'Das Zuspiel zielt in dieser Übung gezielt zwischen die beiden Abwehrspieler, damit der Klärungsfall wieder und wieder eintritt. Später mischt der Zuspieler auch Außen- und kurze Bälle dazu — die Zuständigkeit bleibt trotzdem jedes Mal anzusagen. So wird aus der Regel ein Reflex.',
    ],
    skizze: {
      spieler: [
        { pos: { x: 3.3, y: 1.7 }, label: 'A1' },
        { pos: { x: 3.3, y: 4.4 }, label: 'A2' },
        { pos: { x: 9.5, y: 3.05 }, label: 'Z', partei: 'b' },
      ],
      zonen: [{ x: 1.6, y: 2.55, b: 3.4, h: 1.0, label: 'Mitte?' }],
      shuttlewege: [{ von: { x: 9.2, y: 3.05 }, bis: { x: 3.2, y: 3.05 } }],
      hinweis:
        'Z spielt bewusst zwischen A1 und A2 — es nimmt, wessen Vorhandseite getroffen wird, und die Ansage „mein!" kommt vor dem Treffpunkt.',
    },
  },
  'td-03': {
    beschreibung: [
      'Im Doppel entscheiden die ersten drei Schläge über den Angriff: kurzer Aufschlag, Return, dritter Ball. Wer den dritten Ball plant — flach auf die Mitte oder hinter den ans Netz gerückten Returnspieler — erobert den Angriff; wer ihn hoch spielt, schenkt ihn her. Genau diese Sequenz wird hier in Serie trainiert.',
      'Aufschlag- und Returnpaar stehen in echter Doppelaufstellung, nach dem geplanten dritten Ball wird der Punkt frei ausgespielt. Gezählt wird, wie oft das aufschlagende Paar den Angriff erobert — eine ehrliche Kennzahl für die Qualität von Aufschlag und Drittball-Plan. Der Aufschläger lernt dabei das Wichtigste: sofort nach dem Aufschlag Schläger hoch, Gewicht auf die Ballen.',
    ],
    skizze: {
      spieler: [
        { pos: { x: 4.1, y: 1.9 }, label: 'A1' },
        { pos: { x: 2.3, y: 3.05 }, label: 'A2' },
        { pos: { x: 8.9, y: 2.2 }, label: 'B1', partei: 'b' },
        { pos: { x: 10.8, y: 3.6 }, label: 'B2', partei: 'b' },
      ],
      shuttlewege: [
        { von: { x: 4.4, y: 1.9 }, bis: { x: 8.8, y: 2.7 } },
        { von: { x: 8.9, y: 2.0 }, bis: { x: 5.7, y: 2.2 } },
        { von: { x: 5.8, y: 2.5 }, bis: { x: 9.7, y: 3.2 } },
      ],
      hinweis:
        '① Kurzer Aufschlag, ② Return, ③ geplanter dritter Ball flach auf die Mitte — danach wird der Punkt frei ausgespielt.',
    },
  },
  'td-04': {
    beschreibung: [
      'Angriff im Doppel ist Arbeitsteilung: Die hintere Person erzeugt mit Smashes und schnellen Drops Dauerdruck, die vordere lauert am Netz und tötet alles, was kurz und hoch zurückkommt. Der Angriff lebt, solange der Shuttle nach unten gespielt wird — diese Übung trainiert, ihn am Leben zu halten.',
      'Das Abwehrpaar darf nur flach oder hoch zurückspielen, nicht selbst angreifen, sodass das Angriffspaar die Formation lange halten kann. Gemessen wird die Angriffsdauer in Ballwechseln. Zwei typische Fehler werden dabei sichtbar: der Netzspieler, der nach hinten ausweicht und dem Partner die Bälle stiehlt — und der Dauer-Vollgas-Smash, der ohne Drop-Wechsel schnell ausrechenbar ist.',
    ],
    skizze: {
      spieler: [
        { pos: { x: 5.2, y: 3.05 }, label: 'A1' },
        { pos: { x: 2.0, y: 3.05 }, label: 'A2' },
        { pos: { x: 10.5, y: 1.7 }, label: 'B1', partei: 'b' },
        { pos: { x: 10.5, y: 4.4 }, label: 'B2', partei: 'b' },
      ],
      zonen: [{ x: 4.72, y: 0.46, b: 1.98, h: 5.18, label: 'Zone A1' }],
      shuttlewege: [
        { von: { x: 2.2, y: 2.7 }, bis: { x: 10.3, y: 2.0 } },
        { von: { x: 5.4, y: 3.4 }, bis: { x: 7.8, y: 4.0 } },
      ],
      hinweis:
        'A2 hält mit Smash/Drop den Druck aus dem Hinterfeld, A1 gehört das vordere Drittel: alles Kurze abfangen, hohe Netzbälle töten.',
    },
  },
  'td-05': {
    beschreibung: [
      'Doppelabwehr ist Teamarbeit unter Beschuss: Beide stehen nebeneinander, jede:r verantwortet die eigene Feldhälfte, und Smashes werden flach geblockt statt panisch hochgeschlagen. Der Drill stellt diese Situation in Reinform her — ein Smasher mit Shuttle-Korb greift im Wechsel beide Seiten an.',
      'Die Abwehr steht tief (Rückhandgriff, Schläger vor der Hüfte) und blockt ins Vorfeld oder kontert ins Mittelfeld. Typische Schwäche: Das Paar rückt unter Druck unbewusst zur Mitte zusammen und öffnet die Außenbahnen — dagegen hilft die Merkregel, die eigenen Füße an der Seitenbahn zu „verankern". Die Variante mit eingestreuten Drops zwingt zusätzlich zum Lösen nach vorn.',
    ],
    skizze: {
      spieler: [
        { pos: { x: 3.6, y: 1.7 }, label: 'A1' },
        { pos: { x: 3.6, y: 4.4 }, label: 'A2' },
        { pos: { x: 11.4, y: 3.05 }, label: 'B', partei: 'b' },
      ],
      shuttlewege: [
        { von: { x: 11.2, y: 2.7 }, bis: { x: 3.9, y: 1.8 } },
        { von: { x: 11.2, y: 3.4 }, bis: { x: 3.9, y: 4.3 } },
        { von: { x: 3.8, y: 2.1 }, bis: { x: 7.6, y: 2.5 } },
      ],
      hinweis:
        'B smasht im Wechsel auf beide Seiten; A1/A2 halten nebeneinander die Breite und blocken flach ins Vorfeld.',
    },
  },
  'td-06': {
    beschreibung: [
      'Der Return gegen den kurzen Doppel-Aufschlag ist eine Angriffswaffe — wenn er früh genommen wird. Der Returnspieler steht so nah wie erlaubt an der vorderen Aufschlaglinie, der Schläger ist oben, und der erste Schritt geht nach VORN: Treffpunkt über Netzhöhe, Return auf den Körper des Aufschlägers, auf den T-Punkt oder als Stopp hinter das Netz.',
      'Nach dem Return wird der Punkt ausgespielt; gezählt wird, wie oft das Returnpaar in den ersten zwei Schlägen den Angriff übernimmt. Wichtig ist die Zielmischung — wer immer dasselbe Ziel wählt, wird ausgerechnet. Die schwere Variante mit eingestreutem Swip/Flick hält den Returnspieler ehrlich: Wer zu früh nach vorn stürmt, wird überspielt.',
    ],
    skizze: {
      spieler: [
        { pos: { x: 5.0, y: 2.0 }, label: 'A1' },
        { pos: { x: 2.5, y: 3.5 }, label: 'A2' },
        { pos: { x: 9.0, y: 2.0 }, label: 'B1', partei: 'b' },
        { pos: { x: 11.0, y: 3.2 }, label: 'B2', partei: 'b' },
      ],
      shuttlewege: [
        { von: { x: 8.8, y: 2.0 }, bis: { x: 5.4, y: 2.2 } },
        { von: { x: 5.3, y: 2.0 }, bis: { x: 8.9, y: 2.6 } },
        { von: { x: 5.3, y: 1.7 }, bis: { x: 7.2, y: 1.4 } },
      ],
      hinweis:
        'B1 serviert kurz, A1 attackiert den Return früh über Netzhöhe: auf den Körper, den T-Punkt oder als Stopp hinters Netz.',
    },
  },
  'td-07': {
    beschreibung: [
      'Stumme Doppel verlieren gegen laute: Diese Spielform macht Kommunikation zur Regel. Vor jedem eigenen Schlag muss „mein!" gerufen werden, beim Überlassen „dein!" — fehlt die Ansage, geht der Punkt an die Gegenseite. Was zunächst künstlich wirkt, baut in kürzester Zeit die Gewohnheit auf, die später in jeder Drucksituation trägt.',
      'Die Form eignet sich besonders für neue Paarungen und Schulgruppen, weil sie das häufigste Anfängerproblem (beide schlagen / beide lassen) direkt an der Wurzel packt. Die Auswertung nach jedem Satz — wo gab es stumme Zonen? — lenkt den Blick auf die kritischen Bereiche, allen voran die Mitte.',
    ],
    skizze: {
      spieler: [
        { pos: { x: 3.3, y: 1.7 }, label: 'A1' },
        { pos: { x: 3.3, y: 4.4 }, label: 'A2' },
        { pos: { x: 10.1, y: 1.7 }, label: 'B1', partei: 'b' },
        { pos: { x: 10.1, y: 4.4 }, label: 'B2', partei: 'b' },
      ],
      zonen: [{ x: 1.6, y: 2.55, b: 3.4, h: 1.0, label: '„mein!"' }],
      hinweis:
        'Normales Doppel mit Ansage-Pflicht: Vor jedem Schlag „mein!", beim Überlassen „dein!" — ohne Ansage geht der Punkt an die Gegenseite.',
    },
  },
  'td-08': {
    beschreibung: [
      'Im Mixed (und zunehmend auch im normalen Doppel) gibt es eine bewusste Dauer-Rollenteilung: Eine Person kontrolliert permanent das Vorfeld zwischen Netz und T-Linie, die andere deckt Mittel- und Hinterfeld. Diese Übung lässt beide Rollen erleben und klärt die Zuständigkeiten an der kritischen Übergangszone.',
      'Die Vorfeldperson stoppt und tötet alles Kurze und weicht niemals nach hinten aus — hinten ist Partnerzone, und der Blick bleibt konsequent nach vorn gerichtet (Vertrauen!). Die hintere Person sichert die Länge, greift diagonal an und deckt den Lob über das Vorfeld ab. Der Rollentausch nach jeder Runde gehört dazu: Wer beide Perspektiven kennt, versteht die Lücken des Gegners.',
    ],
    skizze: {
      spieler: [
        { pos: { x: 5.4, y: 3.05 }, label: 'A1' },
        { pos: { x: 2.2, y: 3.05 }, label: 'A2' },
        { pos: { x: 10.3, y: 1.7 }, label: 'B1', partei: 'b' },
        { pos: { x: 10.3, y: 4.4 }, label: 'B2', partei: 'b' },
      ],
      zonen: [
        { x: 4.72, y: 0.46, b: 1.98, h: 5.18, label: 'A1: Vorfeld' },
        { x: 0.46, y: 0.46, b: 4.26, h: 5.18, label: 'A2: Mittel-/Hinterfeld' },
      ],
      hinweis:
        'Feste Rollen: A1 bleibt zwischen Netz und T-Linie (kurze Bälle töten/stoppen), A2 sichert dahinter Länge und Diagonalangriff.',
    },
  },
}
