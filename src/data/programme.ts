/**
 * Mitgelieferte Mehrwochen-Programme (§6) — statische Bundle-Daten:
 * 4 Programm-Vorlagen plus die zugehörigen Einheiten-Vorlagen (je 90 Min).
 * Jede Woche trägt einen Progressionshinweis.
 */
import type { Einheit, Programm } from '../datenmodell'

/* ---------- Einheiten-Vorlagen (istVorlage: true, Blöcke aus der Bibliothek) ---------- */

export const vorlagenEinheiten: Einheit[] = [
  {
    id: 've-grundlagen-1',
    name: 'Grundschläge kennenlernen (90 Min)',
    zielSkills: ['clear', 'aufschlag'],
    istVorlage: true,
    bloecke: [
      { uebungId: 'aw-01', dauerMin: 10 },
      { uebungId: 'aw-03', dauerMin: 5 },
      { uebungId: 'st-01', dauerMin: 15, notiz: 'Treffpunkt vor dem Körper betonen' },
      { uebungId: 'st-09', dauerMin: 15 },
      { uebungId: 'st-14', dauerMin: 10 },
      { uebungId: 'fw-03', dauerMin: 10 },
      { uebungId: 'sf-04', dauerMin: 25 },
    ],
  },
  {
    id: 've-grundlagen-2',
    name: 'Beinarbeit & hohe Bälle (90 Min)',
    zielSkills: ['beinarbeit', 'clear'],
    istVorlage: true,
    bloecke: [
      { uebungId: 'aw-10', dauerMin: 10 },
      { uebungId: 'fw-01', dauerMin: 10 },
      { uebungId: 'fw-02', dauerMin: 10 },
      { uebungId: 'st-01', dauerMin: 15 },
      { uebungId: 'st-11', dauerMin: 10 },
      { uebungId: 'fw-10', dauerMin: 10 },
      { uebungId: 'sf-01', dauerMin: 25 },
    ],
  },
  {
    id: 've-grundlagen-3',
    name: 'Erste Spielformen (90 Min)',
    zielSkills: ['taktik_einzel', 'netzspiel'],
    istVorlage: true,
    bloecke: [
      { uebungId: 'aw-08', dauerMin: 10 },
      { uebungId: 'st-10', dauerMin: 10 },
      { uebungId: 'st-03', dauerMin: 10 },
      { uebungId: 'te-01', dauerMin: 15 },
      { uebungId: 'sf-06', dauerMin: 15 },
      { uebungId: 'sf-02', dauerMin: 30 },
    ],
  },
  {
    id: 've-smash-technik',
    name: 'Smash-Technik (90 Min)',
    zielSkills: ['smash', 'schnelligkeit'],
    istVorlage: true,
    bloecke: [
      { uebungId: 'aw-05', dauerMin: 10 },
      { uebungId: 'ko-03', dauerMin: 10 },
      { uebungId: 'st-05', dauerMin: 15, notiz: 'Winkel vor Härte' },
      { uebungId: 'st-06', dauerMin: 15 },
      { uebungId: 'fw-04', dauerMin: 10 },
      { uebungId: 'st-19', dauerMin: 10 },
      { uebungId: 'sf-01', dauerMin: 20 },
    ],
  },
  {
    id: 've-smash-angriff',
    name: 'Angriff im Spiel (90 Min)',
    zielSkills: ['smash', 'taktik_doppel'],
    istVorlage: true,
    bloecke: [
      { uebungId: 'aw-02', dauerMin: 10 },
      { uebungId: 'st-05', dauerMin: 10 },
      { uebungId: 'st-20', dauerMin: 15 },
      { uebungId: 'td-04', dauerMin: 15 },
      { uebungId: 'te-05', dauerMin: 10 },
      { uebungId: 'sf-07', dauerMin: 30 },
    ],
  },
  {
    id: 've-turnier-volumen',
    name: 'Volumen & Grundlagen (90 Min)',
    zielSkills: ['ausdauer', 'clear'],
    istVorlage: true,
    bloecke: [
      { uebungId: 'aw-01', dauerMin: 10 },
      { uebungId: 'fw-02', dauerMin: 10 },
      { uebungId: 'st-02', dauerMin: 15 },
      { uebungId: 'st-19', dauerMin: 15 },
      { uebungId: 'te-04', dauerMin: 15 },
      { uebungId: 'ko-01', dauerMin: 10 },
      { uebungId: 'ko-04', dauerMin: 15 },
    ],
  },
  {
    id: 've-turnier-intensitaet',
    name: 'Intensität & Multishuttle (90 Min)',
    zielSkills: ['schnelligkeit', 'smash'],
    istVorlage: true,
    bloecke: [
      { uebungId: 'aw-05', dauerMin: 10 },
      { uebungId: 'fw-12', dauerMin: 10 },
      { uebungId: 'st-18', dauerMin: 15 },
      { uebungId: 'st-19', dauerMin: 15 },
      { uebungId: 'fw-09', dauerMin: 10 },
      { uebungId: 'ko-02', dauerMin: 10 },
      { uebungId: 'sf-05', dauerMin: 20 },
    ],
  },
  {
    id: 've-turnier-taktik',
    name: 'Taktik & Wettkampf (90 Min)',
    zielSkills: ['taktik_einzel', 'aufschlag'],
    istVorlage: true,
    bloecke: [
      { uebungId: 'aw-02', dauerMin: 10 },
      { uebungId: 'st-08', dauerMin: 10 },
      { uebungId: 'te-03', dauerMin: 15 },
      { uebungId: 'te-07', dauerMin: 15 },
      { uebungId: 'te-08', dauerMin: 20 },
      { uebungId: 'sf-05', dauerMin: 20 },
    ],
  },
  {
    id: 've-ag-einstieg',
    name: 'AG: Spielerischer Einstieg (90 Min)',
    zielSkills: ['beinarbeit', 'aufschlag'],
    istVorlage: true,
    bloecke: [
      { uebungId: 'aw-06', dauerMin: 15 },
      { uebungId: 'aw-04', dauerMin: 10 },
      { uebungId: 'st-09', dauerMin: 15 },
      { uebungId: 'fw-03', dauerMin: 10 },
      { uebungId: 'ko-10', dauerMin: 15 },
      { uebungId: 'sf-04', dauerMin: 25 },
    ],
  },
  {
    id: 've-ag-grundschlaege',
    name: 'AG: Grundschläge & Minispiele (90 Min)',
    zielSkills: ['clear', 'netzspiel'],
    istVorlage: true,
    bloecke: [
      { uebungId: 'aw-01', dauerMin: 10 },
      { uebungId: 'st-01', dauerMin: 15 },
      { uebungId: 'st-10', dauerMin: 10 },
      { uebungId: 'st-11', dauerMin: 10 },
      { uebungId: 'fw-01', dauerMin: 10 },
      { uebungId: 'sf-06', dauerMin: 15 },
      { uebungId: 'sf-01', dauerMin: 20 },
    ],
  },
  {
    id: 've-ag-turnierformen',
    name: 'AG: Mini-Turnierformen (90 Min)',
    zielSkills: ['taktik_einzel'],
    istVorlage: true,
    bloecke: [
      { uebungId: 'aw-10', dauerMin: 10 },
      { uebungId: 'st-09', dauerMin: 10 },
      { uebungId: 'te-01', dauerMin: 15 },
      { uebungId: 'sf-02', dauerMin: 30 },
      { uebungId: 'sf-05', dauerMin: 25 },
    ],
  },
]

