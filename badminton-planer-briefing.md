# Badminton-Trainings- & Turnierplaner — Projekt-Briefing

**Projektname (Arbeitstitel):** `badminton-planer`
**Auftraggeber:** Dr. Winkelmann (Lehrer, Trainer, aktiver Spieler)
**Ziel-Hosting:** GitHub Pages (rein statisch — HTML/CSS/JS, kein Backend)
**Sprache der App:** ausschließlich Deutsch
**Einsatzkontexte:** Schulsport/AG, Vereinstraining, eigenes Training — alle drei gleichwertig

---

## 1. Projektziel

Eine Web-App, die Badminton-Training planbar und Fortschritt sichtbar macht — und nebenbei komplette Turniere organisiert. Drei Säulen:

1. **Trainingsbereich:** Übungsbibliothek mit Vorschlagssystem, Einheiten-Builder, Mehrwochen-Programme mit Progression.
2. **Bewegungslehre:** ~25 animierte Bewegungsabläufe (Schlagtechnik, Footwork, Taktik) als interaktive SVG-Animationen mit Zeitlupe und Phasen-Stepper.
3. **Turnierplaner:** Vier Formate (K.o., Gruppen + K.o., Jeder gegen Jeden, Schweizer System) mit Spielplan-Generierung, Ergebniseingabe, Live-Tabellen und Beamer-Modus.

Verbindendes Element: **Profile & Gruppen.** Spieler werden einmal angelegt, tauchen im Tracking auf und lassen sich als Gruppe direkt in ein Turnier übernehmen.

---

## 2. Tech-Stack & Architektur-Entscheidungen (verbindlich)

| Bereich | Entscheidung | Begründung / Hinweise |
|---|---|---|
| Framework | **React 18+ mit TypeScript** | Strikte Typen, `strict: true` in tsconfig |
| Build | **Vite** | `base: '/badminton-planer/'` in `vite.config.ts` setzen (Repo-Name; falls anderer Repo-Name, anpassen) |
| Styling | **Tailwind CSS** | Plus eigenes Token-System (siehe Design) |
| Routing | **react-router mit `HashRouter`** | Pflicht! `BrowserRouter` bricht auf GitHub Pages bei Reload/Deeplinks |
| State | **Zustand** (Library) mit Persist-Middleware auf localStorage | Ein zentraler Store, in Slices aufgeteilt |
| Validierung | **zod** | Schemas für alle persistierten Daten; Pflicht beim JSON-Import |
| Drag & Drop | **dnd-kit** | Touch-fähig (Tablet in der Halle!) |
| Charts | **recharts** | RadarChart fürs Skill-Tracking |
| Tests | **Vitest** | Pflicht für die gesamte Turnier-Engine (siehe §15) |
| PWA | **vite-plugin-pwa** | Offline-first, alles im Precache — Hallen-WLAN ist unzuverlässig |
| Deploy | **GitHub Actions** → offizieller Pages-Workflow (`actions/upload-pages-artifact` + `actions/deploy-pages`) | Workflow-Datei gehört zu Phase 0 |

**Grundprinzip:** Zur Laufzeit keinerlei externe Requests. Alle Daten (Übungen, Animationen, Programme) sind im Bundle. Keine CDN-Fonts ohne Self-Hosting.

---

## 3. Datenmodell (TypeScript, verbindliche Basis)

Alle Entitäten bekommen `id: string` (nanoid o. ä.) und ISO-Datumsstrings. Das Modell darf erweitert, aber nicht umbenannt werden.

