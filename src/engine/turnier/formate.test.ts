/** §15-Pflichttests: Round Robin (4/5/7), Schweizer (8/9 + Buchholz), Gruppen+K.o. */
import { describe, expect, it } from 'vitest'
import type { Match, Teilnehmer, Turnier, Zaehlweise } from '../../datenmodell'
import { erzeugeRng } from './rng'
import { bergerRunden, erzeugeRoundRobinMatches } from './roundRobin'
import { buchholz, schweizerTabelle, standardRunden } from './schweizer'
import { kreuzSlots, verteileGruppen, koPhaseMoeglich } from './gruppenKo'
import { erzeugeSpielplan, koPhaseStarten, schweizerRundeAuslosen, trageErgebnisEin, istRundeKomplett, aktuelleSchweizerRunde } from './index'

const zw: Zaehlweise = {
  modus: 'punkte', saetzeZumSieg: 1, punkteProSatz: 11, verlaengerung: false, maxPunkte: 11,
}

function teilnehmer(n: number, gesetzte = 0): Teilnehmer[] {
  return Array.from({ length: n }, (_, i) => ({
    id: `t${i + 1}`,
    name: `Spieler ${i + 1}`,
    ...(i < gesetzte ? { setzplatz: i + 1 } : {}),
  }))
}

/* ---------- Round Robin ---------- */
describe('Round Robin (Berger): 4, 5, 7 Teilnehmer', () => {
  for (const n of [4, 5, 7]) {
    it(`${n} Teilnehmer: jeder gegen jeden genau einmal, niemand 2× pro Runde`, () => {
      const ids = teilnehmer(n).map((t) => t.id)
      const matches = erzeugeRoundRobinMatches(ids)
      expect(matches).toHaveLength((n * (n - 1)) / 2)

      const paare = new Set(
        matches.map((m) => [m.teilnehmerAId, m.teilnehmerBId].sort().join('|')),
      )
      expect(paare.size).toBe((n * (n - 1)) / 2)

      const runden = new Map<number, string[]>()
      for (const m of matches) {
        const liste = runden.get(m.runde!) ?? []
        liste.push(m.teilnehmerAId!, m.teilnehmerBId!)
        runden.set(m.runde!, liste)
      }
      for (const [, leute] of runden) {
        expect(new Set(leute).size).toBe(leute.length)
      }
    })
  }

  it('Hin- und Rückrunde: jede Paarung genau zweimal, Seiten getauscht', () => {
    const ids = teilnehmer(4).map((t) => t.id)
    const matches = erzeugeRoundRobinMatches(ids, { hinRueckrunde: true })
    expect(matches).toHaveLength(12)
    const gerichtete = new Set(matches.map((m) => `${m.teilnehmerAId}>${m.teilnehmerBId}`))
    expect(gerichtete.size).toBe(12) // Rückspiel mit getauschten Seiten
  })

  it('Berger-Runden: 5 Teilnehmer → 5 Runden, je Runde pausiert genau eine Person', () => {
    const runden = bergerRunden(teilnehmer(5).map((t) => t.id))
    expect(runden).toHaveLength(5)
    for (const r of runden) expect(r).toHaveLength(2) // 4 spielen, 1 pausiert
  })
})

/* ---------- Schweizer System ---------- */
function schweizerTurnier(n: number, runden?: number): Turnier {
  return {
    id: 's1', name: 'Schweiz', datum: '2026-06-12', disziplin: 'einzel', format: 'schweizer',
    zaehlweise: zw, felderAnzahl: 3, teilnehmer: teilnehmer(n),
    matches: [], config: { ...(runden ? { schweizerRunden: runden } : {}) }, status: 'laufend',
  }
}

/** Runde komplett spielen: kleinere Nummer gewinnt (deterministisch). */
function spieleRunde(t: Turnier, runde: number, zeit: number): Turnier {
  for (const m of t.matches.filter((m) => m.runde === runde && m.status === 'offen')) {
    const a = Number(m.teilnehmerAId!.slice(1))
    const b = Number(m.teilnehmerBId!.slice(1))
    t = {
      ...t,
      matches: trageErgebnisEin(t, m.id, a < b ? [{ a: 11, b: 7 }] : [{ a: 7, b: 11 }], {
        jetzt: `2026-06-12T1${zeit}:00:00Z`,
      }),
    }
  }
  return t
}

