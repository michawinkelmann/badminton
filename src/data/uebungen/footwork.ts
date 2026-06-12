/** Footwork — 12 Übungen. Material-Konvention siehe aufwaermen.ts. */
import type { Uebung } from '../../datenmodell'

export const footwork: Uebung[] = [
  {
    id: 'fw-01',
    name: 'Split-Step-Timing am Signal',
    kategorie: 'footwork',
    skills: ['beinarbeit', 'schnelligkeit'],
    niveau: ['anfaenger', 'fortgeschritten', 'leistung'],
    dauerMin: 8,
    personen: 'paar',
    material: [],
    kurzbeschreibung:
      'Den Auftakthüpfer exakt auf den gegnerischen Schlagmoment legen — das Fundament aller Laufarbeit.',
    durchfuehrung: [
      'Läufer steht in Grundposition am T-Punkt, Partner steht gegenüber und imitiert Schläge (oder klatscht).',
      'Auf das Signal: Split-Step (kleiner beidbeiniger Hüpfer in die Breite) und expolsiver erster Schritt in die vom Partner gezeigte Richtung.',
      '3 × 10 Signale, Richtungen zufällig (vorn links/rechts, seitlich, hinten links/rechts).',
      'Rollen tauschen; Fokus: Landung des Split-Steps GENAU im Schlagmoment.',
    ],
    variationen: [
      'Leichter: nur zwei Richtungen (vorn/hinten).',
      'Schwerer: Partner täuscht an — Start nur bei echtem „Schlag".',
    ],
    fehlerbilder: [
      'Split-Step kommt zu spät (nach dem Schlag) → Rhythmus laut vorgeben: „und-JETZT"; Landung im Signalmoment.',
      'Hüpfer zu hoch → flacher, breiter Kontakt; Fersen bleiben leicht, Knie federn.',
    ],
    animationId: 'anim-splitstep',
  },
  {
    id: 'fw-02',
    name: '6-Punkte-Sternlauf',
    kategorie: 'footwork',
    skills: ['beinarbeit', 'ausdauer'],
    niveau: ['anfaenger', 'fortgeschritten', 'leistung'],
    dauerMin: 10,
    personen: 'allein',
    material: ['Hütchen'],
    kurzbeschreibung:
      'Das klassische Laufmuster in alle sechs Feldbereiche — Schattenschläge inklusive.',
    durchfuehrung: [
      'Sechs Hütchen platzieren: Vorhand/Rückhand am Netz, beide Seitenlinien mittig, beide Hinterfeld-Ecken.',
      'Aus der zentralen Position nacheinander alle Punkte anlaufen: vorn Ausfallschritt, seitlich Sidestep mit Ausfallschritt, hinten Umlaufen bzw. Umsprung mit Schattenschlag.',
      'Nach jedem Punkt zurück über die Mitte mit Split-Step.',
      '3 Runden à 1 Minute, dazwischen 1 Minute Pause; Reihenfolge pro Runde ändern.',
    ],
    variationen: [
      'Leichter: nur 4 Punkte (ohne Seitenlinien), Tempo moderat.',
      'Schwerer: Partner ruft die Punkte zufällig zu; oder 90 Sekunden Belastung.',
    ],
    fehlerbilder: [
      'Mitte wird nur überlaufen statt mit Auftakt gesetzt → an der Mitte bewusst Split-Step zeigen, sonst Runde ungültig.',
      'Vorne fehlt der lange Ausfallschritt → letzter Schritt lang, Knie über dem Fuß, Oberkörper aufrecht.',
    ],
    animationId: 'anim-sternlauf',
  },
  {
    id: 'fw-03',
    name: 'Ausfallschritt-Pendel ans Netz',
    kategorie: 'footwork',
    skills: ['beinarbeit'],
    niveau: ['anfaenger', 'fortgeschritten'],
    dauerMin: 8,
    personen: 'allein',
    material: [],
    kurzbeschreibung:
      'Saubere Lunge-Technik im Wechsel in beide Vorfeld-Ecken — Knie-stabil und rückenfreundlich.',
    durchfuehrung: [
      'Start am T-Punkt; abwechselnd in die Vorhand- und Rückhand-Netzecke laufen.',
      'Letzter Schritt als langer Ausfallschritt: Ferse zuerst aufsetzen, Knie bleibt über dem Fuß, Schlägerarm streckt zum gedachten Shuttle.',
      'Aktiv über das vordere Bein zurückdrücken, Rückweg mit kleinen schnellen Schritten.',
      '3 × 10 Ausfallschritte (5 pro Seite), 45 Sekunden Pause.',
    ],
    variationen: [
      'Leichter: Distanz halbieren (Start an der Aufschlaglinie).',
      'Schwerer: am Umkehrpunkt einen Shuttle greifen/ablegen (siehe Netz-Pendel).',
    ],
    fehlerbilder: [
      'Knie schiebt weit über die Fußspitze hinaus → Schritt verlängern, Gesäß tiefer, Druck über die Ferse.',
      'Oberkörper klappt nach vorn → Brust raus, Blick zur Netzkante, freier Arm balanciert hinten.',
    ],
    animationId: 'anim-ausfallschritt',
  },
  {
    id: 'fw-04',
    name: 'Umsprung-Drill in der Vorhand-Ecke',
    kategorie: 'footwork',
    skills: ['beinarbeit', 'schnelligkeit'],
    niveau: ['fortgeschritten', 'leistung'],
    dauerMin: 10,
    personen: 'allein',
    material: [],
    kurzbeschreibung:
      'Der Scissor-Jump im Hinterfeld: hinter den Shuttle kommen, in der Luft scheren, mit Zug nach vorn landen.',
    durchfuehrung: [
      'Start an der Feldmitte, Rückwärtsbewegung in die Vorhand-Hinterfeld-Ecke (Sidesteps, eingedrehte Hüfte).',
      'Absprung vom Schlagbein (rechts bei Rechtshändern), Schattenschlag im höchsten Punkt, Beine scheren in der Luft.',
      'Landung: linker Fuß hinten setzt zuerst auf und drückt sofort nach vorn ab — erster Schritt Richtung Mitte ist Teil der Landung.',
      '3 × 8 Umsprünge mit Schattenschlag, 1 Minute Pause.',
    ],
    variationen: [
      'Leichter: Bewegung ohne Sprung als Schrittfolge durchgehen (Chassé–Stellschritt–Schlag).',
      'Schwerer: Partner wirft echten Shuttle hoch an; danach Sprint ans Netz.',
    ],
    fehlerbilder: [
      'Landung beidbeinig ohne Vorwärtszug → Schere bewusst ansagen: „hinten landet, vorne zieht".',
      'Absprung unter dem Shuttle statt dahinter → erst hinter den (gedachten) Treffpunkt arbeiten, dann springen.',
    ],
    animationId: 'anim-umsprung',
  },
  {
    id: 'fw-05',
    name: 'Sidestep-Pendel zwischen den Seitenlinien',
    kategorie: 'footwork',
    skills: ['beinarbeit', 'schnelligkeit'],
    niveau: ['anfaenger', 'fortgeschritten', 'leistung'],
    dauerMin: 8,
    personen: 'allein',
    material: [],
    kurzbeschreibung:
      'Schnelle Sidesteps mit Abwehr-Schattenschlag an beiden Seitenlinien — Breite verteidigen lernen.',
    durchfuehrung: [
      'Start in der Feldmitte; Sidesteps zur Vorhand-Seitenlinie, dort Ausfallschritt mit Abwehr-Schattenschlag.',
      'Zurück über die Mitte (Split-Step) zur anderen Seite, gleiches Muster Rückhand.',
      '4 × 30 Sekunden Pendel, 30 Sekunden Pause.',
      'Hüfte bleibt tief und frontal zum Netz, Füße kreuzen nie.',
    ],
    variationen: [
      'Leichter: Tempo herausnehmen, ohne Schattenschlag.',
      'Schwerer: 45 Sekunden Belastung; oder mit Richtungs-Zuruf statt festem Pendel.',
    ],
    fehlerbilder: [
      'Füße kreuzen beim Seitwärtslaufen → „Schritt-schließ-Schritt"-Rhythmus vorgeben, Abstand zwischen den Füßen halten.',
      'Aufrichten während des Pendelns → Stuhl-Bild: Hüfte bleibt auf Sitzhöhe.',
    ],
    animationId: 'anim-sidesteps',
  },
  {
    id: 'fw-06',
    name: 'Schattenlaufwege nach Ansage',
    kategorie: 'footwork',
    skills: ['beinarbeit', 'schnelligkeit', 'ausdauer'],
    niveau: ['anfaenger', 'fortgeschritten', 'leistung'],
    dauerMin: 10,
    personen: 'gruppe',
    material: [],
    kurzbeschreibung:
      'Trainer oder Partner zeigt Richtungen an, die Gruppe läuft die Wege mit Schattenschlägen — gut dosierbar für jede Gruppengröße.',
    durchfuehrung: [
      'Jede Person auf einem eigenen (Halb-)Feld in Grundposition; Ansager steht vorn sichtbar.',
      'Ansager zeigt mit dem Arm eine der sechs Richtungen; alle laufen den Weg mit korrektem Schrittmuster und Schattenschlag, danach zurück zur Mitte.',
      '4 Serien à 45 Sekunden, 45 Sekunden Pause; Richtungstempo an die Gruppe anpassen.',
    ],
    variationen: [
      'Leichter: nur Vorfeld/Hinterfeld ansagen, lange Pausen zwischen den Signalen.',
      'Schwerer: Doppelsignale (zwei Wege nacheinander), Tempo hoch.',
    ],
    fehlerbilder: [
      'Schattenschläge verkümmern zu Armwedeln → vollständige Schlagbewegung mit Treffpunkt-Stopp einfordern.',
    ],
  },
  {
    id: 'fw-07',
    name: 'Koordinationsleiter & Hütchen-Frequenz',
    kategorie: 'footwork',
    skills: ['schnelligkeit', 'beinarbeit'],
    niveau: ['anfaenger', 'fortgeschritten', 'leistung'],
    dauerMin: 10,
    personen: 'allein',
    material: ['Koordinationsleiter', 'Hütchen'],
    kurzbeschreibung:
      'Fußfrequenz und Rhythmusgefühl mit Leiter-Drills — die Basis für schnelle Richtungswechsel.',
    durchfuehrung: [
      'Leiter auslegen; je 2 Durchgänge: jeder Fuß in jedes Feld, seitlicher Durchlauf, Icky Shuffle (rein-rein-raus).',
      'Danach 2 Hütchen im Abstand von 1,5 m: 3 × 10 Sekunden maximale Seitwechsel-Frequenz.',
      'Zwischen den Durchgängen zurückgehen statt -laufen (volle Qualität pro Durchgang).',
    ],
    variationen: [
      'Leichter: Muster halbieren, Tempo moderat.',
      'Schwerer: Leiter rückwärts; nach dem letzten Leiterfeld Sprint über 3 m.',
    ],
    fehlerbilder: [
      'Blick klebt auf der Leiter → nach den ersten Feldern Blick zur „Netzkante" heben.',
      'Bodenkontakt laut und lang → leise Ballenkontakte ansagen: „heißer Boden".',
    ],
  },
  {
    id: 'fw-08',
    name: 'Rückhand-Ecke: Umlaufen trainieren',
    kategorie: 'footwork',
    skills: ['beinarbeit'],
    niveau: ['fortgeschritten', 'leistung'],
    dauerMin: 10,
    personen: 'allein',
    material: ['Hütchen'],
    kurzbeschreibung:
      'Den Laufweg in die tiefe Rückhand-Ecke so legen, dass statt der Rückhand die Vorhand (Umlaufen) spielbar ist.',
    durchfuehrung: [
      'Hütchen in der Rückhand-Hinterfeld-Ecke; Start an der Mitte.',
      'Laufweg: Auftakt, Eindrehen über die Rückhandseite, 2–3 schnelle Schritte HINTER den gedachten Treffpunkt, Umsprung mit Vorhand-Überkopf-Schattenschlag.',
      'Rückweg über die Mitte; 3 × 8 Wiederholungen, 45 Sekunden Pause.',
      'Kontrollfrage je Wiederholung: Stand der Körper seitlich-hinter dem Shuttle?',
    ],
    variationen: [
      'Leichter: Schrittfolge in Zeitlupe abgehen, Pausen zwischen den Wiederholungen.',
      'Schwerer: Partner wirft hohe Shuttles in die Ecke — echte Treffpunkte.',
    ],
    fehlerbilder: [
      'Lauf endet UNTER dem Shuttle, Schlag nur noch nach hinten möglich → Weg bewusst einen Schritt weiter nach hinten planen.',
      'Aus Bequemlichkeit Rückhand statt Umlaufen → Übungsziel klarmachen: Rückhand ist hier verboten.',
    ],
    animationId: 'anim-rh-ecke',
  },
  {
    id: 'fw-09',
    name: '4-Ecken-Zuruf mit Schläger',
    kategorie: 'footwork',
    skills: ['beinarbeit', 'ausdauer'],
    niveau: ['anfaenger', 'fortgeschritten', 'leistung'],
    dauerMin: 10,
    personen: 'paar',
    material: [],
    kurzbeschreibung:
      'Partnergesteuertes Eckenlaufen mit vollständigen Schattenschlägen — Belastung wie ein langer Ballwechsel.',
    durchfuehrung: [
      'Felder-Ecken nummerieren (1 = Netz Vorhand, 2 = Netz Rückhand, 3 = hinten Vorhand, 4 = hinten Rückhand).',
      'Partner ruft Zahlen in unregelmäßiger Folge; Läufer läuft die Ecke an, zeigt den passenden Schattenschlag, zurück zur Mitte.',
      '4 × 40 Sekunden pro Person, dazwischen wechseln (Pause = Ansagerrolle).',
    ],
    variationen: [
      'Leichter: feste Reihenfolge 1–2–3–4, moderates Tempo.',
      'Schwerer: Zahlenpaare („3–1!") — zwei Wege ohne Mittelpause.',
    ],
    fehlerbilder: [
      'Tempo sinkt, Wege werden abgekürzt → Ansager passt Frequenz an: Qualität vor Geschwindigkeit.',
      'Kein Schattenschlag in den hinteren Ecken → ohne Überkopf-Schatten zählt die Ecke nicht.',
    ],
  },
  {
    id: 'fw-10',
    name: 'Netz-Pendel mit Shuttle-Ablage',
    kategorie: 'footwork',
    skills: ['beinarbeit', 'schnelligkeit'],
    niveau: ['anfaenger', 'fortgeschritten'],
    dauerMin: 8,
    personen: 'allein',
    material: ['Hütchen'],
    kurzbeschreibung:
      'Ausfallschritte ans Netz mit Aufnehmen und Ablegen von Shuttles — Tiefe erzwingen, Rumpf stabilisieren.',
    durchfuehrung: [
      '4 Shuttles an der Netzlinie verteilen (2 Vorhand-, 2 Rückhandseite), Start am T-Punkt.',
      'Pendel: Ausfallschritt zur ersten Position, Shuttle greifen, zurück zur Mitte, Ausfallschritt zur nächsten, Shuttle ablegen — bis alle Positionen getauscht sind.',
      '3 Runden, Zeit stoppen; zwischen den Runden 60 Sekunden Pause.',
    ],
    variationen: [
      'Leichter: 2 Shuttles, ohne Zeitdruck.',
      'Schwerer: 6 Shuttles; Aufnahme nur mit der Nicht-Schlaghand.',
    ],
    fehlerbilder: [
      'Greifen aus dem runden Rücken → Tiefe kommt aus dem Ausfallschritt, nicht aus der Wirbelsäule.',
      'Stoppschritt fehlt, Schwung trägt ins Netz → letzter Schritt lang und stoppend (Ferse zuerst).',
    ],
  },
  {
    id: 'fw-11',
    name: 'Spiegel-Duell',
    kategorie: 'footwork',
    skills: ['beinarbeit', 'schnelligkeit'],
    niveau: ['anfaenger', 'fortgeschritten', 'leistung'],
    dauerMin: 8,
    personen: 'paar',
    material: [],
    kurzbeschreibung:
      'Zwei Personen, ein unsichtbares Band: Wer führt, bestimmt die Laufwege — wer spiegelt, reagiert.',
    durchfuehrung: [
      'Beide stehen sich auf zwei Feldhälften an der T-Linie gegenüber.',
      'Person A läuft frei badmintonspezifische Wege (Ecken, Seiten), Person B spiegelt so schnell und genau wie möglich.',
      '4 × 30 Sekunden, nach jeder Runde Führungswechsel; 30 Sekunden Pause.',
      'Abschlussrunde als Wettkampf: Schafft B, den Abstand nie größer als einen Schritt werden zu lassen?',
    ],
    variationen: [
      'Leichter: Führung nur in zwei Richtungen, Tempo gedrosselt.',
      'Schwerer: A darf Täuschungen einbauen (Antritt andeuten, abbrechen).',
    ],
    fehlerbilder: [
      'Spiegler schaut auf die Füße → Blick auf Hüfte/Körpermitte der führenden Person richten.',
    ],
  },
  {
    id: 'fw-12',
    name: 'Reaktiv-Starts: Split-Step + erster Schritt',
    kategorie: 'footwork',
    skills: ['schnelligkeit', 'beinarbeit'],
    niveau: ['fortgeschritten', 'leistung'],
    dauerMin: 10,
    personen: 'paar',
    material: ['Hütchen'],
    kurzbeschreibung:
      'Maximale Explosivität auf den ersten Metern — der erste Schritt entscheidet, ob der Shuttle noch spielbar ist.',
    durchfuehrung: [
      '4 Hütchen im Quadrat (2 m Kantenlänge) um den Läufer; Partner gibt Richtungssignale per Handzeichen.',
      'Läufer: Split-Step auf das Signal, explosiver erster Schritt, Hütchen berühren, sofort zurück in die Mitte.',
      '5 Serien à 6 Starts, zwischen den Serien 60 Sekunden Pause (volle Erholung — Schnelligkeit braucht Frische).',
    ],
    variationen: [
      'Leichter: 2 Hütchen, akustisches Signal.',
      'Schwerer: Signale als Zahlen-Code (kognitive Last), Quadrat auf 2,5 m.',
    ],
    fehlerbilder: [
      'Erster Schritt zu kurz und zögerlich → bewusst „fallen lassen" in die Richtung, Körperschwerpunkt führt.',
      'Pausen werden verkürzt, Qualität sinkt → Pausenzeit strikt einhalten, lieber Serie streichen.',
    ],
    animationId: 'anim-splitstep',
  },
]
