/**
 * Pose-Engine, Teil 1 (§8.1): reine Interpolations-Funktionen, UI-frei.
 * Figur-Animationen = Sequenz von Winkel-Keyframes (Stellungen); zwischen
 * ihnen wird pro Winkelkanal kubisch interpoliert (Catmull-Rom), erst danach
 * wird die Geometrie gebacken (figurPose). Segmentlängen bleiben dadurch
 * exakt, der Schläger schwingt in Bögen statt über Sehnen-Abkürzungen.
 */
import type {
  AnimationsPhase,
  BahnPunkt,
  FigurKeyframe,
  JointId,
  Pose,
  Stellung,
} from '../../datenmodell'
import { BODEN_Y, figurPose } from './figur'

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

/* ---------- Winkel-Interpolation für Figur-Animationen ---------- */

/**
 * Interpolations-Kanäle einer Stellung. Defaults werden VOR der Interpolation
 * aufgelöst (kopf ?? rumpf, eindreh ?? 12, Seit-Winkel ?? 0, beinSeit ±4,
 * flugHoehe ?? 0) — sonst würde z. B. ein einzelner gesetzter kopf-Winkel
 * gegen wechselnde rumpf-Defaults springen.
 */
function stellungZuKanaelen(s: Stellung): number[] {
  return [
    s.huefte.x,
    s.huefte.y,
    s.rumpf,
    s.kopf ?? s.rumpf,
    s.oberarm,
    s.unterarm,
    s.schlaeger,
    s.obL,
    s.unL,
    s.obR,
    s.unR,
    s.eindreh ?? 12,
    s.oberarmSeit ?? 0,
    s.unterarmSeit ?? 0,
    s.schlaegerSeit ?? 0,
    s.beinSeitL ?? -4,
    s.beinSeitR ?? 4,
    s.flugHoehe ?? 0,
  ]
}

function kanaeleZuStellung(w: number[]): Stellung {
  return {
    huefte: { x: w[0]!, y: w[1]! },
    rumpf: w[2]!,
    kopf: w[3]!,
    oberarm: w[4]!,
    unterarm: w[5]!,
    schlaeger: w[6]!,
    obL: w[7]!,
    unL: w[8]!,
    obR: w[9]!,
    unR: w[10]!,
    eindreh: w[11]!,
    oberarmSeit: w[12]!,
    unterarmSeit: w[13]!,
    schlaegerSeit: w[14]!,
    beinSeitL: w[15]!,
    beinSeitR: w[16]!,
    flugHoehe: w[17]!,
  }
}

/**
 * Stellung zum Zeitpunkt t — kubische Hermite-Interpolation (Catmull-Rom)
 * PRO WINKELKANAL über alle Keyframes:
 *
 * - Tangenten: nicht-uniforme Catmull-Rom-Gewichtung (Bessel/Overhauser)
 *   m_i = (Δt_i·s_{i−1} + Δt_{i−1}·s_i) / (Δt_{i−1} + Δt_i) mit den
 *   Sekanten s = Δw/Δt — bei uniformen Zeiten exakt die zentrale finite
 *   Differenz (w_{i+1} − w_{i−1}) / (t_{i+1} − t_{i−1}). Die Gewichtung
 *   zugunsten des KÜRZEREN Nachbarsegments hält das Tempo eines schnellen
 *   Anschwungs am Keyframe durch (Kontakt!), statt es vom langen, langsamen
 *   Ausschwung-Segment herunterziehen zu lassen. Ränder Tangente 0;
 *   `halt: true` erzwingt Tangente 0 (bewusster Stopp).
 * - Durch die durchgehende Tangente an inneren Keyframes gibt es keinen
 *   Smoothstep-Stopp mehr am Kontakt-Keyframe (Durchschwung!), leichtes
 *   Überschwingen wirkt bei Schlagbewegungen natürlich.
 * - KEIN Winkel-Wrapping: Rohwerte interpolieren ist gewollt
 *   (55° → −135° schwingt über oben, genau wie in den Daten gemeint).
 * - Halte-Segmente (Kanalwert links = rechts) bleiben exakt konstant,
 *   damit eine stehende Figur nicht durch Nachbar-Tangenten „atmet".
 */
