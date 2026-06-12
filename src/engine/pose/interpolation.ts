/**
 * Pose-Engine, Teil 1 (§8.1): reine Interpolations-Funktionen, UI-frei.
 * Animation = Sequenz von Schlüsselposen; zwischen ihnen wird mit
 * Smoothstep-Easing interpoliert.
 */
import type { AnimationsPhase, BahnPunkt, JointId, Pose } from '../../datenmodell'

export const ALLE_JOINTS: JointId[] = [
  'kopf',
  'nacken',
  'schulter',
  'ellbogen',
  'handgelenk',
  'schlaegerKopf',
  'huefte',
  'knieL',
  'fussL',
  'knieR',
  'fussR',
]

/** Smoothstep-Easing: weicher Beginn und Auslauf je Segment. */
export function smoothstep(u: number): number {
  const x = Math.min(1, Math.max(0, u))
  return x * x * (3 - 2 * x)
}

export function lerp(a: number, b: number, u: number): number {
  return a + (b - a) * u
}

/**
 * Segment-Suche: Index i mit punkte[i].t <= t <= punkte[i+1].t
 * plus normalisierte Position u im Segment. Vor/nach der Sequenz wird geklemmt.
 */
export function findeSegment<T extends { t: number }>(
  punkte: T[],
  t: number,
): { i: number; u: number } {
  if (punkte.length === 0) throw new Error('Leere Punktliste')
  if (t <= punkte[0]!.t || punkte.length === 1) return { i: 0, u: 0 }
  const letzter = punkte.length - 1
  if (t >= punkte[letzter]!.t) return { i: Math.max(0, letzter - 1), u: 1 }
  let i = 0
  while (i < letzter - 1 && punkte[i + 1]!.t <= t) i++
  const a = punkte[i]!.t
  const b = punkte[i + 1]!.t
  return { i, u: b === a ? 0 : (t - a) / (b - a) }
}

/** Pose zum Zeitpunkt t (Smoothstep zwischen den Schlüsselposen). */
export function interpolierePose(posen: Pose[], t: number): Pose {
  const { i, u } = findeSegment(posen, t)
  const von = posen[i]!
  const nach = posen[Math.min(i + 1, posen.length - 1)]!
  const e = smoothstep(u)
  const joints = {} as Pose['joints']
  for (const j of ALLE_JOINTS) {
    joints[j] = {
      x: lerp(von.joints[j].x, nach.joints[j].x, e),
      y: lerp(von.joints[j].y, nach.joints[j].y, e),
      z: lerp(von.joints[j].z ?? 0, nach.joints[j].z ?? 0, e),
    }
  }
  return {
    t,
    joints,
    meta: {
      eindreh: lerp(von.meta?.eindreh ?? 12, nach.meta?.eindreh ?? 12, e),
    },
  }
}

/**
 * Position auf einer Bahn zum Zeitpunkt t — undefined außerhalb des
 * Zeitfensters (Shuttle erscheint/verschwindet).
 */
export function interpoliereBahn(
  punkte: BahnPunkt[],
  t: number,
): { x: number; y: number; z?: number } | undefined {
  if (punkte.length === 0) return undefined
  if (t < punkte[0]!.t || t > punkte[punkte.length - 1]!.t) return undefined
  const { i, u } = findeSegment(punkte, t)
  const von = punkte[i]!
  if (von.unsichtbar) return undefined
  const nach = punkte[Math.min(i + 1, punkte.length - 1)]!
  return {
    x: lerp(von.x, nach.x, u),
    y: lerp(von.y, nach.y, u),
    ...(von.z !== undefined || nach.z !== undefined
      ? { z: lerp(von.z ?? nach.z ?? 0, nach.z ?? von.z ?? 0, u) }
      : {}),
  }
}

/** Bereits zurückgelegter Teil einer Bahn (für animiert gezeichnete Laufwege). */
export function bahnBisJetzt(punkte: BahnPunkt[], t: number): { x: number; y: number }[] {
  const ergebnis: { x: number; y: number }[] = []
  for (const p of punkte) {
    if (p.t <= t) ergebnis.push({ x: p.x, y: p.y })
    else break
  }
  const aktuell = interpoliereBahn(punkte, t)
  if (aktuell && punkte[0] && t >= punkte[0].t) ergebnis.push(aktuell)
  return ergebnis
}

/** Index der aktiven Phase zum Zeitpunkt t (letzte Phase deckt das Ende ab). */
export function aktivePhasenIndex(phasen: AnimationsPhase[], t: number): number {
  for (let i = 0; i < phasen.length; i++) {
    const p = phasen[i]!
    if (t >= p.vonT && t < p.bisT) return i
  }
  return t >= (phasen[phasen.length - 1]?.bisT ?? 0) ? phasen.length - 1 : 0
}

/** Quadratische Bézierkurve als Bahn sampeln (§8: shuttleBahn Bézier-gesampelt). */
export function bezierBahn(
  p0: { x: number; y: number },
  steuer: { x: number; y: number },
  p1: { x: number; y: number },
  vonT: number,
  bisT: number,
  schritte = 12,
  z?: { von: number; bis: number },
): BahnPunkt[] {
  const punkte: BahnPunkt[] = []
  for (let s = 0; s <= schritte; s++) {
    const u = s / schritte
    const einsMinus = 1 - u
    punkte.push({
      t: lerp(vonT, bisT, u),
      x: einsMinus * einsMinus * p0.x + 2 * einsMinus * u * steuer.x + u * u * p1.x,
      y: einsMinus * einsMinus * p0.y + 2 * einsMinus * u * steuer.y + u * u * p1.y,
      ...(z ? { z: lerp(z.von, z.bis, u) } : {}),
    })
  }
  return punkte
}