describe('Schweizer System: 8 und 9 Teilnehmer', () => {
  for (const n of [8, 9]) {
    it(`${n} Teilnehmer: keine Wiederholungsbegegnung, Freilose korrekt vergeben`, () => {
      let t = schweizerTurnier(n)
      const rundenzahl = standardRunden(n) // 3 bzw. 4
      t = { ...t, matches: erzeugeSpielplan(t, erzeugeRng(5)) }

      for (let r = 1; r <= rundenzahl; r++) {
        t = spieleRunde(t, r, r)
        expect(istRundeKomplett(t.matches, r)).toBe(true)
        if (r < rundenzahl) t = { ...t, matches: schweizerRundeAuslosen(t, erzeugeRng(100 + r)) }
      }
      expect(aktuelleSchweizerRunde(t.matches)).toBe(rundenzahl)

      // keine Wiederholungsbegegnung
      const paare = t.matches
        .filter((m) => m.teilnehmerAId && m.teilnehmerBId)
        .map((m) => [m.teilnehmerAId, m.teilnehmerBId].sort().join('|'))
      expect(new Set(paare).size).toBe(paare.length)

      // Freilose: bei ungerader Zahl genau 1 pro Runde, nie zweimal dieselbe Person
      const freilose = t.matches.filter((m) => !m.teilnehmerBId)
      if (n % 2 === 1) {
        expect(freilose).toHaveLength(rundenzahl)
        const empfaenger = freilose.map((m) => m.teilnehmerAId)
        expect(new Set(empfaenger).size).toBe(empfaenger.length)
        for (const f of freilose) {
          expect(f.status).toBe('beendet')
          expect(f.siegerId).toBe(f.teilnehmerAId) // Freilos = Sieg
        }
      } else {
        expect(freilose).toHaveLength(0)
      }

      // jede:r spielt pro Runde höchstens einmal
      for (let r = 1; r <= rundenzahl; r++) {
        const leute = t.matches
          .filter((m) => m.runde === r)
          .flatMap((m) => [m.teilnehmerAId, m.teilnehmerBId])
          .filter(Boolean)
        expect(new Set(leute).size).toBe(leute.length)
      }
    })
  }

  it('Buchholz gegen handgerechnetes Beispiel (4 Spieler, 2 Runden)', () => {
    // R1: A schlägt B, C schlägt D · R2: A schlägt C, D schlägt B
    const matches: Match[] = [
      { id: '1', teilnehmerAId: 'A', teilnehmerBId: 'B', saetze: [{ a: 11, b: 5 }], siegerId: 'A', status: 'beendet', runde: 1 },
      { id: '2', teilnehmerAId: 'C', teilnehmerBId: 'D', saetze: [{ a: 11, b: 7 }], siegerId: 'C', status: 'beendet', runde: 1 },
      { id: '3', teilnehmerAId: 'A', teilnehmerBId: 'C', saetze: [{ a: 11, b: 9 }], siegerId: 'A', status: 'beendet', runde: 2 },
      { id: '4', teilnehmerAId: 'D', teilnehmerBId: 'B', saetze: [{ a: 11, b: 8 }], siegerId: 'D', status: 'beendet', runde: 2 },
    ]
    // Punkte: A=2, C=1, D=1, B=0
    // Buchholz (Summe Gegnerpunkte): A = B(0)+C(1) = 1 · B = A(2)+D(1) = 3
    // C = D(1)+A(2) = 3 · D = C(1)+B(0) = 1
    const bh = buchholz(['A', 'B', 'C', 'D'], matches)
    expect(bh.get('A')).toBe(1)
    expect(bh.get('B')).toBe(3)
    expect(bh.get('C')).toBe(3)
    expect(bh.get('D')).toBe(1)

    // Endwertung: Punkte → Buchholz: A(2) vor C(1,BH3) vor D(1,BH1) vor B(0)
    const tabelle = schweizerTabelle(['A', 'B', 'C', 'D'], matches, zw)
    expect(tabelle.map((z) => z.teilnehmerId)).toEqual(['A', 'C', 'D', 'B'])
  })
})

