/**
 * Jeder gegen Jeden (§9.2): Paarungserzeugung per Berger-Tabellen/Circle-Method,
 * optional Hin- und Rückrunde. Bei ungerader Zahl pausiert pro Runde eine Person.
 */
import { nanoid } from 'nanoid'
import type { Match } from '../../datenmodell'

const BYE = '__bye__'

/** Runden mit Paarungen (Circle-Method): faire Reihenfolge, niemand 2× pro Runde. */
export function bergerRunden(teilnehmerIds: string[]): { a: string; b: string }[][] {
  const ids = [...teilnehmerIds]
  if (ids.length % 2 === 1) ids.push(BYE)
  const m = ids.length
  const runden: { a: string; b: string }[][] = []
  // Circle: letzter Platz fix, Rest rotiert
  const kreis = [...ids]
  for (let r = 0; r < m - 1; r++) {
    const runde: { a: string; b: string }[] = []
    for (let i = 0; i < m / 2; i++) {
      const a = kreis[i]!
      const b = kreis[m - 1 - i]!
      if (a === BYE || b === BYE) continue
      // Seiten abwechseln für etwas Aufschlag-Fairness
      runde.push(r % 2 === 0 ? { a, b } : { a: b, b: a })
    }
    runden.push(runde)
    // rotieren (alle außer letztem Element)
    kreis.splice(1, 0, kreis.pop()!)
  }
  return runden
}

export function erzeugeRoundRobinMatches(
  teilnehmerIds: string[],
  optionen: { hinRueckrunde?: boolean; gruppeId?: string; phase?: 'gruppe' } = {},
): Match[] {
  const runden = bergerRunden(teilnehmerIds)
  const matches: Match[] = []
  const baue = (paare: { a: string; b: string }[], runde: number, tauschen: boolean) => {
    for (const p of paare) {
      matches.push({
        id: nanoid(),
        teilnehmerAId: tauschen ? p.b : p.a,
        teilnehmerBId: tauschen ? p.a : p.b,
        saetze: [],
        status: 'offen',
        runde,
        ...(optionen.gruppeId ? { gruppeId: optionen.gruppeId } : {}),
        ...(optionen.phase ? { phase: optionen.phase } : {}),
      })
    }
  }
  runden.forEach((paare, i) => baue(paare, i + 1, false))
  if (optionen.hinRueckrunde) {
    runden.forEach((paare, i) => baue(paare, runden.length + i + 1, true))
  }
  return matches
}
