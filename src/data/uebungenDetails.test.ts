/**
 * Qualitäts-Checks für die ausführlichen Übungsdetails:
 * jede Übung hat eine erklärende Beschreibung, Skizzen sind geometrisch
 * plausibel (innerhalb des Court-Koordinatensystems) und verweisen nur
 * auf existierende Übungen.
 */
import { describe, expect, it } from 'vitest'
import type { SkizzenPunkt } from '../datenmodell'
import { COURT } from '../engine/pose/court'
import { uebungsBibliothek } from './uebungen'
import { uebungsDetails } from './uebungen/details'

// Sichtbarer Bereich der Skizze: Court plus 0,5 m Rand (viewBoxOben)
const RAND = 0.5
const X_MAX = COURT.laenge + RAND
const Y_MAX = COURT.breite + RAND

function imBild(p: SkizzenPunkt): boolean {
  return p.x >= -RAND && p.x <= X_MAX && p.y >= -RAND && p.y <= Y_MAX
}

describe('Übungsdetails: Beschreibungen', () => {
  it('jede Detail-ID gehört zu einer existierenden Übung (keine Waisen)', () => {
    const ids = new Set(uebungsBibliothek.map((u) => u.id))
    for (const id of Object.keys(uebungsDetails)) {
      expect(ids.has(id), `Detail ohne Übung: ${id}`).toBe(true)
    }
  })

  for (const u of uebungsBibliothek) {
    it(`${u.id} „${u.name}" hat eine ausführliche Beschreibung`, () => {
      expect(u.beschreibung, 'beschreibung fehlt').toBeDefined()
      expect(u.beschreibung!.length).toBeGreaterThanOrEqual(2)
      for (const absatz of u.beschreibung!) {
        expect(absatz.length, 'Absatz zu kurz').toBeGreaterThan(80)
      }
      // Mehrwert statt Kopie: Beschreibung wiederholt nicht die Kurzbeschreibung
      expect(u.beschreibung!.join(' ')).not.toContain(u.kurzbeschreibung)
    })
  }
})

describe('Übungsdetails: Skizzen', () => {
  const mitSkizze = uebungsBibliothek.filter((u) => u.skizze)

  it('deckt alle räumlich relevanten Übungen ab (mindestens 50)', () => {
    expect(mitSkizze.length).toBeGreaterThanOrEqual(50)
  })

  it('Footwork, Taktik und Spielform-Kern haben durchgängig Skizzen', () => {
    const pflicht = uebungsBibliothek.filter(
      (u) =>
        (u.kategorie === 'footwork' && u.id !== 'fw-07') ||
        u.kategorie === 'taktik_doppel' ||
        (u.kategorie === 'taktik_einzel' && u.id !== 'te-07'),
    )
    for (const u of pflicht) {
      expect(u.skizze, `${u.id} ohne Skizze`).toBeDefined()
    }
  })

  for (const u of mitSkizze) {
    it(`${u.id}: Skizzen-Geometrie liegt im Court-Bild`, () => {
      const s = u.skizze!
      const elemente =
        (s.spieler?.length ?? 0) +
        (s.huetchen?.length ?? 0) +
        (s.zonen?.length ?? 0) +
        (s.laufwege?.length ?? 0) +
        (s.shuttlewege?.length ?? 0)
      expect(elemente, 'leere Skizze').toBeGreaterThan(0)

      for (const sp of s.spieler ?? []) {
        expect(imBild(sp.pos), `Spieler ${sp.label} außerhalb`).toBe(true)
        expect(sp.label.length).toBeGreaterThanOrEqual(1)
        expect(sp.label.length).toBeLessThanOrEqual(3)
      }
      for (const h of s.huetchen ?? []) expect(imBild(h), 'Hütchen außerhalb').toBe(true)
      for (const z of s.zonen ?? []) {
        expect(z.b).toBeGreaterThan(0)
        expect(z.h).toBeGreaterThan(0)
        expect(imBild({ x: z.x, y: z.y }), 'Zonen-Ecke außerhalb').toBe(true)
        expect(imBild({ x: z.x + z.b, y: z.y + z.h }), 'Zonen-Ecke außerhalb').toBe(true)
      }
      for (const w of [...(s.laufwege ?? []), ...(s.shuttlewege ?? [])]) {
        expect(imBild(w.von), 'Weg-Start außerhalb').toBe(true)
        expect(imBild(w.bis), 'Weg-Ende außerhalb').toBe(true)
        const laenge = Math.hypot(w.bis.x - w.von.x, w.bis.y - w.von.y)
        expect(laenge, 'Weg ohne Länge').toBeGreaterThan(0.3)
      }
    })
  }
})
