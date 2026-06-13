/** Ausführliche Beschreibungen & Skizzen — Kondition (ko) und Spielformen (sf). */
import type { UebungsDetails } from './typen'

export const konditionDetails: Record<string, UebungsDetails> = {
  'ko-01': {
    beschreibung: [
      'Die Linien-Pyramide ist der badmintonspezifische Klassiker unter den Sprintformen: Von der Grundlinie aus werden nacheinander alle Querlinien des Felds angelaufen — vordere Aufschlaglinie, Netz, gegnerische Aufschlaglinie, gegnerische Grundlinie — und jede Linie wird mit der Hand berührt. Die ständigen Stopps und Antritte entsprechen exakt dem Belastungsprofil des Spiels.',
      'Das Handauflegen ist kein Schikane-Detail: Es erzwingt das tiefe Abbremsen mit kurzen, stoppenden Schritten, das auch im Spiel jede Richtungsumkehr einleitet. Die Zeit pro Pyramide wird notiert — so wird der konditionelle Fortschritt über die Wochen objektiv sichtbar.',
    ],
    skizze: {
      spieler: [{ pos: { x: 0.3, y: 3.05 }, label: 'A' }],
      laufwege: [
        { von: { x: 0.5, y: 2.6 }, bis: { x: 4.72, y: 2.6 } },
        { von: { x: 4.72, y: 2.2 }, bis: { x: 0.6, y: 2.2 } },
        { von: { x: 0.5, y: 3.5 }, bis: { x: 6.7, y: 3.5 } },
        { von: { x: 6.7, y: 3.9 }, bis: { x: 0.6, y: 3.9 } },
        { von: { x: 0.5, y: 4.6 }, bis: { x: 8.68, y: 4.6 } },
        { von: { x: 8.68, y: 5.0 }, bis: { x: 0.6, y: 5.0 } },
      ],
      hinweis:
        'Pyramide ab Grundlinie: jede Querlinie (T-Linie, Netz, gegnerische T-Linie, Grundlinie) anlaufen, mit der Hand berühren, zurück.',
    },
  },
  'ko-02': {
    beschreibung: [
      'Das 30/30-Intervall-Schattenbadminton ist die spielnächste Ausdauerform überhaupt: 30 Sekunden Schattenspiel mit maximalem Tempo in alle Ecken, 30 Sekunden lockeres Gehen — acht Runden lang. Die Belastungsspitzen und kurzen Erholungen entsprechen dem Rhythmus enger dritter Sätze.',
      'Damit die Form ihren Wert behält, gilt eine harte Qualitätsregel: Sobald Laufwege abgekürzt und Schattenschläge zu Armwedeln werden, ist das Intervall wertlos — dann lieber abbrechen. Die Laufmuster wechseln pro Intervall (nur vorn/hinten, nur Seiten, frei), das hält Kopf und Beine gleichermaßen wach.',
    ],
    skizze: {
      spieler: [{ pos: { x: 3.35, y: 3.05 }, label: 'A' }],
      laufwege: [
        { von: { x: 3.35, y: 3.05 }, bis: { x: 5.7, y: 1.1 } },
        { von: { x: 3.35, y: 3.05 }, bis: { x: 5.7, y: 5.0 } },
        { von: { x: 3.35, y: 3.05 }, bis: { x: 1.1, y: 1.1 } },
        { von: { x: 3.35, y: 3.05 }, bis: { x: 1.1, y: 5.0 } },
      ],
      hinweis:
        '30 Sekunden Vollgas-Schattenspiel in die Ecken (vollständige Schattenschläge!), 30 Sekunden gehen — 8 Intervalle.',
    },
  },
  'ko-03': {
    beschreibung: [
      'Sprungkraft entscheidet über die Qualität von Sprungsmash und Umsprung — und sie lässt sich gezielt aufbauen. Diese Serie kombiniert Strecksprünge (maximale Höhe aus der Hocke) mit Smashsprüngen, bei denen im höchsten Punkt die komplette Schattenschlag-Bewegung ausgeführt wird.',
      'Das heimliche Hauptthema ist die Landung: federnd über die Ballen, Knie leicht gebeugt und über der Fußspitze — niemals steifbeinig. Deshalb gilt strikt Qualität vor Wiederholungszahl, mit großzügigen Pausen zwischen den Serien. Wer die Landungen beherrscht, kann Sprungelemente verletzungsfrei ins Spiel übernehmen.',
    ],
  },
  'ko-04': {
    beschreibung: [
      'Jeder Schlag im Lauf braucht einen stabilen Rumpf als Fundament: Er überträgt die Kraft aus den Beinen in den Arm und hält den Oberkörper auch im tiefen Ausfallschritt aufrecht. Dieser Zirkel trainiert die komplette Rumpfkette an vier Stationen — Front- und Seitstütz, Rotation und untere Bauchmuskulatur.',
      'Die Russian Twists werden bewusst mit dem Schläger in beiden Händen ausgeführt — ein kleiner badmintonspezifischer Akzent für die Rotationskraft, die in jedem Überkopfschlag steckt. Der Zirkel braucht nur eine Matte und eignet sich als fester Baustein am Ende der Einheit oder als Heimprogramm.',
    ],
  },
  'ko-05': {
    beschreibung: [
      'Skater-Sprünge bauen genau die seitliche Beinkraft auf, die in der Abwehr über Erreichen oder Verpassen entscheidet: explosiver seitlicher Absprung von einem Bein, stabile Landung auf dem anderen — wie ein Eisschnellläufer. Die einbeinige Landung trainiert nebenbei die Knie-Stabilität, die bei seitlichen Aktionen besonders gefordert ist.',
      'Qualitätskriterium ist die ruhige Landung: Knie über der Fußspitze, Oberkörper still, kurz halten — erst dann zurückspringen. Ein einknickendes Knie oder weggehüpfte Landungen sind das Signal, die Distanz zu verkürzen. Erst Stabilität, dann Weite, dann Tempo.',
    ],
  },
  'ko-06': {
    beschreibung: [
      'Der Burpee-Shuttle-Run ist die teamtaugliche Ganzkörper-Belastung für Schulgruppen und Vereinstraining: An zwei Linien im Abstand der Feldlänge wechseln sich Burpees und Pendelsprints ab. Die Übung braucht null Aufbau, skaliert über die Rundenzahl und funktioniert mit beliebig vielen Personen.',
      'Als Staffel organisiert entsteht automatisch Anfeuerung und Pausenstruktur: Während eine Person läuft, erholen sich die anderen. Bei nachlassender Rumpfspannung in den Burpees (durchhängende Hüfte) wird auf die leichtere Variante ohne Liegestütz gewechselt — die Laufbelastung bleibt erhalten.',
    ],
    skizze: {
      spieler: [{ pos: { x: 0.3, y: 3.05 }, label: 'A' }],
      huetchen: [
        { x: 0.15, y: 2.0 },
        { x: 13.25, y: 2.0 },
      ],
      laufwege: [
        { von: { x: 0.6, y: 2.8 }, bis: { x: 13.0, y: 2.8 } },
        { von: { x: 13.0, y: 3.3 }, bis: { x: 0.6, y: 3.3 } },
      ],
      hinweis:
        'An Linie A 3 Burpees, Sprint zu Linie B (Feldlänge), 3 Burpees, Sprint zurück — eine Runde; als Staffel im Team.',
    },
  },
  'ko-07': {
    beschreibung: [
      'Das Tabata-Protokoll (8 × 20 Sekunden Belastung / 10 Sekunden Pause) presst einen vollwertigen Konditionsreiz in vier Minuten — ideal, wenn im Techniktraining nur ein kleines Zeitfenster für Athletik bleibt. Hier wechseln sich Mountain Climbers und Jump Lunges ab und decken damit Rumpf, Hüftbeuger und Beinkraft ab.',
      'Die kurzen Pausen verzeihen keine schlampige Technik: Schultern bleiben bei den Climbers über den Händen, die Knie folgen bei den Lunges der Fußspitze. Vor dem Protokoll eine Minute einbewegen, danach zwei Minuten austraben — das gehört fest dazu.',
    ],
  },
  'ko-08': {
    beschreibung: [
      'Die Schlagkraft des Smashes entsteht nicht im Arm, sondern in der Kette Beine → Hüfte → Rumpf → Arm. Medizinball-Überkopfwürfe trainieren genau diese Kette mit Zusatzlast: Ball hinter den Kopf, Bogenspannung aufbauen, Hüfte schiebt vor, explosiver Abwurf — die gleiche Sequenz wie im Schlag, nur messbar kraftvoller.',
      'Der Partner ist Trainingspartner und Techniktrainer zugleich: Er fängt nicht nur, sondern kontrolliert die Bogenspannung und meldet, wenn der Wurf nur noch aus den Armen kommt. Mit ein bis zwei Kilogramm Ballgewicht ist die Übung auch für Jugendliche geeignet; mehr Gewicht macht den Wurf langsam und zerstört den Übertrag.',
    ],
  },
  'ko-09': {
    beschreibung: [
      'Kastensprünge entwickeln die explosive Streckkraft der Beine — die Grundlage für Sprungsmash und schnelle Antritte. Gesprungen wird AUF den kniehohen Kasten (das Hinunterspringen entfällt bewusst: herabsteigen schont Gelenke und hält die Qualität hoch), oben wird vollständig aufgerichtet.',
      'Der zweite Teil verbindet Landung und Antritt: vom Kastenrand abrollen lassen, federnd landen und aus der Landung sofort drei Meter sprinten. Genau diese Kombination — Landung sofort in Bewegung umsetzen — ist das badmintonspezifische Element, etwa nach dem Umsprung. Lange Pausen sind Pflicht: Explosivkraft braucht Frische.',
    ],
  },
  'ko-10': {
    beschreibung: [
      'Lauf-Memory versteckt ein komplettes Ausdauertraining in einem Spiel: Auf der einen Hallenseite liegen verdeckte Kartenpaare, die Teams starten auf der anderen — pro Lauf dürfen genau zwei Karten aufgedeckt werden. Wer kein Paar findet, dreht die Karten zurück und läuft leer nach Hause. So entstehen viele Läufe, ohne dass es jemand als Laufen empfindet.',
      'Die Laufstrecke lässt sich badmintonisieren (Hütchen-Slalom, Sidestep-Pflichtzonen), und die Merkkomponente hält auch wartende Teammitglieder beschäftigt: Mitdenken lohnt sich. Die feste Rotation der Laufreihenfolge verhindert, dass sich Einzelne hinter der Team-Taktik verstecken.',
    ],
  },
}

