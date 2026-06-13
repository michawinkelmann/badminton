/** Ausführliche Beschreibungen & Skizzen — Aufwärmen (aw-01 … aw-10). */
import type { UebungsDetails } from './typen'

export const aufwaermenDetails: Record<string, UebungsDetails> = {
  'aw-01': {
    beschreibung: [
      'Das Lauf-ABC ist die klassische Einlaufform aus der Leichtathletik, übertragen auf die Badmintonhalle: Die Gruppe bewegt sich in verschiedenen Lauf- und Sprungformen über die Hallenbreite, jede Bahn hat eine eigene Aufgabe. Ziel ist nicht Tempo, sondern saubere, rhythmische Ausführung — Herz-Kreislauf-System, Fußgelenke und Koordination werden gleichzeitig vorbereitet.',
      'Organisatorisch reicht es, eine Start- und eine Ziellinie quer durch die Halle festzulegen (z. B. zwei Seitenlinien benachbarter Felder). Die Gruppe startet in Wellen von vier bis sechs Personen, der Rückweg wird locker getrabt und dient als Pause. Wer das Lauf-ABC regelmäßig an den Anfang der Stunde setzt, schafft ein verlässliches Einlauf-Ritual, das ohne Erklärung funktioniert.',
    ],
  },
  'aw-02': {
    beschreibung: [
      'Schattenbadminton heißt: alle Bewegungen des Spiels ausführen, nur ohne Shuttle. Die übende Person steht allein auf einer Feldhälfte, läuft aus der zentralen Position die typischen Wege in die Feldecken und deutet dort den passenden Schlag vollständig an — Überkopf-Clear hinten, Netzdrop vorn, Abwehr an der Seite. Weil kein Ball getroffen werden muss, liegt die ganze Aufmerksamkeit auf Laufwegen, Auftakt (Split-Step) und Schlagbewegung.',
      'Als Aufwärmform wird bewusst langsam begonnen: erst nur Laufwege, dann Wege mit Schattenschlag, zuletzt etwas Tempo. So werden genau die Bewegungsmuster aktiviert, die gleich im Training gebraucht werden. Die Übung braucht keinerlei Material und funktioniert mit beliebig vielen Personen parallel — jede:r auf einer (Halb-)Feldfläche.',
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
        'A läuft aus der zentralen Position nacheinander in alle sechs Feldbereiche und zeigt dort den Schattenschlag; nach jedem Weg zurück zur Mitte.',
    },
  },
  'aw-03': {
    beschreibung: [
      'Diese Mobilisationsreihe bereitet genau die Gelenke vor, die beim Badminton die Hauptarbeit leisten: Schulter, Handgelenk und Brustwirbelsäule. Alle Übungen werden im Stand ausgeführt, der Schläger dient dabei als leichtes Zusatzgewicht und macht die Bewegungen badmintonspezifisch — etwa beim Schlägerkreisen aus dem Handgelenk, das später die Unterarmrotation im Schlag vorbereitet.',
      'Die Reihe dauert nur wenige Minuten und gehört vor jedes Schlagtraining, besonders vor Überkopf-Einheiten (Clear, Smash). Sie eignet sich auch als ruhiger Auftakt, während die Gruppe eintrudelt: Jede Person kann sofort allein beginnen, es gibt keine Aufbau- oder Partnerabhängigkeit.',
    ],
  },
  'aw-04': {
    beschreibung: [
      'Werfen und Fangen klingt banal, ist aber für Badminton-Anfänger:innen doppelt wertvoll: Der Wurf über die Netzhöhe entspricht in seiner Mechanik fast exakt der Überkopf-Schlagbewegung (Ellbogen führt, Gewicht verlagert von hinten nach vorn) — wer gut wirft, lernt den Clear schneller. Die Fangaufgaben schulen nebenbei Reaktion und Starts.',
      'Die Paare stehen sich am Netz gegenüber und werfen den Shuttle in hohem Bogen zu; später wird auf Distanz geworfen. Beim Reaktionsfangen hält eine Person den Shuttle auf Schulterhöhe und lässt ihn fallen, die andere startet aus zwei Metern und versucht, ihn vor dem Boden zu fangen — ein einfacher, motivierender Wettkampf, der das Nervensystem aufweckt.',
    ],
    skizze: {
      spieler: [
        { pos: { x: 5.6, y: 3.05 }, label: 'A' },
        { pos: { x: 7.8, y: 3.05 }, label: 'B', partei: 'b' },
      ],
      shuttlewege: [{ von: { x: 5.7, y: 2.7 }, bis: { x: 7.7, y: 2.7 } }],
      hinweis:
        'A und B werfen den Shuttle in hohem Bogen über die Netzkante — die Wurfbewegung entspricht der Überkopf-Schlagtechnik.',
    },
  },
  'aw-05': {
    beschreibung: [
      'Seilspringen ist eine der effizientesten Aufwärmformen für Badminton: Es bringt den Puls hoch, aktiviert die Wadenmuskulatur und trainiert genau den federnden Ballenkontakt, der später beim Split-Step gebraucht wird. Das Intervallformat (45 Sekunden springen, 15 Sekunden Pause) hält die Belastung kontrollierbar.',
      'Die vier Runden steigern sich von beidbeinigen Sprüngen über Wechselsprünge bis zu einbeinigen Varianten. Wichtig ist die Qualität: flache Sprünge knapp über dem Boden, leise Landungen, Knie nie ganz gestreckt. Wer kein Seil hat, springt dieselben Formen ohne Seil — der Trainingseffekt für die Füße bleibt weitgehend erhalten.',
    ],
  },
  'aw-06': {
    beschreibung: [
      'Shuttle-Staffeln sind der bewährte spielerische Einstieg für Schul- und Anfängergruppen: Teams treten im Pendellauf gegeneinander an, transportiert wird dabei ein Shuttle auf der Schlägerfläche. Das zwingt zu kontrolliertem Laufen mit ruhiger Schlägerhand — eine versteckte Vorübung für die Schlägerkontrolle, verpackt in einen Wettkampf, der sofort Stimmung erzeugt.',
      'Aufbau: Teams à drei bis fünf Personen starten hinter der Grundlinie, das Wendehütchen steht an der gegenüberliegenden Aufschlaglinie. Die Rundenvarianten (zwei Shuttles, Ablegen und Aufnehmen am Wendepunkt) steigern die Schwierigkeit, ohne dass neu erklärt werden muss. Auf klare Laufgassen achten, damit sich die Teams nicht kreuzen.',
    ],
    skizze: {
      spieler: [
        { pos: { x: 0.4, y: 1.5 }, label: 'T1' },
        { pos: { x: 0.4, y: 3.05 }, label: 'T2' },
        { pos: { x: 0.4, y: 4.6 }, label: 'T3' },
      ],
      huetchen: [
        { x: 8.68, y: 1.5 },
        { x: 8.68, y: 3.05 },
        { x: 8.68, y: 4.6 },
      ],
      laufwege: [{ von: { x: 0.7, y: 1.5 }, bis: { x: 8.4, y: 1.5 } }],
      hinweis:
        'Teams starten an der Grundlinie, Wendepunkt an der gegenüberliegenden Aufschlaglinie — Shuttle auf der Schlägerfläche balancieren.',
    },
  },
  'aw-07': {
    beschreibung: [
      'Dynamisches Dehnen ersetzt vor dem Training das klassische Halten von Dehnpositionen: Die Muskulatur wird in Bewegung auf Länge gebracht und gleichzeitig aktiviert. Für Badminton stehen Hüfte und Beinrückseite im Mittelpunkt, denn der tiefe Ausfallschritt ans Netz verlangt genau diese Beweglichkeit — wer sie nicht hat, kompensiert mit rundem Rücken oder zu kurzen Schritten.',
      'Die vier Übungen (Ausfallschritte im Gehen, Beinpendel, tiefe Hocke, seitliche Ausfallschritte) lassen sich ohne Material in einer freien Hallenecke durchführen. Sie eignen sich direkt nach dem allgemeinen Einlaufen und vor den ersten Laufübungen — besonders vor Netz- und Footwork-Einheiten.',
    ],
  },
  'aw-08': {
    beschreibung: [
      'Die Einspiel-Rallye ist der Übergang vom Aufwärmen zum eigentlichen Training: Auf dem längs halbierten Feld spielt das Paar kontrolliert miteinander — erst kurze Netzbälle, dann flache Drives, zuletzt hohe Clears. Die Reihenfolge ist bewusst gewählt: von kleinen zu großen Bewegungen, von wenig zu viel Armschwung, so werden Schulter und Timing schonend hochgefahren.',
      'Entscheidend ist der kooperative Charakter: Es geht um lange Ballwechsel, nicht um Punkte. Eine Zielvorgabe wie „zehn Kontakte am Stück, dann Tempo leicht steigern" hält die Qualität hoch. Durch die Längs-Halbierung können vier Personen pro Feld gleichzeitig einspielen.',
    ],
    skizze: {
      spieler: [
        { pos: { x: 4.4, y: 1.7 }, label: 'A' },
        { pos: { x: 9.0, y: 1.7 }, label: 'B', partei: 'b' },
      ],
      zonen: [{ x: 0, y: 0, b: 13.4, h: 3.05, label: 'Halbfeld längs' }],
      shuttlewege: [
        { von: { x: 5.9, y: 1.7 }, bis: { x: 7.5, y: 1.7 } },
        { von: { x: 8.9, y: 1.4 }, bis: { x: 4.5, y: 1.4 } },
      ],
      hinweis:
        'Einspielen auf der halben Feldbreite: erst Netzdrops, dann Drives, dann Clears — zwei Paare pro Feld möglich.',
    },
  },
  'aw-09': {
    beschreibung: [
      'Diese Reaktionsübung verbindet Aufwärmen mit dem wichtigsten Timing-Baustein des Badmintons: dem Split-Step vor dem Antritt. Die übende Person steht am T-Punkt, die Partnerin hält einen Shuttle an der Netzkante in der ausgestreckten Hand und lässt ihn ohne Vorwarnung fallen. Aufgabe: mit Auftakthüpfer starten und den Shuttle fangen, bevor er den Boden berührt.',
      'Der Reiz liegt in der Dosierbarkeit: Über den Startabstand lässt sich die Schwierigkeit stufenlos einstellen — ideal ist eine Erfolgsquote um 70 Prozent, dann bleibt die Übung fordernd und motivierend zugleich. Nebenbei wird der lange letzte Ausfallschritt ans Netz automatisch mittrainiert.',
    ],
    skizze: {
      spieler: [
        { pos: { x: 4.72, y: 3.05 }, label: 'A' },
        { pos: { x: 6.4, y: 2.3 }, label: 'Z', partei: 'b' },
      ],
      laufwege: [{ von: { x: 4.72, y: 3.05 }, bis: { x: 6.2, y: 2.4 } }],
      hinweis:
        'Z lässt den Shuttle an der Netzkante fallen, A startet mit Split-Step vom T-Punkt und fängt ihn vor dem Boden.',
    },
  },
  'aw-10': {
    beschreibung: [
      'Der Aufwärm-Parcours nutzt die Feldlinien als Stationen-Rundkurs: An jeder Seite des Felds wartet eine andere Bewegungsaufgabe (Sidesteps, Rückwärtslaufen, Hopserlauf, Ausfallschritte am Netz), an den Ecken wird mit Split-Step die Richtung gewechselt. So entsteht ein abwechslungsreiches Aufwärmen, das bereits alle badmintontypischen Bewegungsrichtungen enthält.',
      'Die Gruppe startet versetzt im Abstand von etwa zehn Sekunden, dadurch ist das Feld gleichmäßig gefüllt und niemand wartet lange. Vier bis sechs Runden pro Person reichen; die angekündigte „Tempo-Runde" am Ende setzt einen motivierenden Schlusspunkt. Der Parcours funktioniert auf jedem freien Feld und braucht nur vier Hütchen.',
    ],
    skizze: {
      spieler: [{ pos: { x: 0.4, y: 0.4 }, label: 'A' }],
      huetchen: [
        { x: 0.15, y: 0.15 },
        { x: 6.55, y: 0.15 },
        { x: 6.55, y: 5.95 },
        { x: 0.15, y: 5.95 },
      ],
      laufwege: [
        { von: { x: 0.6, y: 0.15 }, bis: { x: 6.3, y: 0.15 } },
        { von: { x: 6.55, y: 0.5 }, bis: { x: 6.55, y: 5.6 } },
        { von: { x: 6.3, y: 5.95 }, bis: { x: 0.6, y: 5.95 } },
        { von: { x: 0.15, y: 5.6 }, bis: { x: 0.15, y: 0.5 } },
      ],
      hinweis:
        'Rundkurs um die Feldhälfte: jede Seite eine andere Laufform, an jedem Eck-Hütchen Split-Step und Richtungswechsel; am Netz Ausfallschritte.',
    },
  },
}
