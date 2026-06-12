/**
 * Tracking-Engine (§7) — reine Funktionen, UI-frei:
 * Skill-Minuten aus Logs, Kennzahlen, Radar-Daten mit Vergleichszeitpunkt,
 * Log-Erzeugung fürs Abhaken (Profil ODER alle Gruppenmitglieder).
 */
import { nanoid } from 'nanoid'
import type {
  Einheit,
  Programm,
  ProgrammZuweisung,
  SkillEinschaetzung,
  SkillId,
  TrainingsLog,
  Uebung,
} from '../datenmodell'
import { ALLE_SKILLS } from '../data/skills'

const WOCHE_MS = 7 * 24 * 60 * 60 * 1000

/* ---------- Trainingsvolumen ---------- */

/**
 * Minuten je Skill: Blockdauer wird gleichmäßig auf die Skills der Übung
 * verteilt; gezählt werden nur absolvierte Übungen des Logs.
 */
export function skillMinuten(
  logs: TrainingsLog[],
  findeEinheit: (id: string) => Einheit | undefined,
  findeUebung: (id: string) => Uebung | undefined,
): Record<SkillId, number> {
  const minuten = Object.fromEntries(ALLE_SKILLS.map((s) => [s, 0])) as Record<SkillId, number>
  for (const log of logs) {
    const einheit = findeEinheit(log.einheitId)
    if (!einheit) continue
    for (const block of einheit.bloecke) {
      if (!log.absolvierteUebungIds.includes(block.uebungId)) continue
      const uebung = findeUebung(block.uebungId)
      if (!uebung || uebung.skills.length === 0) continue
      const anteil = block.dauerMin / uebung.skills.length
      for (const skill of uebung.skills) minuten[skill] += anteil
    }
  }
  return minuten
}

/** Gesamtminuten eines Logs (über absolvierte Blöcke). */
export function logMinuten(
  log: TrainingsLog,
  findeEinheit: (id: string) => Einheit | undefined,
): number {
  const einheit = findeEinheit(log.einheitId)
  if (!einheit) return 0
  return einheit.bloecke
    .filter((b) => log.absolvierteUebungIds.includes(b.uebungId))
    .reduce((summe, b) => summe + b.dauerMin, 0)
}

export interface Kennzahlen {
  einheitenLetzte4Wochen: number
  einheitenGesamt: number
  minutenGesamt: number
}

export function kennzahlen(
  logs: TrainingsLog[],
  findeEinheit: (id: string) => Einheit | undefined,
  heute: Date = new Date(),
): Kennzahlen {
  const grenze = heute.getTime() - 4 * WOCHE_MS
  return {
    einheitenLetzte4Wochen: logs.filter((l) => new Date(l.datum).getTime() >= grenze).length,
    einheitenGesamt: logs.length,
    minutenGesamt: Math.round(logs.reduce((s, l) => s + logMinuten(l, findeEinheit), 0)),
  }
}

/* ---------- Skill-Radar ---------- */

/** Letzte Einschätzung je Skill zum Stichtag (oder davor); historisiert. */
export function einschaetzungZum(
  einschaetzungen: SkillEinschaetzung[],
  profilId: string,
  stichtag: Date,
): Partial<Record<SkillId, number>> {
  const ergebnis: Partial<Record<SkillId, number>> = {}
  const grenze = stichtag.getTime()
  for (const skill of ALLE_SKILLS) {
    let beste: SkillEinschaetzung | undefined
    for (const e of einschaetzungen) {
      if (e.profilId !== profilId || e.skill !== skill) continue
      const zeit = new Date(e.datum).getTime()
      if (zeit > grenze) continue
      if (!beste || zeit > new Date(beste.datum).getTime()) beste = e
    }
    if (beste) ergebnis[skill] = beste.wert
  }
  return ergebnis
}

export interface RadarPunkt {
  skill: SkillId
  name: string
  aktuell?: number
  vergleich?: number
}

/** Radar-Daten: aktuelle Werte plus optional Werte von vor X Wochen (§7). */
export function radarDaten(
  einschaetzungen: SkillEinschaetzung[],
  profilId: string,
  skillNamen: Record<SkillId, string>,
  vergleichWochen?: number,
  heute: Date = new Date(),
): { punkte: RadarPunkt[]; hatAktuell: boolean; hatVergleich: boolean } {
  const aktuell = einschaetzungZum(einschaetzungen, profilId, heute)
  const vergleich =
    vergleichWochen !== undefined
      ? einschaetzungZum(
          einschaetzungen,
          profilId,
          new Date(heute.getTime() - vergleichWochen * WOCHE_MS),
        )
      : {}
  const punkte = ALLE_SKILLS.map((skill) => ({
    skill,
    name: skillNamen[skill],
    aktuell: aktuell[skill],
    vergleich: vergleich[skill],
  }))
  return {
    punkte,
    hatAktuell: punkte.some((p) => p.aktuell !== undefined),
    hatVergleich: punkte.some((p) => p.vergleich !== undefined),
  }
}

/* ---------- Programme: Abhaken & Fortschritt ---------- */

/** Log fürs Abhaken: eine Einheit, ein oder mehrere Profile (Gruppe!). */
export function erzeugeAbhakLog(
  einheit: Einheit,
  profilIds: string[],
  datum: string,
): TrainingsLog {
  return {
    id: nanoid(),
    profilIds,
    einheitId: einheit.id,
    datum,
    absolvierteUebungIds: einheit.bloecke.map((b) => b.uebungId),
  }
}

export function programmGesamtEinheiten(programm: Programm): number {
  return programm.wochen.reduce((s, w) => s + w.einheitIds.length, 0)
}

export function zuweisungFortschritt(
  zuweisung: ProgrammZuweisung,
  programm: Programm | undefined,
): { erledigt: number; gesamt: number; prozent: number } {
  const gesamt = programm ? programmGesamtEinheiten(programm) : 0
  const erledigt = zuweisung.abgehakt.length
  return { erledigt, gesamt, prozent: gesamt === 0 ? 0 : Math.round((erledigt / gesamt) * 100) }
}

/** Aktuelle Programmwoche (1-basiert) anhand des Startdatums. */
export function aktuelleWoche(startDatum: string, heute: Date = new Date()): number {
  const start = new Date(startDatum).getTime()
  return Math.max(1, Math.floor((heute.getTime() - start) / WOCHE_MS) + 1)
}

export function istAbgehakt(
  zuweisung: ProgrammZuweisung,
  woche: number,
  einheitId: string,
): { woche: number; einheitId: string; datum: string; logId?: string } | undefined {
  return zuweisung.abgehakt.find((a) => a.woche === woche && a.einheitId === einheitId)
}