export const spielformenDetails: Record<string, UebungsDetails> = {
  'sf-01': {
    beschreibung: [
      'Das Halbfeld-Einzel ist die wichtigste Spielform für volle Hallen: Das Feld wird längs geteilt, auf jedem Court entstehen zwei schmale Spielbahnen — doppelt so viele Menschen spielen gleichzeitig. Gespielt wird mit normalen Regeln, nur der Aufschlag erfolgt immer von hinten.',
      'Die schmale Bahn verändert das Spiel auf lehrreiche Weise: Seitliches Ausweichen entfällt, also entscheiden Länge, kurze Bälle und Geduld. Genau deshalb ist das Halbfeld-Einzel mehr als eine Notlösung — es ist gezieltes Training für das Lang-kurz-Spiel, verpackt in echten Wettkampf.',
    ],
    skizze: {
      spieler: [
        { pos: { x: 3.0, y: 1.7 }, label: 'A' },
        { pos: { x: 10.4, y: 1.7 }, label: 'B', partei: 'b' },
        { pos: { x: 3.0, y: 4.4 }, label: 'C' },
        { pos: { x: 10.4, y: 4.4 }, label: 'D', partei: 'b' },
      ],
      zonen: [{ x: 0, y: 2.9, b: 13.4, h: 0.3 }],
      hinweis:
        'Feld längs geteilt: A spielt gegen B auf der oberen Bahn, C gegen D auf der unteren — zwei Einzel pro Court.',
    },
  },
  'sf-02': {
    beschreibung: [
      'Das Kaiserspiel ist die bewährteste Turnier-Spielform für gemischte Gruppen: Alle Felder werden nummeriert, vom Einstiegsfeld bis zum „Kaiserfeld". Überall wird gleichzeitig auf Zeit gespielt (etwa drei Minuten), dann steigen die Gewinner ein Feld auf und die Verlierer eines ab.',
      'Die Mechanik sorgt von selbst für ausgeglichene Spiele: Nach wenigen Runden treffen oben die Stärksten aufeinander und unten wird auf Augenhöhe gespielt — niemand wird dauerhaft überrollt, niemand langweilt sich. Bei Gleichstand am Rundenende entscheidet sofort der nächste Punkt („Sudden Death"), damit der Wechsel zügig läuft. Funktioniert als Einzel und als Doppel, auf Wunsch auch auf Halbfeldern.',
    ],
  },
  'sf-03': {
    beschreibung: [
      'Drei gegen drei auf dem Doppelfeld klingt eng — ist aber durch die eingebaute Rotation eine der bewegungsreichsten Spielformen für Gruppen: Pro Seite stehen zwei auf dem Feld (vorne/hinten), eine Person wartet daneben. Nach jedem verlorenen Ballwechsel rotiert die Seite, die den Punkt abgegeben hat.',
      'Die Rotation (Wartende:r kommt vorn hinein, vordere Person rückt nach hinten, hintere geht hinaus) sorgt dafür, dass alle ständig beide Positionen spielen und niemand lange aussetzt. Wichtig ist die laute Einsteige-Ansage „drin!", bevor der nächste Aufschlag kommt — sonst entstehen Lücken im Feld.',
    ],
    skizze: {
      spieler: [
        { pos: { x: 5.0, y: 3.05 }, label: 'A1' },
        { pos: { x: 2.2, y: 3.05 }, label: 'A2' },
        { pos: { x: 1.0, y: 6.45 }, label: 'A3' },
        { pos: { x: 9.5, y: 2.0 }, label: 'B1', partei: 'b' },
        { pos: { x: 11.5, y: 4.0 }, label: 'B2', partei: 'b' },
        { pos: { x: 12.4, y: 6.45 }, label: 'B3', partei: 'b' },
      ],
      laufwege: [
        { von: { x: 1.4, y: 6.3 }, bis: { x: 4.5, y: 3.5 }, gebogen: true },
        { von: { x: 2.2, y: 3.4 }, bis: { x: 1.4, y: 6.1 }, gebogen: true },
      ],
      hinweis:
        'Je zwei spielen (vorne/hinten), die dritte Person wartet neben dem Feld; nach abgegebenem Punkt rotiert die Seite im Kreis.',
    },
  },
  'sf-04': {
    beschreibung: [
      'Brennball-Badminton übersetzt das bekannteste Schulspiel in die Badminton-Welt — und schmuggelt dabei echtes Aufschlagtraining ein: Statt zu werfen, bringt das Laufteam den Shuttle per langem Aufschlag ins Spiel. Nur wer hoch und weit aufschlägt, verschafft sich genug Zeit für die Runde über die Laufstationen.',
      'Das Feldteam holt den Shuttle und bringt ihn zur Brennbox; wer dann zwischen den Stationen unterwegs ist, ist „verbrannt". Die Spielform trägt mühelos eine ganze Klassenstunde, und die Aufschlag-Wiederholungen summieren sich nebenbei auf ein Vielfaches dessen, was eine klassische Übungsreihe schaffen würde.',
    ],
  },
  'sf-05': {
    beschreibung: [
      'Das Kurzsatz-Karussell bringt Wettkampfgefühl in die Breite: Auf allen verfügbaren (Halb-)Feldern werden parallel kurze Sätze bis 7 gespielt, danach rotieren die Gewinner im Uhrzeigersinn ein Feld weiter. So mischen sich die Paarungen automatisch und jede Person sammelt in 15 Minuten viele echte Satz-Erfahrungen.',
      'Weil die Sätze kurz sind, bleibt keine Niederlage lange hängen — ideal, um auch zurückhaltende Spieler:innen ans Wettkampfspielen zu gewöhnen. Falls sich Leistungsgruppen zu stark sortieren (Starke spielen nur noch gegen Starke), wird die Rotationsrichtung umgekehrt oder per Los gemischt.',
    ],
  },
  'sf-06': {
    beschreibung: [
      'Diese Spielform sperrt die Gewaltlösung: Smash und Drive sind verboten, erlaubt sind nur Clear, Drop, Netzdrop und Lob. Punkte entstehen damit fast nur noch über das Vorfeld — enge Netzdrops bauen den Druck auf, präzise Lobs lösen ihn — und genau diese oft vernachlässigten Schläge bekommen endlich Spielpraxis unter Wettkampfbedingungen.',
      'Ein verbotener Schlag gibt den Punkt direkt ab, das hält die Regel scharf. Besonders lehrreich ist die Lob-Bewertung: Ein Lob, der im Mittelfeld landet, würde im echten Spiel totgesmasht — im Nur-kurz-Spiel fällt das nicht sofort auf, deshalb wird die Qualität laut kommentiert („wäre durch!").',
    ],
    skizze: {
      spieler: [
        { pos: { x: 4.4, y: 3.05 }, label: 'A' },
        { pos: { x: 9.0, y: 3.05 }, label: 'B', partei: 'b' },
      ],
      zonen: [
        { x: 4.72, y: 0.46, b: 1.98, h: 5.18, label: 'Netzspiel' },
        { x: 6.7, y: 0.46, b: 1.98, h: 5.18, label: 'Netzspiel' },
      ],
      shuttlewege: [
        { von: { x: 5.9, y: 2.6 }, bis: { x: 7.4, y: 2.6 } },
        { von: { x: 7.5, y: 3.4 }, bis: { x: 1.0, y: 3.6 } },
      ],
      hinweis:
        'Erlaubt sind nur Clear, Drop, Netzdrop und Lob — das Spiel verlagert sich ins Vorfeld, Smash/Drive geben den Punkt ab.',
    },
  },
  'sf-07': {
    beschreibung: [
      'Doppel-König ist die schnellste Art, viele Doppel auf wenig Feldern zu organisieren: Ein Feld ist das Königsfeld, gespielt werden Kurzsätze bis 7. Das Gewinnerpaar bleibt, das Verliererpaar reiht sich hinten in die Warteschlange ein, das nächste Paar fordert sofort heraus.',
      'Damit ein starkes Paar das Feld nicht dauerhaft blockiert, gilt die Sterne-Regel: Wer dreimal in Folge König bleibt, bekommt einen Stern und tritt ab. Die Wartezeit wird aktiv genutzt — Schattenbadminton oder ein Drive-Duell neben dem Feld halten alle warm und verkürzen die gefühlte Pause.',
    ],
    skizze: {
      spieler: [
        { pos: { x: 3.3, y: 1.7 }, label: 'A1' },
        { pos: { x: 3.3, y: 4.4 }, label: 'A2' },
        { pos: { x: 10.1, y: 1.7 }, label: 'B1', partei: 'b' },
        { pos: { x: 10.1, y: 4.4 }, label: 'B2', partei: 'b' },
        { pos: { x: 8.2, y: 6.45 }, label: 'C1', partei: 'b' },
        { pos: { x: 9.6, y: 6.45 }, label: 'C2', partei: 'b' },
      ],
      laufwege: [{ von: { x: 8.6, y: 6.3 }, bis: { x: 9.8, y: 4.8 }, gebogen: true }],
      hinweis:
        'Königsfeld: Gewinnerpaar (A) bleibt, Verliererpaar geht in die Schlange, das nächste wartende Paar (C) kommt sofort aufs Feld.',
    },
  },
}
