/**
 * Phase-2-Abnahme, Teil 2: Alle Filterkombinationen liefern korrekte Treffer.
 */
import { describe, expect, it } from 'vitest'
import type { Uebung } from '../datenmodell'
import { uebungsBibliothek } from '../data/uebungen'
import { filtereUebungen, trifftFilter } from './uebungsFilter'

describe('Einzelfilter', () => {
  it('Kategorie: liefert genau die Übungen der Kategorie', () => {
    const treffer = filtereUebungen(uebungsBibliothek, { kategorie: 'footwork' })
    expect(treffer).toHaveLength(12)
    expect(treffer.every((u) => u.kategorie === 'footwork')).toBe(true)
  })

  it('Skill: jede Trefferübung zahlt auf den Skill ein', () => {
    const treffer = filtereUebungen(uebungsBibliothek, { skill: 'clear' })
    expect(treffer.length).toBeGreaterThan(0)
    expect(treffer.every((u) => u.skills.includes('clear'))).toBe(true)
    // Gegenprobe: Nicht-Treffer enthalten den Skill wirklich nicht
    const rest = uebungsBibliothek.filter((u) => !treffer.includes(u))
    expect(rest.every((u) => !u.skills.includes('clear'))).toBe(true)
  })

  it('Niveau: nur Übungen, die für das Niveau geeignet sind', () => {
    const treffer = filtereUebungen(uebungsBibliothek, { niveau: 'anfaenger' })
    expect(treffer.length).toBeGreaterThan(0)
    expect(treffer.every((u) => u.niveau.includes('anfaenger'))).toBe(true)
  })

  it('Personenzahl: exakte Übungsform', () => {
    const treffer = filtereUebungen(uebungsBibliothek, { personen: 'allein' })
    expect(treffer.length).toBeGreaterThan(0)
    expect(treffer.every((u) => u.personen === 'allein')).toBe(true)
  })

  it('Material: Übungen, die das Material verwenden', () => {
    const treffer = filtereUebungen(uebungsBibliothek, { material: 'Shuttle-Korb' })
    expect(treffer.length).toBeGreaterThan(0)
    expect(treffer.every((u) => u.material.includes('Shuttle-Korb'))).toBe(true)
  })

  it('Dauer: keine Übung über dem Maximum', () => {
    const treffer = filtereUebungen(uebungsBibliothek, { maxDauer: 10 })
    expect(treffer.length).toBeGreaterThan(0)
    expect(treffer.every((u) => u.dauerMin <= 10)).toBe(true)
  })

  it('Volltextsuche: findet Begriffe aus der ausführlichen Beschreibung', () => {
    const uebung: Uebung = {
      id: 'test-beschreibung',
      name: 'Testübung',
      kategorie: 'schlagtechnik',
      skills: ['clear'],
      niveau: ['anfaenger'],
      dauerMin: 10,
      personen: 'paar',
      material: [],
      kurzbeschreibung: 'Kurz.',
      durchfuehrung: ['Schritt eins'],
      beschreibung: ['Der Spezialbegriff Fledermausgriff steht nur hier.'],
    }
    expect(filtereUebungen([uebung], { suche: 'fledermausgriff' })).toHaveLength(1)
    expect(filtereUebungen([uebung], { suche: 'nicht-enthalten' })).toHaveLength(0)
  })

  it('Volltextsuche: findet Namen, Beschreibungen und Schritte, case-insensitiv', () => {
    expect(
      filtereUebungen(uebungsBibliothek, { suche: 'kaiserspiel' }).map((u) => u.id),
    ).toContain('sf-02')
    // Begriff aus einem Durchführungs-Schritt
    expect(
      filtereUebungen(uebungsBibliothek, { suche: 'Icky Shuffle' }).map((u) => u.id),
    ).toContain('fw-07')
    expect(filtereUebungen(uebungsBibliothek, { suche: 'SMASH' }).length).toBeGreaterThan(0)
  })

  it('leere Suche und leerer Filter ändern nichts', () => {
    expect(filtereUebungen(uebungsBibliothek, {})).toHaveLength(75)
    expect(filtereUebungen(uebungsBibliothek, { suche: '   ' })).toHaveLength(75)
  })
})

describe('Kombinationen (UND-Verknüpfung)', () => {
  it('Kategorie + Skill + Niveau', () => {
    const treffer = filtereUebungen(uebungsBibliothek, {
      kategorie: 'schlagtechnik',
      skill: 'smash',
      niveau: 'leistung',
    })
    expect(treffer.length).toBeGreaterThan(0)
    for (const u of treffer) {
      expect(u.kategorie).toBe('schlagtechnik')
      expect(u.skills).toContain('smash')
      expect(u.niveau).toContain('leistung')
    }
  })

  it('Personen + Dauer + Suche', () => {
    const treffer = filtereUebungen(uebungsBibliothek, {
      personen: 'paar',
      maxDauer: 12,
      suche: 'netz',
    })
    for (const u of treffer) {
      expect(u.personen).toBe('paar')
      expect(u.dauerMin).toBeLessThanOrEqual(12)
    }
  })

  it('Kombination entspricht der Schnittmenge der Einzelfilter', () => {
    const einzeln = new Set(
      filtereUebungen(uebungsBibliothek, { kategorie: 'kondition' })
        .filter((u) => u.niveau.includes('fortgeschritten'))
        .filter((u) => u.personen === 'allein')
        .map((u) => u.id),
    )
    const kombiniert = new Set(
      filtereUebungen(uebungsBibliothek, {
        kategorie: 'kondition',
        niveau: 'fortgeschritten',
        personen: 'allein',
      }).map((u) => u.id),
    )
    expect(kombiniert).toEqual(einzeln)
  })

  it('Widersprüchliche Kombination liefert leere Liste (und wirft nicht)', () => {
    const treffer = filtereUebungen(uebungsBibliothek, {
      kategorie: 'aufwaermen',
      skill: 'taktik_doppel',
    })
    expect(treffer).toEqual([])
  })

  it('trifftFilter ist konsistent mit filtereUebungen', () => {
    const filter = { kategorie: 'footwork' as const, maxDauer: 9 }
    const treffer = filtereUebungen(uebungsBibliothek, filter)
    for (const u of uebungsBibliothek) {
      expect(trifftFilter(u, filter)).toBe(treffer.includes(u))
    }
  })
})
