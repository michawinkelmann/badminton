/**
 * Schweizer System (§9.2): Rundenzahl Standard ceil(log2(n)); Paarung je Runde
 * nach Punktgruppen, innerhalb nach Buchholz, KEINE Wiederholungsbegegnung
 * (Backtracking, notfalls benachbarte Punktgruppe); Freilos (= Sieg) an den
 * niedrigstplatzierten Teilnehmer ohne bisheriges Freilos.
 * Endwertung: Punkte → Buchholz → Satzdifferenz → Ballpunktdifferenz.
 */
import { nanoid } from 'nanoid'
import type { Match, Teilnehmer, Zaehlweise } from '../../datenmodell'
import { mische, type Rng } from './rng'
import { ballpunkte, pruefeSaetze } from './zaehlweise'

export function standardRunden(teilnehmerzahl: number): number {
  return Math.max(1, Math.ceil(Math.log2(Math.max(2, teilnehmerzahl))))
}

/** Punkte: Sieg = 1 (auch Freilos). */
export function schweizerPunkte(teilnehmerIds: string[], matches: Match[]): Map<string, number> {
  const punkte = new Map(teilnehmerIds.map((id) => [id, 0]))
  for (const m of matches) {
    if (m.status === 'beendet' && m.siegerId && punkte.has(m.siegerId)) {
      punkte.set(m.siegerId, punkte.get(m.siegerId)! + 1)
    }
  }
  return punkte
}

/** Buchholz: Summe der Punkte aller bisherigen Gegner (Freilos zählt keinen Gegner). */
export function buchholz(teilnehmerIds: string[], matches: Match[]): Map<string, number> {
  const punkte = schweizerPunkte(teilnehmerIds, matches)
  const bh = new Map(teilnehmerIds.map((id) => [id, 0]))
  for (const m of matches) {
    if (m.status !== 'beendet' || !m.teilnehmerAId || !m.teilnehmerBId) continue
    bh.set(m.teilnehmerAId, (bh.get(m.teilnehmerAId) ?? 0) + (punkte.get(m.teilnehmerBId) ?? 0))
    bh.set(m.teilnehmerBId, (bh.get(m.teilnehmerBId) ?? 0) + (punkte.get(m.teilnehmerAId) ?? 0))
  }
  return bh
}

function bisherigePaarungen(matches: Match[]): Set<string> {
  const set = new Set<string>()
  for (const m of matches) {
    if (m.teilnehmerAId && m.teilnehmerBId) {
      set.add([m.teilnehmerAId, m.teilnehmerBId].sort().join('|'))
    }
  }
  return set
}

function hatteFreilos(id: string, matches: Match[]): boolean {
  return matches.some(
    (m) => m.status === 'beendet' && m.siegerId === id && (!m.teilnehmerAId || !m.teilnehmerBId),
  )
}

/** Greedy-Paarung mit Backtracking — vermeidet Wiederholungen vollständig. */
function paareOhneWiederholung(
  reihung: string[],
  gespielt: Set<string>,
): { a: string; b: string }[] | undefined {
  if (reihung.length === 0) return []
  const [erster, ...rest] = reihung
  for (let i = 0; i < rest.length; i++) {
    const partner = rest[i]!
    if (gespielt.has([erster!, partner].sort().join('|'))) continue
    const verbleibend = rest.filter((_, j) => j !== i)
    const unten = paareOhneWiederholung(verbleibend, gespielt)
    if (unten) return [{ a: erster!, b: partner }, ...unten]
  }
  return undefined
}

/**
 * Nächste Schweizer Runde auslosen. Runde 1: Reihung nach Setzplatz, Rest gelost.
 * Ab Runde 2: Punkte ↓, Buchholz ↓. Gibt die neuen Matches zurück.
 */
