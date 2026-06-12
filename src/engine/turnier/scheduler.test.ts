/** Tests: Felder-Scheduler — Wartezeit-Fairness, keine Doppel-Einsätze. */
import { describe, expect, it } from 'vitest'
import type { Match } from '../../datenmodell'
import { naechsteSpiele, spielbereiteMatches, weiseFelderZu } from './scheduler'

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
