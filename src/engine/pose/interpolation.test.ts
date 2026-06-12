/** Tests der Pose-Engine: Interpolation, Phasenfindung, Bézier-Sampling. */
import { describe, expect, it } from 'vitest'
import type { Pose } from '../../datenmodell'
import { figurPose, grundstellung, hocke } from './figur'
import {
  aktivePhasenIndex,
  bahnBisJetzt,
  bezierBahn,
  findeSegment,
  interpoliereBahn,
  interpolierePose,
  smoothstep,
} from './interpolation'

const posen: Pose[] = [
  figurPose(0, grundstellung(40)),
  figurPose(1000, hocke(44)),
  figurPose(2000, grundstellung(48)),
]

describe('interpolierePose', () => {
  it('liefert an Schlüsselzeitpunkten exakt die Schlüsselpose', () => {
    expect(interpolierePose(posen, 0).joints.huefte.x).toBeCloseTo(40)
    expect(interpolierePose(posen, 1000).joints.huefte.x).toBeCloseTo(44)
    expect(interpolierePose(posen, 2000).joints.huefte.x).toBeCloseTo(48)
  })

  it('interpoliert dazwischen mit Smoothstep (Mitte = Mittelwert)', () => {
    const mitte = interpolierePose(posen, 500)
    expect(mitte.joints.huefte.x).toBeCloseTo(42) // smoothstep(0,5) = 0,5
    expect(mitte.joints.huefte.y).toBeGreaterThan(57.5)
    expect(mitte.joints.huefte.y).toBeLessThan(61.5)
  })

  it('klemmt vor Beginn und nach Ende', () => {
    expect(interpolierePose(posen, -50).joints.huefte.x).toBeCloseTo(40)
    expect(interpolierePose(posen, 9999).joints.huefte.x).toBeCloseTo(48)
  })
})

describe('findeSegment & smoothstep', () => {
  it('findet das richtige Segment', () => {
    const punkte = [{ t: 0 }, { t: 100 }, { t: 300 }]
    expect(findeSegment(punkte, 50)).toEqual({ i: 0, u: 0.5 })
    expect(findeSegment(punkte, 200)).toEqual({ i: 1, u: 0.5 })
    expect(findeSegment(punkte, 300).u).toBe(1)
  })

  it('smoothstep: 0→0, 0,5→0,5, 1→1, weiche Enden', () => {
    expect(smoothstep(0)).toBe(0)
    expect(smoothstep(0.5)).toBeCloseTo(0.5)
    expect(smoothstep(1)).toBe(1)
    expect(smoothstep(0.1)).toBeLessThan(0.1) // sanfter Anlauf
  })
})

describe('Bahnen', () => {
  const bahn = [
    { t: 100, x: 0, y: 0 },
    { t: 200, x: 10, y: 20 },
  ]

  it('interpoliereBahn: linear im Fenster, undefined außerhalb', () => {
    expect(interpoliereBahn(bahn, 50)).toBeUndefined()
    expect(interpoliereBahn(bahn, 250)).toBeUndefined()
    expect(interpoliereBahn(bahn, 150)).toEqual({ x: 5, y: 10 })
  })

  it('bahnBisJetzt liefert den bereits gezeichneten Teil inkl. aktueller Position', () => {
    expect(bahnBisJetzt(bahn, 50)).toEqual([])
    const teil = bahnBisJetzt(bahn, 150)
    expect(teil[0]).toEqual({ x: 0, y: 0 })
    expect(teil[teil.length - 1]).toEqual({ x: 5, y: 10 })
  })

  it('bezierBahn: Endpunkte exakt, Zeiten gleichmäßig, monoton', () => {
    const b = bezierBahn({ x: 0, y: 0 }, { x: 5, y: 10 }, { x: 10, y: 0 }, 0, 100, 10)
    expect(b).toHaveLength(11)
    expect(b[0]).toEqual({ t: 0, x: 0, y: 0 })
    expect(b[10]!.x).toBeCloseTo(10)
    expect(b[5]!.y).toBeCloseTo(5) // Scheitel der Parabel
    for (let i = 1; i < b.length; i++) expect(b[i]!.t).toBeGreaterThan(b[i - 1]!.t)
  })
})

describe('aktivePhasenIndex', () => {
  const phasen = [
    { vonT: 0, bisT: 500, label: 'eins', lehrtext: 'x' },
    { vonT: 500, bisT: 1000, label: 'zwei', lehrtext: 'y' },
  ]
  it('findet die aktive Phase, Ende fällt auf die letzte', () => {
    expect(aktivePhasenIndex(phasen, 0)).toBe(0)
    expect(aktivePhasenIndex(phasen, 499)).toBe(0)
    expect(aktivePhasenIndex(phasen, 500)).toBe(1)
    expect(aktivePhasenIndex(phasen, 1000)).toBe(1)
  })
})