```typescript
// ---------- Personen ----------
interface Profil {
  id: string;
  name: string;
  niveau: 'anfaenger' | 'fortgeschritten' | 'leistung';
  erstelltAm: string;
  notizen?: string;
}

interface Gruppe {
  id: string;
  name: string;               // z. B. "Badminton-AG Mittwoch", "Herren 2"
  mitgliederIds: string[];
}

// ---------- Skills & Tracking ----------
type SkillId =
  | 'clear' | 'drop' | 'smash' | 'drive' | 'netzspiel' | 'aufschlag'
  | 'beinarbeit' | 'schnelligkeit' | 'ausdauer'
  | 'taktik_einzel' | 'taktik_doppel';

interface SkillEinschaetzung {       // Selbsteinschätzung, historisiert
  id: string;
  profilId: string;
  skill: SkillId;
  wert: number;                      // 1–10
  datum: string;
}

interface TrainingsLog {             // absolvierte Einheit
  id: string;
  profilIds: string[];               // einzelne Person ODER alle Gruppenmitglieder
  einheitId: string;
  datum: string;
  absolvierteUebungIds: string[];    // ggf. Teilmenge der Einheit
  notizen?: string;
}

// ---------- Übungen ----------
type Kategorie =
  | 'aufwaermen' | 'schlagtechnik' | 'footwork'
  | 'taktik_einzel' | 'taktik_doppel' | 'kondition' | 'spielformen';

interface Uebung {
  id: string;
  name: string;
  kategorie: Kategorie;
  skills: SkillId[];                 // worauf zahlt die Übung ein
  niveau: Profil['niveau'][];        // für welche Niveaus geeignet
  dauerMin: number;                  // Richtwert
  personen: 'allein' | 'paar' | 'gruppe';
  material: string[];                // z. B. ["Hütchen", "Shuttle-Korb"]
  kurzbeschreibung: string;          // 1–2 Sätze
  durchfuehrung: string[];           // nummerierte Schritte
  variationen?: string[];            // leichter/schwerer
  fehlerbilder?: string[];           // typischer Fehler → Korrekturhinweis
  animationId?: string;              // Verweis auf Animation
}

// ---------- Einheiten & Programme ----------
interface EinheitBlock { uebungId: string; dauerMin: number; notiz?: string; }

interface Einheit {
  id: string;
  name: string;
  zielSkills: SkillId[];
  bloecke: EinheitBlock[];
  istVorlage: boolean;               // mitgelieferte vs. eigene
}

interface ProgrammWoche {
  nummer: number;
  fokus: string;                     // z. B. "Grundschläge festigen"
  einheitIds: string[];              // 1–3 Einheiten pro Woche
  progressionsHinweis?: string;      // was diese Woche steigert
}

interface Programm {
  id: string;
  name: string;
  beschreibung: string;
  zielniveau: Profil['niveau'];
  wochen: ProgrammWoche[];
  istVorlage: boolean;
}

interface ProgrammZuweisung {
  id: string;
  programmId: string;
  zielId: string;                    // Profil-ID oder Gruppen-ID
  zielTyp: 'profil' | 'gruppe';
  startDatum: string;
  abgehakt: { woche: number; einheitId: string; datum: string }[];
}

// ---------- Turnier ----------
type TurnierFormat = 'ko' | 'gruppen_ko' | 'jeder_gegen_jeden' | 'schweizer';
type Disziplin = 'einzel' | 'doppel' | 'mixed';

interface Zaehlweise {
  modus: 'punkte' | 'zeit';
  saetzeZumSieg: 1 | 2;              // Best-of-1 oder Best-of-3
  punkteProSatz: number;             // Standard 21; Schule oft 11/15
  verlaengerung: boolean;            // 2-Punkte-Abstand
  maxPunkte: number;                 // Kappung, Standard 30
  zeitspielMin?: number;             // nur bei modus 'zeit'
}

interface Teilnehmer {
  id: string;
  name: string;                      // bei Doppel: "Müller / Schmidt"
  profilIds?: string[];              // optionale Verknüpfung zu Profilen
  setzplatz?: number;                // optional, 1 = topgesetzt
}

interface SatzErgebnis { a: number; b: number; }

interface Match {
  id: string;
  feld?: number;
  teilnehmerAId?: string;            // undefined = TBD oder Freilos
  teilnehmerBId?: string;
  saetze: SatzErgebnis[];
  siegerId?: string;
  status: 'offen' | 'laufend' | 'beendet';
  // formatabhängige Verortung:
  runde?: number;                    // Schweizer / Round Robin / K.o.-Runde
  bracketSlot?: number;              // Position innerhalb der K.o.-Runde
  bracketTyp?: 'haupt' | 'platz3';
  gruppeId?: string;                 // bei Gruppenphase
  phase?: 'gruppe' | 'ko';           // bei gruppen_ko
}

interface Turnier {
  id: string;
  name: string;
  datum: string;
  disziplin: Disziplin;
  format: TurnierFormat;
  zaehlweise: Zaehlweise;
  felderAnzahl: number;
  teilnehmer: Teilnehmer[];
  matches: Match[];
  config: {
    gruppenAnzahl?: number;          // gruppen_ko
    aufsteigerProGruppe?: number;    // gruppen_ko, Standard 2
    schweizerRunden?: number;        // Standard ceil(log2(n))
    spielUmPlatz3?: boolean;
    hinRueckrunde?: boolean;         // jeder_gegen_jeden
    doppelAuslosung?: 'fest' | 'zufall'; // bei Doppel: Paare fix oder auslosen
  };
  status: 'setup' | 'laufend' | 'beendet';
}

// ---------- Persistenz-Wurzel ----------
interface AppState {
  schemaVersion: number;             // Start: 1, Migrationen vorsehen
  profile: Profil[];
  gruppen: Gruppe[];
  eigeneUebungen: Uebung[];          // Bibliothek selbst ist statisch im Bundle
  einheiten: Einheit[];
  programme: Programm[];             // eigene; Vorlagen statisch im Bundle
  zuweisungen: ProgrammZuweisung[];
  logs: TrainingsLog[];
  einschaetzungen: SkillEinschaetzung[];
  turniere: Turnier[];
}
```

