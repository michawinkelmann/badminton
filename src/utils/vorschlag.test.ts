/**
 * Phase-3-Abnahme (Engine-Teil): Auto-generierte Einheiten sind plausibel aufgebaut.
 */
import { describe, expect, it } from 'vitest'
import { uebungsBibliothek, findeUebung } from '../data/uebungen'
import type { VorschlagsKriterien } from './vorschlag'
import {
  bewerte,
  einheitGesamtdauer,
  erstelleEinheitAutomatisch,
  istGeeignet,
  schlageUebungenVor,
} from './vorschlag'

const basis: VorschlagsKriterien = {
  zielSkills: ['clear', 'beinarbeit'],
  niveau: 'fortgeschritten',
  zeitMin: 90,
  personen: 2,
}

describe('Bewertung (Skill-Match > Niveau-Match > Material)', () => {
  it('mehr Skill-Treffer schlagen Niveau- und Material-Punkte', () => {
    const liste = schlageUebungenVor(uebungsBibliothek, basis)
    for (let i = 1; i < liste.length; i++) {
      expect(liste[i - 1]!.punkte).toBeGreaterThanOrEqual(liste[i]!.punkte)
    }
    // Spitzenreiter muss auf mindestens einen Ziel-Skill einzahlen
    expect(liste[0]!.skillTreffer.length).toBeGreaterThan(0)
  })

  it('Niveau-Match gibt 10 Punkte, Material-Erfüllung 1 Punkt', () => {
    const u = uebungsBibliothek.find((x) => x.id === 'st-01')! // Clear, paar, ohne Material
    const mitNiveau = bewerte(u, basis)
    expect(mitNiveau.punkte).toBe(100 + 10 + 1) // 1 Skill-Treffer (clear), Niveau passt, Material leer
    const ohneNiveau = bewerte(u, { ...basis, niveau: 'leistung' })
    expect(ohneNiveau.punkte).toBe(100 + 0 + 1)
  })

  it('Personenzahl filtert hart: allein-Übungen gehen immer, Gruppe braucht 3+', () => {
    const gruppe = uebungsBibliothek.find((u) => u.personen === 'gruppe')!
    expect(istGeeignet(gruppe, { ...basis, personen: 2 })).toBe(false)
    expect(istGeeignet(gruppe, { ...basis, personen: 6 })).toBe(true)
  })

  it('Material filtert hart, wenn eine Liste gegeben ist', () => {
    const mitKorb = uebungsBibliothek.find((u) => u.material.includes('Shuttle-Korb'))!
    expect(istGeeignet(mitKorb, { ...basis, material: [] })).toBe(false)
    expect(istGeeignet(mitKorb, { ...basis, material: ['Shuttle-Korb'] })).toBe(true)
    expect(istGeeignet(mitKorb, basis)).toBe(true) // undefined = alles da
  })
})

describe('Einheit automatisch erstellen (§5-Muster, Zeitbudget exakt)', () => {
  for (const zeit of [45, 60, 90, 120]) {
    it(`${zeit} Minuten: Aufwärmen → 2–3 Hauptübungen → Spielform, Summe exakt`, () => {
      const einheit = erstelleEinheitAutomatisch(uebungsBibliothek, {
        ...basis,
        zeitMin: zeit,
      })!
      expect(einheit).toBeDefined()
      expect(einheitGesamtdauer(einheit.bloecke)).toBe(zeit)

      const kategorien = einheit.bloecke.map(
        (b) => findeUebung(b.uebungId, [])!.kategorie,
      )
      expect(kategorien[0]).toBe('aufwaermen')
      expect(kategorien[kategorien.length - 1]).toBe('spielformen')

      const haupt = kategorien.slice(1, -1)
      expect(haupt.length).toBeGreaterThanOrEqual(2)
      expect(haupt.length).toBeLessThanOrEqual(3)
      expect(haupt.every((k) => k !== 'aufwaermen' && k !== 'spielformen')).toBe(true)

      // Aufwärmen 10–15 Minuten (§5)
      expect(einheit.bloecke[0]!.dauerMin).toBeGreaterThanOrEqual(10)
      expect(einheit.bloecke[0]!.dauerMin).toBeLessThanOrEqual(15)

      // Kein Block unter 5 Minuten, keine Übung doppelt
      expect(einheit.bloecke.every((b) => b.dauerMin >= 5)).toBe(true)
      const ids = einheit.bloecke.map((b) => b.uebungId)
      expect(new Set(ids).size).toBe(ids.length)
    })
  }

  it('Hauptübungen zahlen auf die Ziel-Skills ein', () => {
    const einheit = erstelleEinheitAutomatisch(uebungsBibliothek, basis)!
    const haupt = einheit.bloecke.slice(1, -1)
    const decktSkillAb = haupt.some((b) =>
      findeUebung(b.uebungId, [])!.skills.some((s) => basis.zielSkills.includes(s)),
    )
    expect(decktSkillAb).toBe(true)
    expect(einheit.zielSkills).toEqual(basis.zielSkills)
  })

  it('respektiert Personenzahl 1 (keine Paar-/Gruppenübungen)', () => {
    const einheit = erstelleEinheitAutomatisch(uebungsBibliothek, {
      ...basis,
      personen: 1,
    })!
    for (const b of einheit.bloecke) {
      expect(findeUebung(b.uebungId, [])!.personen).toBe('allein')
    }
    expect(einheitGesamtdauer(einheit.bloecke)).toBe(90)
  })

  it('respektiert Materialeinschränkung (nur Grundausstattung)', () => {
    const einheit = erstelleEinheitAutomatisch(uebungsBibliothek, {
      ...basis,
      material: [],
    })!
    for (const b of einheit.bloecke) {
      expect(findeUebung(b.uebungId, [])!.material).toEqual([])
    }
  })

  it('liefert undefined, wenn nichts geeignet ist', () => {
    expect(
      erstelleEinheitAutomatisch(uebungsBibliothek, { ...basis, personen: 0 }),
    ).toBeUndefined()
  })
})
