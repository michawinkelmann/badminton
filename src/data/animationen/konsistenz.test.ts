/**
 * Konsistenztests aus dem Animations-Review:
 * 1. Treffpunkt = Schlägerkopf: Zum Kontaktzeitpunkt ist der Shuttle am Schläger.
 * 2. Netzquerung: Figur-Shuttle fliegt ÜBER die Netzkante, nie hindurch.
 * 3. Ballwechsel (Court): Richtungswechsel nur an Spielerpositionen,
 *    Shuttle verschwindet nicht vor dem Ende.
 */
import { describe, expect, it } from 'vitest'
import type { BewegungsAnimation } from '../../datenmodell'
import { BODEN_Y } from '../../engine/pose/figur'
import { COURT } from '../../engine/pose/court'
import { interpoliereBahn, interpolierePose } from '../../engine/pose/interpolation'
import { alleAnimationen, findeAnimation } from './index'

const NETZKANTE_Y = BODEN_Y - 1.55 * 40 // = 30 im 0–100-Raum

/** Kontaktzeitpunkte der Figur-Animationen (Schlagmoment). */
const KONTAKTE: Record<string, number> = {
  'anim-clear': 1450,
  'anim-drop': 1480,
  'anim-smash': 1400,
  'anim-sprungsmash': 1300,
  'anim-rh-clear': 1500,
  'anim-drive-vh': 800,
  'anim-drive-rh': 800,
  'anim-unterhand-clear': 1400,
  'anim-netzdrop': 1410,
  'anim-netzlob-rh': 1420,
  'anim-aufschlag-kurz': 1150,
  'anim-aufschlag-lang': 1300,
  'anim-netzkill': 790,
  'anim-block': 950,
}

function abstand(a: { x: number; y: number }, b: { x: number; y: number }): number {
  return Math.hypot(a.x - b.x, a.y - b.y)
}

describe('Treffpunkt = Schlägerkopf', () => {
  for (const [id, kontaktT] of Object.entries(KONTAKTE)) {
    it(`${id}: Shuttle ist beim Kontakt (t=${kontaktT}) am Schlägerkopf`, () => {
      const a = findeAnimation(id)!
      const shuttle = interpoliereBahn(a.shuttleBahn!, kontaktT)
      expect(shuttle, 'Shuttle muss zum Kontaktzeitpunkt sichtbar sein').toBeDefined()
      const tip = interpolierePose(a.posen, kontaktT).joints.schlaegerKopf
      expect(
        abstand(tip, shuttle!),
        `Abstand Schlägerkopf↔Shuttle: ${abstand(tip, shuttle!).toFixed(1)}`,
      ).toBeLessThan(8)
    })
  }
})

describe('Netzquerung (Figur): immer über die Kante', () => {
  const mitNetz = alleAnimationen.filter(
    (a) => a.typ === 'figur' && a.netzX !== undefined && a.shuttleBahn,
  )
  for (const a of mitNetz) {
    it(`${a.id}: Shuttle quert das Netz oberhalb der Kante`, () => {
      const punkte = a.shuttleBahn!
      let querungen = 0
      for (let i = 0; i < punkte.length - 1; i++) {
        const p = punkte[i]!
        const q = punkte[i + 1]!
        if (p.unsichtbar) continue
        const dx = q.x - p.x
        if (dx === 0) continue
        const u = (a.netzX! - p.x) / dx
        if (u > 0 && u <= 1) {
          const y = p.y + (q.y - p.y) * u
          querungen++
          expect(y, `Querung bei t≈${Math.round(p.t)} liegt zu tief (y=${y.toFixed(1)})`).toBeLessThan(NETZKANTE_Y + 0.5)
        }
      }
      expect(querungen).toBeGreaterThan(0)
    })
  }
})

describe('Netzquerung (Vergleichs-Flugbahnen, Seitenansicht): über die Kante', () => {
  const mitBahnen = alleAnimationen.filter((a) => (a.bahnen?.length ?? 0) > 0)
  for (const a of mitBahnen) {
    for (const b of a.bahnen!) {
      it(`${a.id} – ${b.label}: quert das Netz oberhalb von ${COURT.netzHoehe} m`, () => {
        const pts = b.punkte
        let querung: number | undefined
        for (let i = 0; i < pts.length - 1; i++) {
          const p = pts[i]!
          const q = pts[i + 1]!
          const dx = q.x - p.x
          if (dx === 0) continue
          const u = (COURT.netzX - p.x) / dx
          if (u > 0 && u <= 1) {
            querung = p.y + (q.y - p.y) * u
            break
          }
        }
        expect(querung, `${b.label} quert die Netzlinie nicht`).toBeDefined()
        expect(
          querung!,
          `${b.label} quert zu tief (y=${querung?.toFixed(2)} m, Netz=${COURT.netzHoehe} m)`,
        ).toBeGreaterThanOrEqual(COURT.netzHoehe)
      })
    }
  }
})

