/** Taktik Doppel — 8 Übungen. Material-Konvention siehe aufwaermen.ts. */
import type { Uebung } from '../../datenmodell'

export const taktikDoppel: Uebung[] = [
  {
    id: 'td-01',
    name: 'Rotation Angriff ↔ Abwehr',
    kategorie: 'taktik_doppel',
    skills: ['taktik_doppel', 'beinarbeit'],
    niveau: ['anfaenger', 'fortgeschritten', 'leistung'],
    dauerMin: 12,
    personen: 'gruppe',
    material: [],
    kurzbeschreibung:
      'Das Herzstück des Doppels: vorne-hinten im Angriff, nebeneinander in der Abwehr — und die Wechsel dazwischen.',
    durchfuehrung: [
      'Zwei Paare spielen kooperativ: Paar A greift an (vorne/hinten), Paar B verteidigt (nebeneinander).',
      'Regel: Hebt A den Shuttle hoch, wechselt A sofort in die Abwehrformation und B in den Angriff.',
      '4 × 2 Minuten Dauerwechsel ohne Punktzählung, kurze Pausen mit Formations-Feedback.',
      'Schlüsselmomente laut ansagen lassen: „Angriff!" / „Abwehr!".',
    ],
    variationen: [
      'Leichter: Trainer ruft die Wechsel, Shuttle wird neu eingeworfen.',
      'Schwerer: frei auf Punkte spielen, Formationsfehler = direkter Punktverlust (Beobachter entscheidet).',
    ],
    fehlerbilder: [
      'Nach dem eigenen Heber bleiben beide hinten/vorne stehen → Merksatz: „Wer hebt, geht zur Seite" — sofort nebeneinander.',
      'Wechsel in den Angriff ohne Absprache, beide laufen nach vorn → hintere Person ruft „ich" für das Hinterfeld.',
    ],
    animationId: 'anim-doppel-angriff',
  },
  {
    id: 'td-02',
    name: 'Mitte-Abdeckung und Kommunikation',
    kategorie: 'taktik_doppel',
    skills: ['taktik_doppel'],
    niveau: ['anfaenger', 'fortgeschritten'],
    dauerMin: 10,
    personen: 'gruppe',
    material: [],
    kurzbeschreibung:
      'Wer nimmt den Ball durch die Mitte? Klare Zuständigkeiten und laute Ansagen statt Schlägersalat.',
    durchfuehrung: [
      'Zuspieler (oder drittes Paar) spielt gezielt Bälle zwischen die beiden Abwehrspieler.',
      'Grundregel einüben: In der Abwehr nimmt die Person, auf deren Vorhandseite der Shuttle kommt; Ansage „mein!" vor dem Treffpunkt.',
      '3 × 10 Mittebälle, danach Positions- bzw. Rollenwechsel.',
      'Steigerung: Zuspiel variiert zwischen Mitte, außen und kurz — Zuständigkeit bleibt anzusagen.',
    ],
    variationen: [
      'Leichter: Zuspiel als Wurf, Tempo niedrig.',
      'Schwerer: harte Drives durch die Mitte, Ansage muss trotzdem kommen.',
    ],
    fehlerbilder: [
      'Beide schlagen gleichzeitig oder beide lassen → Vorhand-Mitte-Regel wiederholen und JEDEN Mitteball ansagen lassen.',
    ],
  },
  {
    id: 'td-03',
    name: 'Aufschlag-Drittball-Drill im Doppel',
    kategorie: 'taktik_doppel',
    skills: ['taktik_doppel', 'aufschlag'],
    niveau: ['fortgeschritten', 'leistung'],
    dauerMin: 12,
    personen: 'gruppe',
    material: [],
    kurzbeschreibung:
      'Die ersten drei Bälle entscheiden im Doppel: kurzer Aufschlag, Return, geplanter dritter Ball.',
    durchfuehrung: [
      'Aufschlagpaar gegen Returnpaar in Doppelaufstellung.',
      '10 Durchgänge: kurzer Aufschlag, beliebiger Return, der dritte Ball wird nach Plan gespielt (flach auf die Mitte oder hinter den Netzspieler) — danach Punkt frei ausspielen.',
      'Nach 10 Durchgängen Rollen tauschen; zählen, wie oft das aufschlagende Paar den Angriff erobert.',
    ],
    variationen: [
      'Leichter: Return kooperativ ans Netz, dritter Ball ohne Gegnerdruck.',
      'Schwerer: Returnpaar greift den Aufschlag maximal an (Druck-Return auf den Körper).',
    ],
    fehlerbilder: [
      'Aufschläger schaut dem Aufschlag nach, dritter Ball kommt zu spät → nach dem Aufschlag sofort Schläger hoch, Gewicht auf die Ballen.',
      'Dritter Ball wird hoch gespielt und schenkt den Angriff her → flache Optionen einüben, hoch nur als bewusste Notlösung.',
    ],
  },
  {
    id: 'td-04',
    name: 'Angriffsformation halten: hinten druckvoll, vorne tödlich',
    kategorie: 'taktik_doppel',
    skills: ['taktik_doppel', 'smash', 'netzspiel'],
    niveau: ['fortgeschritten', 'leistung'],
    dauerMin: 12,
    personen: 'gruppe',
    material: [],
    kurzbeschreibung:
      'Im Angriff bleiben: hinten Smash/Drop-Druck, vorne alles Kurze töten — solange der Shuttle nach unten geht.',
    durchfuehrung: [
      'Angriffspaar (vorne/hinten) gegen Abwehrpaar; Abwehr darf nur flach oder hoch zurückspielen, nicht selbst angreifen.',
      'Hintere Person wechselt zwischen Smash und schnellem Drop; vordere Person fängt alles Kurze ab und tötet hohe Netzbälle.',
      '3 × 3 Minuten, danach Rotation aller Rollen.',
      'Erfolgskriterium: Wie lange bleibt der Angriff am Stück erhalten (Ballwechsel zählen)?',
    ],
    variationen: [
      'Leichter: Abwehr spielt nur hoch — reine Angriffsschulung.',
      'Schwerer: Abwehr darf flach kontern, der Netzspieler muss abfangen.',
    ],
    fehlerbilder: [
      'Netzspieler weicht nach hinten aus und nimmt dem Partner Bälle weg → Zonen klären: vorderes Drittel gehört der vorderen Person, Schläger oben halten.',
      'Hinten nur Vollgas-Smash bis zur Erschöpfung → Smash-Drop-Wechsel als Pflicht-Rhythmus vorgeben.',
    ],
    animationId: 'anim-doppel-angriff',
  },
  {
    id: 'td-05',
    name: 'Abwehr-Drill: 2 verteidigen gegen 1 Smasher',
    kategorie: 'taktik_doppel',
    skills: ['taktik_doppel', 'drive'],
    niveau: ['fortgeschritten', 'leistung'],
    dauerMin: 12,
    personen: 'gruppe',
    material: ['Shuttle-Korb'],
    kurzbeschreibung:
      'Doppelabwehr unter Dauerdruck: Smashes flach zurückblocken und gemeinsam die Breite halten.',
    durchfuehrung: [
      'Ein Smasher im Hinterfeld (mit Korb-Nachschub), zwei Verteidiger nebeneinander auf der Gegenseite.',
      'Smasher greift abwechselnd beide Seiten an; Abwehr blockt flach ins Vorfeld oder kontert ins Mittelfeld.',
      '3 × 12 Smashes, dann Rotation; Abwehrstand: tief, Schläger vor der Hüfte, Rückhandgriff.',
    ],
    variationen: [
      'Leichter: Smash-Tempo 60 %, Ansage der Zielseite.',
      'Schwerer: Smasher mischt Drop ein — Abwehr muss zusätzlich nach vorn lösen.',
    ],
    fehlerbilder: [
      'Abwehr rückt unbewusst zusammen, außen wird frei → Fußposition an den Seitenbahnen verankern („eigene Hälfte halten").',
      'Blocks springen hoch ab und laden zum Nachsmash → lockerer Griff, Schläger nur hinhalten.',
    ],
    animationId: 'anim-doppel-abwehr',
  },
  {
    id: 'td-06',
    name: 'Return-Druck gegen den kurzen Aufschlag',
    kategorie: 'taktik_doppel',
    skills: ['taktik_doppel', 'netzspiel'],
    niveau: ['fortgeschritten', 'leistung'],
    dauerMin: 10,
    personen: 'gruppe',
    material: [],
    kurzbeschreibung:
      'Den kurzen Doppel-Aufschlag früh attackieren: Return auf Körper oder T-Punkt und sofort nachrücken.',
    durchfuehrung: [
      'Aufschlagpaar serviert kurz, Returnspieler steht maximal nah an der vorderen Aufschlaglinie, Schläger oben.',
      '10 Returns pro Person mit festem Ziel: Mitte/T-Punkt, Körper des Aufschlägers, oder Stopp hinter das Netz — danach Punkt ausspielen.',
      'Rollen rotieren; zählen, wie oft das Returnpaar in den ersten zwei Schlägen den Angriff bekommt.',
    ],
    variationen: [
      'Leichter: Aufschläger kündigt „kurz" an, Return nur platzieren.',
      'Schwerer: Aufschläger mischt Swip/Flick ein — Return muss Übergriff vermeiden.',
    ],
    fehlerbilder: [
      'Returnspieler wartet hinter der Linie und lässt den Shuttle fallen → ersten Schritt nach VORN als Standard; Treffpunkt über Netzhöhe suchen.',
      'Return immer ins gleiche Ziel → drei Ziele bewusst mischen, sonst stellt sich der Gegner ein.',
    ],
  },
  {
    id: 'td-07',
    name: 'Lautes Doppel: Ansage-Pflichtspiel',
    kategorie: 'taktik_doppel',
    skills: ['taktik_doppel'],
    niveau: ['anfaenger'],
    dauerMin: 10,
    personen: 'gruppe',
    material: [],
    kurzbeschreibung:
      'Doppel-Spielform mit Kommunikations-Pflicht: jeder Ball in der eigenen Hälfte wird angesagt — ideal für neue Paare und Schulgruppen.',
    durchfuehrung: [
      'Normales Doppel, aber: Vor jedem eigenen Schlag muss „mein!" gerufen werden, bei Überlassen „dein!".',
      'Fehlt die Ansage, gibt es den Punkt für die Gegenseite — anfangs großzügig, dann streng werten.',
      '2–3 Sätze bis 11; nach jedem Satz kurze Runde: Wo gab es stumme Zonen?',
    ],
    variationen: [
      'Leichter: nur Mittebälle sind ansagepflichtig.',
      'Schwerer: zusätzlich Formations-Ansagen („Angriff!"/„Abwehr!") verpflichtend.',
    ],
    fehlerbilder: [
      'Ansagen kommen NACH dem Treffpunkt → Ansage gehört VOR den Schlag; im Zweifel früh rufen.',
    ],
  },
  {
    id: 'td-08',
    name: 'Mixed-Positionsspiel: Rollen klären',
    kategorie: 'taktik_doppel',
    skills: ['taktik_doppel', 'netzspiel'],
    niveau: ['fortgeschritten', 'leistung'],
    dauerMin: 12,
    personen: 'gruppe',
    material: [],
    kurzbeschreibung:
      'Mixed-typische Rollenverteilung einüben: eine Person kontrolliert das Vorfeld, die andere deckt Mittel- und Hinterfeld.',
    durchfuehrung: [
      'Paare in Mixed-Aufteilung: Vorfeldspieler:in agiert dauerhaft zwischen Netz und T-Linie, Partner:in dahinter.',
      'Spielform gegen zweites Paar; Aufgabe Vorfeld: kurze Bälle töten/stoppen, niemals nach hinten ausweichen.',
      'Aufgabe hinten: Längen sichern, diagonal angreifen, den Lob über das Vorfeld abdecken.',
      '3 × 4 Minuten, Rollen innerhalb des Paars tauschen — beide Perspektiven erleben.',
    ],
    variationen: [
      'Leichter: Gegnerpaar spielt nur hoch und lang.',
      'Schwerer: Gegner zielen bewusst auf die Übergangszone hinter dem Vorfeldspieler.',
    ],
    fehlerbilder: [
      'Vorfeldspieler:in dreht sich zum eigenen Hinterfeld um → Blick bleibt nach vorn, hinten ist Partnerzone (Vertrauen).',
      'Hintere Person spielt kurze Bälle selbst und kollidiert → kurze Zone klar abgeben, nur durchlaufen wenn angesagt.',
    ],
  },
]
