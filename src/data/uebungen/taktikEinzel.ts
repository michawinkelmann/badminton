/** Taktik Einzel — 8 Übungen. Material-Konvention siehe aufwaermen.ts. */
import type { Uebung } from '../../datenmodell'

export const taktikEinzel: Uebung[] = [
  {
    id: 'te-01',
    name: 'Lang-kurz-Muster spielen',
    kategorie: 'taktik_einzel',
    skills: ['taktik_einzel', 'clear', 'drop'],
    niveau: ['anfaenger', 'fortgeschritten'],
    dauerMin: 12,
    personen: 'paar',
    material: [],
    kurzbeschreibung:
      'Das Ur-Muster des Einzels: Gegner mit Clear nach hinten schicken, mit Drop nach vorn ziehen.',
    durchfuehrung: [
      'Person A spielt nur lang (Clear/Lob), Person B antwortet im festen Muster: auf hohe Bälle Drop, auf kurze Bälle Lob.',
      '5 Minuten Muster spielen, dann Rollen tauschen.',
      'Fokus für B: jeden Drop bewusst platzieren; Fokus für A: jeden Ball erlaufen und hoch klären.',
      'Abschluss: 2 Minuten frei — Muster darf, muss aber nicht gebrochen werden.',
    ],
    variationen: [
      'Leichter: nur Halbfeld längs, geworfene Zuspiele bei Anfängern.',
      'Schwerer: B darf zusätzlich überraschend angreifen (Smash), wenn der Lob zu kurz kommt.',
    ],
    fehlerbilder: [
      'Drops werden aus Bequemlichkeit ins Mittelfeld gespielt → Ziel: vor der Aufschlaglinie; Mittelfeld-Drops zählen als Fehler.',
      'Nach dem eigenen Schlag bleibt A stehen → konsequent zur Mitte zurückarbeiten, sonst läuft das Muster ins Leere.',
    ],
  },
  {
    id: 'te-02',
    name: 'Gegner aus der Mitte spielen',
    kategorie: 'taktik_einzel',
    skills: ['taktik_einzel'],
    niveau: ['fortgeschritten', 'leistung'],
    dauerMin: 15,
    personen: 'paar',
    material: [],
    kurzbeschreibung:
      'Freie Flächen erkennen und konsequent in die vom Gegner entfernteste Ecke spielen.',
    durchfuehrung: [
      'Normales Einzel im ganzen Feld, aber mit einer Regel: Jeder Schlag muss in die Ecke, die am weitesten vom Gegner entfernt ist.',
      'Partner gibt nach jedem Ballwechsel kurz Feedback: Welche Ecke wäre frei gewesen?',
      '3 Sätze bis 7 Punkte; ein bewusst „falsch" platzierter Ball gibt dem Gegner den Punkt.',
    ],
    variationen: [
      'Leichter: Spielfeld auf Dreiviertelfeld verkleinern, Tempo herausnehmen.',
      'Schwerer: zusätzlich Tempo-Wechsel einbauen — zweimal langsam aufbauen, dann beschleunigen.',
    ],
    fehlerbilder: [
      'Es wird auf den Gegner statt von ihm weg gespielt → vor dem Schlag bewusst die Position des Gegners wahrnehmen („Kopf hoch").',
    ],
    animationId: 'anim-einzel-position',
  },
  {
    id: 'te-03',
    name: 'Aufschlag-Folgeschlag-Ketten',
    kategorie: 'taktik_einzel',
    skills: ['taktik_einzel', 'aufschlag'],
    niveau: ['fortgeschritten', 'leistung'],
    dauerMin: 12,
    personen: 'paar',
    material: [],
    kurzbeschreibung:
      'Den dritten Ball planen: Aufschlag und Folgeschlag als einstudierte Kette statt zufälliger Reaktion.',
    durchfuehrung: [
      'Kette 1 (10 Wiederholungen): kurzer Aufschlag → Return auf das Netz → geplanter Netzdrop oder Lob je nach Return-Höhe.',
      'Kette 2 (10 Wiederholungen): hoher Aufschlag → Drop-Return → geplanter Gegen-Drop oder Lob aus dem Lauf.',
      'Returnspieler spielt zunächst kooperativ, dann zunehmend variabel.',
      'Auswertung: Welche Kette bringt die meisten neutralen/vorteilhaften dritten Bälle?',
    ],
    variationen: [
      'Leichter: Return-Art fest verabreden.',
      'Schwerer: ab dem dritten Ball Punkt frei ausspielen.',
    ],
    fehlerbilder: [
      'Nach dem Aufschlag Zuschauen statt Bereitschaft → direkt nach dem Aufschlag in die Grundposition, Schläger vor den Körper.',
    ],
  },
  {
    id: 'te-04',
    name: 'Halbfeld-Einzel nur lang',
    kategorie: 'taktik_einzel',
    skills: ['taktik_einzel', 'clear', 'ausdauer'],
    niveau: ['anfaenger', 'fortgeschritten'],
    dauerMin: 12,
    personen: 'paar',
    material: [],
    kurzbeschreibung:
      'Einzel auf dem längs halbierten Feld, nur Längenspiel erlaubt — schult Geduld und Clear-Qualität.',
    durchfuehrung: [
      'Feld längs halbieren (Mittellinie + eine Seitenbahn), erlaubt sind nur Bälle hinter die Aufschlaglinie „lang".',
      'Sätze bis 11 Punkte; jeder Ball, der vor der hinteren Zone landet, gibt dem Gegner den Punkt.',
      'Zwischen den Sätzen 1 Minute Pause mit Mini-Analyse: Wer hat zuerst die Länge verloren?',
    ],
    variationen: [
      'Leichter: Zone vergrößern (ab Feldmitte zählt „lang").',
      'Schwerer: nur Überkopf-Clears erlaubt, Unterhand-Befreiungen geben den Punkt ab.',
    ],
    fehlerbilder: [
      'Clears werden unter Ermüdung flach → bewusst neu „aufladen": Stellung korrigieren, Höhe übertreiben.',
    ],
  },
  {
    id: 'te-05',
    name: 'Vorfeld-Druck nach kurzem Ball',
    kategorie: 'taktik_einzel',
    skills: ['taktik_einzel', 'netzspiel'],
    niveau: ['fortgeschritten', 'leistung'],
    dauerMin: 12,
    personen: 'paar',
    material: [],
    kurzbeschreibung:
      'Nach jedem eigenen kurzen Ball ans Netz nachrücken und den Gegner unter Druck setzen.',
    durchfuehrung: [
      'Spielform im ganzen Feld: Nach jedem eigenen Drop oder Netzdrop MUSS bis an die T-Linie nachgerückt werden.',
      'Partner versucht, mit Lob oder Gegen-Drop aufzulösen; Punkt wird normal ausgespielt.',
      '3 Sätze bis 7; wer nach kurzem Ball hinten stehen bleibt, verliert den Punkt automatisch (Selbstkontrolle/Beobachter).',
    ],
    variationen: [
      'Leichter: Muster kooperativ ohne Punkte spielen.',
      'Schwerer: Nachrücken zusätzlich mit angedeuteter Kill-Drohung — Gegner muss präzise loben.',
    ],
    fehlerbilder: [
      'Nachrücken halbherzig bis Mittelfeld → klare Marke setzen: Fuß auf die T-Linie.',
      'Beim Nachrücken Schläger unten → Schlägerkopf über Netzkante mitführen (Kill-Bereitschaft).',
    ],
  },
  {
    id: 'te-06',
    name: 'Konterspiel gegen Angriff',
    kategorie: 'taktik_einzel',
    skills: ['taktik_einzel', 'drive'],
    niveau: ['leistung'],
    dauerMin: 12,
    personen: 'paar',
    material: [],
    kurzbeschreibung:
      'Aus der Abwehr gezielt flach kontern statt nur hoch zu befreien — den Angriff des Gegners entwerten.',
    durchfuehrung: [
      'Person A greift durchgehend an (Smash/Drop aus dem Hinterfeld), Person B verteidigt mit Auftrag: jeden zweiten Ball flach kontern (Block-Drive ins Mittelfeld oder Konter-Drive die Linie entlang).',
      '5 Minuten, dann Rollenwechsel.',
      'Auswertung: Nach welchen Kontern musste A die Angriffsposition aufgeben?',
    ],
    variationen: [
      'Leichter: A smasht mit reduziertem Tempo auf den Körper.',
      'Schwerer: B kündigt nichts an und mischt Block, Konter und Lob frei — A muss lesen.',
    ],
    fehlerbilder: [
      'Konter aus zu tiefem Treffpunkt erzwungen → tiefe Bälle weiter hoch befreien; Konter nur bei hüfthohem Treffpunkt.',
    ],
  },
  {
    id: 'te-07',
    name: 'Aufgaben-Sätze mit Geheimauftrag',
    kategorie: 'taktik_einzel',
    skills: ['taktik_einzel'],
    niveau: ['fortgeschritten', 'leistung'],
    dauerMin: 15,
    personen: 'paar',
    material: ['Aufgabenkarten (Zettel)'],
    kurzbeschreibung:
      'Beide Spieler ziehen einen geheimen Taktik-Auftrag und versuchen, ihn im Satz umzusetzen — Gegner-Lesen inklusive.',
    durchfuehrung: [
      'Aufträge auf Zettel schreiben, z. B.: „Greife nur über die Rückhandseite an", „Spiele jeden 3. Ball kurz", „Gewinne 3 Punkte am Netz".',
      'Beide ziehen verdeckt einen Auftrag und spielen einen Satz bis 11.',
      'Nach dem Satz: Gegner rät den Auftrag; richtiges Raten gibt 2 Bonuspunkte.',
      '2–3 Sätze mit neuen Aufträgen.',
    ],
    variationen: [
      'Leichter: einfache Aufträge („Gewinne einen Punkt mit Drop").',
      'Schwerer: zwei Aufträge gleichzeitig; oder Auftrag nur über Schlagverteilung erfüllbar.',
    ],
    fehlerbilder: [
      'Auftrag wird mit Brechstange erzwungen und verrät sich sofort → Aufträge in normale Spielzüge einweben (Timing!).',
    ],
  },
  {
    id: 'te-08',
    name: 'Zonen-Einzel: Präzision unter Druck',
    kategorie: 'taktik_einzel',
    skills: ['taktik_einzel', 'clear', 'drop'],
    niveau: ['anfaenger', 'fortgeschritten', 'leistung'],
    dauerMin: 15,
    personen: 'paar',
    material: ['Klebeband (Zielzonen)'],
    kurzbeschreibung:
      'Einzel mit Bonus-Zonen: Treffer in markierte Ecken zählen doppelt — Präzision wird belohnt.',
    durchfuehrung: [
      'In beiden Feldern die vier Ecken (je ca. 60 × 60 cm) mit Klebeband markieren.',
      'Normales Einzel bis 15 Punkte: Gewinnt ein Schlag den Ballwechsel direkt in einer Zone, zählt er 2 Punkte.',
      'Zwischenstand laut mitzählen; 2–3 Sätze.',
    ],
    variationen: [
      'Leichter: Zonen vergrößern; Zonenpunkte auch bei Bodenkontakt nach Netzroller.',
      'Schwerer: nur noch Zonentreffer zählen überhaupt (alles andere 0).',
    ],
    fehlerbilder: [
      'Zonenjagd um jeden Preis mit vielen Ausbällen → Regel ergänzen: Aus = minus 1; kluges Risiko trainieren.',
    ],
  },
]