describe('Ballwechsel-Konsistenz (Court-Draufsicht)', () => {
  const rallys = ['anim-einzel-position', 'anim-doppel-angriff', 'anim-doppel-abwehr']

  function spielerNah(a: BewegungsAnimation, t: number, pos: { x: number; y: number }): number {
    let min = Infinity
    for (const sp of a.spieler ?? []) {
      const p =
        interpoliereBahn(sp.bahn, Math.min(Math.max(t, sp.bahn[0]!.t), sp.bahn[sp.bahn.length - 1]!.t)) ?? sp.bahn[0]!
      min = Math.min(min, abstand(p, pos))
    }
    return min
  }

  for (const id of rallys) {
    it(`${id}: Richtungswechsel nur an Spielern, Shuttle bleibt bis zum Ende`, () => {
      const a = findeAnimation(id)!
      const punkte = a.shuttleBahn!

      // Shuttle existiert bis zum Schluss (kein Verschwinden)
      expect(interpoliereBahn(punkte, a.dauerMs - 50)).toBeDefined()
      expect(punkte[punkte.length - 1]!.t).toBeGreaterThanOrEqual(a.dauerMs - 1)

      // Richtungswechsel > 50° → ein Spieler muss dort stehen (Schlag!)
      for (let i = 1; i < punkte.length - 1; i++) {
        const a1 = punkte[i - 1]!
        const b = punkte[i]!
        const c = punkte[i + 1]!
        const v1 = { x: b.x - a1.x, y: b.y - a1.y }
        const v2 = { x: c.x - b.x, y: c.y - b.y }
        const l1 = Math.hypot(v1.x, v1.y)
        const l2 = Math.hypot(v2.x, v2.y)
        if (l1 < 0.15 || l2 < 0.15) continue // Halten/Liegen
        const cos = (v1.x * v2.x + v1.y * v2.y) / (l1 * l2)
        if (cos < Math.cos((50 * Math.PI) / 180)) {
          const naechster = spielerNah(a, b.t, b)
          expect(
            naechster,
            `${id}: Knick bei t=${Math.round(b.t)} (${b.x.toFixed(1)},${b.y.toFixed(1)}) ohne Spieler (nächster: ${naechster.toFixed(2)} m)`,
          ).toBeLessThan(1.0)
        }
      }
    })
  }

  it('anim-aufschlagfelder: Shuttle zwischen den Aufschlägen ausgeblendet', () => {
    const a = findeAnimation('anim-aufschlagfelder')!
    expect(interpoliereBahn(a.shuttleBahn!, 1200)).toBeDefined() // Aufschlag 1 fliegt
    expect(interpoliereBahn(a.shuttleBahn!, 2600)).toBeUndefined() // ausgeblendet
    expect(interpoliereBahn(a.shuttleBahn!, 3800)).toBeDefined() // Aufschlag 2 fliegt
    expect(interpoliereBahn(a.shuttleBahn!, 6000)).toBeUndefined() // Regel-Phase
  })
})

describe('Phasenmitte zeigt einen gültigen Zeitpunkt (Stepper-Anker)', () => {
  for (const a of alleAnimationen) {
    it(`${a.id}: alle Phasenmitten liegen in [0, dauerMs]`, () => {
      for (const p of a.phasen) {
        const mitte = p.vonT + (p.bisT - p.vonT) / 2
        expect(mitte).toBeGreaterThanOrEqual(0)
        expect(mitte).toBeLessThanOrEqual(a.dauerMs)
      }
    })
  }
})

describe('3D-lite: Tiefe konsistent', () => {
  const figuren = alleAnimationen.filter((a) => a.typ === 'figur')

  for (const a of figuren) {
    it(`${a.id}: z-Werte im Rahmen, Eindrehen 0–90°`, () => {
      for (const pose of a.posen) {
        expect(pose.meta?.eindreh ?? 12).toBeGreaterThanOrEqual(0)
        expect(pose.meta?.eindreh ?? 12).toBeLessThanOrEqual(90)
        for (const j of Object.values(pose.joints)) {
          expect(Math.abs(j.z ?? 0)).toBeLessThanOrEqual(24)
        }
      }
    })
  }

  it('Frontansicht: Shuttle ist beim Kontakt seitlich am Schlägerkopf', () => {
    for (const [id, kontaktT] of Object.entries(KONTAKTE)) {
      const a = findeAnimation(id)!
      const shuttle = interpoliereBahn(a.shuttleBahn!, kontaktT)!
      const tip = interpolierePose(a.posen, kontaktT).joints.schlaegerKopf
      const dz = Math.abs((tip.z ?? 0) - (shuttle.z ?? 7))
      expect(dz, `${id}: |z-Differenz| = ${dz.toFixed(1)}`).toBeLessThan(5)
    }
  })
})