/* ---------- Programm-Vorlagen ---------- */

export const programmVorlagen: Programm[] = [
  {
    id: 'prog-grundlagen',
    name: 'Grundlagen-Programm',
    beschreibung:
      'Sechs Wochen vom ersten Schlägergriff zu den ersten Spielformen: Schlägerhaltung und Grundschläge, dann Beinarbeit, zum Schluss kleine Wettspiele.',
    zielniveau: 'anfaenger',
    istVorlage: true,
    wochen: [
      { nummer: 1, fokus: 'Schlägerhaltung & Treffpunkt', einheitIds: ['ve-grundlagen-1'], progressionsHinweis: 'Alles über Genauigkeit: kurze Distanzen, viele Ballkontakte, noch kein Tempo.' },
      { nummer: 2, fokus: 'Grundschläge festigen', einheitIds: ['ve-grundlagen-1'], progressionsHinweis: 'Gleiche Einheit, höhere Ansprüche: Zielzonen verkleinern, Ballwechsel verlängern.' },
      { nummer: 3, fokus: 'Beinarbeit einführen', einheitIds: ['ve-grundlagen-2'], progressionsHinweis: 'Laufwege kommen dazu — Split-Step vor jedem Zuspiel laut ansagen.' },
      { nummer: 4, fokus: 'Beinarbeit & Länge', einheitIds: ['ve-grundlagen-2'], progressionsHinweis: 'Tempo der Laufwege steigt; Clears müssen jetzt die hintere Zone erreichen.' },
      { nummer: 5, fokus: 'Erste Spielformen', einheitIds: ['ve-grundlagen-3'], progressionsHinweis: 'Vom Üben zum Spielen: Regeln und Zählweise einführen, Fehler dürfen passieren.' },
      { nummer: 6, fokus: 'Spielen & Festigen', einheitIds: ['ve-grundlagen-3'], progressionsHinweis: 'Sätze zählen, Aufschlagregeln anwenden — Abschluss mit kleinem Klassenturnier.' },
    ],
  },
  {
    id: 'prog-smash',
    name: 'Smash & Angriff',
    beschreibung:
      'Vier Wochen Angriffsschulung: erst Technik und Sprungkraft, dann Smash aus der Bewegung und komplette Angriffsketten im Spiel.',
    zielniveau: 'fortgeschritten',
    istVorlage: true,
    wochen: [
      { nummer: 1, fokus: 'Smash-Technik', einheitIds: ['ve-smash-technik'], progressionsHinweis: 'Mit 80 % Kraft schlagen — der steile Winkel ist das Ziel, nicht das Tempo.' },
      { nummer: 2, fokus: 'Sprungkraft & Treffpunkt', einheitIds: ['ve-smash-technik'], progressionsHinweis: 'Sprungserien intensiver, Smash jetzt mit Umsprung — Treffpunkt bleibt vor dem Körper.' },
      { nummer: 3, fokus: 'Smash aus der Bewegung', einheitIds: ['ve-smash-angriff'], progressionsHinweis: 'Zuspiele variabler: erst laufen, dann schlagen. Qualität vor Serienlänge.' },
      { nummer: 4, fokus: 'Angriffsketten im Spiel', einheitIds: ['ve-smash-angriff'], progressionsHinweis: 'Smash–Nachrücken–Kill als Kette durchspielen; im Abschlussspiel zählen Angriffspunkte doppelt.' },
    ],
  },
  {
    id: 'prog-turnier',
    name: 'Turniervorbereitung',
    beschreibung:
      'Acht Wochen bis zum Wettkampf: Volumen aufbauen, Intensität steigern, Taktik schärfen — und in der Schlusswoche gezielt Tapering.',
    zielniveau: 'leistung',
    istVorlage: true,
    wochen: [
      { nummer: 1, fokus: 'Volumen aufbauen', einheitIds: ['ve-turnier-volumen'], progressionsHinweis: 'Umfänge hoch, Intensität moderat — Grundlagen für die harten Wochen legen.' },
      { nummer: 2, fokus: 'Volumen + erste Intensität', einheitIds: ['ve-turnier-volumen', 've-turnier-intensitaet'], progressionsHinweis: 'Zweite Einheit pro Woche: Multishuttle kommt dazu, Pausen bewusst kurz.' },
      { nummer: 3, fokus: 'Intensität', einheitIds: ['ve-turnier-intensitaet'], progressionsHinweis: 'Serien länger (15 statt 12 Shuttles), Tempo der Zuspiele steigt.' },
      { nummer: 4, fokus: 'Intensität + Taktik', einheitIds: ['ve-turnier-intensitaet', 've-turnier-taktik'], progressionsHinweis: 'Unter Ermüdung sauber bleiben: Taktikspiele direkt nach den Intervallen.' },
      { nummer: 5, fokus: 'Belastungsspitze', einheitIds: ['ve-turnier-volumen', 've-turnier-intensitaet'], progressionsHinweis: 'Härteste Woche des Blocks — danach wird reduziert. Schlaf und Erholung ernst nehmen.' },
      { nummer: 6, fokus: 'Taktik & Matchpläne', einheitIds: ['ve-turnier-intensitaet', 've-turnier-taktik'], progressionsHinweis: 'Aufgabenspiele gegen verschiedene Spielertypen; Aufschlag-Ketten automatisieren.' },
      { nummer: 7, fokus: 'Wettkampfsimulation', einheitIds: ['ve-turnier-taktik'], progressionsHinweis: 'Sätze unter Turnierbedingungen (Zählweise, Seitenwechsel, kurze Pausen).' },
      { nummer: 8, fokus: 'Tapering', einheitIds: ['ve-turnier-volumen'], progressionsHinweis: 'Umfang halbieren, Intensität nur in kurzen Spitzen — frisch ins Turnier.' },
    ],
  },
  {
    id: 'prog-schul-ag',
    name: 'Schul-AG-Halbjahr',
    beschreibung:
      'Zwölf Wochen für die Badminton-AG: pro Woche eine 90-Minuten-Einheit, spielerisch, mit wenig Material — vom Einstieg bis zum Mini-Turnier.',
    zielniveau: 'anfaenger',
    istVorlage: true,
    wochen: [
      { nummer: 1, fokus: 'Ankommen & Ausprobieren', einheitIds: ['ve-ag-einstieg'], progressionsHinweis: 'Erfolgserlebnisse vor Technik: jeder Treffer zählt, Staffeln machen die Gruppe warm.' },
      { nummer: 2, fokus: 'Werfen, Fangen, Treffen', einheitIds: ['ve-ag-einstieg'], progressionsHinweis: 'Wurfbewegung als Vorstufe des Überkopfschlags betonen — Distanzen leicht vergrößern.' },
      { nummer: 3, fokus: 'Aufschlag & Clear', einheitIds: ['ve-ag-grundschlaege'], progressionsHinweis: 'Erste richtige Grundschläge; Partnerwechsel nach jeder Übung mischt die Niveaus.' },
      { nummer: 4, fokus: 'Grundschläge festigen', einheitIds: ['ve-ag-grundschlaege'], progressionsHinweis: 'Zielzonen einführen (Reifen/Klebeband) — Treffer laut mitzählen lassen.' },
      { nummer: 5, fokus: 'Netzspiel entdecken', einheitIds: ['ve-ag-grundschlaege'], progressionsHinweis: 'Mehr Zeit am Netz: kurze Bälle als „Trickschläge" verkaufen, das motiviert.' },
      { nummer: 6, fokus: 'Erste Turnierform', einheitIds: ['ve-ag-turnierformen'], progressionsHinweis: 'Kaiserspiel einführen — Regeln gemeinsam erarbeiten, Schiedsrichterrolle rotieren.' },
      { nummer: 7, fokus: 'Spielfähigkeit', einheitIds: ['ve-ag-grundschlaege'], progressionsHinweis: 'Zurück zur Technik mit Spielbezug: Was im Kaiserspiel schwerfiel, gezielt üben.' },
      { nummer: 8, fokus: 'Lange & kurze Bälle', einheitIds: ['ve-ag-grundschlaege'], progressionsHinweis: 'Lang-kurz-Wechsel als Taktik entdecken: Wohin laufe ich nach meinem Schlag?' },
      { nummer: 9, fokus: 'Turnierformen vertiefen', einheitIds: ['ve-ag-turnierformen'], progressionsHinweis: 'Kurzsatz-Karussell: viele Gegner, schnelle Wechsel, alle bleiben in Bewegung.' },
      { nummer: 10, fokus: 'Doppel ausprobieren', einheitIds: ['ve-ag-turnierformen'], progressionsHinweis: 'Zu zweit auf dem Feld: laute Ansagen („mein/dein") von Anfang an einfordern.' },
      { nummer: 11, fokus: 'Generalprobe', einheitIds: ['ve-ag-turnierformen'], progressionsHinweis: 'Abschlussturnier vorbereiten: Zählweise, Aufschlagwechsel und Fairplay-Regeln sichern.' },
      { nummer: 12, fokus: 'AG-Abschlussturnier', einheitIds: ['ve-ag-turnierformen'], progressionsHinweis: 'Das große Finale — Urkunden nicht vergessen. Rückblick: Was nehmen alle mit?' },
    ],
  },
]

/* ---------- Zugriff (Vorlagen + eigene kombiniert) ---------- */

export function alleProgramme(eigene: Programm[]): Programm[] {
  return [...programmVorlagen, ...eigene]
}

export function findeProgramm(id: string, eigene: Programm[]): Programm | undefined {
  return programmVorlagen.find((p) => p.id === id) ?? eigene.find((p) => p.id === id)
}

export function alleEinheitenMitVorlagen(eigene: Einheit[]): Einheit[] {
  return [...vorlagenEinheiten, ...eigene]
}

export function findeEinheitMitVorlagen(
  id: string,
  eigene: Einheit[],
): Einheit | undefined {
  return vorlagenEinheiten.find((e) => e.id === id) ?? eigene.find((e) => e.id === id)
}
