/** §15-Pflichttests: Tabellenlogik — jeder Tiebreaker einzeln konstruiert. */
import { describe, expect, it } from 'vitest'
import type { Match, Zaehlweise } from '../../datenmodell'
import { berechneTabelle } from './tabelle'

const zw: Zaehlweise = {
  modus: 'punkte', saetzeZumSieg: 1, punkteProSatz: 11, verlaengerung: false, maxPunkte: 11,
}

let nr = 0
function match(a: string, b: string, pa: number, pb: number): Match {
  return {
    id: `m${++nr}`,
    teilnehmerAId: a,
    teilnehmerBId: b,
    saetze: [{ a: pa, b: pb }],
    siegerId: pa > pb ? a : b,
    status: 'beendet',
  }
}

describe('Tiebreaker einzeln (§9.1: Siege → direkt → Satzdiff → Balldiff → Los)', () => {
  it('1. Siege entscheiden', () => {
    const t = berechneTabelle(
      ['A', 'B', 'C'],
      [match('A', 'B', 11, 3), match('A', 'C', 11, 3), match('B', 'C', 11, 3)],
      zw,
    )
    expect(t.map((z) => z.teilnehmerId)).toEqual(['A', 'B', 'C'])
    expect(t[0]!.siege).toBe(2)
  })

  it('2. direkter Vergleich bei zwei Punktgleichen', () => {
    // A, B, C je 1 Sieg im Kreis? Nein: konstruiere 2 Gleiche:
    // A schlägt B knapp, B hat bessere Differenz — direkter Vergleich zählt zuerst
    const matches = [
      match('A', 'B', 11, 9), // A schlägt B
      match('B', 'C', 11, 0), // B mit Riesen-Differenz
      match('A', 'C', 0, 11), // C schlägt A → A und B je 1 Sieg, C 1 Sieg... alle 1!
    ]
    // Kreis: alle 1 Sieg → direkter Vergleich in der 3er-Gruppe ist auch 1-1-1
    // → nächstes Kriterium (Satzdiff = 0 überall) → Balldifferenz
    const t = berechneTabelle(['A', 'B', 'C'], matches, zw)
    // Balldifferenzen: A: (11-9)+(0-11) = -9; B: (9-11)+(11-0) = +9; C: (0-11)+(11-0)?? C: (11-0)+(0-11)=0...
    // B(+9) vor C(0) vor A(-9)
    expect(t.map((z) => z.teilnehmerId)).toEqual(['B', 'C', 'A'])
  })

  it('2b. direkter Vergleich schlägt bessere Differenz (genau 2 Gleiche)', () => {
    const matches = [
      match('A', 'B', 11, 9), // direktes Duell: A gewinnt
      match('A', 'C', 0, 11),
      match('B', 'C', 11, 0), // B holt riesige Differenz
      match('A', 'D', 11, 0),
      match('B', 'D', 11, 0),
      match('C', 'D', 11, 0),
    ]
    // Siege: A=2, B=2, C=2, D=0 → 3er-Gruppe... will genau 2: nimm D raus aus Gleichheit ok bleibt 3er.
    // Direkter Vergleich A-B-C untereinander: A:1 (vs B), B:1 (vs C), C:1 (vs A) → gleich
    // Satzdiff untereinander? Gesamtsatzdiff: A: +1+−1+1=+1? Sätze: A 2 Siege=+2, 1 Niederlage=−1 → +1; B: +2−1=+1; C: +2−1=+1 → gleich
    // Balldiff: A: (11−9)+(0−11)+(11−0)=+2; B: (9−11)+(11−0)+(11−0)=+20; C: (11−0)+(0−11)+(11−0)=+11
    const t = berechneTabelle(['A', 'B', 'C', 'D'], matches, zw)
    expect(t.map((z) => z.teilnehmerId)).toEqual(['B', 'C', 'A', 'D'])
  })

  it('3. Satzdifferenz, wenn direkter Vergleich gleich', () => {
    const zw3: Zaehlweise = { ...zw, saetzeZumSieg: 2 }
    const matches: Match[] = [
      // A schlägt C 2:0, B schlägt C 2:1 → A bessere Satzdifferenz
      { id: 'x1', teilnehmerAId: 'A', teilnehmerBId: 'C', saetze: [{ a: 11, b: 5 }, { a: 11, b: 6 }], siegerId: 'A', status: 'beendet' },
      { id: 'x2', teilnehmerAId: 'B', teilnehmerBId: 'C', saetze: [{ a: 11, b: 5 }, { a: 4, b: 11 }, { a: 11, b: 7 }], siegerId: 'B', status: 'beendet' },
    ]
    // A und B: je 1 Sieg, kein direktes Duell → Satzdiff: A +2, B +1
    const t = berechneTabelle(['A', 'B', 'C'], matches, zw3)
    expect(t.map((z) => z.teilnehmerId)).toEqual(['A', 'B', 'C'])
  })

  it('4. Ballpunktdifferenz als letztes Zahlenkriterium', () => {
    const matches = [match('A', 'C', 11, 2), match('B', 'D', 11, 9)]
    // A & B je 1 Sieg, kein Duell, Satzdiff je +1 → Balldiff A +9, B +2
    const t = berechneTabelle(['A', 'B', 'C', 'D'], matches, zw)
    expect(t[0]!.teilnehmerId).toBe('A')
    expect(t[1]!.teilnehmerId).toBe('B')
  })

  it('5. Patt → losNoetig-Flag; manuelle Reihung löst auf', () => {
    const matches = [match('A', 'C', 11, 5), match('B', 'D', 11, 5)]
    // A & B komplett identisch → Patt
    const patt = berechneTabelle(['A', 'B', 'C', 'D'], matches, zw)
    const a = patt.find((z) => z.teilnehmerId === 'A')!
    const b = patt.find((z) => z.teilnehmerId === 'B')!
    expect(a.losNoetig && b.losNoetig).toBe(true)

    const manuell = berechneTabelle(['A', 'B', 'C', 'D'], matches, zw, ['B', 'A'])
    expect(manuell[0]!.teilnehmerId).toBe('B')
    expect(manuell[0]!.losNoetig).toBe(false)
  })
})