/* ---------- Gruppen + K.o. ---------- */
describe('Gruppen + K.o.', () => {
  it('Snake-Seeding: Seeds 1–8 auf 2 Gruppen → A:1,4,5,8 / B:2,3,6,7', () => {
    const gruppen = verteileGruppen(teilnehmer(8, 8), 2, erzeugeRng(1))
    expect(gruppen[0]).toEqual(['t1', 't4', 't5', 't8'])
    expect(gruppen[1]).toEqual(['t2', 't3', 't6', 't7'])
  })

  it('Snake-Seeding: 4 Gruppen schlängeln korrekt (1..8 → A:1,8 B:2,7 C:3,6 D:4,5)', () => {
    const gruppen = verteileGruppen(teilnehmer(8, 8), 4, erzeugeRng(1))
    expect(gruppen).toEqual([
      ['t1', 't8'],
      ['t2', 't7'],
      ['t3', 't6'],
      ['t4', 't5'],
    ])
  })

  it('Kreuzpaarungen: A1–B2 und B1–A2 — Gruppengegner frühestens im Finale (2 Gruppen)', () => {
    const slots = kreuzSlots(2, [['A1', 'A2'], ['B1', 'B2']])
    expect(slots).toEqual(['A1', 'B2', 'B1', 'A2'])
    // Halbfinale: (A1,B2) und (B1,A2) — keine Gruppen-Wiederholung
  })

  it('Kreuzpaarungen bei 4 Gruppen: Erst-/Zweitplatzierte in getrennten Hälften', () => {
    const slots = kreuzSlots(2, [['A1', 'A2'], ['B1', 'B2'], ['C1', 'C2'], ['D1', 'D2']])
    expect(slots).toEqual(['A1', 'B2', 'C1', 'D2', 'B1', 'A2', 'D1', 'C2'])
    const oben = slots.slice(0, 4)
    for (const g of ['A', 'B', 'C', 'D']) {
      const erste = oben.includes(`${g}1`) ? 'oben' : 'unten'
      const zweite = oben.includes(`${g}2`) ? 'oben' : 'unten'
      expect(erste).not.toBe(zweite)
    }
  })

  it('Komplettdurchlauf 9 Personen, 2 Gruppen: Gruppenphase → K.o. mit Kreuzpaarung', () => {
    let t: Turnier = {
      id: 'g1', name: 'GK', datum: '2026-06-12', disziplin: 'einzel', format: 'gruppen_ko',
      zaehlweise: zw, felderAnzahl: 2, teilnehmer: teilnehmer(9, 4),
      matches: [], config: { gruppenAnzahl: 2, aufsteigerProGruppe: 2, spielUmPlatz3: true },
      status: 'laufend',
    }
    expect(koPhaseMoeglich(2, 2)).toBe(true)
    t = { ...t, matches: erzeugeSpielplan(t, erzeugeRng(3)) }

    // Gruppenphase: 4er- und 5er-Gruppe → 6 + 10 = 16 Spiele
    expect(t.matches.filter((m) => m.phase === 'gruppe')).toHaveLength(16)
    expect(() => koPhaseStarten(t)).toThrow(/Gruppenphase/)

    // alles spielen: kleinere Nummer gewinnt
    let minute = 0
    for (const m of [...t.matches]) {
      const a = Number(m.teilnehmerAId!.slice(1))
      const b = Number(m.teilnehmerBId!.slice(1))
      t = {
        ...t,
        matches: trageErgebnisEin(t, m.id, a < b ? [{ a: 11, b: 6 }] : [{ a: 6, b: 11 }], {
          jetzt: `2026-06-12T10:${String(minute++).padStart(2, '0')}:00Z`,
        }),
      }
    }
    t = { ...t, matches: koPhaseStarten(t) }
    const ko = t.matches.filter((m) => m.phase === 'ko' && m.bracketTyp === 'haupt')
    expect(ko.filter((m) => m.runde === 1)).toHaveLength(2) // Halbfinals
    // Kreuzpaarung: kein Halbfinale mit zwei Leuten aus derselben Gruppe
    const gruppeVon = new Map<string, string>()
    for (const m of t.matches.filter((m) => m.phase === 'gruppe')) {
      gruppeVon.set(m.teilnehmerAId!, m.gruppeId!)
      gruppeVon.set(m.teilnehmerBId!, m.gruppeId!)
    }
    for (const hf of ko.filter((m) => m.runde === 1)) {
      expect(gruppeVon.get(hf.teilnehmerAId!)).not.toBe(gruppeVon.get(hf.teilnehmerBId!))
    }
  })
})
