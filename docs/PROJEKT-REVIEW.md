# Projekt-Review Badminton-Planer (2026-07-01)

> **Status (2026-07-02): ALLE Befunde umgesetzt.** Teil B (Bugs 1–12, 14) am 2026-07-01/02,
> Teil A (Animationen A1–A6) und die E2E-Specs (Befund 13, `e2e/formate.spec.ts`) am 2026-07-02.
> Verifikation: 454 Unit-Tests grün, tsc 0 Fehler, 7/7 Playwright-E2E grün,
> quantitative Zielwerte erreicht (`docs/review/messwerte-nach-teil-a.txt`):
> Segment-Schrumpfung überall 0,000 % (vorher bis −97 %), Kontakt-Distanz ≤ 0,01 Einheiten
> (Test-Toleranz 8 → 3 gesenkt), Kontakt-Tempo 55–95 % vom Peak im Schlagfenster
> (vorher 1–13 %), Füße exakt auf BODEN_Y ± 0,000 (vorher 4,5–9,6 schwebend).
>
> Umsetzungsnotizen (Abweichungen vom ursprünglichen Fix-Vorschlag):
> - Tangenten: nicht-uniforme Catmull-Rom-Gewichtung (Bessel) statt zentraler finiter
>   Differenzen — bei uniformen Zeiten identisch, hält aber das Tempo schneller
>   Anschwung-Segmente am Keyframe durch.
> - Neu `FigurKeyframe.schlag` (Treffmoment-Keyframe übernimmt die schnellere Nachbar-Sekante,
>   kein Abbremsen am Kontakt) und `FigurKeyframe.halt` (Tangente 0); Halte-Segmente mit
>   identischen Kanalwerten bleiben exakt konstant (kein „Atmen" im Stand).
> - Kontaktmomente zweier Bahnen justiert statt Posen verbogen: Netzkill 790 → 730 ms
>   (Schlägerkopf wieder VOR der Netzlinie), Netzlob-RH 1420 → 1460 ms (Kontakt nahe
>   Schwung-Peak, 6 cm vor dem Netz); Netzlob-Anflug als 2-Segment-Bahn (Apex über der
>   Kante, steiler Fall) neu gezeichnet.
> - `BestaetigungsDialog` bekam `aria-label={titel}` (Accessible Name für den nativen Dialog).
> - H4-Messung präzisiert: Peak im Schlagfenster ±300 ms um den Kontakt — Lauf-Phasen
>   (Körpertranslation trägt den Schlägerkopf, z. B. Netzdrop-Anlauf) verzerren sonst den Nenner.
> - Nachtrag Schwungrichtung: Die Winkel-Interpolation legte offen, dass mehrere
>   Keyframe-Rohwerte die falsche Rotationsrichtung kodierten (Positions-Lerp hatte das
>   über Sehnen-Abkürzungen kaschiert) — Schläger pendelte vorn-unten durch statt über
>   Kopf zu peitschen, der Ball flog „entgegen dem Schlag". Fix: Winkel-Repräsentationen
>   ±360° (ausholungUeberkopf: unterarm −218° ≡ 142°, schlaeger −255° ≡ 105°; RH-Clear
>   analog) plus Kontaktmomente in den Schwung gelegt (rh-clear 1380, drive-rh 680,
>   netzkill 690 mit 2-Segment-Kill-Bahn). Neuer Richtungs-Check: Schlägerkopf-Bewegung
>   am Kontakt ≈ Shuttle-Abflugrichtung (Winkel < 75° bzw. Soft-Touch-Ausnahme) für
>   alle 14 Schläge erfüllt.

**Gesamtzustand:** solide. 440/440 Unit-Tests grün, Typecheck fehlerfrei, saubere Architektur (Engine UI-frei, gute Testabdeckung der Turnierlogik, Build/Deploy korrekt aufgesetzt). Die gefundenen Probleme liegen an den Rändern: Sonderfälle der Turnierformate, Eingabe-Validierung — und die Animations-Engine hat zwei strukturelle Schwächen, die genau dein Nachvollziehbarkeits-Problem erklären.

---

## Teil A: Animationen — warum die Bewegungsabläufe schwer nachzuvollziehen sind

Alle Zahlen stammen aus einer quantitativen Analyse (Sampling aller 17 Figur-Animationen in 10-ms-Schritten). 1 m ≈ 40 Einheiten im 0–100-Raum.

### A1 · KERNPROBLEM: Der Arm kollabiert mitten in der Bewegung

`interpolierePose` (engine/pose/interpolation.ts:52) interpoliert Gelenk-**Positionen** linear. Bei großen Winkeländerungen nimmt jedes Gelenk die Sehne statt des Bogens — die Segmente werden dazwischen sichtbar kürzer. Gemessene maximale Schrumpfung (xy-Länge vs. Soll):

| Animation | schlimmstes Segment | Schrumpfung | Zeitpunkt |
|---|---|---|---|
| Clear / Drop | Oberarm | **−97 %** | t≈350 (Eindrehen) |
| Smash | Oberarm | **−97 %** | t≈330 |
| Sprungsmash | Oberarm | −96 % | t≈400 |
| Umsprung | Oberarm | −91 % | t≈350 |
| RH-Clear, Netzlob, Unterhand-Clear | Schläger | −91…−95 % | Schlagphase |
| Aufschlag lang | Schläger | −68 % | t≈1600 |
| Drive RH | Schläger | −74 % | t≈650 |

−97 % heißt: Der Oberarm ist zwischenzeitlich praktisch auf einen Punkt zusammengeschnurrt — der Ellbogen wandert durch die Schulter. Genau in der Ausholphase, in der man die Technik zeigen will, sieht die Figur „kaputt" aus. Der Schlägerkopf nimmt zudem eine Abkürzung statt des runden Schwungwegs — die Bewegungsspur (Spur-Punkte) zeigt deshalb keinen Bogen.

**Fix (empfohlen, löst A1 vollständig):** Winkel statt Positionen interpolieren. Die Winkel existieren bereits — jede anim-Datei definiert `Stellung`-Objekte und backt sie via `figurPose()` sofort zu Positionen. Stattdessen:

1. `BewegungsAnimation` um `stellungen?: { t: number; s: Stellung }[]` erweitern (Datenmodell erlaubt Erweiterung, §3).
2. Neue Funktion `interpoliereStellung(a, b, e)`: lerpt `huefte.x/y` und alle Winkelkanäle (rumpf, kopf, oberarm, unterarm, schlaeger, obL/unL/obR/unR, eindreh, *Seit). Defaults beachten: `kopf ?? rumpf`, `eindreh ?? 12`, `beinSeitL ?? −4`, `beinSeitR ?? 4`.
3. Pro Frame: `figurPose(t, interpolierteStellung)` — Segmentlängen sind damit per Konstruktion exakt, Schwungbögen entstehen automatisch.
4. Kein Winkel-Wrapping einbauen: einfacher Lerp der Rohwerte ist korrekt und gewollt (55° → −135° schwingt über oben, genau wie in den Daten gemeint).

Wichtig: Die Posen **an** den Keyframes ändern sich dadurch nicht — nur der Weg dazwischen. Shuttle-Kontaktpunkte und Konsistenztests bleiben gültig; lediglich der Snapshot-Test (Zwischenposen) muss neu aufgenommen werden. Aufwand: ~1–2 h, mechanische Umstellung der 17 anim-Dateien (`figurPose(t, X)` → `{ t, s: X }`).

### A2 · Der Schlag stoppt im Treffmoment

Das Smoothstep-Easing hat an jedem Keyframe Geschwindigkeit 0 — und der Kontaktzeitpunkt liegt fast immer **auf** einem Keyframe. Der Schläger bremst also vor dem Treffpunkt ab, steht kurz still und beschleunigt wieder. Physikalisch müsste die Schlägerkopf-Geschwindigkeit am Kontakt maximal sein. Gemessen (Tempo am Kontakt in % vom Peak):

| Animation | Tempo am Kontakt | Peak-Versatz |
|---|---|---|
| Clear | 13 % | −70 ms |
| Drop | 11 % | −80 ms |
| Smash | 13 % | −70 ms |
| Sprungsmash | 1 % | +230 ms |
| Drive RH | 4 % | −370 ms |
| Block | 4 % | −220 ms |
| **Netzkill** | **90 %** | +40 ms |

Netzkill ist der Beweis: Dort liegt der Kontakt (790 ms) mitten im Segment (Keyframes 700/950) — und der Schlag sieht entsprechend „knackig" aus.

**Fix-Optionen:**
- *Sofort, ohne Engine-Änderung:* Kontakt-Keyframes zeitlich versetzen, sodass der Kontakt in die Segmentmitte fällt (Netzkill-Muster).
- *Sauber (empfohlen, zusammen mit A1):* Catmull-Rom-Interpolation über die Winkelkanäle statt segmentweisem Smoothstep — durchgehende Geschwindigkeit an inneren Keyframes, kein Stopp; leichtes Überschwingen wirkt bei Schlagbewegungen sogar natürlich (Durchschwung). Optional pro Keyframe ein `halt: true` für gewollte Stopps (z. B. Ende der Grundstellung). Aufwand: ~60 Zeilen Engine + Feinschliff.

### A3 · Die Figur schwebt über dem Boden

In **allen** 17 Figur-Animationen hängen die Füße 4,5–9,6 Einheiten (≈ 11–24 cm) über der gezeichneten Bodenlinie (BODEN_Y = 92); die Beingeometrie der Stellungs-Bausteine erreicht den Boden nie. Bei einer 100er-viewBox sind das 5–10 % der Bildhöhe — sichtbar, und es untergräbt die Referenz „Netzkante 1,55 m".

**Fix:** Boden-Verankerung in `figurPose()`: `dy = BODEN_Y − max(fussL.y, fussR.y)`, alle Gelenke um dy verschieben; für Sprünge (Sprungsmash, Splitstep, Umsprung) explizites `flugHoehe?: number` in `Stellung`. Achtung: verschiebt die Figur je Pose unterschiedlich nach unten → Shuttle-Bahnen (Bezier-Endpunkte) müssen nachgezogen werden; die Konsistenztests fangen das ein. Alternativ minimal-invasiv: Beinwinkel der 6 Stellungs-Bausteine nachkalibrieren.

### A4 · Kontaktpräzision: gut, aber zwei Ausreißer + zu laxe Test-Toleranz

Abstand Schlägerkopf↔Shuttle am Kontaktzeitpunkt: meist 1–6 cm (gut). Ausreißer: **Drop 12 cm** (Minimum 30 ms *vor* dem Kontakt-t), **Sprungsmash 10 cm**, Clear-Minimum 50 ms *nach* Kontakt-t. Die Test-Toleranz in konsistenz.test.ts:49 beträgt 8 Einheiten ≈ **20 cm** — das lässt sichtbare „Luftschläge" durch. Empfehlung: Bahnen der drei Ausreißer nachjustieren, Toleranz auf 3 (≈ 7 cm) senken.

### A5 · Frontansicht ohne Tiefen-Staffelung

Die Seitenansicht dimmt netzferne Glieder (opacity 0.45) — die Frontansicht zeichnet alles voll deckend und sortiert nur die Reihenfolge (FigurAnsicht.tsx:91). Vorderes und hinteres Bein sind nicht unterscheidbar. Fix: opacity aus `tiefe` ableiten (z. B. 0.5–1.0 normalisiert über die Figuren-Tiefenspanne). ~5 Zeilen.

### A6 · Kleinere Punkte

- **Kein Kontakt-Moment-Marker:** Die Kontaktzeiten existieren nur im Test (`KONTAKTE`-Map). Ins Datenmodell heben (`kontaktT?: number`) und im Player einen kurzen Impact-Ring (~80 ms) am Treffpunkt rendern — zusammen mit A2 macht das den entscheidenden Moment sofort erfassbar. Optional: automatische Zeitlupe ±150 ms um den Kontakt.
- **Court-Animationen: Läufer ohne Beschleunigung.** Spieler-Bahnen werden linear interpoliert (kein Easing) — abrupte Starts/Stopps und Knicke an Bahnpunkten. Smoothstep pro Bahnsegment oder Catmull-Rom über die Bahn würde Laufwege natürlicher machen (betrifft Sidesteps, Sternlauf, Einzel-Position, Doppel-Taktik).
- `FigurAnsicht.tsx:71`: Front-Fallback `z ?? 7` ist eine Magic Number (Schlagarm-Seite); als benannte Konstante neben `FRONT_MITTE` dokumentieren.
- Nach dem Loop-Ende springt die Animation hart auf t=0 (`% dauerMs`); da Start-/Endpose identisch sind, fällt es kaum auf — eine kurze Pause am Ende (300 ms Hold) würde den Zyklus lesbarer machen.

### Empfohlene Reihenfolge (Animationen)

1. **A1 + A2 zusammen**: Stellungs-Keyframes + Catmull-Rom-Winkelinterpolation → größter Effekt auf Nachvollziehbarkeit.
2. **A3** Boden-Verankerung (+ Bahnen nachziehen).
3. **A4** Drop/Sprungsmash/Clear-Bahnen justieren, Test-Toleranz 8 → 3.
4. **A6** Kontakt-Marker + kontaktT ins Datenmodell.
5. **A5** Tiefen-Dimmen Frontansicht, Court-Läufer-Easing.

---

## Teil B: Fehler im restlichen Projekt

### Bugs

1. **Import bricht bei Zeitspiel-Turnieren komplett.** `schemas/appState.ts:171` fordert `punkteProSatz` positiv; das Preset „Zeitspiel 10 Min" (`zaehlweise.ts:100`) hat `0`. Ein Export mit so einem Turnier lässt sich nicht reimportieren — beim Voll-Import scheitert **alles** (Backup-Verlust-Szenario). Fix: `z.number().int().min(0)` + Roundtrip-Test je Preset.
2. **K.o. mit 3 Teilnehmern + Spiel um Platz 3 ist nie abschließbar.** `ko.ts:166` propagiert den „Verlierer" eines Freilos-Halbfinals nicht → Platz-3-Match bleibt halbleer, Turnier ewig „laufend", keine Urkunden. Fix: Platz-3-Match mit nur einem Teilnehmer nach Ende der Halbfinals als Freilos beenden.
3. **Gruppen+K.o.: Einer-Gruppen crashen den K.o.-Start.** `gruppenKo.ts:71–76` greift auf `tabellenProGruppe[i+1]![1]!` zu; `TurnierNeu.tsx:181–186` validiert Teilnehmerzahl vs. Gruppenzahl nicht (7 TN / 4 Gruppen → Einer-Gruppe mit dem Topgesetzten, der stillschweigend verschwindet; TypeError beim K.o.-Start). Fix: Mindestgruppengröße ≥ max(2, Aufsteiger) beim Speichern erzwingen + `kreuzSlots` defensiv.
4. **„Paare zufällig auslosen" löscht bei ungerader Anzahl die letzte Person** (Meldung suggeriert das Gegenteil); Doppelklick verschachtelt bereits gebildete Paare erneut. `TurnierNeu.tsx:128–146`. Fix: bei ungerader Anzahl nicht ersetzen; immer aus der Ursprungsliste auslosen.
5. **EinheitenBuilder legt bei jedem „Speichern" auf einer Vorlage eine neue Kopie an.** `EinheitenBuilder.tsx:301`: `if (!vorhandene)` muss `if (!gespeicherte)` heißen + `navigate(..., { replace: true })` auf die neue ID.

### Risiken

6. `profilLoeschen` (store/index.ts:175–182) hinterlässt verwaiste Zuweisungen, Einschätzungen und Log-Referenzen — `gruppeLoeschen` räumt korrekt auf, hier fehlt es.
7. Satz-Validierung akzeptiert unmögliche Endstände wie 30:0 (`zaehlweise.ts:26`) — bei Kappung nur Differenz 1–2 zulassen.
8. Zwischenstand auf Match ohne Feld setzt Status `laufend` → fällt dauerhaft aus der Scheduler-Warteschlange (`turnier/index.ts:185–189` + `scheduler.ts:19`). Nur mit Feldzuweisung auf `laufend`.
9. Freie Zählweise wird beim Speichern nicht validiert (`TurnierNeu.tsx:387–412`): `punkteProSatz 0` oder `maxPunkte < punkteProSatz` möglich → mitten im Turnier ist kein gültiges Ergebnis mehr eingebbar (kollidiert zusätzlich mit Bug 1).
10. `turnierSchweizerRundeAuslosen` (store/index.ts:462–471) hat keinen Guard — Doppeltap lost zwei Runden parallel aus. Guard gehört in den Store, nicht nur in die UI.
11. CSV-Export ohne Formel-Injection-Schutz (`csv.ts:10–13`): Werte, die mit `=`, `+`, `−`, `@` beginnen, werden in Excel als Formel ausgeführt. Standard-Fix: `'` voranstellen.

### Verbesserungen

12. `ErgebnisDialog` nutzt ein Div-Overlay ohne Fokus-Trap/Escape — `BestaetigungsDialog` macht es mit nativem `<dialog>` richtig; Muster übernehmen.
13. E2E deckt nur K.o. ab — gerade die ungetesteten Formate (Gruppen+K.o.-Phasenwechsel = Bug 3, Schweizer-Auslosung = Risiko 10, Zeitspiel = Bug 1) enthalten die Fehler. Je ein Smoke-Test ergänzen.
14. Volltextsuche ignoriert `beschreibung` entgegen eigener Doku (`uebungsFilter.ts:21–32`).

---

## Priorisierung gesamt

| Prio | Was | Warum |
|---|---|---|
| 1 | Bug 1 (Import/Zeitspiel) | Datenverlust beim Backup-Restore |
| 2 | A1+A2 (Winkel-Interpolation + Durchschwung) | dein Kernanliegen; größter sichtbarer Qualitätssprung |
| 3 | Bugs 2–5 | laufende Turniere blockiert / Datenverlust bei Eingabe |
| 4 | Risiken 6–11 | Konsistenz & Validierung |
| 5 | A3–A6, Verbesserungen 12–14 | Feinschliff |

*Testlauf: 440 passed, 1 skipped · tsc --noEmit: 0 Fehler (Node 22, Linux). Hinweis: `npm test` schlägt in Nicht-Windows-Umgebungen fehl, solange node_modules von Windows stammen (esbuild-Binaries plattformspezifisch) — kein Projektfehler.*