export function interpoliereStellung(keyframes: FigurKeyframe[], t: number): Stellung {
  if (keyframes.length === 0) throw new Error('Leere Keyframe-Liste')
  const n = keyframes.length
  const werte = keyframes.map((k) => stellungZuKanaelen(k.s))
  if (n === 1 || t <= keyframes[0]!.t) return kanaeleZuStellung(werte[0]!)
  if (t >= keyframes[n - 1]!.t) return kanaeleZuStellung(werte[n - 1]!)

  const { i, u } = findeSegment(keyframes, t)
  const t0 = keyframes[i]!.t
  const t1 = keyframes[i + 1]!.t
  const dt = t1 - t0
  if (dt <= 0) return kanaeleZuStellung(werte[i]!)

  /** Tangente (Wert-Einheit pro ms) am Knoten j für Kanal k. */
  const tangente = (j: number, k: number): number => {
    if (keyframes[j]!.halt || j === 0 || j === n - 1) return 0
    const dtVor = keyframes[j]!.t - keyframes[j - 1]!.t
    const dtNach = keyframes[j + 1]!.t - keyframes[j]!.t
    const sVor = (werte[j]![k]! - werte[j - 1]![k]!) / dtVor
    const sNach = (werte[j + 1]![k]! - werte[j]![k]!) / dtNach
    // Schlagmoment: kein Abbremsen — schnellere Sekante bestimmt das Tempo (A2)
    if (keyframes[j]!.schlag) return Math.abs(sVor) >= Math.abs(sNach) ? sVor : sNach
    return (dtNach * sVor + dtVor * sNach) / (dtVor + dtNach)
  }

  const u2 = u * u
  const u3 = u2 * u
  const h00 = 2 * u3 - 3 * u2 + 1
  const h10 = u3 - 2 * u2 + u
  const h01 = -2 * u3 + 3 * u2
  const h11 = u3 - u2

  const out: number[] = []
  for (let k = 0; k < werte[0]!.length; k++) {
    const w0 = werte[i]![k]!
    const w1 = werte[i + 1]![k]!
    if (w0 === w1) {
      out.push(w0) // Halte-Segment: konstant
      continue
    }
    out.push(h00 * w0 + h10 * dt * tangente(i, k) + h01 * w1 + h11 * dt * tangente(i + 1, k))
  }
  return kanaeleZuStellung(out)
}

/** Pose zum Zeitpunkt t einer Figur-Animation (Winkel-Interpolation + Geometrie). */
export function figurPoseZuZeit(stellungen: FigurKeyframe[], t: number): Pose {
  return figurPose(t, interpoliereStellung(stellungen, t))
}

/**
 * Fuß-Aufsetzzeitpunkte (Übergang Luft → Boden) — Grundlage der
 * Aufsetz-Marker im Player. Hysterese gegen Flackern: ein Fuß gilt erst
 * ab 1,0 Einheiten über dem Boden als „in der Luft" und ab 0,4 wieder
 * als „aufgesetzt" (flacher Split-Step-Hüpfer: ~1,2).
 */
export function fussAufsetzer(
  stellungen: FigurKeyframe[],
  schrittMs = 20,
): { t: number; fuss: 'L' | 'R' }[] {
  if (stellungen.length === 0) return []
  const ende = stellungen[stellungen.length - 1]!.t
  const out: { t: number; fuss: 'L' | 'R' }[] = []
  let bodenL = true
  let bodenR = true
  for (let t = 0; t <= ende; t += schrittMs) {
    const j = figurPoseZuZeit(stellungen, t).joints
    const abstandL = BODEN_Y - j.fussL.y
    const abstandR = BODEN_Y - j.fussR.y
    if (bodenL && abstandL > 1.0) bodenL = false
    else if (!bodenL && abstandL < 0.4) {
      bodenL = true
      out.push({ t, fuss: 'L' })
    }
    if (bodenR && abstandR > 1.0) bodenR = false
    else if (!bodenR && abstandR < 0.4) {
      bodenR = true
      out.push({ t, fuss: 'R' })
    }
  }
  return out
}

/**
 * Position auf einer Bahn zum Zeitpunkt t — undefined außerhalb des
 * Zeitfensters (Shuttle erscheint/verschwindet).
 *
 * `easing: 'smooth'` beschleunigt/bremst pro Segment (Smoothstep) — für
 * Läufer auf Wegpunkt-Bahnen. Shuttles bleiben 'linear' (Bézier-gesampelt,
 * dort steckt die Kurve schon in den Punkten).
 */
export function interpoliereBahn(
  punkte: BahnPunkt[],
  t: number,
  easing: 'linear' | 'smooth' = 'linear',
): { x: number; y: number; z?: number } | undefined {
  if (punkte.length === 0) return undefined
  if (t < punkte[0]!.t || t > punkte[punkte.length - 1]!.t) return undefined
  const { i, u } = findeSegment(punkte, t)
  const von = punkte[i]!
  if (von.unsichtbar) return undefined
  const nach = punkte[Math.min(i + 1, punkte.length - 1)]!
  const e = easing === 'smooth' ? smoothstep(u) : u
  return {
    x: lerp(von.x, nach.x, e),
    y: lerp(von.y, nach.y, e),
    ...(von.z !== undefined || nach.z !== undefined
      ? { z: lerp(von.z ?? nach.z ?? 0, nach.z ?? von.z ?? 0, e) }
      : {}),
  }
}

/** Bereits zurückgelegter Teil einer Bahn (für animiert gezeichnete Laufwege). */
export function bahnBisJetzt(
  punkte: BahnPunkt[],
  t: number,
  easing: 'linear' | 'smooth' = 'linear',
): { x: number; y: number }[] {
  const ergebnis: { x: number; y: number }[] = []
  for (const p of punkte) {
    if (p.t <= t) ergebnis.push({ x: p.x, y: p.y })
    else break
  }
  const aktuell = interpoliereBahn(punkte, t, easing)
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
