/**
 * Zentrales Datenmodell — verbindliche Basis aus dem Projekt-Briefing (§3).
 * Darf erweitert, aber nicht umbenannt werden.
 * Alle Datumsfelder: ISO-Strings. Alle IDs: nanoid.
 */

// ---------- Personen ----------
export interface Profil {
  id: string
  name: string
  niveau: 'anfaenger' | 'fortgeschritten' | 'leistung'
  erstelltAm: string
  notizen?: string
  /** Archivierte Profile werden in Listen ausgeblendet (Erweiterung §7). */
  archiviert?: boolean
}

export interface Gruppe {
  id: string
  name: string // z. B. "Badminton-AG Mittwoch", "Herren 2"
  mitgliederIds: string[]
}

// ---------- Skills & Tracking ----------
export type SkillId =
  | 'clear'
  | 'drop'
  | 'smash'
  | 'drive'
  | 'netzspiel'
  | 'aufschlag'
  | 'beinarbeit'
  | 'schnelligkeit'
  | 'ausdauer'
  | 'taktik_einzel'
  | 'taktik_doppel'

export interface SkillEinschaetzung {
  // Selbsteinschätzung, historisiert
  id: string
  profilId: string
  skill: SkillId
  wert: number // 1–10
  datum: string
}

export interface TrainingsLog {
  // absolvierte Einheit
  id: string
  profilIds: string[] // einzelne Person ODER alle Gruppenmitglieder
  einheitId: string
  datum: string
  absolvierteUebungIds: string[] // ggf. Teilmenge der Einheit
  notizen?: string
}

// ---------- Übungen ----------
export type Kategorie =
  | 'aufwaermen'
  | 'schlagtechnik'
  | 'footwork'
  | 'taktik_einzel'
  | 'taktik_doppel'
  | 'kondition'
  | 'spielformen'

export interface Uebung {
  id: string
  name: string
  kategorie: Kategorie
  skills: SkillId[] // worauf zahlt die Übung ein
  niveau: Profil['niveau'][] // für welche Niveaus geeignet
  dauerMin: number // Richtwert
  personen: 'allein' | 'paar' | 'gruppe'
  material: string[] // z. B. ["Hütchen", "Shuttle-Korb"]
  kurzbeschreibung: string // 1–2 Sätze
  durchfuehrung: string[] // nummerierte Schritte
  variationen?: string[] // leichter/schwerer
  fehlerbilder?: string[] // typischer Fehler → Korrekturhinweis
  animationId?: string // Verweis auf Animation
}

// ---------- Einheiten & Programme ----------
export interface EinheitBlock {
  uebungId: string
  dauerMin: number
  notiz?: string
}

export interface Einheit {
  id: string
  name: string
  zielSkills: SkillId[]
  bloecke: EinheitBlock[]
  istVorlage: boolean // mitgelieferte vs. eigene
}

export interface ProgrammWoche {
  nummer: number
  fokus: string // z. B. "Grundschläge festigen"
  einheitIds: string[] // 1–3 Einheiten pro Woche
  progressionsHinweis?: string // was diese Woche steigert
}

export interface Programm {
  id: string
  name: string
  beschreibung: string
  zielniveau: Profil['niveau']
  wochen: ProgrammWoche[]
  istVorlage: boolean
}

export interface ProgrammZuweisung {
  id: string
  programmId: string
  zielId: string // Profil-ID oder Gruppen-ID
  zielTyp: 'profil' | 'gruppe'
  startDatum: string
  abgehakt: { woche: number; einheitId: string; datum: string; logId?: string }[]
}

// ---------- Turnier ----------
export type TurnierFormat = 'ko' | 'gruppen_ko' | 'jeder_gegen_jeden' | 'schweizer'
export type Disziplin = 'einzel' | 'doppel' | 'mixed'

export interface Zaehlweise {
  modus: 'punkte' | 'zeit'
  saetzeZumSieg: 1 | 2 // Best-of-1 oder Best-of-3
  punkteProSatz: number // Standard 21; Schule oft 11/15
  verlaengerung: boolean // 2-Punkte-Abstand
  maxPunkte: number // Kappung, Standard 30
  zeitspielMin?: number // nur bei modus 'zeit'
}

export interface Teilnehmer {
  id: string
  name: string // bei Doppel: "Müller / Schmidt"
  profilIds?: string[] // optionale Verknüpfung zu Profilen
  setzplatz?: number // optional, 1 = topgesetzt
}

export interface SatzErgebnis {
  a: number
  b: number
}

export interface Match {
  id: string
  feld?: number
  teilnehmerAId?: string // undefined = TBD oder Freilos
  teilnehmerBId?: string
  saetze: SatzErgebnis[]
  siegerId?: string
  status: 'offen' | 'laufend' | 'beendet'
  /** Abschlusszeitpunkt (ISO) — Grundlage der Wartezeit-Fairness im Scheduler. */
  beendetUm?: string
  // formatabhängige Verortung:
  runde?: number // Schweizer / Round Robin / K.o.-Runde
  bracketSlot?: number // Position innerhalb der K.o.-Runde
  bracketTyp?: 'haupt' | 'platz3'
  gruppeId?: string // bei Gruppenphase
  phase?: 'gruppe' | 'ko' // bei gruppen_ko
}

