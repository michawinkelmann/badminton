/**
 * Gruppen + K.o. (§9.2): Snake-Seeding in Gruppen, Round Robin je Gruppe,
 * dann steigen `aufsteigerProGruppe` in ein K.o. auf — Kreuzpaarungen so,
 * dass Gruppengegner sich frühestens im Halbfinale wiedersehen.
 */
import type { Match, Teilnehmer, Zaehlweise } from '../../datenmodell'
import { mische, type Rng } from './rng'
import { erzeugeRoundRobinMatches } from './roundRobin'
import { berechneTabelle } from './tabelle'
import { erzeugeKoMatches } from './ko'

export const GRUPPEN_NAMEN = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H']

/** Vorschlag: Gruppen à 3–5 (§9.2). */
export function gruppenVorschlag(teilnehmerzahl: number): number {
  if (teilnehmerzahl <= 5) return 1
  if (teilnehmerzahl <= 10) return 2
  if (teilnehmerzahl <= 20) return 4
  return 8
}

/**
 * Verteilung per Snake-Seeding: Setzliste (Setzplätze zuerst, Rest gelost)
 * schlängelt durch die Gruppen: A B C C B A A B C …
 */
export function verteileGruppen(
  teilnehmer: Teilnehmer[],
  gruppenAnzahl: number,
  rng: Rng,
): string[][] {
  const gesetzte = teilnehmer
    .filter((t) => t.setzplatz !== undefined)
    .sort((a, b) => a.setzplatz! - b.setzplatz!)
  const rest = mische(teilnehmer.filter((t) => t.setzplatz === undefined), rng)
  const seedListe = [...gesetzte, ...rest]

  const gruppen: string[][] = Array.from({ length: gruppenAnzahl }, () => [])
  seedListe.forEach((t, i) => {
    const block = Math.floor(i / gruppenAnzahl)
    const pos = i % gruppenAnzahl
    const index = block % 2 === 0 ? pos : gruppenAnzahl - 1 - pos
    gruppen[index]!.push(t.id)
  })
  return gruppen
}

export function erzeugeGruppenMatches(gruppen: string[][]): Match[] {
  return gruppen.flatMap((ids, i) =>
    erzeugeRoundRobinMatches(ids, { gruppeId: GRUPPEN_NAMEN[i] ?? `G${i + 1}`, phase: 'gruppe' }),
  )
}

export function gruppenphaseFertig(matches: Match[]): boolean {
  const gruppenMatches = matches.filter((m) => m.phase === 'gruppe')
  return gruppenMatches.length > 0 && gruppenMatches.every((m) => m.status === 'beendet')
}

/**
 * Kreuz-Slots für die K.o.-Phase: A1–B2, B1–A2 (2 Gruppen) bzw.
 * A1–B2, C1–D2, B1–A2, D1–C2 (4 Gruppen) — Erst- und Zweitplatzierte einer
 * Gruppe landen in entgegengesetzten Bracket-Hälften.
 */
export function kreuzSlots(aufsteigerProGruppe: number, tabellenProGruppe: string[][]): string[] {
  const k = tabellenProGruppe.length
  const slots: string[] = []
  if (aufsteigerProGruppe === 1) {
    for (const t of tabellenProGruppe) slots.push(t[0]!)
    return slots
  }
  // Standard: 2 Aufsteiger — Paare (G_i 1. vs G_partner 2.)
  for (let i = 0; i < k; i += 2) {
    slots.push(tabellenProGruppe[i]![0]!, tabellenProGruppe[i + 1]![1]!)
  }
  for (let i = 0; i < k; i += 2) {
    slots.push(tabellenProGruppe[i + 1]![0]!, tabellenProGruppe[i]![1]!)
  }
  return slots
}

/** Prüft, ob die K.o.-Phase mit dieser Konfiguration möglich ist (2^x Aufsteiger). */
export function koPhaseMoeglich(gruppenAnzahl: number, aufsteigerProGruppe: number): boolean {
  const gesamt = gruppenAnzahl * aufsteigerProGruppe
  if (gesamt < 2) return false
  if (aufsteigerProGruppe === 2 && gruppenAnzahl % 2 !== 0) return false
  return (gesamt & (gesamt - 1)) === 0
}

/** K.o.-Phase aus den Gruppentabellen erzeugen (phase 'ko'). */
export function starteKoMatches(
  gruppen: string[][],
  matches: Match[],
  zw: Zaehlweise,
  aufsteigerProGruppe: number,
  spielUmPlatz3: boolean,
  manuelleReihung: string[] = [],
): Match[] {
  const tabellen = gruppen.map((ids, i) => {
    const gruppenId = GRUPPEN_NAMEN[i] ?? `G${i + 1}`
    const eigene = matches.filter((m) => m.phase === 'gruppe' && m.gruppeId === gruppenId)
    return berechneTabelle(ids, eigene, zw, manuelleReihung)
      .slice(0, aufsteigerProGruppe)
      .map((z) => z.teilnehmerId)
  })
  const slots = kreuzSlots(aufsteigerProGruppe, tabellen)
  return erzeugeKoMatches(slots, { spielUmPlatz3, phase: 'ko' })
}

/** Gruppen aus den Matches rekonstruieren (gruppeId → Mitglieder). */
export function gruppenAusMatches(matches: Match[]): Map<string, Set<string>> {
  const gruppen = new Map<string, Set<string>>()
  for (const m of matches) {
    if (m.phase !== 'gruppe' || !m.gruppeId) continue
    if (!gruppen.has(m.gruppeId)) gruppen.set(m.gruppeId, new Set())
    if (m.teilnehmerAId) gruppen.get(m.gruppeId)!.add(m.teilnehmerAId)
    if (m.teilnehmerBId) gruppen.get(m.gruppeId)!.add(m.teilnehmerBId)
  }
  return gruppen
}
