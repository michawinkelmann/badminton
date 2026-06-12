/** Kondition — 10 Übungen. Material-Konvention siehe aufwaermen.ts. */
import type { Uebung } from '../../datenmodell'

export const kondition: Uebung[] = [
  {
    id: 'ko-01',
    name: 'Linien-Pyramide (Court-Sprints)',
    kategorie: 'kondition',
    skills: ['ausdauer', 'schnelligkeit'],
    niveau: ['anfaenger', 'fortgeschritten', 'leistung'],
    dauerMin: 10,
    personen: 'allein',
    material: [],
    kurzbeschreibung:
      'Sprint-Pyramide über die Feldlinien — badmintonspezifische Antritts- und Stopparbeit.',
    durchfuehrung: [
      'Start an der Grundlinie: Sprint zur vorderen Aufschlaglinie und zurück, zur Netzlinie und zurück, zur gegnerischen Aufschlaglinie und zurück, zur gegnerischen Grundlinie und zurück.',
      'Jede Linie mit der Hand berühren, Stopps mit kurzen, stoppenden Schritten.',
      '3–5 Pyramiden, Pause zwischen den Durchgängen 60–90 Sekunden.',
      'Zeit pro Pyramide notieren — Verlauf über die Wochen vergleichen.',
    ],
    variationen: [
      'Leichter: nur bis zur Netzlinie, 3 Durchgänge.',
      'Schwerer: rückwärts zurücklaufen; oder zwei Pyramiden am Stück.',
    ],
    fehlerbilder: [
      'Aufrichten beim Stoppen, lange Bremswege → tiefer Körperschwerpunkt, letzte zwei Schritte kurz und stoppend.',
    ],
  },
  {
    id: 'ko-02',
    name: 'Intervall-Schattenbadminton 30/30',
    kategorie: 'kondition',
    skills: ['ausdauer', 'beinarbeit'],
    niveau: ['fortgeschritten', 'leistung'],
    dauerMin: 10,
    personen: 'allein',
    material: [],
    kurzbeschreibung:
      'Hochintensives Schattenspiel im 30/30-Intervall — die Ausdauerform, die wie ein drittes Satz-Finale brennt.',
    durchfuehrung: [
      '8 Intervalle: 30 Sekunden Schattenbadminton mit maximalem Tempo (alle Ecken, vollständige Schattenschläge), 30 Sekunden lockeres Gehen.',
      'Laufmuster pro Intervall wechseln (nur Netz/hinten, nur Seiten, frei).',
      'Qualitätsregel: Sinkt die Bewegungsqualität deutlich, Intervall abbrechen statt durchschleppen.',
    ],
    variationen: [
      'Leichter: 20/40-Intervalle, 6 Runden.',
      'Schwerer: 40/20-Intervalle; letzte zwei Intervalle mit Zuruf-Richtungen.',
    ],
    fehlerbilder: [
      'Halbe Laufwege und angedeutete Schläge → lieber weniger Intervalle in voller Qualität.',
    ],
  },
  {
    id: 'ko-03',
    name: 'Sprungserien: Streck- und Smashsprünge',
    kategorie: 'kondition',
    skills: ['schnelligkeit', 'smash'],
    niveau: ['fortgeschritten', 'leistung'],
    dauerMin: 10,
    personen: 'allein',
    material: [],
    kurzbeschreibung:
      'Explosive Sprungkraft für Sprungsmash und Umsprung — mit sauberer Landetechnik.',
    durchfuehrung: [
      '3 × 8 Strecksprünge: aus der Hocke maximal hoch, Arme schwingen mit, Landung federnd.',
      '3 × 6 Smashsprünge: beidbeiniger Absprung mit voller Schattenschlag-Bewegung im höchsten Punkt.',
      'Zwischen den Serien 60–90 Sekunden Pause; Qualität vor Wiederholungszahl.',
    ],
    variationen: [
      'Leichter: Sprunghöhe reduzieren, 2 Serien.',
      'Schwerer: Smashsprünge mit Scherbewegung (Umsprung-Simulation) und direktem Antritt nach vorn nach der Landung.',
    ],
    fehlerbilder: [
      'Landung steifbeinig mit durchgestreckten Knien → Landung wie auf „heißem Boden" abfedern, Knie folgen der Fußspitze.',
      'Hohlkreuz im Absprung → Rumpf aktiv anspannen, Blick geradeaus.',
    ],
  },
  {
    id: 'ko-04',
    name: 'Rumpf-Zirkel für Schlagstabilität',
    kategorie: 'kondition',
    skills: ['ausdauer'],
    niveau: ['anfaenger', 'fortgeschritten', 'leistung'],
    dauerMin: 12,
    personen: 'allein',
    material: ['Matte'],
    kurzbeschreibung:
      'Stabiler Rumpf = präzise Schläge unter Bewegung. Vier Stationen, zwei Runden.',
    durchfuehrung: [
      'Station 1: Unterarmstütz (Plank), 40 Sekunden.',
      'Station 2: Seitstütz je Seite 30 Sekunden.',
      'Station 3: Russian Twist mit Schläger in beiden Händen, 20 Wiederholungen.',
      'Station 4: Beinheben in Rückenlage, 12 Wiederholungen — unterer Rücken bleibt am Boden.',
      '2 Runden, zwischen den Stationen 20 Sekunden, zwischen den Runden 90 Sekunden Pause.',
    ],
    variationen: [
      'Leichter: Zeiten halbieren, Plank auf den Knien.',
      'Schwerer: Plank mit wechselndem Armheben; dritte Runde.',
    ],
    fehlerbilder: [
      'Hüfte hängt im Stütz durch → Gesäß und Bauch aktiv anspannen, Körper bildet ein Brett.',
    ],
  },
  {
    id: 'ko-05',
    name: 'Skater-Sprünge für die Abwehrbreite',
    kategorie: 'kondition',
    skills: ['schnelligkeit', 'beinarbeit'],
    niveau: ['fortgeschritten', 'leistung'],
    dauerMin: 8,
    personen: 'allein',
    material: [],
    kurzbeschreibung:
      'Seitliche Einbeinsprünge wie ein Eisschnellläufer — Power für seitliche Abwehraktionen.',
    durchfuehrung: [
      'Seitlicher Absprung vom rechten Bein, Landung stabil auf dem linken (ca. 1–1,5 m), kurz halten, zurückspringen.',
      '3 × 10 Sprünge pro Seite, Pause 60 Sekunden.',
      'Landung: Knie über Fußspitze, Oberkörper ruhig, Arme schwingen badmintontypisch mit.',
    ],
    variationen: [
      'Leichter: Distanz verkürzen, Zwischenschritt erlauben.',
      'Schwerer: Landung 2 Sekunden einbeinig einfrieren; oder mit Schattenschlag-Abwehr bei jeder Landung.',
    ],
    fehlerbilder: [
      'Knie knickt bei der Landung nach innen → Distanz reduzieren, Knie aktiv nach außen steuern.',
      'Wackelige Landung wird weggehüpft → erst Stabilität, dann Weite.',
    ],
  },
  {
    id: 'ko-06',
    name: 'Burpee-Shuttle-Run',
    kategorie: 'kondition',
    skills: ['ausdauer'],
    niveau: ['anfaenger', 'fortgeschritten'],
    dauerMin: 10,
    personen: 'gruppe',
    material: ['Hütchen'],
    kurzbeschreibung:
      'Teamtaugliche Ganzkörper-Belastung: Burpees und Pendelsprints im Wechsel — Schulklassiker mit Badminton-Rahmen.',
    durchfuehrung: [
      'Zwei Linien im Abstand der Feldlänge markieren (oder Grund- zu Grundlinie nutzen).',
      'Zirkel: 3 Burpees an Linie A, Sprint zu Linie B, 3 Burpees, Sprint zurück — das ist eine Runde.',
      '4–6 Runden pro Person; in Teams als Staffel mit Anfeuern organisieren.',
    ],
    variationen: [
      'Leichter: Burpees ohne Liegestütz (nur Strecksprung mit Bodenkontakt der Hände).',
      'Schwerer: 5 Burpees; Sprint als Sidestep-Strecke.',
    ],
    fehlerbilder: [
      'Burpees mit durchhängender Hüfte → Rumpfspannung ansagen oder auf leichtere Variante wechseln.',
    ],
  },
  {
    id: 'ko-07',
    name: 'Tabata: Mountain Climbers & Jump Lunges',
    kategorie: 'kondition',
    skills: ['ausdauer', 'schnelligkeit'],
    niveau: ['fortgeschritten', 'leistung'],
    dauerMin: 8,
    personen: 'allein',
    material: ['Matte'],
    kurzbeschreibung:
      'Vier Minuten Vollgas im Tabata-Protokoll — kompakte Kondition für das Saisontraining.',
    durchfuehrung: [
      'Tabata-Protokoll: 8 × (20 Sekunden Belastung / 10 Sekunden Pause).',
      'Intervalle abwechselnd: Mountain Climbers (ungerade) und Jump Lunges/Wechselsprung-Ausfallschritte (gerade).',
      'Vorher 1 Minute locker einbewegen, danach 2 Minuten austraben.',
    ],
    variationen: [
      'Leichter: Lunges ohne Sprung im Wechselschritt.',
      'Schwerer: zweites Tabata nach 3 Minuten Pause (dann 16 Intervalle gesamt).',
    ],
    fehlerbilder: [
      'Mountain Climbers mit hoher Hüfte und kurzen Schritten → Schultern über die Hände, Knie zügig zur Brust.',
      'Jump Lunges mit Knie-Innenknick → Tempo reduzieren, Achse Knie-Fußspitze halten.',
    ],
  },
  {
    id: 'ko-08',
    name: 'Medizinball-Überkopfwürfe',
    kategorie: 'kondition',
    skills: ['smash', 'schnelligkeit'],
    niveau: ['fortgeschritten', 'leistung'],
    dauerMin: 10,
    personen: 'paar',
    material: ['Medizinball (1–2 kg)'],
    kurzbeschreibung:
      'Die Schlagkraft-Kette des Smashes mit dem Medizinball trainieren: Beine → Rumpf → Arm.',
    durchfuehrung: [
      'Paarweise gegenüber (4–5 m): Überkopfwurf beidarmig mit Bogenspannung — Ball hinter den Kopf führen, Hüfte schiebt vor, explosiv abwerfen.',
      '3 × 8 beidarmige Würfe.',
      'Danach 2 × 6 einarmig-unterstützte Schock-Würfe je Seite (Wurfarm wirft, andere Hand stützt den Ball bis zum Abwurf).',
      'Pausen 60 Sekunden; Partner kontrolliert die Bogenspannung.',
    ],
    variationen: [
      'Leichter: leichterer Ball, nur beidarmig.',
      'Schwerer: Würfe aus leichtem Ausfallschritt mit Gewichtsverlagerung wie beim Schlag.',
    ],
    fehlerbilder: [
      'Wurf nur aus den Armen, Hüfte bleibt starr → Bewegung von unten aufbauen: Ferse-Hüfte-Brust-Arm nacheinander.',
      'Hohlkreuz beim Ausholen → Rumpf anspannen, Ausholweg verkürzen.',
    ],
  },
  {
    id: 'ko-09',
    name: 'Kastensprünge & Tiefe Starts',
    kategorie: 'kondition',
    skills: ['schnelligkeit'],
    niveau: ['fortgeschritten', 'leistung'],
    dauerMin: 10,
    personen: 'allein',
    material: ['Kasten (kniehoch)'],
    kurzbeschreibung:
      'Explosivkraft der Beine: auf den Kasten springen, kontrolliert landen, aus der Landung antreten.',
    durchfuehrung: [
      '3 × 6 Kastensprünge: aus dem Stand explosiv auf den kniehohen Kasten, oben vollständig aufrichten, herabsteigen (nicht springen).',
      '3 × 4 „Landung + Start": vom Kastenrand abrollen lassen, federnd landen und sofort 3 m sprinten.',
      'Pausen 90 Sekunden — maximale Frische für maximale Explosivität.',
    ],
    variationen: [
      'Leichter: niedrigerer Kasten oder Treppenstufe, nur Sprünge ohne Start.',
      'Schwerer: einbeinige Landungen (vorsichtig steigern), Start als Sidestep.',
    ],
    fehlerbilder: [
      'Herunterspringen statt -steigen nach dem Sprung → Verletzungsrisiko; Abstieg bewusst langsam.',
      'Landung mit komplett gestreckten Beinen → Hüfte und Knie beugen, „leise landen".',
    ],
  },
  {
    id: 'ko-10',
    name: 'Lauf-Memory mit Shuttles',
    kategorie: 'kondition',
    skills: ['ausdauer'],
    niveau: ['anfaenger'],
    dauerMin: 12,
    personen: 'gruppe',
    material: ['Hütchen', 'Memory-Karten oder beschriftete Zettel'],
    kurzbeschreibung:
      'Laufintensive Spielform für Schulgruppen: Memory-Paare suchen, dabei unbemerkt Ausdauer sammeln.',
    durchfuehrung: [
      'Auf der einen Hallenseite liegen verdeckte Kartenpaare (oder beschriftete Shuttles), Teams starten auf der anderen Seite.',
      'Pro Lauf darf eine Person genau zwei Karten aufdecken; Paar gefunden = mitnehmen, sonst wieder umdrehen und zurücklaufen.',
      'Team mit den meisten Paaren gewinnt; 2–3 Runden mit neuen Karten.',
      'Laufweg badmintonisieren: Hütchen-Slalom oder Sidestep-Pflichtzone einbauen.',
    ],
    variationen: [
      'Leichter: Laufweg verkürzen, Karten halb offen.',
      'Schwerer: vor jedem Aufdecken 3 Hampelmänner; Rückweg rückwärts.',
    ],
    fehlerbilder: [
      'Einzelne laufen kaum (Taktiker-Falle) → Reihenfolge im Team fest rotieren lassen.',
    ],
  },
]
