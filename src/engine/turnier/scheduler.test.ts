/** Tests: Felder-Scheduler — Wartezeit-Fairness, keine Doppel-Einsätze. */
import { describe, expect, it } from 'vitest'
import type { Match } from '../../datenmodell'
import { geschaetztesEnde, naechsteSpiele, spielbereiteMatches, wartezeitMin, weiseFelderZu } from './scheduler'

let nr = 0
function offen(a: string, b: string, extras: Partial<Match> = {}): Match {
  return { id: `m${++nr}`, teilnehmerAId: a, teilnehmerBId: b, saetze: [], status: 'offen', ...extras }
}
function beendet(a: string, b: string, um: string): Match {
  return {
    id: `m${++nr}`, teilnehmerAId: a, teilnehmerBId: b,
    saetze: [{ a: 11, b: 5 }], siegerId: a, status: 'beendet', beendetUm: um,
  }
}

describe('Scheduler (§9.1)', () => {
  it('keine Person in zwei laufenden Spielen', () => {
    const matches = [
      offen('A', 'B', { feld: 1 }), // läuft auf Feld 1
      offen('A', 'C'), // A ist beschäftigt
      offen('D', 'E'),
    ]
    const bereit = spielbereiteMatches(matches)
    expect(bereit.map((m) => `${m.teilnehmerAId}-${m.teilnehmerBId}`)).toEqual(['D-E'])
  })

  it('längste Pause zuerst: wer zuletzt spielte, wartet', () => {
    const matches = [
      beendet('A', 'B', '2026-06-12T10:00:00Z'),
      beendet('C', 'D', '2026-06-12T11:00:00Z'),
      offen('A', 'E'), // A pausiert seit 10:00
      offen('C', 'F'), // C erst seit 11:00
    ]
    const reihenfolge = naechsteSpiele(matches)
    expect(reihenfolge[0]!.teilnehmerAId).toBe('A')
  })

  it('Neulinge (noch kein Spiel) kommen vor allen Pausierenden', () => {
    const matches = [
      beendet('A', 'B', '2026-06-12T09:00:00Z'),
      offen('A', 'C'),
      offen('X', 'Y'), // beide noch nie gespielt
    ]
    expect(naechsteSpiele(matches)[0]!.teilnehmerAId).toBe('X')
  })

  it('weiseFelderZu: füllt freie Felder ohne Personen-Konflikte', () => {
    const matches = [
      offen('A', 'B'),
      offen('A', 'C'), // Konflikt mit erstem
      offen('D', 'E'),
      offen('F', 'G'),
    ]
    const zuweisungen = weiseFelderZu(matches, 3)
    expect(zuweisungen).toHaveLength(3)
    expect(new Set(zuweisungen.map((z) => z.feld)).size).toBe(3)
    // A darf nur einmal eingeplant sein
    const geplant = zuweisungen.map((z) => matches.find((m) => m.id === z.matchId)!)
    const leute = geplant.flatMap((m) => [m.teilnehmerAId, m.teilnehmerBId])
    expect(new Set(leute).size).toBe(leute.length)
  })

  it('belegte Felder werden nicht doppelt vergeben', () => {
    const matches = [offen('A', 'B', { feld: 2, status: 'laufend' }), offen('C', 'D'), offen('E', 'F')]
    const zuweisungen = weiseFelderZu(matches, 2)
    expect(zuweisungen).toHaveLength(1)
    expect(zuweisungen[0]!.feld).toBe(1)
  })

  it('TBD-Matches (Teilnehmer offen) werden nie eingeplant', () => {
    const matches: Match[] = [
      { id: 'tbd', saetze: [], status: 'offen', runde: 2, bracketSlot: 0, bracketTyp: 'haupt' },
      offen('A', 'B'),
    ]
    expect(weiseFelderZu(matches, 2)).toHaveLength(1)
  })
})

describe('Zeitschätzung (geschätztes Ende)', () => {
  const T0 = Date.parse('2026-06-12T10:00:00Z')
  const iso = (ms: number) => new Date(ms).toISOString()
  const fertig = (id: string, um: number): Match => ({
    id, teilnehmerAId: `${id}-a`, teilnehmerBId: `${id}-b`,
    saetze: [{ a: 15, b: 9 }], siegerId: `${id}-a`, status: 'beendet', beendetUm: iso(um),
  })
  const wartet = (id: string): Match => ({
    id, teilnehmerAId: `${id}-a`, teilnehmerBId: `${id}-b`, saetze: [], status: 'offen',
  })

  it('undefined bei weniger als zwei beendeten Spielen', () => {
    expect(geschaetztesEnde([fertig('1', T0), wartet('2')], T0)).toBeUndefined()
  })

  it('rechnet mit dem mittleren Abstand der letzten Spiele', () => {
    const matches = [fertig('1', T0), fertig('2', T0 + 10 * 60_000), fertig('3', T0 + 20 * 60_000), wartet('4'), wartet('5')]
    // Ø 10 Min Abstand, 2 offene Spiele → Ende = letztes Ende + 20 Min
    expect(geschaetztesEnde(matches, T0 + 20 * 60_000)).toBe(T0 + 40 * 60_000)
  })

  it('nutzt jetzt als Basis, wenn länger nichts endete', () => {
    const matches = [fertig('1', T0), fertig('2', T0 + 5 * 60_000), wartet('3')]
    const jetzt = T0 + 90 * 60_000
    expect(geschaetztesEnde(matches, jetzt)).toBe(jetzt + 5 * 60_000)
  })
})

describe('Wartezeit einer Paarung', () => {
  const T0 = Date.parse('2026-06-12T14:00:00Z')
  const iso = (ms: number) => new Date(ms).toISOString()

  it('zählt ab dem späteren letzten Spiel beider Beteiligter', () => {
    const matches: Match[] = [
      { id: 'f1', teilnehmerAId: 'A', teilnehmerBId: 'X', saetze: [{ a: 15, b: 3 }], status: 'beendet', siegerId: 'A', beendetUm: iso(T0) },
      { id: 'f2', teilnehmerAId: 'B', teilnehmerBId: 'Y', saetze: [{ a: 15, b: 7 }], status: 'beendet', siegerId: 'B', beendetUm: iso(T0 + 10 * 60_000) },
      { id: 'n', teilnehmerAId: 'A', teilnehmerBId: 'B', saetze: [], status: 'offen' },
    ]
    expect(wartezeitMin(matches[2]!, matches, T0 + 25 * 60_000)).toBe(15)
  })

  it('undefined, wenn beide noch nie gespielt haben', () => {
    const n: Match = { id: 'n', teilnehmerAId: 'A', teilnehmerBId: 'B', saetze: [], status: 'offen' }
    expect(wartezeitMin(n, [n], T0)).toBeUndefined()
  })
})