export function naechsteSchweizerRunde(
  teilnehmer: Teilnehmer[],
  matches: Match[],
  runde: number,
  rng: Rng,
): Match[] {
  const ids = teilnehmer.map((t) => t.id)
  let reihung: string[]
  if (runde === 1) {
    const gesetzte = teilnehmer
      .filter((t) => t.setzplatz !== undefined)
      .sort((a, b) => a.setzplatz! - b.setzplatz!)
      .map((t) => t.id)
    const rest = mische(teilnehmer.filter((t) => t.setzplatz === undefined).map((t) => t.id), rng)
    reihung = [...gesetzte, ...rest]
  } else {
    const punkte = schweizerPunkte(ids, matches)
    const bh = buchholz(ids, matches)
    reihung = [...ids].sort(
      (a, b) =>
        punkte.get(b)! - punkte.get(a)! ||
        bh.get(b)! - bh.get(a)! ||
        a.localeCompare(b),
    )
  }

  const neue: Match[] = []

  // Freilos bei ungerader Zahl: niedrigstplatzierte:r ohne bisheriges Freilos
  if (reihung.length % 2 === 1) {
    const kandidat =
      [...reihung].reverse().find((id) => !hatteFreilos(id, matches)) ??
      reihung[reihung.length - 1]!
    reihung = reihung.filter((id) => id !== kandidat)
    neue.push({
      id: nanoid(),
      teilnehmerAId: kandidat,
      saetze: [],
      status: 'beendet',
      siegerId: kandidat,
      runde,
    })
  }

  const paare = paareOhneWiederholung(reihung, bisherigePaarungen(matches))
  // Fallback (theoretisch, wenn keine wiederholungsfreie Paarung existiert):
  const endgueltig =
    paare ??
    Array.from({ length: reihung.length / 2 }, (_, i) => ({
      a: reihung[2 * i]!,
      b: reihung[2 * i + 1]!,
    }))

  for (const p of endgueltig) {
    neue.push({
      id: nanoid(),
      teilnehmerAId: p.a,
      teilnehmerBId: p.b,
      saetze: [],
      status: 'offen',
      runde,
    })
  }
  return neue
}

export interface SchweizerZeile {
  teilnehmerId: string
  punkte: number
  buchholz: number
  satzDifferenz: number
  ballDifferenz: number
  platz: number
}

/** Endwertung: Punkte → Buchholz → Satzdifferenz → Ballpunktdifferenz. */
export function schweizerTabelle(
  teilnehmerIds: string[],
  matches: Match[],
  zw: Zaehlweise,
): SchweizerZeile[] {
  const punkte = schweizerPunkte(teilnehmerIds, matches)
  const bh = buchholz(teilnehmerIds, matches)
  const satz = new Map(teilnehmerIds.map((id) => [id, 0]))
  const ball = new Map(teilnehmerIds.map((id) => [id, 0]))
  for (const m of matches) {
    if (m.status !== 'beendet' || !m.teilnehmerAId || !m.teilnehmerBId) continue
    const ausw = pruefeSaetze(m.saetze, zw)
    const b = ballpunkte(m.saetze)
    satz.set(m.teilnehmerAId, satz.get(m.teilnehmerAId)! + ausw.saetzeA - ausw.saetzeB)
    satz.set(m.teilnehmerBId, satz.get(m.teilnehmerBId)! + ausw.saetzeB - ausw.saetzeA)
    ball.set(m.teilnehmerAId, ball.get(m.teilnehmerAId)! + b.a - b.b)
    ball.set(m.teilnehmerBId, ball.get(m.teilnehmerBId)! + b.b - b.a)
  }
  const zeilen = teilnehmerIds.map((id) => ({
    teilnehmerId: id,
    punkte: punkte.get(id)!,
    buchholz: bh.get(id)!,
    satzDifferenz: satz.get(id)!,
    ballDifferenz: ball.get(id)!,
    platz: 0,
  }))
  zeilen.sort(
    (x, y) =>
      y.punkte - x.punkte ||
      y.buchholz - x.buchholz ||
      y.satzDifferenz - x.satzDifferenz ||
      y.ballDifferenz - x.ballDifferenz,
  )
  zeilen.forEach((z, i) => (z.platz = i + 1))
  return zeilen
}
