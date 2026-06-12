/** §15-Pflichttests: K.o. mit 3, 5, 8, 9, 16, 17 Teilnehmern. */
import { describe, expect, it } from 'vitest'
import type { Match, Teilnehmer, Turnier, Zaehlweise } from '../../datenmodell'
import { erzeugeRng } from './rng'
import { naechsteZweierpotenz, verteileSlots, erzeugeKoMatches, anzahlRunden } from './ko'
import { trageErgebnisEin, korrekturBetroffene } from './index'

const zw: Zaehlweise = {
  modus: 'punkte', saetzeZumSieg: 1, punkteProSatz: 11, verlaengerung: false, maxPunkte: 11,
}

function teilnehmer(n: number, gesetzte = 2): Teilnehmer[] {
  return Array.from({ length: n }, (_, i) => ({
    id: `t${i + 1}`,
    name: `Spieler ${i + 1}`,
    ...(i < gesetzte ? { setzplatz: i + 1 } : {}),
  }))
}

function koTurnier(n: number, gesetzte = 2, seed = 7): Turnier {
  const t: Turnier = {
    id: 'tu1', name: 'Test', datum: '2026-06-12', disziplin: 'einzel', format: 'ko',
    zaehlweise: zw, felderAnzahl: 2, teilnehmer: teilnehmer(n, gesetzte),
    matches: [], config: { spielUmPlatz3: true }, status: 'laufend',
  }
  const slots = verteileSlots(t.teilnehmer, erzeugeRng(seed))
  t.matches = erzeugeKoMatches(slots, { spielUmPlatz3: true })
  return t
}

/** Spielt das Turnier komplett durch — es gewinnt immer die kleinere t-Nummer. */
function durchspielen(t: Turnier): Turnier {
  for (let sicherheit = 0; sicherheit < 100; sicherheit++) {
    const offen = t.matches.find(
      (m) => m.status === 'offen' && m.teilnehmerAId && m.teilnehmerBId,
    )
    if (!offen) break
    const a = Number(offen.teilnehmerAId!.slice(1))
    const b = Number(offen.teilnehmerBId!.slice(1))
    const saetze = a < b ? [{ a: 11, b: 5 }] : [{ a: 5, b: 11 }]
    t = { ...t, matches: trageErgebnisEin(t, offen.id, saetze, { jetzt: `2026-06-12T10:${String(sicherheit).padStart(2, '0')}:00Z` }) }
  }
  return t
}