---

## 4. Übungsbibliothek (Inhalte!)

**Umfang zum Start: ~75 fachlich fundierte Übungen**, als statische TypeScript-Daten (`src/data/uebungen.ts`). Richtverteilung:

| Kategorie | Anzahl | Beispiele |
|---|---|---|
| Aufwärmen | 10 | Lauf-ABC mit Shuttle, Schattenbadminton, Mobilisation Schulter/Handgelenk |
| Schlagtechnik | 20 | Clear-Festigung über Zuspiel, Drop-Präzision auf Zielfelder, Smash-Serien, Drive-Duell, kurzer RH-Aufschlag auf Ziele, Netzdrops aus der Bewegung |
| Footwork | 12 | 6-Punkte-Sternlauf, Ausfallschritt-Pendel, Umsprung-Drill, Split-Step-Timing, Schattenlaufwege nach Ansage |
| Taktik Einzel | 8 | Lange-kurz-Muster, Gegner-aus-der-Mitte-Spiel, Aufschlag-Folgeschlag-Ketten |
| Taktik Doppel | 8 | Rotation Angriff↔Abwehr, Mitte-Abdeckung, Aufschlag-Drittball-Drill |
| Kondition | 10 | Court-Sprints, Sprungserien, Intervall-Schattenbadminton, Rumpfstabilität |
| Spielformen | 7 | Halbfeld-Einzel, Kaiserspiel, 3-gegen-3-Rotation, Brennball-Badminton (Schule) |

**Qualitätsanforderung an die Inhalte:** Jede Übung vollständig nach Interface ausfüllen — insbesondere `durchfuehrung` (konkrete Schritte mit Wiederholungs-/Zeitangaben), `fehlerbilder` (typischer Fehler → Korrektur) und ehrliche `material`- und `personen`-Angaben. Fachsprachlich korrekt (BWF-übliche deutsche Begriffe: Clear, Drop, Smash, Drive, Lob, Töten, Umsprung, Ausfallschritt, Split-Step). Schul-taugliche Übungen sind als solche erkennbar (Niveau `anfaenger`, `personen: 'gruppe'`).

**UI:** Filterbare Bibliotheksansicht (Kategorie, Skill, Niveau, Personenzahl, Material, Dauer, Volltextsuche). Übungsdetail-Seite mit allen Feldern und eingebetteter Animation, falls vorhanden. Eigene Übungen anlegen/bearbeiten möglich (landen in `eigeneUebungen`).

---

## 5. Vorschlagssystem & Einheiten-Builder

