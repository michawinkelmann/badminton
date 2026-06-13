/**
 * Regeln & Glossar (statisches Wissen, §-Erweiterung).
 * Quellen: BWF Laws of Badminton; Beschluss zur 3×15-Zählweise (gültig ab Januar 2027).
 */

export interface RegelAbschnitt {
  id: string
  titel: string
  absaetze: string[]
  punkte?: string[]
}

export interface GlossarEintrag {
  begriff: string
  erklaerung: string
  /** Verweis auf eine Animation der Bewegungslehre, falls vorhanden. */
  animationId?: string
}

export const REGEL_ABSCHNITTE: RegelAbschnitt[] = [
  {
    id: 'spielidee',
    titel: 'Spielidee & Zählweise (aktuell: 2×21)',
    absaetze: [
      'Badminton wird auf Zeitgewinn gespielt: Der Shuttle darf den Boden nicht berühren, jeder Ballwechsel bringt einen Punkt (Rally-Point-System) — egal, wer aufgeschlagen hat.',
    ],
    punkte: [
      'Ein Match gewinnt, wer zuerst zwei Sätze gewonnen hat (Best of 3).',
      'Ein Satz geht bis 21 Punkte.',
      'Bei 20:20 geht es in die Verlängerung: Es gewinnt, wer zuerst 2 Punkte Vorsprung hat.',
      'Kappung bei 30: Bei 29:29 entscheidet der nächste Punkt (30:29).',
      'Seitenwechsel nach jedem Satz — und im dritten Satz zusätzlich, sobald eine Seite 11 Punkte erreicht.',
      'Pausen: 60 Sekunden bei 11 Punkten im Satz, 120 Sekunden zwischen den Sätzen.',
    ],
  },
  {
    id: 'neue-zaehlweise',
    titel: 'Neue Zählweise ab 2027: 3×15',
    absaetze: [
      'Der Weltverband BWF hat 2026 mit großer Mehrheit (82 %) eine neue Zählweise beschlossen. Sie gilt ab Januar 2027 zunächst für internationale Turniere; nationale Verbände entscheiden selbst, ob und wann sie nachziehen.',
      'Im Turnierplaner kannst du die neue Zählweise schon heute über das Preset „Neu 3×15 (ab 2027)" verwenden — gut zum Ausprobieren und Eingewöhnen.',
    ],
    punkte: [
      'Weiterhin Best of 3: Zwei Gewinnsätze entscheiden das Match.',
      'Ein Satz geht jetzt bis 15 Punkte (statt 21).',
      'Bei 14:14 geht es in die Verlängerung: 2 Punkte Vorsprung nötig.',
      'Kappung bei 21: Bei 20:20 entscheidet der nächste Punkt (21:20).',
      'Rally-Point bleibt: Jeder Ballwechsel zählt.',
    ],
  },
  {
    id: 'aufschlag',
    titel: 'Aufschlag',
    absaetze: [
      'Der Aufschlag wird immer diagonal in das gegenüberliegende Aufschlagfeld gespielt. Von wo aufgeschlagen wird, bestimmt der eigene Punktestand:',
    ],
    punkte: [
      'Eigener Punktestand gerade (0, 2, 4 …): Aufschlag von rechts. Ungerade (1, 3, 5 …): von links.',
      'Der Shuttle muss unterhalb der Taille getroffen werden; der Schlägerkopf zeigt beim Treffpunkt nach unten (international gilt alternativ die feste 1,15-m-Treffhöhe).',
      'Beide Füße müssen beim Aufschlag den Boden berühren und dürfen die Linien nicht berühren.',
      'Einzel: Macht der Aufschläger den Punkt, behält er das Aufschlagrecht und wechselt die Aufschlagseite. Macht der Rückschläger den Punkt, wandert das Aufschlagrecht.',
      'Doppel: Nur ein Aufschlagrecht pro Seite. Die Positionen werden nur getauscht, wenn die aufschlagende Seite punktet — so entsteht die Doppel-Rotation.',
      'Im Doppel ist das Aufschlagfeld kürzer: Die hintere Doppel-Aufschlaglinie (innere hintere Linie) begrenzt es.',
    ],
  },
  {
    id: 'feld',
    titel: 'Feld, Netz & Linien',
    absaetze: [
      'Das Feld ist 13,40 m lang. Einzel und Doppel nutzen unterschiedliche Begrenzungen — eine häufige Fehlerquelle:',
    ],
    punkte: [
      'Einzel: schmal (5,18 m, innere Seitenlinien) und lang (bis zur Grundlinie).',
      'Doppel: breit (6,10 m, äußere Seitenlinien) und lang — nur beim Aufschlag gilt hinten die innere Linie.',
      'Netzhöhe: 1,55 m an den Pfosten, 1,524 m in der Mitte.',
      'Linien gehören zum Feld: Ein Shuttle auf der Linie ist IN.',
    ],
  },
  {
    id: 'fehler',
    titel: 'Typische Fehler',
    absaetze: ['Ein Fehler beendet den Ballwechsel — Punkt für die Gegenseite. Die häufigsten:'],
    punkte: [
      'Shuttle landet außerhalb der gültigen Begrenzung oder unter dem Netz hindurch.',
      'Netzberührung mit Körper oder Schläger, während der Ball im Spiel ist.',
      'Der Shuttle wird zweimal nacheinander auf derselben Seite berührt (Doppelschlag).',
      'Übergreifen: Der Shuttle darf erst hinter dem Netz getroffen werden — die Ausschwungbewegung darf aber über das Netz folgen.',
      'Behinderung des Gegners oder absichtliches Ablenken.',
      'Aufschlagfehler: zu hoher Treffpunkt, Fuß auf der Linie, Shuttle verfehlt das diagonale Feld.',
    ],
  },
]

