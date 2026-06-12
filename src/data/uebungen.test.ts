/**
 * Phase-2-Abnahme, Teil 1: Qualitäts- und Vollständigkeits-Checks der Bibliothek.
 */
import { describe, expect, it } from 'vitest'
import type { Kategorie } from '../datenmodell'
import { uebungsBibliothek } from './uebungen'

const SOLL_VERTEILUNG: Record<Kategorie, number> = {
  aufwaermen: 10,
  schlagtechnik: 20,
  footwork: 12,
  taktik_einzel: 8,
  taktik_doppel: 8,
  kondition: 10,
  spielformen: 7,
}

describe('Übungsbibliothek: Umfang & Verteilung (§4)', () => {
  it('enthält genau 75 Übungen', () => {
    expect(uebungsBibliothek).toHaveLength(75)
  })

  it('hält die Richtverteilung je Kategorie ein', () => {
    for (const [kategorie, soll] of Object.entries(SOLL_VERTEILUNG)) {
      const anzahl = uebungsBibliothek.filter((u) => u.kategorie === kategorie).length
      expect(anzahl, `Kategorie ${kategorie}`).toBe(soll)
    }
  })

  it('hat eindeutige IDs', () => {
    const ids = uebungsBibliothek.map((u) => u.id)
    expect(new Set(ids).size).toBe(ids.length)
  })
})

describe('Übungsbibliothek: Vollständigkeit jeder Übung (§4 Qualitätsanforderung)', () => {
  for (const u of uebungsBibliothek) {
    it(`${u.id} „${u.name}" ist vollständig ausgefüllt`, () => {
      expect(u.name.length).toBeGreaterThan(3)
      expect(u.kurzbeschreibung.length).toBeGreaterThan(20)
      expect(u.skills.length).toBeGreaterThanOrEqual(1)
      expect(u.niveau.length).toBeGreaterThanOrEqual(1)
      expect(u.dauerMin).toBeGreaterThanOrEqual(5)
      expect(u.dauerMin).toBeLessThanOrEqual(25)
      // Konkrete Durchführung mit mehreren Schritten
      expect(u.durchfuehrung.length).toBeGreaterThanOrEqual(2)
      for (const schritt of u.durchfuehrung) expect(schritt.length).toBeGreaterThan(10)
      // Fehlerbild → Korrektur und Variationen sind Pflichtinhalte
      expect(u.fehlerbilder?.length ?? 0).toBeGreaterThanOrEqual(1)
      for (const f of u.fehlerbilder ?? []) expect(f).toContain('→')
      expect(u.variationen?.length ?? 0).toBeGreaterThanOrEqual(1)
    })
  }
})

describe('Übungsbibliothek: Schul-Tauglichkeit (§4)', () => {
  it('bietet mindestens 10 Gruppen-Übungen für Anfänger (AG/Schulsport)', () => {
    const schultauglich = uebungsBibliothek.filter(
      (u) => u.personen === 'gruppe' && u.niveau.includes('anfaenger'),
    )
    expect(schultauglich.length).toBeGreaterThanOrEqual(10)
  })

  it('Spielformen enthalten anfängertaugliche Gruppenformen', () => {
    const spielformen = uebungsBibliothek.filter(
      (u) =>
        u.kategorie === 'spielformen' &&
        u.personen === 'gruppe' &&
        u.niveau.includes('anfaenger'),
    )
    expect(spielformen.length).toBeGreaterThanOrEqual(3)
  })
})
