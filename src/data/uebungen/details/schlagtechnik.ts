/** Ausführliche Beschreibungen & Skizzen — Schlagtechnik (st-01 … st-20). */
import type { UebungsDetails } from './typen'

export const schlagtechnikDetails: Record<string, UebungsDetails> = {
  'st-01': {
    beschreibung: [
      'Die Grundübung für den Vorhand-Überkopf-Clear: Eine Person übt ausschließlich den Schlag, die andere liefert verlässliche hohe Zuspiele. Durch diese Arbeitsteilung entsteht eine ruhige, wiederholbare Lernsituation — der Shuttle kommt immer ähnlich an, sodass sich die übende Person ganz auf Stellung, Ausholbewegung und Treffpunkt konzentrieren kann.',
      'Die übende Person steht im Mitte-Hinterfeld, der Zuspieler auf der Gegenseite etwa in Feldmitte. Jeder Clear soll hoch und weit in Richtung gegnerische Grundlinie fliegen; danach kurz die Grundspannung neu aufbauen. Gearbeitet wird in festen Serien mit Rollentausch — so bleibt auch das Zuspielen (eine eigene Fertigkeit!) im Training.',
    ],
    skizze: {
      spieler: [
        { pos: { x: 2.0, y: 3.05 }, label: 'A' },
        { pos: { x: 9.5, y: 3.05 }, label: 'Z', partei: 'b' },
      ],
      shuttlewege: [
        { von: { x: 9.2, y: 3.5 }, bis: { x: 2.4, y: 3.5 } },
        { von: { x: 2.2, y: 2.6 }, bis: { x: 12.6, y: 2.6 } },
      ],
      hinweis:
        'Z spielt hohe Bälle ins Hinterfeld, A antwortet mit hohen, weiten Clears Richtung Grundlinie.',
    },
  },
  'st-02': {
    beschreibung: [
      'Länge ist die wichtigste Eigenschaft eines guten Clears: Ein kurzer Clear lädt den Gegner zum Smash ein, ein langer drückt ihn an die Grundlinie. Diese Übung macht Länge messbar — mit Klebeband wird eine schmale Zielzone direkt vor der Grundlinie markiert, und nur Treffer dort zählen.',
      'Der Zuspieler bringt hohe Bälle, die übende Person spielt Serien von 15 Clears und zählt laut mit. Im zweiten Durchgang wird diagonal gespielt: Die lange Diagonale verlangt noch mehr Druck aus Unterarmrotation und Gewichtsverlagerung. Konkrete Zielvorgaben (z. B. „8 von 15") machen Fortschritt von Woche zu Woche sichtbar.',
    ],
    skizze: {
      spieler: [
        { pos: { x: 2.0, y: 3.05 }, label: 'A' },
        { pos: { x: 9.5, y: 3.05 }, label: 'Z', partei: 'b' },
      ],
      zonen: [{ x: 12.8, y: 0.46, b: 0.6, h: 5.18, label: 'Ziel' }],
      shuttlewege: [
        { von: { x: 2.2, y: 2.6 }, bis: { x: 13.0, y: 2.6 } },
        { von: { x: 2.2, y: 3.4 }, bis: { x: 13.0, y: 4.9 } },
      ],
      hinweis:
        'Zielzone: die letzten 60 cm vor der Grundlinie. Clears längs und diagonal — nur Treffer in der Zone zählen.',
    },
  },
  'st-03': {
    beschreibung: [
      'Der Überkopf-Drop lebt von Präzision: Er soll möglichst nah hinter dem Netz landen, damit der Gegner weit laufen und von unten spielen muss. Reifen oder Klebebandfelder im gegnerischen Vorfeld machen diese Präzision sichtbar und zählbar — ein Ziel nahe der Netzmitte, eines in der Ecke.',
      'Entscheidend ist die Täuschung: Ausholbewegung und Körpereinsatz sehen exakt aus wie beim Clear, erst im Treffpunkt wird das Tempo herausgenommen. Der Zuspieler hat deshalb eine Doppelrolle — er bringt nicht nur die hohen Bälle, sondern gibt auch Rückmeldung, ob Clear und Drop wirklich gleich aussehen.',
    ],
    skizze: {
      spieler: [
        { pos: { x: 2.0, y: 3.05 }, label: 'A' },
        { pos: { x: 10.0, y: 3.05 }, label: 'Z', partei: 'b' },
      ],
      zonen: [
        { x: 7.0, y: 2.7, b: 0.6, h: 0.6, label: '1' },
        { x: 7.0, y: 0.8, b: 0.6, h: 0.6, label: '2' },
      ],
      shuttlewege: [
        { von: { x: 2.2, y: 3.0 }, bis: { x: 7.3, y: 3.0 } },
        { von: { x: 2.2, y: 2.5 }, bis: { x: 7.3, y: 1.1 } },
      ],
      hinweis:
        'Drops aus dem Hinterfeld abwechselnd auf beide markierten Ziele knapp hinter dem Netz.',
    },
  },
  'st-04': {
    beschreibung: [
      'Wer Clear und Drop aus identischer Ausholbewegung spielen kann, ist für den Gegner nicht mehr lesbar — genau das trainiert diese Übung. Der Zuspieler ruft erst kurz vor dem Treffpunkt „lang" oder „kurz", sodass die Entscheidung fallen muss, wenn die Ausholbewegung längst läuft.',
      'Damit verlagert sich der Fokus von der reinen Schlagtechnik auf den Umschaltmoment: gleiche Vorbereitung, späte Entscheidung, unterschiedliche Ausführung nur im letzten Moment. In der schwersten Variante entfällt die Ansage ganz — die übende Person beobachtet stattdessen die Position des Zuspielers und entscheidet gegenläufig (rückt er vor, kommt der Clear).',
    ],
    skizze: {
      spieler: [
        { pos: { x: 2.0, y: 3.05 }, label: 'A' },
        { pos: { x: 9.5, y: 3.05 }, label: 'Z', partei: 'b' },
      ],
      zonen: [
        { x: 12.5, y: 0.46, b: 0.9, h: 5.18, label: 'lang' },
        { x: 6.9, y: 0.46, b: 1.2, h: 5.18, label: 'kurz' },
      ],
      shuttlewege: [
        { von: { x: 2.2, y: 2.6 }, bis: { x: 12.8, y: 2.6 } },
        { von: { x: 2.2, y: 3.5 }, bis: { x: 7.4, y: 3.5 } },
      ],
      hinweis:
        'Z ruft kurz vor dem Treffpunkt „lang" oder „kurz" — A setzt mit identischer Ausholbewegung um.',
    },
  },
  'st-05': {
    beschreibung: [
      'Smash-Training in kurzen Serien: Der Zuspieler bringt halbhohe Bälle (geworfen oder aus dem Shuttle-Korb geschlagen) ins Mitte-Hinterfeld, gesmasht wird in Dreierserien mit Pause dazwischen. Die Serienform hält die Qualität hoch — nach drei Smashes sinkt die Spannung im Schlagarm spürbar, also kommt die Pause genau richtig.',
      'Technisch zählt der Winkel mehr als die reine Härte: Treffpunkt deutlich vor dem Körper, Schlagfläche zeigt beim Treffen schräg nach unten, das Handgelenk „schnappt über den Shuttle". Ein Smash, der steil auf Höhe der hinteren Aufschlaglinie einschlägt, ist wertvoller als ein harter, flacher Ball in Rückhandreichweite des Gegners.',
    ],
    skizze: {
      spieler: [
        { pos: { x: 2.2, y: 3.05 }, label: 'A' },
        { pos: { x: 9.0, y: 3.05 }, label: 'Z', partei: 'b' },
      ],
      shuttlewege: [
        { von: { x: 8.7, y: 3.5 }, bis: { x: 2.6, y: 3.5 } },
        { von: { x: 2.4, y: 2.6 }, bis: { x: 9.6, y: 2.6 } },
      ],
      hinweis:
        'Halbhohes Zuspiel ins Hinterfeld, Smash in 3er-Serien — steil vor den Zuspieler statt hart und flach.',
    },
  },
  'st-06': {
    beschreibung: [
      'Ein platzierter Smash an die Seitenlinie ist schwerer abzuwehren als ein harter auf den Körper — der Verteidiger muss den Schläger erst zur Seite bringen. Diese Übung verschiebt deshalb den Fokus von der Kraft zur Platzierung: Beide Doppel-Seitenbahnen des gegnerischen Felds werden zu Zielzonen, gesmasht wird bewusst mit nur etwa 80 Prozent Kraft.',
      'Die übende Person smasht abwechselnd in die linke und rechte Bahn; getroffene Bahnen zählen als Punkt, Smashes auf den Körper des Zuspielers ausdrücklich nicht. Der Abschlusswettkampf mit Punktwertung bringt Spielnähe — und zeigt schnell, dass die Schulterachse schon im Absprung zur Zielseite zeigen muss.',
    ],
    skizze: {
      spieler: [
        { pos: { x: 2.2, y: 3.05 }, label: 'A' },
        { pos: { x: 10.0, y: 3.05 }, label: 'Z', partei: 'b' },
      ],
      zonen: [
        { x: 6.7, y: 0, b: 6.7, h: 0.46, label: 'Zielbahn' },
        { x: 6.7, y: 5.64, b: 6.7, h: 0.46, label: 'Zielbahn' },
      ],
      shuttlewege: [
        { von: { x: 2.4, y: 2.8 }, bis: { x: 10.5, y: 0.3 } },
        { von: { x: 2.4, y: 3.3 }, bis: { x: 10.5, y: 5.8 } },
      ],
      hinweis:
        'Smashes abwechselnd in beide Seitenbahnen — Platzierung vor Härte (80 % Kraft).',
    },
  },
  'st-07': {
    beschreibung: [
      'Das Drive-Duell ist das klassische Tempo-Training für das Mittelfeld: Beide stehen sich auf Höhe der vorderen Aufschlaglinien gegenüber und spielen den Shuttle flach und hart hin und her. Auf dieser kurzen Distanz bleibt keine Zeit für große Bewegungen — der Schläger muss vor dem Körper bleiben, der Rückhandgriff ist Grundstellung, geschlagen wird fast nur aus Unterarm und Handgelenk.',
      'Gespielt wird kooperativ in Minuten-Intervallen: Ziel ist, den Ballwechsel am Leben zu halten und das Tempo gemeinsam zu steigern, nicht den Punkt zu machen. Wer das Duell als Wettkampf spielen will, nimmt die Variante auf Punkte — dann zeigt sich sofort, wessen Schläger nach dem Schlag zu tief hängt.',
    ],
    skizze: {
      spieler: [
        { pos: { x: 4.5, y: 3.05 }, label: 'A' },
        { pos: { x: 8.9, y: 3.05 }, label: 'B', partei: 'b' },
      ],
      shuttlewege: [
        { von: { x: 4.8, y: 2.7 }, bis: { x: 8.6, y: 2.7 } },
        { von: { x: 8.6, y: 3.4 }, bis: { x: 4.8, y: 3.4 } },
      ],
      hinweis:
        'Beide auf Höhe der vorderen Aufschlaglinie: flache, harte Drives im Dauerfeuer — Schläger bleibt vor dem Körper.',
    },
  },
  'st-08': {
    beschreibung: [
      'Der kurze Rückhand-Aufschlag ist im Doppel Standard und im Einzel eine wichtige Variante — und er ist reine Präzisionsarbeit, die sich hervorragend allein trainieren lässt. Zwei kleine Zielzonen direkt hinter der gegnerischen vorderen Aufschlaglinie (an der Mittellinie und außen) geben die beiden taktisch wichtigsten Ziele vor.',
      'Aus dem Shuttle-Korb werden Serien geschlagen: Shuttle an den Federn halten, kurzer Schub aus dem Unterarm, Flugkurve flach über die Netzkante, sodass der Shuttle direkt hinter der Linie „stirbt". Wer die Treffer notiert, sieht über die Wochen eine der ehrlichsten Fortschrittskurven im Badminton — beim Aufschlag entscheidet nur die eigene Routine.',
    ],
    skizze: {
      spieler: [{ pos: { x: 4.0, y: 1.9 }, label: 'A' }],
      zonen: [
        { x: 8.75, y: 2.65, b: 0.4, h: 0.4, label: '1' },
        { x: 8.75, y: 0.6, b: 0.4, h: 0.4, label: '2' },
      ],
      shuttlewege: [
        { von: { x: 4.3, y: 1.9 }, bis: { x: 8.85, y: 2.8 } },
        { von: { x: 4.3, y: 1.6 }, bis: { x: 8.85, y: 0.85 } },
      ],
      hinweis:
        'Kurze Rückhand-Aufschläge flach über die Netzkante auf zwei kleine Zonen direkt hinter der T-Linie (Mitte und außen).',
    },
  },
  'st-09': {
    beschreibung: [
      'Der hohe, lange Vorhand-Aufschlag ist im Einzel die sichere Eröffnung: Er drückt den Gegner ganz nach hinten und gibt Zeit, die eigene Grundposition einzunehmen. Damit er das leistet, muss der Shuttle steil fallend im letzten Meter der Aufschlagfläche landen — genau dieser Bereich wird als Zielzone markiert.',
      'Die Bewegung gleicht einem Unterhand-Wurf: Schrittstellung, Shuttle vor dem Körper fallen lassen, Hüfte dreht ein, der Schläger schwingt von tief nach hoch vollständig durch. Wichtigste Kontrolle ist die Fallrichtung: Ein guter langer Aufschlag kommt fast senkrecht herunter; rutscht der Shuttle flach in die Zone, fehlt Höhe und der Gegner kann ihn früh abfangen.',
    ],
    skizze: {
      spieler: [{ pos: { x: 3.9, y: 1.9 }, label: 'A' }],
      zonen: [{ x: 12.4, y: 3.05, b: 1.0, h: 2.59, label: 'Ziel' }],
      shuttlewege: [{ von: { x: 4.2, y: 2.0 }, bis: { x: 12.8, y: 4.3 } }],
      hinweis:
        'Hoher Vorhand-Aufschlag diagonal: Der Shuttle soll steil fallend im letzten Meter der Aufschlagfläche landen.',
    },
  },
  'st-10': {
    beschreibung: [
      'Im Spiel kommt der Netzdrop nie aus dem Stand — man läuft hin, spielt und muss sofort wieder weg. Diese Übung baut deshalb den kompletten Bewegungszyklus ein: Start am T-Punkt mit Split-Step, langer Ausfallschritt in die Netzecke, Treffpunkt so früh und hoch wie möglich, enger Drop über die Kante, rückwärts zurück zur Mitte.',
      'Der Zuspieler bedient abwechselnd die Vorhand- und Rückhandseite, sodass beide Ausfallschritt-Varianten trainiert werden. Je früher der Treffpunkt, desto mehr Optionen: Wer den Shuttle erst kurz über dem Boden erreicht, kann nur noch heben — deshalb gilt: Schlägerarm schon im Lauf vorstrecken.',
    ],
    skizze: {
      spieler: [
        { pos: { x: 4.72, y: 3.05 }, label: 'A' },
        { pos: { x: 7.6, y: 3.05 }, label: 'Z', partei: 'b' },
      ],
      laufwege: [
        { von: { x: 4.72, y: 3.05 }, bis: { x: 6.1, y: 1.5 } },
        { von: { x: 4.72, y: 3.05 }, bis: { x: 6.1, y: 4.6 } },
      ],
      shuttlewege: [
        { von: { x: 7.4, y: 2.6 }, bis: { x: 6.2, y: 1.7 } },
        { von: { x: 7.4, y: 3.5 }, bis: { x: 6.2, y: 4.4 } },
      ],
      hinweis:
        'Z bedient abwechselnd beide Netzecken; A läuft vom T-Punkt mit Ausfallschritt hin, spielt den Drop eng und arbeitet zurück zur Mitte.',
    },
  },
  'st-11': {
    beschreibung: [
      'Der Unterhand-Lob vom Netz ist die sichere Antwort auf einen guten Netzdrop des Gegners: hoch genug, dass niemand ihn abfangen kann, und lang genug, dass der Gegner ganz nach hinten muss. Beides wird hier gezielt trainiert — die Zielzone sind die letzten 80 Zentimeter vor der Grundlinie.',
      'Der Partner spielt Netzdrops, die übende Person antwortet im Wechsel mit Vorhand- und Rückhand-Lobs in die Zone. Die Höhe wird bewusst übertrieben: Als Maßstab gilt ein gedachter Gegner mit ausgestrecktem Schläger am Netz, über den der Lob sicher hinwegfliegen muss. Erst wenn Höhe und Länge stimmen, kommt als Feinschliff die Täuschung aus der angedeuteten Netzdrop-Haltung dazu.',
    ],
    skizze: {
      spieler: [
        { pos: { x: 5.8, y: 2.4 }, label: 'A' },
        { pos: { x: 7.7, y: 3.05 }, label: 'Z', partei: 'b' },
      ],
      zonen: [{ x: 12.6, y: 0.46, b: 0.8, h: 5.18, label: 'Ziel' }],
      shuttlewege: [
        { von: { x: 7.5, y: 2.7 }, bis: { x: 6.1, y: 2.4 } },
        { von: { x: 5.95, y: 2.3 }, bis: { x: 12.9, y: 3.0 } },
      ],
      hinweis:
        'Z spielt Netzdrops, A hebt hoch und tief in die markierte Zone vor der Grundlinie — Höhe vor Länge.',
    },
  },
  'st-12': {
    beschreibung: [
      'Der Netz-Kill bestraft jeden zu hohen Ball über der Netzkante — aber nur, wenn die Bewegung stimmt: kurzer „Stich" aus dem Handgelenk steil nach unten, ohne Ausholen. Wer ausholt, trifft entweder das Netz (Fehler) oder kommt zu spät. Genau dieses kompakte Schlagmuster wird hier in hoher Wiederholungszahl eingeschliffen.',
      'Der Zuspieler bringt Shuttles knapp über Netzkantenhöhe ins Vorfeld, die übende Person steht einen Schritt hinter dem Netz und tötet konsequent nach unten. Nach jedem Kill geht der Schläger sofort wieder hoch — im Spiel kommt der nächste Ball schneller, als man denkt. Die Profi-Variante mischt knappe Bälle dazu, bei denen statt des Kills der weiche Netzdrop die richtige Wahl ist.',
    ],
    skizze: {
      spieler: [
        { pos: { x: 5.8, y: 3.05 }, label: 'A' },
        { pos: { x: 7.8, y: 3.05 }, label: 'Z', partei: 'b' },
      ],
      shuttlewege: [
        { von: { x: 7.6, y: 2.7 }, bis: { x: 6.3, y: 2.7 } },
        { von: { x: 6.1, y: 3.3 }, bis: { x: 7.5, y: 3.6 } },
      ],
      hinweis:
        'Z wirft knapp über Netzkantenhöhe, A tötet mit kurzem Handgelenksschlag steil nach unten — ohne Ausholen, ohne Netzberührung.',
    },
  },
  'st-13': {
    beschreibung: [
      'Die beste Antwort auf einen Smash ist oft nicht der Gegenschlag, sondern der ruhige Block: Der Schläger wird dem Shuttle nur entgegengehalten, der lockere Griff schluckt das Tempo, und der Ball fällt kurz hinter das Netz — dorthin, wo der smashende Gegner gerade nicht ist. So dreht sich der Ballwechsel: Aus der Abwehr wird Angriff.',
      'Der Angreifer smasht kontrolliert mit 70 bis 80 Prozent aus dem Hinterfeld, die verteidigende Person steht mittig-tief mit Rückhandgriff vor dem Körper. Der häufigste Fehler ist der verkrampfte Griff: Dann springt der Block weit ins Mittelfeld und lädt zum Nachsmash ein. Merkhilfe: Griffdruck erst im Treffmoment leicht erhöhen, davor bleibt die Hand weich.',
    ],
    skizze: {
      spieler: [
        { pos: { x: 3.8, y: 3.05 }, label: 'A' },
        { pos: { x: 11.2, y: 3.05 }, label: 'B', partei: 'b' },
      ],
      shuttlewege: [
        { von: { x: 11.0, y: 2.7 }, bis: { x: 4.1, y: 2.7 } },
        { von: { x: 4.0, y: 3.3 }, bis: { x: 7.5, y: 3.4 } },
      ],
      hinweis:
        'B smasht aus dem Hinterfeld, A blockt mit lockerem Griff kurz hinter das Netz — Tempo schlucken statt schlagen.',
    },
  },
  'st-14': {
    beschreibung: [
      'Der Unterhand-Clear (auch Befreiungs-Lob) ist der Rettungsschlag, wenn der Gegner Druck macht: Ein tiefer Ball wird hoch und weit zur Grundlinie gespielt — das kauft Zeit, um die eigene Position zu ordnen, und nimmt dem Gegner den Angriffswinkel. Schlecht ausgeführt ist er allerdings eine Einladung: Ein kurzer, flacher Befreiungsball wird sofort totgesmasht.',
      'Der Partner spielt halbschnelle Bälle auf Knie- bis Hüfthöhe ins Mittelfeld, abwechselnd auf die Vorhand- und Rückhandseite. Die übende Person geht mit dem Ausfallschritt zum Shuttle, trifft vor dem Knie und schwingt kräftig von unten nach oben durch. Die Höhe darf ruhig übertrieben wirken — im Zweifel ist zu hoch immer besser als zu flach.',
    ],
    skizze: {
      spieler: [
        { pos: { x: 3.5, y: 3.05 }, label: 'A' },
        { pos: { x: 9.0, y: 3.05 }, label: 'Z', partei: 'b' },
      ],
      shuttlewege: [
        { von: { x: 8.7, y: 3.5 }, bis: { x: 4.0, y: 3.5 } },
        { von: { x: 3.7, y: 2.7 }, bis: { x: 12.8, y: 2.7 } },
      ],
      hinweis:
        'Z spielt halbschnell ins Mittelfeld, A befreit mit dem Unterhand-Clear hoch und weit zur Grundlinie.',
    },
  },
  'st-15': {
    beschreibung: [
      'Der Rückhand-Überkopf-Clear gilt als schwierigster Grundschlag: Man steht mit dem Rücken zum Netz, sieht den Gegner nicht und muss die Kraft aus einer kurzen Unterarm-Außenrotation holen statt aus dem großen Schwung. Er ist der Notschlag für Bälle in der tiefen Rückhand-Ecke, die sich nicht mehr umlaufen lassen — und genau so wird er hier trainiert.',
      'Der Zuspieler legt die Bälle bewusst so, dass Umlaufen unmöglich ist. Die übende Person dreht ein, der Ellbogen zeigt zum Shuttle, der Treffpunkt liegt hoch über der Schulter, und der „Daumen schiebt" durch den Schlag. Gearbeitet wird in kurzen Serien mit viel Pause: Dieser Schlag lebt von Präzision, nicht von Masse. Realistisches Zwischenziel ist das hintere Felddrittel, die Grundlinie das Endziel.',
    ],
    skizze: {
      spieler: [
        { pos: { x: 0.9, y: 1.0 }, label: 'A' },
        { pos: { x: 9.2, y: 1.6 }, label: 'Z', partei: 'b' },
      ],
      zonen: [{ x: 11.2, y: 0.46, b: 2.2, h: 5.18, label: 'Ziel' }],
      shuttlewege: [
        { von: { x: 8.9, y: 1.3 }, bis: { x: 1.3, y: 1.0 } },
        { von: { x: 1.1, y: 1.3 }, bis: { x: 12.0, y: 2.2 } },
      ],
      hinweis:
        'Zuspiel tief in die Rückhand-Ecke (Umlaufen unmöglich) — A befreit mit dem Rückhand-Überkopf-Clear mindestens ins hintere Drittel.',
    },
  },
  'st-16': {
    beschreibung: [
      'Das Wand-Drive-Training ist die beste Solo-Übung für schnelle Hände: Der Shuttle wird flach gegen eine freie Hallenwand gespielt und direkt wieder angenommen — die Wand „antwortet" sofort, schneller als jeder Partner. Dadurch entsteht eine Schlagfrequenz, die im normalen Spiel kaum erreichbar ist.',
      'Mit zwei bis drei Metern Wandabstand werden Vorhand- und Rückhand-Drives im freien Wechsel gespielt, der Schläger bleibt dabei ständig vor dem Körper. Ein alter Shuttle reicht völlig. Der Rekordzähler (Wandkontakte ohne Fehler) macht die Übung zum Selbstwettkampf — ideal auch als Zusatzaufgabe, wenn Felder knapp sind.',
    ],
  },
  'st-17': {
    beschreibung: [
      'Im Spiel schlägt man nie mit Ruhepuls auf — meist kommt der Aufschlag direkt nach einem anstrengenden Ballwechsel. Diese Übung stellt genau diese Situation nach: 20 Sekunden hochintensives Schattenbadminton treiben den Puls, unmittelbar danach folgen fünf Aufschläge auf markierte Ziele, abwechselnd kurz mit der Rückhand und lang mit der Vorhand.',
      'Der Vergleich der Trefferquote mit ruhigen Serien zeigt, wie stark der Puls die Präzision beeinflusst — und trainiert die wichtigste Gegenmaßnahme: die feste Aufschlag-Routine. Stand sortieren, einmal durchatmen, dann erst aufschlagen. Diese drei Sekunden Ruhe sind im Wettkampf Gold wert.',
    ],
    skizze: {
      spieler: [{ pos: { x: 3.9, y: 2.0 }, label: 'A' }],
      zonen: [
        { x: 8.75, y: 2.65, b: 0.4, h: 0.4, label: 'kurz' },
        { x: 12.4, y: 3.05, b: 1.0, h: 2.59, label: 'lang' },
      ],
      shuttlewege: [
        { von: { x: 4.2, y: 1.9 }, bis: { x: 8.85, y: 2.8 } },
        { von: { x: 4.2, y: 2.3 }, bis: { x: 12.8, y: 4.3 } },
      ],
      hinweis:
        'Erst 20 Sekunden Schattenbadminton (Puls hoch), direkt danach 5 Aufschläge im Wechsel kurz/lang auf die Ziele.',
    },
  },
  'st-18': {
    beschreibung: [
      'Multishuttle heißt: Der Zuspieler wirft aus einem vollen Korb in festem Takt, gespielt wird ohne Unterbrechung — der nächste Shuttle kommt, egal ob der letzte gut war. Diese Form erzeugt im Vorfeld eine Wiederholungsdichte, die mit normalem Spielbetrieb unerreichbar ist.',
      'Die übende Person arbeitet vom T-Punkt aus: knappe Bälle werden als enger Netzdrop gespielt, leicht zu hohe sofort getötet. Zwischen den Schlägen geht es immer zurück zur Mitte, der Schlägerkopf bleibt dabei auf Netzhöhe. Die ständige Entscheidung „Drop oder Kill?" macht die Übung auch kognitiv anspruchsvoll — gute Zuspieler mischen unberechenbar.',
    ],
    skizze: {
      spieler: [
        { pos: { x: 4.72, y: 3.05 }, label: 'A' },
        { pos: { x: 7.1, y: 0.5 }, label: 'Z', partei: 'b' },
      ],
      laufwege: [
        { von: { x: 4.72, y: 3.05 }, bis: { x: 6.0, y: 1.8 } },
        { von: { x: 4.72, y: 3.05 }, bis: { x: 6.0, y: 4.3 } },
      ],
      shuttlewege: [
        { von: { x: 6.95, y: 0.8 }, bis: { x: 6.1, y: 2.0 } },
        { von: { x: 7.1, y: 0.9 }, bis: { x: 6.2, y: 4.1 } },
      ],
      hinweis:
        'Z wirft vom Netzpfosten im 2-Sekunden-Takt ins Vorfeld; A entscheidet pro Ball: enger Netzdrop oder Kill — danach zurück zur Mitte.',
    },
  },
  'st-19': {
    beschreibung: [
      'Das Hinterfeld-Pendant zum Vorfeld-Multishuttle: Hohe Zuspiele kommen im Drei-Sekunden-Takt, und beim Anwurf fällt per Zuruf die Entscheidung — „Clear", „Drop" oder „Smash". So werden alle drei Überkopfschläge unter Belastung und mit ständigem Umschalten trainiert, genau wie im Spiel.',
      'Zwischen den Bällen läuft die übende Person konsequent zur Feldmitte zurück; ohne diesen Rückweg verliert die Übung ihren Wert. Der Zuspieler achtet zusätzlich darauf, dass alle drei Schläge aus derselben Ausholbewegung kommen — sehen Clear, Drop und Smash unterschiedlich aus, liest jeder Gegner die Absicht sofort.',
    ],
    skizze: {
      spieler: [
        { pos: { x: 3.0, y: 3.05 }, label: 'A' },
        { pos: { x: 8.5, y: 3.05 }, label: 'Z', partei: 'b' },
      ],
      laufwege: [
        { von: { x: 3.0, y: 3.05 }, bis: { x: 1.4, y: 1.4 } },
        { von: { x: 3.0, y: 3.05 }, bis: { x: 1.4, y: 4.7 } },
      ],
      shuttlewege: [
        { von: { x: 8.2, y: 2.6 }, bis: { x: 1.7, y: 1.6 } },
        { von: { x: 8.2, y: 3.5 }, bis: { x: 1.7, y: 4.5 } },
      ],
      hinweis:
        'Hohe Zuspiele im Takt in beide Hinterfeld-Ecken; Zuruf entscheidet: Clear, Drop oder Smash — dazwischen zurück über die Mitte.',
    },
  },
  'st-20': {
    beschreibung: [
      'Der Sprungsmash wird hier methodisch aufgebaut statt einfach probiert: Stufe 1 festigt den Standsmash mit hohem Treffpunkt, Stufe 2 ergänzt den beidbeinigen Block-Sprung am Ort, Stufe 3 bringt den Umsprung (Scissor Jump) dazu, bei dem die Beine in der Luft scheren und die Landung schon den Zug nach vorn einleitet.',
      'Jede Stufe umfasst nur wenige Bälle mit viel Pause — Sprungkraft und Koordination brauchen Frische, sonst leidet zuerst die Landetechnik. Genau die ist hier das heimliche Hauptthema: federnde Landung über die Ballen, Knie leicht gebeugt. Wer die Landung beherrscht, springt im Spiel öfter und bleibt verletzungsfrei.',
    ],
    skizze: {
      spieler: [
        { pos: { x: 2.4, y: 3.05 }, label: 'A' },
        { pos: { x: 9.0, y: 3.05 }, label: 'Z', partei: 'b' },
      ],
      shuttlewege: [
        { von: { x: 8.7, y: 3.5 }, bis: { x: 2.8, y: 3.5 } },
        { von: { x: 2.6, y: 2.6 }, bis: { x: 9.8, y: 2.6 } },
      ],
      hinweis:
        'Drei Stufen am selben Ort: Standsmash → Block-Sprung → Umsprung mit Scherbewegung; Landung immer federnd über die Ballen.',
    },
  },
}