describe('K.o.: Freilose & Struktur (3, 5, 8, 9, 16, 17 Teilnehmer)', () => {
  for (const n of [3, 5, 8, 9, 16, 17]) {
    it(`${n} Teilnehmer: korrekte Feldgröße, Freilos-Anzahl und -Verteilung`, () => {
      const groesse = naechsteZweierpotenz(n)
      const slots = verteileSlots(teilnehmer(n, Math.min(4, n)), erzeugeRng(42))

      expect(slots).toHaveLength(groesse)
      const byes = slots.filter((s) => s === undefined).length
      expect(byes).toBe(groesse - n)
      // jeder Teilnehmer genau einmal
      const ids = slots.filter((s): s is string => s !== undefined)
      expect(new Set(ids).size).toBe(n)
      // max. ein Freilos pro Erstrunden-Paar
      for (let p = 0; p < groesse / 2; p++) {
        expect(slots[2 * p] === undefined && slots[2 * p + 1] === undefined).toBe(false)
      }
      // Freilose zuerst an Gesetzte: jedes der ersten Freilose grenzt an
      // einen der Topgesetzten (bei 4er-Feld kann der Anker von Seed 3 den
      // Partner-Slot von Seed 1 belegen — dann bekommt Seed 2 das Freilos)
      const byeIndizes = slots.flatMap((s, i) => (s === undefined ? [i] : []))
      const gesetzteIds = ['t1', 't2', 't3', 't4'].slice(0, Math.min(4, n))
      const anGesetzte = byeIndizes.filter((i) => gesetzteIds.includes(slots[i ^ 1] ?? ''))
      expect(anGesetzte.length).toBe(Math.min(byes, gesetzteIds.length))
      if (byes >= 1 && groesse > 4) {
        expect(slots[0 ^ 1]).toBeUndefined()
        if (byes >= 2) expect(slots[(groesse - 1) ^ 1]).toBeUndefined()
      }

      // Bracket: Bye-Matches sind sofort beendet, Sieger weitergereicht
      const matches = erzeugeKoMatches(slots, { spielUmPlatz3: false })
      const runde1 = matches.filter((m) => m.runde === 1 && m.bracketTyp === 'haupt')
      expect(runde1).toHaveLength(groesse / 2)
      expect(runde1.filter((m) => m.status === 'beendet')).toHaveLength(byes)
    })

    it(`${n} Teilnehmer: Setzplätze 1 und 2 treffen sich frühestens im Finale`, () => {
      const t = durchspielen(koTurnier(n, Math.min(4, n)))
      // t1 (Seed 1) gewinnt alles; t2 (Seed 2) darf vor dem Finale nie gegen t1 spielen
      const finalRunde = anzahlRunden(naechsteZweierpotenz(n))
      const duelle = t.matches.filter(
        (m) =>
          m.bracketTyp === 'haupt' &&
          ((m.teilnehmerAId === 't1' && m.teilnehmerBId === 't2') ||
            (m.teilnehmerAId === 't2' && m.teilnehmerBId === 't1')),
      )
      for (const d of duelle) expect(d.runde).toBe(finalRunde)
      if (n >= 4) expect(duelle).toHaveLength(1) // bei gewinnt-immer-Seed landen beide im Finale
    })
  }

  it('Sieger wird korrekt propagiert, Platz 3 bekommt die Halbfinal-Verlierer', () => {
    const t = durchspielen(koTurnier(8, 4))
    const finale = t.matches.find((m) => m.bracketTyp === 'haupt' && m.runde === 3)!
    expect(finale.siegerId).toBe('t1')
    const platz3 = t.matches.find((m) => m.bracketTyp === 'platz3')!
    expect(platz3.status).toBe('beendet')
    // Halbfinal-Verlierer: gegen t1 verlor t3/t4-Seite, gegen t2 die andere
    expect([platz3.teilnehmerAId, platz3.teilnehmerBId].sort()).toEqual(['t3', 't4'])
  })

  it('Korrektur: Folgespiele mit Ergebnis werden erkannt und bei Bestätigung verworfen', () => {
    let t = durchspielen(koTurnier(8, 4))
    const viertelfinale = t.matches.find(
      (m) => m.bracketTyp === 'haupt' && m.runde === 1 && m.teilnehmerAId && m.teilnehmerBId && m.saetze.length > 0,
    )!
    const betroffen = korrekturBetroffene(t, viertelfinale.id)
    expect(betroffen.length).toBeGreaterThan(0)

    // ohne Bestätigung: Fehler
    expect(() =>
      trageErgebnisEin(t, viertelfinale.id, [{ a: 0, b: 11 }]),
    ).toThrow(/Korrektur/)

    // mit Bestätigung: Folgen werden zurückgesetzt, neuer Sieger steht im Folgematch
    const matches = trageErgebnisEin(t, viertelfinale.id, [{ a: 0, b: 11 }], { folgenVerwerfen: true })
    const neu = matches.find((m) => m.id === viertelfinale.id)!
    expect(neu.siegerId).toBe(viertelfinale.teilnehmerBId)
    const folge = matches.find(
      (m) => m.bracketTyp === 'haupt' && m.runde === 2 &&
        m.bracketSlot === Math.floor(viertelfinale.bracketSlot! / 2),
    )!
    expect([folge.teilnehmerAId, folge.teilnehmerBId]).toContain(viertelfinale.teilnehmerBId)
    expect(folge.saetze).toHaveLength(0)
    expect(folge.status).toBe('offen')
  })
})

describe('K.o.: Setzplätze 1/2 strukturell in entgegengesetzten Hälften', () => {
  for (const n of [8, 16]) {
    it(`${n} Teilnehmer`, () => {
      const slots = verteileSlots(teilnehmer(n, 4), erzeugeRng(99))
      const pos1 = slots.indexOf('t1')
      const pos2 = slots.indexOf('t2')
      expect(pos1).toBeLessThan(n / 2)
      expect(pos2).toBeGreaterThanOrEqual(n / 2)
      // 3/4 in den beiden mittleren Vierteln (je eines)
      const pos3 = slots.indexOf('t3')
      const pos4 = slots.indexOf('t4')
      const mittlere = [n / 2 - 1, n / 2]
      expect(mittlere).toContain(pos3)
      expect(mittlere).toContain(pos4)
      expect(pos3).not.toBe(pos4)
    })
  }
})

describe('K.o.: kein Match verwaist', () => {
  it('9 Teilnehmer: alle Folgerunden vorhanden (16er-Feld → 4 Runden + Platz 3)', () => {
    const t = koTurnier(9, 4)
    const haupt = t.matches.filter((m) => m.bracketTyp === 'haupt')
    expect(haupt.filter((m) => m.runde === 1)).toHaveLength(8)
    expect(haupt.filter((m) => m.runde === 2)).toHaveLength(4)
    expect(haupt.filter((m) => m.runde === 3)).toHaveLength(2)
    expect(haupt.filter((m) => m.runde === 4)).toHaveLength(1)
    expect(t.matches.filter((m: Match) => m.bracketTyp === 'platz3')).toHaveLength(1)
  })
})
