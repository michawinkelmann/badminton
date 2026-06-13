/** Ausführliche Beschreibungen & Skizzen — Footwork (fw-01 … fw-12). */
import type { UebungsDetails } from './typen'

export const footworkDetails: Record<string, UebungsDetails> = {
  'fw-01': {
    beschreibung: [
      'Der Split-Step ist der kleine beidbeinige Auftakthüpfer, mit dem jede Laufaktion im Badminton beginnt — und sein Timing entscheidet alles: Er muss genau in dem Moment landen, in dem der Gegner den Shuttle trifft. Nur dann ist der Körper vorgespannt und der erste Schritt explosiv. Diese Übung isoliert genau dieses Timing.',
      'Die übende Person steht in Grundposition am T-Punkt, der Partner steht gegenüber und imitiert Schläge oder klatscht als Signal. Auf das Signal: Split-Step und explosiver erster Schritt in die gezeigte Richtung — mehr nicht, danach sofort zurück. Weil die Laufstrecke kurz bleibt, können viele Wiederholungen mit voller Konzentration auf den Auftakt gesammelt werden.',
    ],
    skizze: {
      spieler: [
        { pos: { x: 4.72, y: 3.05 }, label: 'A' },
        { pos: { x: 7.8, y: 3.05 }, label: 'Z', partei: 'b' },
      ],
      laufwege: [
        { von: { x: 4.72, y: 3.05 }, bis: { x: 5.8, y: 1.8 } },
        { von: { x: 4.72, y: 3.05 }, bis: { x: 5.8, y: 4.3 } },
        { von: { x: 4.72, y: 3.05 }, bis: { x: 3.4, y: 1.8 } },
        { von: { x: 4.72, y: 3.05 }, bis: { x: 3.4, y: 4.3 } },
      ],
      hinweis:
        'Z gibt das Signal (Schlag-Imitation/Klatschen), A setzt den Split-Step exakt im Signalmoment und startet explosiv in die gezeigte Richtung.',
    },
  },
  'fw-02': {
    beschreibung: [
      'Der 6-Punkte-Sternlauf ist DAS klassische Laufmuster im Badminton: Aus der zentralen Position werden nacheinander alle sechs Feldbereiche angelaufen — beide Netzecken, beide Seitenlinien, beide Hinterfeld-Ecken — und an jedem Punkt wird der passende Schattenschlag gezeigt. Zwischen jedem Weg führt die Route zurück über die Mitte, inklusive Split-Step.',
      'Damit trainiert eine einzige Übung sämtliche Schrittmuster des Spiels: Ausfallschritt nach vorn, Sidesteps zur Seite, Umlaufen und Umsprung nach hinten. Hütchen markieren die sechs Punkte und machen die Wege auch für Anfänger eindeutig. Gelaufen wird in Zeitintervallen mit Pausen — die Reihenfolge pro Runde zu ändern hält die Konzentration hoch.',
    ],
    skizze: {
      spieler: [{ pos: { x: 3.35, y: 3.05 }, label: 'A' }],
      huetchen: [
        { x: 5.9, y: 0.9 },
        { x: 5.9, y: 5.2 },
        { x: 3.35, y: 0.7 },
        { x: 3.35, y: 5.4 },
        { x: 0.9, y: 0.9 },
        { x: 0.9, y: 5.2 },
      ],
      laufwege: [
        { von: { x: 3.35, y: 3.05 }, bis: { x: 5.7, y: 1.1 } },
        { von: { x: 3.35, y: 3.05 }, bis: { x: 5.7, y: 5.0 } },
        { von: { x: 3.35, y: 3.05 }, bis: { x: 3.35, y: 1.0 } },
        { von: { x: 3.35, y: 3.05 }, bis: { x: 3.35, y: 5.1 } },
        { von: { x: 3.35, y: 3.05 }, bis: { x: 1.1, y: 1.1 } },
        { von: { x: 3.35, y: 3.05 }, bis: { x: 1.1, y: 5.0 } },
      ],
      hinweis:
        'Sechs Hütchen markieren die Feldbereiche; jeder Weg endet mit Schattenschlag, der Rückweg führt immer über die Mitte (Split-Step).',
    },
  },
  'fw-03': {
    beschreibung: [
      'Der Ausfallschritt (Lunge) ist der Standard-Abschluss jedes Laufwegs ans Netz — und gleichzeitig die Bewegung, bei der technische Fehler am schnellsten auf Knie und Rücken gehen. Dieses Pendel trainiert ihn isoliert und in hoher Wiederholungszahl: vom T-Punkt abwechselnd in die Vorhand- und Rückhand-Netzecke.',
      'Der letzte Schritt ist lang, die Ferse setzt zuerst auf, das Knie bleibt über dem Fuß, der Oberkörper aufrecht — der Schlägerarm streckt sich zum gedachten Shuttle. Aus der tiefen Position drückt das vordere Bein aktiv zurück, der Rückweg läuft über kleine, schnelle Schritte. Wer hier sauber arbeitet, gewinnt am Netz wertvolle Zentimeter Reichweite.',
    ],
    skizze: {
      spieler: [{ pos: { x: 4.72, y: 3.05 }, label: 'A' }],
      laufwege: [
        { von: { x: 4.72, y: 3.05 }, bis: { x: 6.1, y: 1.4 } },
        { von: { x: 6.1, y: 1.7 }, bis: { x: 4.9, y: 2.9 }, gebogen: true },
        { von: { x: 4.72, y: 3.05 }, bis: { x: 6.1, y: 4.7 } },
        { von: { x: 6.1, y: 4.4 }, bis: { x: 4.9, y: 3.2 }, gebogen: true },
      ],
      hinweis:
        'Pendel vom T-Punkt: langer Ausfallschritt in die Netzecke (Ferse zuerst, Knie über dem Fuß), aktiv zurückdrücken, Seite wechseln.',
    },
  },
  'fw-04': {
    beschreibung: [
      'Der Umsprung (Scissor Jump) ist die Standardlösung für Überkopfbälle im Hinterfeld: Man arbeitet sich seitlich hinter den Shuttle, springt vom Schlagbein ab, die Beine scheren in der Luft, und die Landung auf dem hinteren Fuß drückt sofort wieder nach vorn Richtung Feldmitte. So verliert man nach dem Schlag keine Zeit.',
      'Die Übung zerlegt diese komplexe Bewegung in einen wiederholbaren Drill in der Vorhand-Hinterfeld-Ecke: Rückwärtsbewegung mit eingedrehter Hüfte, Absprung, Schattenschlag im höchsten Punkt, ziehende Landung. Der Kernsatz „hinten landet, vorne zieht" beschreibt das Erfolgskriterium — eine beidbeinige Landung ohne Vorwärtszug verschenkt den ganzen Vorteil des Sprungs.',
    ],
    skizze: {
      spieler: [{ pos: { x: 3.35, y: 3.05 }, label: 'A' }],
      huetchen: [{ x: 1.0, y: 4.9 }],
      laufwege: [
        { von: { x: 3.35, y: 3.05 }, bis: { x: 1.3, y: 4.7 } },
        { von: { x: 1.1, y: 4.5 }, bis: { x: 3.1, y: 3.2 }, gebogen: true },
      ],
      hinweis:
        'Seitlich-rückwärts hinter den gedachten Treffpunkt arbeiten, Umsprung mit Schattenschlag, Landung zieht direkt zurück zur Mitte.',
    },
  },
  'fw-05': {
    beschreibung: [
      'Sidesteps sind das Schrittmuster für die seitliche Verteidigung: Die Hüfte bleibt frontal zum Netz, die Füße kreuzen nie, der Körperschwerpunkt bleibt tief. Dieses Pendel trainiert genau das — von der Feldmitte zur Seitenlinie, dort Ausfallschritt mit Abwehr-Schattenschlag, zurück über die Mitte zur anderen Seite.',
      'Der Split-Step an der Mitte trennt die beiden Richtungen und hält den Rhythmus des echten Spiels aufrecht. Gearbeitet wird in Zeitintervallen; sobald sich der Oberkörper während des Pendelns aufrichtet, ist die Pause überfällig. Das Stuhl-Bild hilft: Die Hüfte bleibt die ganze Zeit ungefähr auf Sitzhöhe.',
    ],
    skizze: {
      spieler: [{ pos: { x: 3.35, y: 3.05 }, label: 'A' }],
      laufwege: [
        { von: { x: 3.35, y: 3.05 }, bis: { x: 3.35, y: 0.9 } },
        { von: { x: 3.35, y: 1.2 }, bis: { x: 3.35, y: 2.9 }, gebogen: true },
        { von: { x: 3.35, y: 3.05 }, bis: { x: 3.35, y: 5.2 } },
        { von: { x: 3.35, y: 4.9 }, bis: { x: 3.35, y: 3.2 }, gebogen: true },
      ],
      hinweis:
        'Sidestep-Pendel zwischen den Seitenlinien: an jeder Linie Ausfallschritt mit Abwehr-Schattenschlag, an der Mitte Split-Step.',
    },
  },
  'fw-06': {
    beschreibung: [
      'Die ansagegesteuerte Variante des Schattentrainings: Eine Person (Trainer:in oder Partner) steht vorn sichtbar und zeigt mit dem Arm eine der sechs Richtungen an — die ganze Gruppe läuft gleichzeitig den entsprechenden Weg mit korrektem Schrittmuster und vollständigem Schattenschlag, danach zurück zur Mitte.',
      'Der große Vorteil gegenüber festen Mustern: Die Richtung ist nicht vorhersehbar, also bleiben Split-Step und Reaktion echte Reaktionen. Gleichzeitig ist die Form beliebig skalierbar — jede Person braucht nur eine (Halb-)Feldfläche, und über das Ansagetempo lässt sich die Belastung exakt an die Gruppe anpassen.',
    ],
    skizze: {
      spieler: [
        { pos: { x: 3.35, y: 3.05 }, label: 'A' },
        { pos: { x: 7.4, y: 3.05 }, label: 'T', partei: 'b' },
      ],
      laufwege: [
        { von: { x: 3.35, y: 3.05 }, bis: { x: 5.7, y: 1.1 } },
        { von: { x: 3.35, y: 3.05 }, bis: { x: 5.7, y: 5.0 } },
        { von: { x: 3.35, y: 3.05 }, bis: { x: 3.35, y: 1.0 } },
        { von: { x: 3.35, y: 3.05 }, bis: { x: 3.35, y: 5.1 } },
        { von: { x: 3.35, y: 3.05 }, bis: { x: 1.1, y: 1.1 } },
        { von: { x: 3.35, y: 3.05 }, bis: { x: 1.1, y: 5.0 } },
      ],
      hinweis:
        'T zeigt mit dem Arm eine der sechs Richtungen an; alle laufen gleichzeitig mit Schattenschlag und arbeiten zurück zur Mitte.',
    },
  },
  'fw-07': {
    beschreibung: [
      'Koordinationsleiter-Drills schulen Fußfrequenz, Rhythmusgefühl und präzise Fußarbeit auf engem Raum — Fähigkeiten, die im Badminton bei jedem Richtungswechsel gebraucht werden. Die Leiter wird neben dem Feld ausgelegt; verschiedene Schrittmuster (jeder Fuß in jedes Feld, seitlicher Durchlauf, Icky Shuffle) werden in je zwei Durchgängen absolviert.',
      'Im Anschluss folgt Frequenzarbeit zwischen zwei Hütchen: zehn Sekunden maximale Seitwechsel. Wichtig ist die Erholungsqualität — zwischen den Durchgängen wird gegangen, nicht gelaufen, damit jeder Durchgang mit voller Frische und sauberer Technik absolviert werden kann. Der Blick löst sich dabei früh von der Leiter und wandert nach vorn, wie im Spiel zur Netzkante.',
    ],
  },
  'fw-08': {
    beschreibung: [
      'In der tiefen Rückhand-Ecke hat man zwei Möglichkeiten: den schwierigen Rückhand-Überkopfschlag — oder das Umlaufen, bei dem man sich so hinter den Shuttle arbeitet, dass die deutlich stärkere Vorhand spielbar bleibt. Diese Übung trainiert den zweiten, taktisch besseren Weg.',
      'Der Laufweg ist der Kern: Auftakt, Eindrehen über die Rückhandseite, zwei bis drei schnelle Schritte bewusst HINTER den gedachten Treffpunkt, dann Umsprung mit Vorhand-Überkopf-Schattenschlag. Die Kontrollfrage nach jeder Wiederholung: Stand der Körper seitlich-hinter dem Shuttle? Wer nur bis unter den Shuttle läuft, kann ihn lediglich noch nach hinten heben — deshalb ist die Rückhand in dieser Übung schlicht verboten.',
    ],
    skizze: {
      spieler: [{ pos: { x: 3.35, y: 3.05 }, label: 'A' }],
      huetchen: [{ x: 0.9, y: 1.0 }],
      laufwege: [
        { von: { x: 3.35, y: 3.05 }, bis: { x: 0.8, y: 0.8 }, gebogen: true },
        { von: { x: 1.0, y: 1.3 }, bis: { x: 3.1, y: 2.8 }, gebogen: true },
      ],
      hinweis:
        'Eindrehen und bewusst HINTER den Treffpunkt in der Rückhand-Ecke laufen, Umsprung mit Vorhand-Schattenschlag, Rückweg über die Mitte.',
    },
  },
  'fw-09': {
    beschreibung: [
      'Das partnergesteuerte Eckenlaufen simuliert die Belastung eines langen Ballwechsels: Die vier Feldecken sind nummeriert, der Partner ruft die Zahlen in unregelmäßiger Folge, gelaufen wird mit vollständigem Schattenschlag und Rückweg über die Mitte. Durch die Zurufe bleibt jede Wiederholung eine Reaktionsaufgabe.',
      'Die Rollenteilung macht die Übung selbstorganisierend: Wer gerade ansagt, hat Pause — so wechseln sich Belastung und Erholung automatisch ab. Der Ansager hat zudem eine Trainerrolle: Er passt das Tempo so an, dass die Laufwege vollständig und die Schattenschläge echt bleiben. Halbe Wege und Armwedeln gelten nicht.',
    ],
    skizze: {
      spieler: [
        { pos: { x: 3.35, y: 3.05 }, label: 'A' },
        { pos: { x: 7.4, y: 3.05 }, label: 'Z', partei: 'b' },
      ],
      huetchen: [
        { x: 5.9, y: 0.9 },
        { x: 5.9, y: 5.2 },
        { x: 1.0, y: 0.9 },
        { x: 1.0, y: 5.2 },
      ],
      laufwege: [
        { von: { x: 3.35, y: 3.05 }, bis: { x: 5.7, y: 1.1 } },
        { von: { x: 3.35, y: 3.05 }, bis: { x: 5.7, y: 5.0 } },
        { von: { x: 3.35, y: 3.05 }, bis: { x: 1.2, y: 1.1 } },
        { von: { x: 3.35, y: 3.05 }, bis: { x: 1.2, y: 5.0 } },
      ],
      hinweis:
        'Die Ecken sind 1–4 nummeriert; Z ruft in unregelmäßiger Folge, A läuft mit Schattenschlag und kehrt über die Mitte zurück.',
    },
  },
  'fw-10': {
    beschreibung: [
      'Dieses Pendel erzwingt echte Tiefe im Ausfallschritt: An der Netzlinie liegen vier Shuttles, die nacheinander aufgenommen und wieder abgelegt werden — greifen kann man nur, wenn der Ausfallschritt wirklich tief ist. Der Rumpf bleibt dabei aufrecht; wer mit rundem Rücken zum Shuttle „taucht", spürt sofort, warum die Technik wichtig ist.',
      'Gleichzeitig trainiert die Übung das Abstoppen: Der letzte Schritt muss lang und bremsend sein (Ferse zuerst), sonst trägt der Schwung ins Netz. Die Zeitnahme über drei Runden macht aus der Technikübung einen motivierenden Selbstwettkampf — mit dem eingebauten Qualitätsfilter, dass unsauberes Greifen automatisch langsamer ist.',
    ],
    skizze: {
      spieler: [{ pos: { x: 4.72, y: 3.05 }, label: 'A' }],
      huetchen: [
        { x: 6.3, y: 1.2 },
        { x: 6.3, y: 2.3 },
        { x: 6.3, y: 3.8 },
        { x: 6.3, y: 4.9 },
      ],
      laufwege: [
        { von: { x: 4.72, y: 3.05 }, bis: { x: 6.1, y: 1.4 } },
        { von: { x: 6.1, y: 2.3 }, bis: { x: 4.9, y: 3.0 }, gebogen: true },
        { von: { x: 4.72, y: 3.05 }, bis: { x: 6.1, y: 4.7 } },
        { von: { x: 6.1, y: 3.8 }, bis: { x: 4.9, y: 3.2 }, gebogen: true },
      ],
      hinweis:
        'Vier Shuttle-Positionen an der Netzlinie: per Ausfallschritt greifen bzw. ablegen, dazwischen immer zurück zum T-Punkt.',
    },
  },
  'fw-11': {
    beschreibung: [
      'Das Spiegel-Duell bringt Reaktionsschnelligkeit ins Lauftraining, ganz ohne Shuttle: Zwei Personen stehen sich auf zwei Feldhälften gegenüber, eine führt mit freien badmintonspezifischen Laufwegen, die andere spiegelt jede Bewegung so schnell und genau wie möglich — als wären beide durch ein unsichtbares Band verbunden.',
      'Für die spiegelnde Person ist das ein Wahrnehmungstraining: Der Blick gehört auf die Körpermitte der führenden Person, nicht auf deren Füße — die Hüfte verrät die Richtung zuerst. Für die führende Person ist es Täuschungstraining, besonders in der Variante mit angedeuteten und abgebrochenen Antritten. Der Rollenwechsel nach jeder Runde hält beide Aufgaben frisch.',
    ],
    skizze: {
      spieler: [
        { pos: { x: 4.72, y: 3.05 }, label: 'A' },
        { pos: { x: 8.68, y: 3.05 }, label: 'B', partei: 'b' },
      ],
      laufwege: [
        { von: { x: 4.72, y: 3.05 }, bis: { x: 3.4, y: 1.5 } },
        { von: { x: 8.68, y: 3.05 }, bis: { x: 10.0, y: 1.5 } },
      ],
      hinweis:
        'A führt mit freien Laufwegen, B spiegelt auf der eigenen Feldhälfte — Blick auf die Körpermitte, nicht auf die Füße.',
    },
  },
  'fw-12': {
    beschreibung: [
      'Schnelligkeit im Badminton entscheidet sich auf dem ersten Meter: Split-Step, fallender Körperschwerpunkt, explosiver erster Schritt. Dieser Drill trainiert genau diese Kette in Reinform — vier Hütchen bilden ein kleines Quadrat um die übende Person, der Partner gibt per Handzeichen die Richtung vor.',
      'Weil maximale Explosivität nur mit voller Erholung trainierbar ist, sind die Pausen Teil der Übung: zwischen den Serien eine volle Minute, und wer die Pausen verkürzt, trainiert Ausdauer statt Schnelligkeit. Die Variante mit Zahlen-Codes statt Handzeichen ergänzt eine kognitive Komponente — erst denken, dann explodieren, wie im Spiel.',
    ],
    skizze: {
      spieler: [
        { pos: { x: 3.35, y: 3.05 }, label: 'A' },
        { pos: { x: 7.4, y: 3.05 }, label: 'Z', partei: 'b' },
      ],
      huetchen: [
        { x: 2.35, y: 2.05 },
        { x: 4.35, y: 2.05 },
        { x: 2.35, y: 4.05 },
        { x: 4.35, y: 4.05 },
      ],
      laufwege: [
        { von: { x: 3.35, y: 3.05 }, bis: { x: 2.55, y: 2.25 } },
        { von: { x: 3.35, y: 3.05 }, bis: { x: 4.15, y: 2.25 } },
        { von: { x: 3.35, y: 3.05 }, bis: { x: 2.55, y: 3.85 } },
        { von: { x: 3.35, y: 3.05 }, bis: { x: 4.15, y: 3.85 } },
      ],
      hinweis:
        'Hütchen-Quadrat (2 m) um A; Z signalisiert die Richtung, A reagiert mit Split-Step und explosivem erstem Schritt, Hütchen berühren, zurück.',
    },
  },
}
