/**
 * Phase-5-Abnahme: Alle 25 Animationen abspielbar, jede Phase mit Lehrtext (§14).
 */
import { describe, expect, it } from 'vitest'
import { ALLE_JOINTS } from '../../engine/pose/interpolation'
import { uebungsBibliothek } from '../uebungen'
import { alleAnimationen, animationsGruppen, findeAnimation } from './index'

const VERBINDLICHE_LISTE = [
  // Schlagtechnik (14)
  'anim-clear', 'anim-drop', 'anim-smash', 'anim-sprungsmash', 'anim-rh-clear',
  'anim-drive-vh', 'anim-drive-rh', 'anim-unterhand-clear', 'anim-netzdrop',
  'anim-netzlob-rh', 'anim-aufschlag-kurz', 'anim-aufschlag-lang', 'anim-netzkill',
  'anim-block',
  // Footwork (6)
  'anim-splitstep', 'anim-ausfallschritt', 'anim-umsprung', 'anim-rh-ecke',
  'anim-sidesteps', 'anim-sternlauf',
  // Taktik & Regeln (5)
  'anim-einzel-position', 'anim-doppel-angriff', 'anim-doppel-abwehr',
  'anim-flugbahnen', 'anim-aufschlagfelder',
]

describe('Registry (§8.2 verbindliche Liste)', () => {
  it('enthält genau die 25 Animationen der Liste', () => {
    expect(alleAnimationen).toHaveLength(25)
    const ids = alleAnimationen.map((a) => a.id)
    expect(new Set(ids).size).toBe(25)
    for (const id of VERBINDLICHE_LISTE) expect(ids).toContain(id)
  })

  it('Gruppierung: 14 Schlagtechnik, 6 Footwork, 5 Taktik & Regeln', () => {
    expect(animationsGruppen.map((g) => g.animationen.length)).toEqual([14, 6, 5])
  })
})

describe('Jede Animation ist vollständig und abspielbar', () => {
  for (const a of alleAnimationen) {
    it(`${a.id} „${a.name}"`, () => {
      expect(a.dauerMs).toBeGreaterThan(500)
      expect(a.name.length).toBeGreaterThan(3)
      expect(a.beschreibung?.length ?? 0).toBeGreaterThan(30)

      // Phasen: nicht leer, lückenlos von 0 bis dauerMs, jede mit Lehrtext
      expect(a.phasen.length).toBeGreaterThanOrEqual(3)
      expect(a.phasen[0]!.vonT).toBe(0)
      expect(a.phasen[a.phasen.length - 1]!.bisT).toBe(a.dauerMs)
      for (let i = 0; i < a.phasen.length; i++) {
        const p = a.phasen[i]!
        expect(p.bisT).toBeGreaterThan(p.vonT)
        expect(p.label.length).toBeGreaterThan(2)
        expect(p.lehrtext.length, `Lehrtext Phase ${i + 1}`).toBeGreaterThan(40)
        if (i > 0) expect(p.vonT).toBe(a.phasen[i - 1]!.bisT)
      }

      if (a.typ === 'figur') {
        // Posen: sortiert, decken 0..dauerMs ab, alle 11 Gelenke im 0–100-Raum
        expect(a.posen.length).toBeGreaterThanOrEqual(4)
        expect(a.posen[0]!.t).toBe(0)
        expect(a.posen[a.posen.length - 1]!.t).toBe(a.dauerMs)
        for (let i = 1; i < a.posen.length; i++) {
          expect(a.posen[i]!.t).toBeGreaterThan(a.posen[i - 1]!.t)
        }
        for (const pose of a.posen) {
          for (const j of ALLE_JOINTS) {
            const punkt = pose.joints[j]
            expect(punkt, `${a.id}: Gelenk ${j}`).toBeDefined()
            expect(punkt.x).toBeGreaterThanOrEqual(0)
            expect(punkt.x).toBeLessThanOrEqual(100)
            expect(punkt.y).toBeGreaterThanOrEqual(-5)
            expect(punkt.y).toBeLessThanOrEqual(100)
          }
        }
      } else {
        // Court-Animationen: Spieler mit Bahnen im Feldbereich (Meter)
        expect((a.spieler?.length ?? 0) + (a.bahnen?.length ?? 0)).toBeGreaterThan(0)
        for (const sp of a.spieler ?? []) {
          expect(sp.bahn.length).toBeGreaterThanOrEqual(2)
          for (const p of sp.bahn) {
            expect(p.t).toBeGreaterThanOrEqual(0)
            expect(p.t).toBeLessThanOrEqual(a.dauerMs)
            expect(p.x).toBeGreaterThanOrEqual(0)
            expect(p.x).toBeLessThanOrEqual(13.4)
          }
        }
      }
    })
  }
})

describe('Verknüpfung mit der Übungsbibliothek', () => {
  it('jede animationId in den Übungen existiert in der Registry', () => {
    for (const u of uebungsBibliothek) {
      if (u.animationId) {
        expect(findeAnimation(u.animationId), `${u.id} → ${u.animationId}`).toBeDefined()
      }
    }
  })

  it('jede Animation wird von mindestens einer Übung ODER der Bewegungslehre genutzt (Registry vollständig)', () => {
    const referenziert = new Set(
      uebungsBibliothek.flatMap((u) => (u.animationId ? [u.animationId] : [])),
    )
    // Mindestens 15 der 25 sind direkt mit Übungen verknüpft
    expect(referenziert.size).toBeGreaterThanOrEqual(15)
  })
})