**Vorschlagssystem („Was willst du verbessern?"):** Eingaben: Ziel-Skills (1–3), Niveau, verfügbare Zeit, Personenzahl, verfügbares Material. Ausgabe: Score-sortierte Übungsliste (Skill-Match > Niveau-Match > Material erfüllt). Zusätzlich Button **„Einheit automatisch erstellen"**: generiert eine vollständige Einheit nach dem Muster *Aufwärmen (10–15 Min) → 2–3 Hauptübungen zu den Ziel-Skills → Spielform/Abschluss*, Zeitbudget wird eingehalten. Ergebnis öffnet sich im Builder und ist dort voll editierbar.

**Einheiten-Builder:** Drag & Drop (dnd-kit) von Übungen in eine Zeitleiste, Blockdauer pro Übung anpassbar, Live-Summe gegen Zielzeit (z. B. 90 Min) mit Über-/Unterschreitungs-Hinweis, Notizfeld je Block. Einheiten speichern, duplizieren, als **Druckansicht** ausgeben (sauberes `@media print`-Layout, eine A4-Seite wenn möglich: Tabelle Block / Übung / Dauer / Hinweise).

---

## 6. Mehrwochen-Programme

**Mitgelieferte Vorlagen (mindestens 4),** als statische Daten inkl. der zugehörigen Einheiten-Vorlagen:

1. **Grundlagen-Programm** (6 Wochen, Anfänger): Schlägerhaltung & Grundschläge → Beinarbeit → erste Spielformen.
2. **Smash & Angriff** (4 Wochen, Fortgeschrittene): Technik → Sprungkraft → Smash aus der Bewegung → Angriffsketten im Spiel.
3. **Turniervorbereitung** (8 Wochen, Fortgeschrittene/Leistung): Volumen → Intensität → Taktik → Tapering in der Schlusswoche.
4. **Schul-AG-Halbjahr** (12 Wochen, Anfänger, Gruppen): pro Woche eine 90-Min-Einheit, spielerisch, wenig Material.

Jede Woche trägt einen `progressionsHinweis` (was und warum gesteigert wird). Eigene Programme lassen sich aus gespeicherten Einheiten zusammenklicken.

**Zuweisung & Verlauf:** Programm einem Profil oder einer Gruppe zuweisen (Startdatum). Wochenansicht mit Abhaken einzelner Einheiten; Abhaken erzeugt automatisch einen `TrainingsLog` für die betroffenen Profile. Fortschrittsbalken pro Programm.

---

## 7. Profile, Gruppen & Fortschritts-Tracking

- **Profile:** anlegen/bearbeiten/archivieren. Profildetail zeigt: Skill-Radar, Einheiten-Historie, laufende Programme.
- **Gruppen:** Mitglieder per Mehrfachauswahl. Aktionen auf Gruppenebene: Programm zuweisen, Einheit als absolviert loggen (für alle Mitglieder), **„Als Turnier-Teilnehmer übernehmen"** (erzeugt Teilnehmerliste im Turnier-Setup, verknüpft `profilIds`).
- **Skill-Radar (recharts):** aktuelle Selbsteinschätzung (1–10) je Skill; optional zweite Ebene im selben Chart: Einschätzung von vor X Wochen (wählbar) zum Vergleich. Einschätzungen werden historisiert, nie überschrieben.
- **Trainingsvolumen:** aus Logs berechnet — Minuten je Skill (über `Uebung.skills` und Blockdauern verteilt), als Balkendiagramm; plus simple Kennzahlen (Einheiten letzte 4 Wochen, Gesamtminuten).
- **Eingabe-Komfort:** Selbsteinschätzung als schnelle Slider-Maske über alle Skills mit einem Speichern-Klick.

---

## 8. Bewegungs-Animationen (Pose-Engine) — Herzstück Nr. 1

### 8.1 Technisches Konzept

Eigene kleine Engine, **keine Videos, kein Lottie**:

- **Strichfigur** als SVG mit definiertem Skelett: Kopf (Kreis), Nacken, Schulter, Ellbogen, Handgelenk, Schlägerkopf (Schlägerlinie + Kopf-Ellipse), Hüfte, Knie L/R, Fuß L/R. Saubere `stroke-linecap: round`, Gelenke als Punkte.
- **Pose** = Datensatz aller Gelenkkoordinaten (normiertes Koordinatensystem, z. B. 0–100). **Animation** = Sequenz von Schlüsselposen mit Zeitstempel, Phasen-Label und Lehrtext:

```typescript
interface Pose { t: number; joints: Record<JointId, {x:number; y:number}>; }
interface AnimationsPhase { vonT: number; bisT: number; label: string; lehrtext: string; }
interface BewegungsAnimation {
  id: string; name: string; typ: 'figur' | 'court' | 'kombi';
  dauerMs: number; posen: Pose[]; phasen: AnimationsPhase[];
  shuttleBahn?: { t: number; x: number; y: number }[];  // Bézier-gesampelt
}
```

- **Player:** Interpolation zwischen Posen via `requestAnimationFrame` (Easing pro Segment). Controls: Play/Pause, Geschwindigkeit (0.25× / 0.5× / 1×), **Phasen-Stepper** (springt zur nächsten Schlüsselpose und pausiert), Scrubber. Aktive Phase zeigt Label + Lehrtext (z. B. „Treffpunkt: höchster Punkt, vor dem Körper, Arm gestreckt"). `prefers-reduced-motion` respektieren (dann Stepper-Modus als Default).
- **Court-Engine:** maßstabsgetreues Court-SVG (13,40 m × 6,10 m, alle Linien, Einzel-/Doppelfeld unterscheidbar), Spieler als beschriftete Punkte, Laufwege als animiert gezeichnete gestrichelte Pfade (`stroke-dasharray`-Technik), Shuttle-Flugbahnen als Bögen. Seitenansicht-Court (Netzhöhe 1,55 m) für Flugbahnen-Vergleich.

### 8.2 Die 25 Animationen (verbindliche Liste)

**Schlagtechnik — Strichfigur seitlich (14):**
1. Vorhand-Überkopf-Clear
2. Überkopf-Drop
3. Smash
4. Sprungsmash
5. Rückhand-Überkopf-Clear
6. Drive Vorhand
7. Drive Rückhand
8. Unterhand-Clear (Lob aus der Abwehr)
9. Netzdrop Vorhand
10. Netz-Lob Rückhand
11. Aufschlag kurz (Rückhand)
12. Aufschlag lang (Vorhand)
13. Töten am Netz (Netz-Kill)
14. Abwehr-Block gegen Smash

**Footwork — Court-Ansicht + Beinarbeit (6):**
15. Split-Step (Auftaktbewegung, Timing)
16. Ausfallschritt zum Netz (Lunge, vorderes Knie über Fuß)
17. Umsprung in der Vorhand-Ecke (Scissor Jump)
18. Lauf in die Rückhand-Ecke (Umlaufen vs. Rückhand)
19. Sidesteps zur Seitenlinie
20. 6-Punkte-Sternlauf (komplettes Laufmuster)

**Taktik & Regeln — Court von oben / Seitenansicht (5):**
21. Zentrale Position & Felddeckung im Einzel
22. Doppel-Angriffsformation (vorne/hinten) mit Rotation
23. Doppel-Abwehrformation (nebeneinander) und Wechsel in den Angriff
24. Flugbahnen-Vergleich Clear/Drop/Smash/Drive (Seitenansicht mit Netz)
25. Aufschlagfelder & Aufschlagregeln Einzel vs. Doppel (interaktiv umschaltbar)

**Fachliche Sorgfalt:** Posen müssen biomechanisch plausibel sein (Bogenspannung beim Clear, Ellbogen-führt-Prinzip, Treffpunkte korrekt: Smash vor dem Körper/abwärts, Drop hoch, Drive schulterhoch). Lehrtexte pro Phase = die Knackpunkte, auf die ein Trainer hinweisen würde.

**Empfohlene Arbeitsweise:** Erst den Player + 2 Referenz-Animationen (Clear, 6-Punkte-Lauf) bauen und visuell verifizieren (Screenshot/Browser), dann die übrigen 23 als reine Datensätze produzieren. Ein internes Dev-Tool (Route `/#/dev/pose-editor`, nur in Dev-Builds) zum Posen-Justieren spart enorm Zeit — lohnt sich bei 25 Animationen.

---

## 9. Turnierplaner — Herzstück Nr. 2

### 9.1 Gemeinsame Engine (`src/engine/turnier/`)

Reine, UI-freie Funktionen (gut testbar): `erzeugeSpielplan(turnier)`, `trageErgebnisEin(turnier, matchId, saetze)`, `berechneTabelle(...)`, `naechsteRunde(...)`, `weiseFelderZu(...)`. Ergebniseingabe validiert gegen die `Zaehlweise` (Satzgewinn, Verlängerung bis 2-Punkte-Abstand, Kappung bei `maxPunkte`).

**Tiebreaker-Reihenfolge** (Round Robin / Gruppen, in dieser Folge): 1. Siege → 2. direkter Vergleich → 3. Satzdifferenz → 4. Ballpunktdifferenz → 5. manuell/Los (UI bietet Entscheidung an).

**Felder-Scheduler:** verteilt offene Spiele auf `felderAnzahl` Felder; nächstes Spiel bekommt das Paar mit der längsten Pause (Wartezeit-Fairness); keine Person in zwei laufenden Spielen.

### 9.2 Format-Spezifika

- **K.o.:** Auffüllen auf nächste Zweierpotenz mit Freilosen. Setzliste optional: 1 und 2 in entgegengesetzte Hälften, 3/4 gelost auf die verbleibenden Viertel, Rest gelost; Freilose zuerst an Gesetzte. Optional Spiel um Platz 3. Bracket-Visualisierung mit Verbindungslinien, horizontal scrollbar, Sieger klickt sich automatisch weiter.
- **Gruppen + K.o.:** Gruppenanzahl wählbar oder Vorschlag (Gruppen à 3–5). Verteilung per Snake-Seeding (gesetzt) bzw. Losung. Round Robin in den Gruppen, dann steigen `aufsteigerProGruppe` (Standard 2) in ein K.o. auf; Kreuzpaarungen (A1–B2, B1–A2 …) so, dass Gruppengegner sich frühestens im Halbfinale wiedersehen.
- **Jeder gegen Jeden:** Paarungserzeugung per **Berger-Tabellen / Circle Method** (faire Reihenfolge), optional Hin- und Rückrunde. Live-Tabelle mit allen Tiebreaker-Spalten.
- **Schweizer System:** Rundenzahl Standard `ceil(log2(n))`, konfigurierbar. Paarung je Runde: nach Punktgruppen, innerhalb der Gruppe nach Buchholz sortiert, **keine Wiederholungsbegegnung** (bei Konflikt in benachbarte Punktgruppe ausweichen); bei ungerader Zahl Freilos (= Sieg) an den niedrigstplatzierten Teilnehmer ohne bisheriges Freilos. Endwertung: Punkte → **Buchholz** → Satzdifferenz → Ballpunktdifferenz.

### 9.3 Setup-Flow & UI

1. Turnier anlegen: Name, Datum, Disziplin, Format, Felderzahl, Zählweise (Presets: „Offiziell 2×21", „Schule 1×15", „Zeitspiel 10 Min" + frei konfigurierbar).
2. Teilnehmer: manuell, per Schnelleingabe (eine Zeile = ein Name) **oder Import aus Gruppe/Profilen**. Bei Doppel/Mixed: feste Paare eintragen oder **Zufallsauslosung** der Paare per Klick (für Schulturniere).
3. Optional Setzliste per Drag & Drop.
4. „Spielplan erzeugen" → Format-Engine läuft, Übersicht zeigt Spielplan; danach Teilnehmerliste eingefroren (Änderung nur mit Warnung + Neugenerierung, sofern noch keine Ergebnisse).
5. Durchführung: Spielliste je Feld, Ergebniseingabe als große, touch-freundliche Satz-Eingabe (Stepper/Ziffernblock, ±-Buttons), Korrektur bereits eingetragener Ergebnisse möglich (Folgespiele werden neu berechnet, mit Bestätigungsdialog falls Folge-Ergebnisse verworfen würden).
6. Abschluss: Endplatzierung, Druckansicht (Spielplan + Ergebnisse + Tabelle/Bracket, s/w-tauglich).

---

## 10. Beamer-Modus

Eigene Route `/#/beamer/:turnierId`, gedacht für zweiten Tab/Fenster am Hallen-Beamer:

- Vollbild-Layout, sehr große Typografie, hoher Kontrast.
- Zeigt: laufende Spiele je Feld mit Live-Satzstand, „Als Nächstes"-Liste (wer macht sich bereit), bei Gruppen/Liga die Tabelle, beim K.o. das Bracket.
- **Live-Sync ohne Backend:** Der Beamer-Tab lauscht auf das `window`-`storage`-Event — Eingaben im Bedien-Tab erscheinen sofort, da beide Tabs denselben localStorage teilen. (Hinweis: funktioniert im selben Browser; genau das ist das Setup Laptop→Beamer.)
- Automatischer Ansichtswechsel (Rotation alle X Sekunden zwischen Spielen/Tabelle), abschaltbar.

---

## 11. Persistenz, Export/Import, PWA

- **localStorage** über Zustand-Persist, Schlüssel `badminton-planer:v1`. `schemaVersion` im State; Migrationsfunktion vorsehen (Switch über Versionen), auch wenn v1 noch keine braucht.
- **Export:** kompletter `AppState` als JSON-Download (`badminton-planer-export-YYYY-MM-DD.json`), menschenlesbar formatiert. Zusätzlich Einzel-Export eines Turniers und einer Einheit (zum Weitergeben an Kollegen).
- **Import:** Datei-Upload → zod-Validierung → Vorschau (was ist enthalten) → Wahl: „Alles ersetzen" oder „Nur ausgewählte Turniere/Einheiten hinzufügen". Niemals stillschweigend mergen.
- **Speicher-Warnung:** dezenter Hinweis in den Einstellungen, dass Daten lokal im Browser liegen (Backup = Export). Bei Schließen mit ungespeichertem laufendem Turnier ist nichts zu tun — es ist ja immer persistiert.
- **PWA:** installierbar, komplette App offline lauffähig, App-Icon (Shuttle-Motiv), `theme-color`. Update-Strategie: neues Service-Worker-Update → unaufdringlicher „Neu laden"-Toast.

---

## 12. Design-Leitplanken

Designentscheidungen (Palette, Typografie, Layout-Charakter) triffst du — aber mit Prozess und Pflichten:

- **Zwei-Pass-Prozess:** Erst kompakten Design-Plan erstellen (4–6 benannte Farb-Tokens, Schriftpaarung Display/Body, Layout-Konzept, **ein** Signatur-Element) und gegen Generik prüfen — dann bauen. Verankere das Design in der Badminton-Welt (Court-Geometrie, Linienführung, Shuttle-Silhouette, Hallencharakter) statt in austauschbaren Dashboard-Defaults. Vermeide die üblichen KI-Looks (Creme + Serifen + Terracotta; Near-Black + Acid-Green; Zeitungs-Hairlines).
- **Pflicht-Anforderungen:** responsive von 360 px bis Beamer-Auflösung; Touch-Targets ≥ 44 px (Tablet-Bedienung in der Halle, ggf. mit klammen Fingern); Beamer-Modus mit maximalem Kontrast; Druckansichten nüchtern und s/w-tauglich; sichtbarer Tastatur-Fokus; `prefers-reduced-motion` respektiert; deutsche UI-Texte in konsistentem Du-Ton, aktive Verben auf Buttons („Spielplan erzeugen", nicht „OK").

---

## 13. Projektstruktur

```
badminton-planer/
├─ .github/workflows/deploy.yml
├─ vite.config.ts                 # base: '/badminton-planer/'
├─ src/
│  ├─ main.tsx, App.tsx           # HashRouter, Routen
│  ├─ pages/                      # Start, Bibliothek, Builder, Programme,
│  │                              # Profile, Tracking, Turniere, TurnierDetail,
│  │                              # Beamer, Bewegungslehre, Einstellungen
│  ├─ components/
│  │  ├─ ui/                      # Basis-Bausteine
│  │  ├─ training/                # UebungsKarte, EinheitenBuilder, Radar …
│  │  ├─ turnier/                 # Bracket, GruppenTabelle, ErgebnisEingabe …
│  │  └─ animation/               # PosePlayer, CourtView, PhasenStepper
│  ├─ engine/
│  │  ├─ turnier/                 # ko.ts, gruppenKo.ts, roundRobin.ts,
│  │  │                           # schweizer.ts, tabelle.ts, scheduler.ts
│  │  │                           # + *.test.ts (Vitest)
│  │  └─ pose/                    # interpolation.ts, player.ts
│  ├─ data/
│  │  ├─ uebungen.ts              # ~75 Übungen
│  │  ├─ programme.ts             # 4 Programm-Vorlagen + deren Einheiten
│  │  ├─ skills.ts                # SkillId-Definitionen + Anzeigenamen
│  │  └─ animationen/             # 25 Dateien, eine pro Animation
│  ├─ store/                      # Zustand-Slices + persist + Migration
│  ├─ schemas/                    # zod-Schemas (Import-Validierung)
│  └─ utils/
└─ public/                        # Icons, Manifest-Assets
```

---

## 14. Umsetzungsphasen mit Abnahmekriterien

Arbeite die Phasen **in dieser Reihenfolge** ab; jede Phase endet mit funktionierendem Build und erfülltem Kriterium.

| Phase | Inhalt | Abnahmekriterium |
|---|---|---|
| 0 | Vite + React + TS + Tailwind + HashRouter + PWA-Grundgerüst + Deploy-Workflow | Leere App läuft live auf GitHub Pages, Reload auf Unterseite funktioniert |
| 1 | Datenmodell, zod-Schemas, Zustand-Store mit Persist, Export/Import | Export → Browserdaten löschen → Import stellt alles wieder her |
| 2 | Übungsbibliothek: 75 Übungen als Daten + Filter-UI + Detailseite + eigene Übungen | Alle Filterkombinationen liefern korrekte Treffer; Inhalte fachlich stichprobengeprüft |
| 3 | Vorschlagssystem + Einheiten-Builder + Druckansicht | Auto-generierte 90-Min-Einheit ist plausibel aufgebaut; Drag & Drop läuft per Touch |
| 4 | Pose-Engine: Player + Court-Engine + 2 Referenz-Animationen, visuell verifiziert | Clear-Animation biomechanisch plausibel; Zeitlupe & Phasen-Stepper funktionieren |
| 5 | Restliche 23 Animationen + Bewegungslehre-Bereich (Übersicht, Verknüpfung mit Übungen) | Alle 25 abspielbar, jede Phase mit Lehrtext |
| 6 | Profile, Gruppen, Tracking (Radar, Volumen, Logs, Einschätzungs-Maske) | Geloggte Einheit erhöht Skill-Minuten korrekt; Radar zeigt Vergleich zweier Zeitpunkte |
| 7 | Programme: 4 Vorlagen + eigene Programme + Zuweisung + Abhaken | Abhaken erzeugt Logs für alle Gruppenmitglieder; Fortschrittsbalken korrekt |
| 8 | Turnier-Engine alle 4 Formate, **mit Vitest-Tests** (siehe §15) | Alle Engine-Tests grün |
| 9 | Turnier-UI: Setup-Flow, Bracket/Tabellen, Ergebniseingabe, Scheduler, Druck | Komplettes 9-Personen-Turnier in jedem Format durchspielbar inkl. Korrektur eines Ergebnisses |
| 10 | Beamer-Modus + Politur (Empty States, Fehlertexte, PWA-Feinschliff, Lighthouse) | Beamer-Tab aktualisiert sich live bei Eingabe im zweiten Tab |

---

## 15. Tests & Qualitätskriterien

**Vitest-Pflichttests für die Turnier-Engine** (mindestens):
- K.o. mit 3, 5, 8, 9, 16, 17 Teilnehmern: korrekte Freilos-Anzahl und -Verteilung, Setzplätze 1/2 treffen sich frühestens im Finale.
- Round Robin mit 4, 5, 7: jeder gegen jeden genau einmal (bzw. zweimal bei Rückrunde), niemand zwei Spiele in derselben Runde.
- Schweizer System mit 8 und 9 (ungerade!): keine Wiederholungsbegegnung, Freilos-Vergabe korrekt, Buchholz-Berechnung gegen handgerechnetes Beispiel.
- Gruppen + K.o.: Snake-Seeding korrekt, Kreuzpaarungen vermeiden frühe Gruppen-Wiederholungen.
- Tabellenlogik: konstruierte Fälle für jeden Tiebreaker einzeln.
- Zählweisen-Validierung: 21:19 ungültig fertig? Nein — Verlängerung; 30:29 gültig (Kappung); 1-Satz-Modus beendet nach einem Satz.

**Allgemeine Qualitätskriterien:**
- Keine Laufzeit-Requests an externe Dienste; App vollständig offline nutzbar.
- TypeScript strict, keine `any` in Engine und Store.
- Alle UI-Texte deutsch, fachsprachlich korrekt.
- Datenverlust-Sicherheit: jede destruktive Aktion (Löschen, Import-Ersetzen, Spielplan-Neugenerierung) mit Bestätigungsdialog.
- Performance: Bibliothek und Turnieransichten flüssig auf einem Mittelklasse-Tablet.

---

## 16. Ausdrücklich NICHT im Scope (v1)

Kein Backend, keine Accounts, kein Geräte-übergreifender Sync (nur Export/Import), keine Videoeinbettung, keine Mehrsprachigkeit, kein Liga-Verwaltungssystem über mehrere Spieltage hinweg. Diese Liste verhindert Scope-Drift — bei Ideen dazu: notieren, nicht bauen.
