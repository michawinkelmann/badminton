/**
 * Aufwärmen — 10 Übungen.
 * Konvention der gesamten Bibliothek: Schläger und ausreichend Shuttles gelten
 * als Grundausstattung und werden bei `material` NICHT gelistet; dort steht nur
 * Zusatzmaterial (Hütchen, Shuttle-Korb, Klebeband …).
 */
import type { Uebung } from '../../datenmodell'

export const aufwaermen: Uebung[] = [
  {
    id: 'aw-01',
    name: 'Lauf-ABC quer durch die Halle',
    kategorie: 'aufwaermen',
    skills: ['beinarbeit', 'ausdauer'],
    niveau: ['anfaenger', 'fortgeschritten', 'leistung'],
    dauerMin: 10,
    personen: 'gruppe',
    material: [],
    kurzbeschreibung:
      'Klassisches Lauf-ABC über die Hallenbreite zur allgemeinen Erwärmung und Fußgelenksaktivierung.',
    durchfuehrung: [
      'Hallenbreite markieren, locker einlaufen: 2 Bahnen Traben.',
      'Je 2 Bahnen: Hopserlauf, Anfersen, Kniehebelauf, Seitgalopp (beide Seiten), Überkreuzlauf (Carioca).',
      'Abschluss: 2 Steigerungsläufe auf ca. 80 % Tempo.',
      'Gesamtumfang ca. 12–14 Bahnen, Rückweg jeweils locker traben.',
    ],
    variationen: [
      'Leichter: Tempo rausnehmen, nur 1 Bahn pro Form.',
      'Schwerer: letzte Bahn jeder Form als Steigerungslauf; auf Pfiff Richtungswechsel.',
    ],
    fehlerbilder: [
      'Fersenlauf statt Ballenkontakt → auf aktiven Fußaufsatz über den Ballen hinweisen.',
      'Arme hängen schlaff → Armeinsatz gegengleich mitnehmen, Ellbogen ca. 90 Grad.',
    ],
  },
  {
    id: 'aw-02',
    name: 'Schattenbadminton locker',
    kategorie: 'aufwaermen',
    skills: ['beinarbeit'],
    niveau: ['anfaenger', 'fortgeschritten', 'leistung'],
    dauerMin: 8,
    personen: 'allein',
    material: [],
    kurzbeschreibung:
      'Grundschläge und Laufwege ohne Shuttle nachstellen — Bewegungsmuster aufwärmen, Treffpunkte abrufen.',
    durchfuehrung: [
      '2 Minuten: nur Laufwege aus der zentralen Position in alle sechs Feldbereiche, betont langsam und sauber.',
      '3 × 1 Minute: Laufweg plus Schattenschlag (Clear hinten, Drop hinten, Netzdrop vorn), dazwischen 30 Sekunden Pause.',
      'Letzte Minute: freies Schattenspiel in Wunschreihenfolge, Tempo leicht anziehen.',
    ],
    variationen: [
      'Leichter: ohne Schläger, nur Laufwege.',
      'Schwerer: Partner ruft die Ecken in unregelmäßiger Folge an.',
    ],
    fehlerbilder: [
      'Kein Split-Step vor dem Losziehen → vor jeder Richtungsänderung kleinen Auftakthüpfer setzen.',
      'Schlagarm bleibt unten → auch im Schatten vollständige Ausholbewegung und hohen Treffpunkt zeigen.',
    ],
  },
  {
    id: 'aw-03',
    name: 'Mobilisation Schulter, Handgelenk & Rumpf',
    kategorie: 'aufwaermen',
    skills: ['schnelligkeit'],
    niveau: ['anfaenger', 'fortgeschritten', 'leistung'],
    dauerMin: 6,
    personen: 'allein',
    material: [],
    kurzbeschreibung:
      'Gezielte Mobilisation der schlagrelevanten Gelenke — Pflichtbaustein vor jedem Schlagtraining.',
    durchfuehrung: [
      'Armkreisen vorwärts/rückwärts, je 10 Wiederholungen, klein beginnend, groß werdend.',
      'Schlägerkreisen aus dem Handgelenk: je 15 Kreise pro Richtung, Unterarm ruhig halten.',
      'Liegende Achten mit dem Schläger vor dem Körper: 2 × 20 Sekunden.',
      'Rumpfrotationen mit Schläger im Nacken: 2 × 10 pro Seite, Hüfte bleibt stabil.',
    ],
    variationen: [
      'Leichter: ohne Schläger, nur mit der Hand.',
      'Schwerer: Schlägerhülle aufziehen (mehr Luftwiderstand) für die Handgelenkskreise.',
    ],
    fehlerbilder: [
      'Schwung aus dem ganzen Arm statt aus dem Handgelenk → Ellbogen an die Hüfte legen und nur das Handgelenk arbeiten lassen.',
    ],
  },
  {
    id: 'aw-04',
    name: 'Shuttle-Werfen und Reaktionsfangen',
    kategorie: 'aufwaermen',
    skills: ['schnelligkeit', 'beinarbeit'],
    niveau: ['anfaenger'],
    dauerMin: 8,
    personen: 'paar',
    material: [],
    kurzbeschreibung:
      'Werfen, Fangen und Reaktionsstarts mit dem Shuttle — schult nebenbei die Wurfbewegung für den Überkopfschlag.',
    durchfuehrung: [
      '2 Minuten: Shuttle über die Netzhöhe zuwerfen und fangen, Wurf wie eine Überkopf-Schlagbewegung (Ellbogen führt).',
      '2 Minuten: Distanzwürfe — wer trifft die Grundlinie aus dem Aufschlagfeld?',
      '3 Runden Reaktionsfangen: Partner hält den Shuttle auf Schulterhöhe und lässt fallen, der andere startet aus 2 m und fängt vor dem Boden.',
    ],
    variationen: [
      'Leichter: Fallhöhe erhöhen (über Kopf halten).',
      'Schwerer: Start aus dem Sitzen oder mit Rücken zum Partner auf Zuruf.',
    ],
    fehlerbilder: [
      'Wurf aus dem reinen Arm ohne Körpereinsatz → seitliche Stellung, Gewicht vom hinteren auf den vorderen Fuß verlagern.',
    ],
  },
  {
    id: 'aw-05',
    name: 'Seilspring-Programm',
    kategorie: 'aufwaermen',
    skills: ['schnelligkeit', 'ausdauer'],
    niveau: ['fortgeschritten', 'leistung'],
    dauerMin: 8,
    personen: 'allein',
    material: ['Springseil'],
    kurzbeschreibung:
      'Seilspringen in Intervallen — bringt Puls, Fußgelenke und Sprungrhythmus auf Betriebstemperatur.',
    durchfuehrung: [
      '4 × 45 Sekunden springen, 15 Sekunden Pause.',
      'Runde 1 beidbeinig, Runde 2 Wechselsprünge, Runde 3 einbeinig (Seite wechseln), Runde 4 frei.',
      'Auf leisen, federnden Ballenkontakt achten — Knie nie ganz durchstrecken.',
    ],
    variationen: [
      'Leichter: ohne Seil dieselben Sprungformen.',
      'Schwerer: letzte Runde mit Doppeldurchschlägen.',
    ],
    fehlerbilder: [
      'Zu hohe Sprünge → nur 2–3 cm über dem Boden bleiben, Frequenz statt Höhe.',
      'Landung auf der Ferse → Blick geradeaus, Ballenkontakt bewusst ansagen.',
    ],
  },
  {
    id: 'aw-06',
    name: 'Shuttle-Staffeln',
    kategorie: 'aufwaermen',
    skills: ['schnelligkeit', 'ausdauer'],
    niveau: ['anfaenger'],
    dauerMin: 10,
    personen: 'gruppe',
    material: ['Hütchen'],
    kurzbeschreibung:
      'Staffelwettbewerbe mit Shuttle-Transport — ideal als spielerischer Einstieg für Schulgruppen.',
    durchfuehrung: [
      'Teams à 3–5 Personen hinter der Grundlinie, Wendepunkt-Hütchen an der gegenüberliegenden Aufschlaglinie.',
      'Runde 1: Shuttle auf der Schlägerfläche balancierend zum Hütchen und zurück tragen, Übergabe an die Nächste/den Nächsten.',
      'Runde 2: zwei Shuttles transportieren (einer auf dem Schläger, einer auf dem Handrücken).',
      'Runde 3: am Wendepunkt Shuttle ablegen, beim nächsten Läufer wieder aufnehmen.',
      'Jede Runde 2–3 Durchgänge, Team-Punkte zählen.',
    ],
    variationen: [
      'Leichter: Shuttle in der freien Hand tragen.',
      'Schwerer: Slalom um zusätzliche Hütchen, Rückweg rückwärts (ohne Balancieren).',
    ],
    fehlerbilder: [
      'Blick klebt am Shuttle, Zusammenstöße drohen → Laufwege klar trennen und Kopf-hoch-Regel ansagen.',
    ],
  },
  {
    id: 'aw-07',
    name: 'Dynamisches Dehnen Beine & Hüfte',
    kategorie: 'aufwaermen',
    skills: ['beinarbeit'],
    niveau: ['anfaenger', 'fortgeschritten', 'leistung'],
    dauerMin: 8,
    personen: 'allein',
    material: [],
    kurzbeschreibung:
      'Dynamische Dehn- und Aktivierungsübungen für Hüfte und Beine — bereitet auf Ausfallschritte vor.',
    durchfuehrung: [
      'Ausfallschritte im Gehen mit aufrechtem Oberkörper: 2 × 8 pro Bein.',
      'Beinpendel vor-zurück und seitlich an der Wand: je 10 pro Bein.',
      'Tiefe Hocke halten, Knie mit den Ellbogen nach außen drücken: 3 × 15 Sekunden.',
      'Seitliche Ausfallschritte (Cossack Squats): 2 × 6 pro Seite.',
    ],
    variationen: [
      'Leichter: Bewegungsumfang verkleinern, an der Wand festhalten.',
      'Schwerer: Ausfallschritte mit Rotation des Oberkörpers über dem vorderen Bein.',
    ],
    fehlerbilder: [
      'Vorderes Knie knickt beim Ausfallschritt nach innen → Knie über die Fußspitze führen, Schrittweite verkürzen.',
    ],
  },
  {
    id: 'aw-08',
    name: 'Lockere Einspiel-Rallye im Halbfeld',
    kategorie: 'aufwaermen',
    skills: ['clear', 'netzspiel'],
    niveau: ['anfaenger', 'fortgeschritten', 'leistung'],
    dauerMin: 8,
    personen: 'paar',
    material: [],
    kurzbeschreibung:
      'Kontrolliertes Einspielen im halben Feld — von kurz nach lang, von locker nach zügig.',
    durchfuehrung: [
      '2 Minuten Netzspiel: nur Netzdrops hin und her, bewusst hoch über die Kante beginnen.',
      '2 Minuten Drives auf halber Felddistanz, Tempo langsam steigern.',
      '3 Minuten hohe Bälle: Clear auf Clear im Halbfeld längs, Längen kontrollieren.',
      'Ziel: lange Ballwechsel statt Punkte — Fehlerminimum ansagen (z. B. 10 Kontakte am Stück).',
    ],
    variationen: [
      'Leichter: Shuttle darf einmal aufticken (Anfänger).',
      'Schwerer: Wechselfolge kurz-lang fest vorgeben (Drop–Lob–Drop–Lob).',
    ],
    fehlerbilder: [
      'Sofort volles Tempo → Einspielcharakter betonen: erst Treffsicherheit, dann Tempo.',
    ],
  },
  {
    id: 'aw-09',
    name: 'Reaktionsstarts ans Netz',
    kategorie: 'aufwaermen',
    skills: ['schnelligkeit', 'beinarbeit'],
    niveau: ['anfaenger', 'fortgeschritten', 'leistung'],
    dauerMin: 6,
    personen: 'paar',
    material: [],
    kurzbeschreibung:
      'Kurze Antritte aus dem Split-Step zum fallenden Shuttle — weckt das Nervensystem.',
    durchfuehrung: [
      'Läufer steht am T-Punkt in Grundposition, Partner an der Netzkante mit Shuttle in ausgestreckter Hand.',
      'Partner lässt den Shuttle ohne Vorwarnung fallen, Läufer startet mit Split-Step und fängt ihn vor dem Boden.',
      '2 × 6 Starts pro Person, danach Rollen tauschen.',
      'Abstand so wählen, dass es gerade so klappt — Erfolgsquote etwa 70 %.',
    ],
    variationen: [
      'Leichter: Partner kündigt mit „Hopp" an.',
      'Schwerer: Läufer startet mit Blick zur Grundlinie und dreht erst auf das Fallgeräusch.',
    ],
    fehlerbilder: [
      'Start aus dem Stand ohne Auftakt → Split-Step-Timing laut mitzählen lassen („tip-tap").',
      'Letzter Schritt zu kurz, Griff nach unten statt Ausfallschritt → langer letzter Schritt, Knie über Fuß.',
    ],
  },
  {
    id: 'aw-10',
    name: 'Aufwärm-Parcours rund ums Feld',
    kategorie: 'aufwaermen',
    skills: ['beinarbeit', 'ausdauer', 'schnelligkeit'],
    niveau: ['anfaenger', 'fortgeschritten'],
    dauerMin: 12,
    personen: 'gruppe',
    material: ['Hütchen'],
    kurzbeschreibung:
      'Stationen-Parcours um das Badmintonfeld — kombiniert Laufformen, Sprünge und badmintonnahe Bewegungen.',
    durchfuehrung: [
      'Parcours aufbauen: Seitenlinie Sidesteps, Grundlinie rückwärts, zweite Seitenlinie Hopserlauf, Netz: 4 Ausfallschritte mit Netzberührung.',
      'An jeder Ecke ein Hütchen: dort Split-Step und Richtungswechsel.',
      'Gruppe startet versetzt im 10-Sekunden-Abstand, 4–6 Runden pro Person.',
      'Letzte Runde als „Tempo-Runde" mit Zeitansage.',
    ],
    variationen: [
      'Leichter: Netzstation ohne Ausfallschritt, nur Knie heben.',
      'Schwerer: an der Grundlinie 3 Strecksprünge einbauen.',
    ],
    fehlerbilder: [
      'Ecken werden weit ausgelaufen → an jedem Hütchen bewusst abstoppen und neu beschleunigen.',
    ],
  },
]
