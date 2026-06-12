/** Spielformen — 7 Übungen. Material-Konvention siehe aufwaermen.ts. */
import type { Uebung } from '../../datenmodell'

export const spielformen: Uebung[] = [
  {
    id: 'sf-01',
    name: 'Halbfeld-Einzel',
    kategorie: 'spielformen',
    skills: ['taktik_einzel', 'clear', 'drop'],
    niveau: ['anfaenger', 'fortgeschritten', 'leistung'],
    dauerMin: 15,
    personen: 'paar',
    material: [],
    kurzbeschreibung:
      'Einzel auf dem längs halbierten Feld — weniger Fläche, mehr Präzision, doppelt so viele Spielende pro Halle.',
    durchfuehrung: [
      'Feld längs teilen (Mittellinie bis Grundlinie, eine Seitenbahn zählt mit) — zwei Spiele pro Court möglich.',
      'Sätze bis 11 mit normalen Regeln; Aufschlag immer von hinten, kurz diagonal entfällt.',
      'Taktischer Fokus: Länge-kurz-Wechsel auf schmaler Bahn — Präzision schlägt Kraft.',
      '2–3 Sätze, danach Gegnerwechsel über die Felder hinweg.',
    ],
    variationen: [
      'Leichter: Shuttle darf einmal aufticken (reine Anfängergruppen).',
      'Schwerer: nur Schläge hinter die Aufschlaglinie und vor die Netz-Zone erlaubt (Mittelfeld gesperrt).',
    ],
    fehlerbilder: [
      'Spiel verkommt zum Clear-Pingpong → Zwischenziel ausrufen: mindestens jeder dritte Ball kurz.',
    ],
  },
  {
    id: 'sf-02',
    name: 'Kaiserspiel',
    kategorie: 'spielformen',
    skills: ['taktik_einzel', 'ausdauer'],
    niveau: ['anfaenger', 'fortgeschritten', 'leistung'],
    dauerMin: 20,
    personen: 'gruppe',
    material: [],
    kurzbeschreibung:
      'Der Klassiker für Gruppen: Auf- und Abstieg über mehrere Felder — jede Runde zählt, niemand sitzt lange.',
    durchfuehrung: [
      'Alle Felder der Halle nummerieren: Feld 1 ist das „Kaiserfeld", das letzte das Einstiegsfeld.',
      'Auf allen Feldern gleichzeitig Einzel (oder Doppel) auf Zeit: 3 Minuten pro Runde.',
      'Rundenende per Pfiff: Gewinner steigen ein Feld auf, Verlierer ein Feld ab; bei Überzahl wartet die nächste Person am Einstiegsfeld und rotiert hinein.',
      '5–6 Runden; wer am Ende auf dem Kaiserfeld steht, ist Tageskaiser:in.',
    ],
    variationen: [
      'Leichter: Halbfelder verwenden — doppelt so viele Plätze, kürzere Wege.',
      'Schwerer: auf dem Kaiserfeld zählen nur Angriffspunkte doppelt (motiviert offensives Spiel).',
    ],
    fehlerbilder: [
      'Lange Diskussionen beim Wechsel kosten Spielzeit → klare Regel: Bei Gleichstand entscheidet der nächste Punkt („Sudden Death").',
    ],
  },
  {
    id: 'sf-03',
    name: '3-gegen-3-Rotation',
    kategorie: 'spielformen',
    skills: ['taktik_doppel', 'beinarbeit'],
    niveau: ['anfaenger', 'fortgeschritten'],
    dauerMin: 15,
    personen: 'gruppe',
    material: [],
    kurzbeschreibung:
      'Drei gegen drei auf dem Doppelfeld mit Pflicht-Rotation nach jedem Ballwechsel — alle bleiben in Bewegung.',
    durchfuehrung: [
      'Pro Seite drei Personen: zwei auf dem Feld (vorne/hinten), eine wartet neben dem Feld.',
      'Nach jedem Ballwechsel rotiert die Seite, die den Punkt abgegeben hat: Wartende:r kommt für die vordere Position hinein, hintere Person rückt vor, Feldspieler:in geht raus.',
      'Sätze bis 15; durch die Rotation spielen alle beide Positionen.',
    ],
    variationen: [
      'Leichter: Rotation nur bei eigenem Aufschlagverlust.',
      'Schwerer: Rotation nach JEDEM Ballwechsel auf beiden Seiten — maximale Wechseldichte.',
    ],
    fehlerbilder: [
      'Wechsel wird verschlafen, Lücken entstehen → Einlaufende:r ruft laut „drin!", erst dann Aufschlag.',
    ],
  },
  {
    id: 'sf-04',
    name: 'Brennball-Badminton',
    kategorie: 'spielformen',
    skills: ['aufschlag', 'ausdauer'],
    niveau: ['anfaenger'],
    dauerMin: 20,
    personen: 'gruppe',
    material: ['Matten oder Reifen (Laufstationen)', 'Kiste/Box'],
    kurzbeschreibung:
      'Das Schulspiel im Badminton-Gewand: Aufschlag ins Feld, Stationenlauf, Feldteam „verbrennt" — Aufschlagtraining inklusive.',
    durchfuehrung: [
      'Zwei Teams: Laufteam an der Grundlinie mit Schlägern, Feldteam verteilt in der Hallenhälfte; 4–5 Laufstationen (Matten) im Rund auslegen.',
      'Laufteam: Person schlägt den Shuttle per Aufschlag (lang!) in die Hallenhälfte und läuft los; Halt nur auf Stationen.',
      'Feldteam: Shuttle holen und in die Brennbox bringen — wer dann zwischen Stationen steht, ist „verbrannt" (Minuspunkt/zurück zum Start).',
      'Vollständige Runde = 1 Punkt; nach 8–10 Aufschlägen Teams tauschen; 2 Durchgänge.',
    ],
    variationen: [
      'Leichter: Shuttle darf geworfen statt geschlagen werden.',
      'Schwerer: Nur Aufschläge, die hinter der Mittellinie landen, erlauben Loslaufen — sonst nächste Person.',
    ],
    fehlerbilder: [
      'Aufschläge gehen flach ins Aus, Frust beim Laufteam → kurz die lange Aufschlagtechnik zeigen (von tief nach hoch durchschwingen).',
    ],
  },
  {
    id: 'sf-05',
    name: 'Kurzsatz-Karussell (jeder gegen jeden)',
    kategorie: 'spielformen',
    skills: ['taktik_einzel'],
    niveau: ['anfaenger', 'fortgeschritten', 'leistung'],
    dauerMin: 20,
    personen: 'gruppe',
    material: [],
    kurzbeschreibung:
      'Viele kurze Sätze, ständig neue Gegner — Wettkampfgefühl für die ganze Gruppe ohne lange Wartezeiten.',
    durchfuehrung: [
      'Alle verfügbaren (Halb-)Felder nutzen; Sätze bis 7 Punkte, kein Verlängern.',
      'Nach jedem Satz rotieren die Gewinner im Uhrzeigersinn, die anderen bleiben — so mischen sich die Paarungen automatisch.',
      '15 Minuten Karussell; jede Person zählt ihre gewonnenen Sätze.',
      'Abschluss: Wer hat die meisten Satzgewinne? Kurze Siegerehrung.',
    ],
    variationen: [
      'Leichter: bei großen Gruppen Doppel statt Einzel — halbiert die Wartezeit.',
      'Schwerer: Vorgabe-Regel — wer 3 Siege in Folge hat, startet künftig mit 0:2.',
    ],
    fehlerbilder: [
      'Starke spielen nur gegen Starke, Schwache verlieren die Lust → Rotationsrichtung gelegentlich umkehren oder per Los mischen.',
    ],
  },
  {
    id: 'sf-06',
    name: 'Nur-kurz-Spiel (Drop & Lob)',
    kategorie: 'spielformen',
    skills: ['netzspiel', 'drop'],
    niveau: ['anfaenger', 'fortgeschritten', 'leistung'],
    dauerMin: 12,
    personen: 'paar',
    material: [],
    kurzbeschreibung:
      'Spielform mit gesperrtem Hinterfeld-Angriff: nur Drops, Netzdrops und Lobs — das Vorfeldspiel wird zum Punktelieferant.',
    durchfuehrung: [
      'Einzel im ganzen Feld, aber Smashes und Drives sind verboten; erlaubt: Clear, Drop, Netzdrop, Lob.',
      'Sätze bis 11; verbotener Schlag = Punkt für die Gegenseite.',
      'Taktischer Kern: Mit engen Netzdrops Druck aufbauen, mit präzisen Lobs auflösen.',
    ],
    variationen: [
      'Leichter: auch Clears verbieten → reines Vorfeldspiel auf Halbfeld.',
      'Schwerer: Netzdrops zählen nur, wenn sie vor der Aufschlaglinie landen.',
    ],
    fehlerbilder: [
      'Lobs landen im Mittelfeld und würden im echten Spiel totgesmashed → Lob-Qualität laut bewerten („wäre durch!").',
    ],
  },
  {
    id: 'sf-07',
    name: 'Doppel-König: Gewinner bleiben',
    kategorie: 'spielformen',
    skills: ['taktik_doppel'],
    niveau: ['anfaenger', 'fortgeschritten', 'leistung'],
    dauerMin: 20,
    personen: 'gruppe',
    material: [],
    kurzbeschreibung:
      'Schnelle Doppel-Spielform: Das Gewinnerpaar bleibt auf dem Feld, Herausforderer rücken nach.',
    durchfuehrung: [
      'Ein Feld ist das Königsfeld; wartende Paare stellen sich an der Seitenlinie an.',
      'Kurzsätze bis 7: Gewinnerpaar bleibt, Verliererpaar reiht sich hinten ein, nächstes Paar kommt sofort.',
      'Bleibt ein Paar dreimal in Folge König, bekommt es einen Stern und tritt ab (verhindert Dauerblockade).',
      '15–20 Minuten; Sterne zählen am Ende.',
    ],
    variationen: [
      'Leichter: Paare nach jedem Durchgang neu mischen (Sozialfaktor).',
      'Schwerer: Herausforderer starten mit 2:0-Führung — Könige unter Druck.',
    ],
    fehlerbilder: [
      'Wartende stehen kalt herum → Wartezone aktiv gestalten: Schattenbadminton oder Drive-Duell neben dem Feld.',
    ],
  },
]