export interface Turnier {
  id: string
  name: string
  datum: string
  disziplin: Disziplin
  format: TurnierFormat
  zaehlweise: Zaehlweise
  felderAnzahl: number
  teilnehmer: Teilnehmer[]
  matches: Match[]
  config: {
    gruppenAnzahl?: number // gruppen_ko
    aufsteigerProGruppe?: number // gruppen_ko, Standard 2
    schweizerRunden?: number // Standard ceil(log2(n))
    spielUmPlatz3?: boolean
    hinRueckrunde?: boolean // jeder_gegen_jeden
    doppelAuslosung?: 'fest' | 'zufall' // bei Doppel: Paare fix oder auslosen
  }
  status: 'setup' | 'laufend' | 'beendet'
}

// ---------- Bewegungs-Animationen (statische Bundle-Daten, §8) ----------
export type JointId =
  | 'kopf'
  | 'nacken'
  | 'schulter'
  | 'ellbogen'
  | 'handgelenk'
  | 'schlaegerKopf'
  | 'huefte'
  | 'knieL'
  | 'fussL'
  | 'knieR'
  | 'fussR'

export interface Pose {
  t: number
  /** x/y = Seitenansicht (0–100); z = Tiefe quer dazu (+ = rechte Körperseite). */
  joints: Record<JointId, { x: number; y: number; z?: number }>
  /** Zusatzinfos für die Frontansicht (Schulter-/Hüftachse). */
  meta?: { eindreh?: number }
}

export interface AnimationsPhase {
  vonT: number
  bisT: number
  label: string
  lehrtext: string
}

export interface BahnPunkt {
  t: number
  x: number
  y: number
  /** Tiefe quer zur Seitenansicht (Frontprojektion); Default ≈ Schlagarmseite. */
  z?: number
  /** Segment AB diesem Punkt ausblenden (z. B. zwischen zwei Aufschlägen). */
  unsichtbar?: boolean
}

/** Court-Animationen (Erweiterung §8): Spielerpunkte mit Laufwegen. */
export interface CourtSpieler {
  id: string
  label: string // z. B. "A", "B1"
  seite: 'a' | 'b'
  bahn: BahnPunkt[]
}

/** Zeitlich eingeblendete Markierungsfläche in Court-Koordinaten (Meter). */
export interface CourtZone {
  vonT: number
  bisT: number
  x: number
  y: number
  breite: number
  hoehe: number
  label?: string
  /** Nur in dieser Disziplin-Ansicht zeigen (Aufschlagfelder-Animation). */
  modus?: 'einzel' | 'doppel'
}

export interface BewegungsAnimation {
  id: string
  name: string
  typ: 'figur' | 'court' | 'kombi'
  dauerMs: number
  posen: Pose[]
  phasen: AnimationsPhase[]
  shuttleBahn?: BahnPunkt[] // Bézier-gesampelt
  // ---- Erweiterungen (Modell darf erweitert werden, §3) ----
  beschreibung?: string
  /** Court-Animationen: Draufsicht oder Seitenansicht */
  courtAnsicht?: 'oben' | 'seite'
  spieler?: CourtSpieler[]
  zonen?: CourtZone[]
  /** Figur-Ansicht: Netz an dieser x-Position (0–100) einblenden */
  netzX?: number
  /** Aufschlagfelder-Animation: Einzel/Doppel umschaltbar */
  umschaltbar?: boolean
  /** Seitenansicht: mehrere beschriftete Flugbahnen (Vergleich Clear/Drop/Smash/Drive) */
  bahnen?: { label: string; punkte: BahnPunkt[] }[]
}

// ---------- Persistenz-Wurzel ----------
export interface AppState {
  schemaVersion: number // Start: 1, Migrationen vorsehen
  profile: Profil[]
  gruppen: Gruppe[]
  eigeneUebungen: Uebung[] // Bibliothek selbst ist statisch im Bundle
  einheiten: Einheit[]
  programme: Programm[] // eigene; Vorlagen statisch im Bundle
  zuweisungen: ProgrammZuweisung[]
  logs: TrainingsLog[]
  einschaetzungen: SkillEinschaetzung[]
  turniere: Turnier[]
}

export const AKTUELLE_SCHEMA_VERSION = 1

export const leererAppState: AppState = {
  schemaVersion: AKTUELLE_SCHEMA_VERSION,
  profile: [],
  gruppen: [],
  eigeneUebungen: [],
  einheiten: [],
  programme: [],
  zuweisungen: [],
  logs: [],
  einschaetzungen: [],
  turniere: [],
}
