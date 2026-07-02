/** Tests der Pose-Engine: Interpolation, Phasenfindung, Bézier-Sampling. */
import { describe, expect, it } from 'vitest'
import type { FigurKeyframe } from '../../datenmodell'
import { SEGMENT, grundstellung, hocke } from './figur'
import {
  aktivePhasenIndex,
  bahnBisJetzt,
  bezierBahn,
  figurPoseZuZeit,
  findeSegment,
  fussAufsetzer,
  interpoliereBahn,
  interpoliereStellung,
  smoothstep,
} from './interpolation'

const keyframes: FigurKeyframe[] = [
  { t: 0, s: grundstellung(40) },
  { t: 1000, s: hocke(44) },
  { t: 2000, s: grundstellung(48) },
]

describe('interpoliereStellung', () => {
  it('liefert an Schlüsselzeitpunkten exakt den Keyframe (inkl. aufgelöster Defaults)', () => {
    expect(interpoliereStellung(keyframes, 0).huefte.x).toBeCloseTo(40)
    expect(interpoliereStellung(keyframes, 1000).huefte.x).toBeCloseTo(44)
    expect(interpoliereStellung(keyframes, 2000).huefte.x).toBeCloseTo(48)
    // Defaults werden VOR der Interpolation aufgelöst:
    expect(interpoliereStellung(keyframes, 0).kopf).toBeCloseTo(grundstellung(40).rumpf)
    expect(interpoliereStellung(keyframes, 0).beinSeitL).toBeCloseTo(-4)
    expect(interpoliereStellung(keyframes, 1000).beinSeitL).toBeCloseTo(-9) // hocke
  })

  it('klemmt vor Beginn und nach Ende', () => {
    expect(interpoliereStellung(keyframes, -50).huefte.x).toBeCloseTo(40)
    expect(interpoliereStellung(keyframes, 9999).huefte.x).toBeCloseTo(48)
  })

  it('läuft an inneren Keyframes mit Tempo durch (Catmull-Rom, kein Stopp)', () => {
    // Geschwindigkeit kurz vor/nach dem mittleren Keyframe ≈ gleich und ≠ 0
    const kanal = (t: number) => interpoliereStellung(keyframes, t).huefte.x
    const vVor = (kanal(1000) - kanal(990)) / 10
    const vNach = (kanal(1010) - kanal(1000)) / 10
    expect(vVor).toBeGreaterThan(0.001)
    expect(vNach).toBeGreaterThan(0.001)
    expect(vVor).toBeCloseTo(vNach, 3)
    // Finite Differenzen: Tangente = (48 − 40) / 2000 = 0,004/ms
    expect(vVor).toBeCloseTo(8 / 2000, 3)
  })

  it('schlag: true hält das Tempo der schnelleren Sekante am Keyframe (A2)', () => {
    // schneller Anschwung (500 ms), langsamer Ausschwung (1500 ms)
    const mitSchlag: FigurKeyframe[] = [
      { t: 0, s: grundstellung(40) },
      { t: 500, schlag: true, s: hocke(48) },
      { t: 2000, s: grundstellung(52) },
    ]
    const kanal = (t: number) => interpoliereStellung(mitSchlag, t).huefte.x
    const vAmSchlag = (kanal(505) - kanal(495)) / 10
    const sekanteAnschwung = (48 - 40) / 500
    // Ohne Flag würde die Bessel-Gewichtung deutlich darunter liegen
    expect(vAmSchlag).toBeGreaterThan(sekanteAnschwung * 0.9)
  })

  it('halt: true erzwingt Tangente 0 (bewusster Stopp)', () => {
    const mitHalt: FigurKeyframe[] = [
      { t: 0, s: grundstellung(40) },
      { t: 1000, halt: true, s: hocke(44) },
      { t: 2000, s: grundstellung(48) },
    ]
    const kanal = (t: number) => interpoliereStellung(mitHalt, t).huefte.x
    const vAmHalt = (kanal(1005) - kanal(995)) / 10
    expect(Math.abs(vAmHalt)).toBeLessThan(0.0005)
  })

  it('Halte-Segmente (gleicher Wert links und rechts) bleiben exakt konstant', () => {
    const mitHold: FigurKeyframe[] = [
      { t: 0, s: hocke(44) },
      { t: 500, s: hocke(44) },
      { t: 1000, s: grundstellung(48) },
    ]
    for (const t of [100, 250, 400]) {
      expect(interpoliereStellung(mitHold, t).huefte.x).toBe(44)
      expect(interpoliereStellung(mitHold, t).oberarm).toBe(hocke(44).oberarm)
    }
  })

  it('figurPoseZuZeit: Segmentlängen (xy) bleiben ZWISCHEN den Keyframes exakt (A1)', () => {
    for (const t of [300, 500, 700, 1200, 1500, 1800]) {
      const j = figurPoseZuZeit(keyframes, t).joints
      const oberarm = Math.hypot(j.ellbogen.x - j.schulter.x, j.ellbogen.y - j.schulter.y)
      expect(oberarm).toBeCloseTo(SEGMENT.oberarm, 6)
      const unterschenkelL = Math.hypot(j.fussL.x - j.knieL.x, j.fussL.y - j.knieL.y)
      expect(unterschenkelL).toBeCloseTo(SEGMENT.unterschenkel, 6)
      const schlaeger = Math.hypot(
        j.schlaegerKopf.x - j.handgelenk.x,
        j.schlaegerKopf.y - j.handgelenk.y,
      )
      expect(schlaeger).toBeCloseTo(SEGMENT.schlaeger, 6)
    }
  })
})

describe('fussAufsetzer', () => {
  it('erkennt die Landung beider Füße nach einem Sprung', () => {
    const sprung: FigurKeyframe[] = [
      { t: 0, s: grundstellung(40) },
      { t: 400, s: { ...grundstellung(40), flugHoehe: 8 } },
      { t: 800, s: grundstellung(40) },
      { t: 1200, s: grundstellung(40) },
    ]
    const landungen = fussAufsetzer(sprung)
    expect(landungen.length).toBeGreaterThanOrEqual(2) // beide Füße setzen auf
    for (const l of landungen) {
      expect(l.t).toBeGreaterThan(400) // erst nach dem Scheitelpunkt
      expect(l.t).toBeLessThanOrEqual(900)
    }
    expect(new Set(landungen.map((l) => l.fuss))).toEqual(new Set(['L', 'R']))
  })

  it('meldet nichts, wenn die Figur am Boden bleibt', () => {
    expect(fussAufsetzer(keyframes)).toEqual([])
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