export const GLOSSAR: GlossarEintrag[] = [
  { begriff: 'Aufschlag, kurz', erklaerung: 'Aufschlag knapp über die Netzkante auf die vordere Aufschlaglinie — Standard im Doppel, nimmt dem Gegner den Angriff.', animationId: 'anim-aufschlag-kurz' },
  { begriff: 'Aufschlag, lang', erklaerung: 'Hoher Aufschlag bis an die Grundlinie — im Einzel beliebt, drückt den Gegner nach hinten.', animationId: 'anim-aufschlag-lang' },
  { begriff: 'Block', erklaerung: 'Kurz abgelegter Ball als Antwort auf einen Smash — Tempo wird herausgenommen, der Shuttle fällt direkt hinter das Netz.', animationId: 'anim-block' },
  { begriff: 'Buchholz-Zahl', erklaerung: 'Tiebreaker im Schweizer System: Summe der Punkte aller bisherigen Gegner. Belohnt Siege gegen starke Gegner.' },
  { begriff: 'Clear', erklaerung: 'Hoher, weiter Schlag von Grundlinie zu Grundlinie. Verschafft Zeit (Defensiv-Clear) oder drückt den Gegner nach hinten (Angriffs-Clear).', animationId: 'anim-clear' },
  { begriff: 'Drive', erklaerung: 'Flacher, schneller Schlag parallel zum Boden, knapp über die Netzkante — typisch fürs schnelle Doppel-Mittelfeld.', animationId: 'anim-drive-vh' },
  { begriff: 'Drop', erklaerung: 'Aus der Clear-Bewegung getarnter, kurz hinter das Netz fallender Ball. Lebt von der Täuschung.', animationId: 'anim-drop' },
  { begriff: 'Freilos', erklaerung: 'Im K.o.-Bracket: Ein Startplatz ohne Gegner — der Gesetzte zieht kampflos in die nächste Runde ein. Entsteht, wenn die Teilnehmerzahl keine Zweierpotenz ist.' },
  { begriff: 'Kill (Netzkill)', erklaerung: 'Kompromissloser Abschluss eines zu hoch geratenen Balls direkt an der Netzkante — steil nach unten.', animationId: 'anim-netzkill' },
  { begriff: 'Kreuzpaarung', erklaerung: 'Übergang von der Gruppen- in die K.o.-Phase: Gruppenerster trifft auf den Zweiten der Nachbargruppe (A1–B2, B1–A2).' },
  { begriff: 'Lob (Netzlob)', erklaerung: 'Hoch über den Gegner gespielter Ball aus der Netzzone an die Grundlinie — die Befreiung aus dem Netzduell.', animationId: 'anim-netzlob-rh' },
  { begriff: 'Netzdrop', erklaerung: 'Feiner Ball aus der Netzzone, der dicht hinter dem Netzband abtropft — erzwingt einen hohen Rückschlag.', animationId: 'anim-netzdrop' },
  { begriff: 'Rally-Point', erklaerung: 'Zählsystem, bei dem jeder Ballwechsel einen Punkt bringt — unabhängig vom Aufschlagrecht. Standard seit 2006.' },
  { begriff: 'Rückhand-Clear', erklaerung: 'Clear aus der tiefen Rückhand-Ecke über Kopf — einer der technisch schwierigsten Schläge.', animationId: 'anim-rh-clear' },
  { begriff: 'Setzliste', erklaerung: 'Rangfolge der stärksten Teilnehmer vor der Auslosung. Gesetzte werden im Bracket so verteilt, dass sie sich erst spät begegnen können.' },
  { begriff: 'Shuttle (Federball)', erklaerung: 'Der Spielball: Naturfeder- oder Nylonshuttle. Fliegt durch den Federkranz stark gebremst — darum sind weite Schläge Technik, nicht Kraft.' },
  { begriff: 'Smash', erklaerung: 'Der härteste Angriffsschlag: steil nach unten geschlagener Überkopfball, oft über 300 km/h im Profibereich.', animationId: 'anim-smash' },
  { begriff: 'Sprungsmash', erklaerung: 'Smash aus dem beidbeinigen Absprung — steilerer Winkel und mehr Druck, kostet aber Stellungssicherheit.', animationId: 'anim-sprungsmash' },
  { begriff: 'Stopp (Netzspiel)', erklaerung: 'Sammelbegriff für kurze Bälle an der Netzkante (Netzdrop, Spinball). Ziel: Der Gegner muss von unten hoch spielen.' },
  { begriff: 'Unterhand-Clear', erklaerung: 'Hoher Befreiungsschlag von unten, meist aus der Abwehr oder dem vorderen Feld — verschafft Zeit für die Stellung.', animationId: 'anim-unterhand-clear' },
  { begriff: 'Verlängerung (Setting)', erklaerung: 'Steht es Unentschieden kurz vor Satzende (20:20 bzw. 14:14 ab 2027), braucht es 2 Punkte Vorsprung — bis zur Kappung (30 bzw. 21).' },
]
