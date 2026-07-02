/** §15-Pflichttests: Zählweisen-Validierung. */
import { describe, expect, it } from 'vitest'
import type { Zaehlweise } from '../../datenmodell'
import { ZAEHLWEISE_PRESETS, pruefeSaetze, satzSieger } from './zaehlweise'

const offiziell: Zaehlweise = {
  modus: 'punkte', saetzeZumSieg: 2, punkteProSatz: 21, verlaengerung: true, maxPunkte: 30,
}

describe('Satz-Endstände (offiziell 21, Verlängerung, Kappung 30)', () => {
  it('21:19 ist ein gültiger Endstand', () => {
    expect(satzSieger({ a: 21, b: 19 }, offiziell)).toBe('a')
  })
  it('21:20 ist KEIN Endstand — Verlängerung', () => {
    expect(satzSieger({ a: 21, b: 20 }, offiziell)).toBeUndefined()
  })
  it('Verlängerung endet mit 2 Punkten Abstand (25:23)', () => {
    expect(satzSieger({ a: 25, b: 23 }, offiziell)).toBe('a')
    expect(satzSieger({ a: 24, b: 23 }, offiziell)).toBeUndefined()
  })
  it('30:29 ist gültig (Kappung bei maxPunkte)', () => {
    expect(satzSieger({ a: 30, b: 29 }, offiziell)).toBe('b' === 'b' && 30 > 29 ? 'a' : 'b')
    expect(satzSieger({ a: 29, b: 30 }, offiziell)).toBe('b')
  })
  it('über maxPunkte ist ungültig', () => {
    expect(satzSieger({ a: 31, b: 29 }, offiziell)).toBeUndefined()
  })
  it('Kappungs-Endstand nur mit 1–2 Punkten Abstand (30:28 ja, 30:22 nein)', () => {
    expect(satzSieger({ a: 30, b: 28 }, offiziell)).toBe('a')
    expect(satzSieger({ a: 30, b: 22 }, offiziell)).toBeUndefined()
    expect(satzSieger({ a: 30, b: 0 }, offiziell)).toBeUndefined()
  })
  it('ohne Verlängerung endet der Satz exakt bei punkteProSatz', () => {
    const ohne: Zaehlweise = { ...offiziell, verlaengerung: false, punkteProSatz: 15 }
    expect(satzSieger({ a: 15, b: 14 }, ohne)).toBe('a')
    expect(satzSieger({ a: 16, b: 14 }, ohne)).toBeUndefined()
  })
})

describe('Match-Auswertung', () => {
  it('Best-of-3: 2 Gewinnsätze nötig, danach kein weiterer Satz erlaubt', () => {
    const fertig = pruefeSaetze([{ a: 21, b: 15 }, { a: 21, b: 18 }], offiziell)
    expect(fertig.fertig).toBe(true)
    expect(fertig.siegerSeite).toBe('a')

    const unfertig = pruefeSaetze([{ a: 21, b: 15 }, { a: 17, b: 21 }], offiziell)
    expect(unfertig.gueltig).toBe(true)
    expect(unfertig.fertig).toBe(false)

    const zuViel = pruefeSaetze(
      [{ a: 21, b: 15 }, { a: 21, b: 18 }, { a: 21, b: 5 }],
      offiziell,
    )
    expect(zuViel.gueltig).toBe(false)
  })

  it('1-Satz-Modus: Match ist nach EINEM Satz beendet', () => {
    const schule: Zaehlweise = { ...offiziell, saetzeZumSieg: 1, punkteProSatz: 15, maxPunkte: 21 }
    const e = pruefeSaetze([{ a: 15, b: 11 }], schule)
    expect(e.fertig).toBe(true)
    expect(e.siegerSeite).toBe('a')
    expect(pruefeSaetze([{ a: 15, b: 11 }, { a: 15, b: 2 }], schule).gueltig).toBe(false)
  })

  it('Zeitspiel: Stand bei Zeitende zählt, Gleichstand ist kein Endstand', () => {
    const zeit: Zaehlweise = {
      modus: 'zeit', saetzeZumSieg: 1, punkteProSatz: 0, verlaengerung: false, maxPunkte: 999, zeitspielMin: 10,
    }
    expect(pruefeSaetze([{ a: 17, b: 12 }], zeit).siegerSeite).toBe('a')
    expect(pruefeSaetze([{ a: 14, b: 14 }], zeit).gueltig).toBe(false)
  })

  it('negative oder nicht-ganzzahlige Punkte sind ungültig', () => {
    expect(pruefeSaetze([{ a: -1, b: 21 }], offiziell).gueltig).toBe(false)
    expect(pruefeSaetze([{ a: 20.5, b: 22.5 }], offiziell).gueltig).toBe(false)
  })
})

describe('Neue BWF-Zählweise 3×15 (ab 2027): 2 Gewinnsätze bis 15, Verlängerung ab 14:14, Kappung 21', () => {
  const z = ZAEHLWEISE_PRESETS.find((pr) => pr.name.includes('3×15'))!.zaehlweise

  it('Preset existiert mit korrekten Werten', () => {
    expect(z).toEqual({ modus: 'punkte', saetzeZumSieg: 2, punkteProSatz: 15, verlaengerung: true, maxPunkte: 21 })
  })

  it('15:13 beendet den Satz, 15:14 nicht (Verlängerung ab 14:14)', () => {
    expect(satzSieger({ a: 15, b: 13 }, z)).toBe('a')
    expect(satzSieger({ a: 15, b: 14 }, z)).toBeUndefined()
    expect(satzSieger({ a: 16, b: 14 }, z)).toBe('a')
  })

  it('Kappung: 20:20 läuft weiter, 21:20 gewinnt (ein Punkt reicht bei 21)', () => {
    expect(satzSieger({ a: 20, b: 20 }, z)).toBeUndefined()
    expect(satzSieger({ a: 21, b: 20 }, z)).toBe('a')
    expect(satzSieger({ a: 20, b: 19 }, z)).toBeUndefined()
  })

  it('Match: zwei Gewinnsätze entscheiden', () => {
    expect(pruefeSaetze([{ a: 15, b: 9 }, { a: 16, b: 14 }], z)).toMatchObject({ fertig: true, siegerSeite: 'a' })
    expect(pruefeSaetze([{ a: 15, b: 9 }, { a: 12, b: 15 }], z)).toMatchObject({ fertig: false })
  })
})
