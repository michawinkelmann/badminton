/**
 * Figur-Geometrie (§8.1), 3D-lite: Posen werden über Winkel in der
 * Seitenebene PLUS optionale Seitwinkel (Tiefe z) definiert. Daraus entstehen
 * zwei synchrone Projektionen:
 *   Seite  = (x, y)  — exakt wie bisher (z beeinflusst sie nicht)
 *   Front  = (50 + z, y) — Blick vom Netz, wie im Spiegel (+z = rechte Hand)
 *
 * Winkelkonvention Seitenebene (y nach unten): 0° = rechts (zum Netz),
 * 90° = unten, 180° = links, -90° = oben. Figur blickt nach RECHTS.
 * Seitwinkel: + = zur rechten Körperseite hinaus, − = zur linken.
 */
import type { Pose, Stellung } from '../../datenmodell'

export type { Stellung } from '../../datenmodell'

export const BODEN_Y = 92
export const FRONT_MITTE = 50
/** Front-Fallback-Tiefe für Shuttle/Spur ohne z: Seite des Schlagarms. */
export const FRONT_SCHLAGSEITE_Z = 7

/** Segmentlängen im 0–100-Raum (Figur ≈ 1,80 m ≈ 72 Einheiten → 1 m ≈ 40). */
export const SEGMENT = {
  kopfRadius: 5,
  hals: 4.5,
  rumpf: 21,
  oberarm: 10.5,
  unterarm: 10.5,
  schlaeger: 13,
  oberschenkel: 13.5,
  unterschenkel: 13.5,
} as const

/** Halbe Schulter-/Hüftbreite im z-Raum. */
export const SCHULTER_HALB = 6.5
export const HUEFTE_HALB = 3.5

const rad = (g: number) => (g * Math.PI) / 180

/** z-Position der Schlagschulter abhängig vom Eindrehen (0 frontal … 90 seitlich). */
export function schulterZ(eindreh: number): number {
  return SCHULTER_HALB * Math.cos(rad(eindreh))
}

/** Halbe Hüftbreite in der Front (Hüfte dreht weniger mit als die Schulter). */
export function hueftZ(eindreh: number): number {
  return HUEFTE_HALB * Math.cos(rad(eindreh * 0.7))
}

export function winkelPunkt(
  von: { x: number; y: number },
  winkelGrad: number,
  laenge: number,
): { x: number; y: number } {
  return {
    x: von.x + Math.cos(rad(winkelGrad)) * laenge,
    y: von.y + Math.sin(rad(winkelGrad)) * laenge,
  }
}

/**
 * Stellung → Pose (11 Gelenke mit x, y, z + Eindreh-Meta).
 *
 * Boden-Verankerung (A3): Der tiefste Fuß steht exakt auf BODEN_Y; die ganze
 * Figur wird entsprechend verschoben. `huefte.y` wirkt damit relativ (die
 * Hüfthöhe folgt den Beinwinkeln). Sprünge heben die Figur über
 * `flugHoehe` explizit vom Boden ab.
 */
export function figurPose(t: number, s: Stellung): Pose {
  const schulterXY = winkelPunkt(s.huefte, s.rumpf, SEGMENT.rumpf)
  const nackenXY = winkelPunkt(schulterXY, s.rumpf, SEGMENT.hals * 0.5)
  const kopfXY = winkelPunkt(nackenXY, s.kopf ?? s.rumpf, SEGMENT.hals + SEGMENT.kopfRadius)
  const ellbogenXY = winkelPunkt(schulterXY, s.oberarm, SEGMENT.oberarm)
  const handgelenkXY = winkelPunkt(ellbogenXY, s.unterarm, SEGMENT.unterarm)
  const schlaegerKopfXY = winkelPunkt(handgelenkXY, s.schlaeger, SEGMENT.schlaeger)
  const knieLXY = winkelPunkt(s.huefte, s.obL, SEGMENT.oberschenkel)
  const fussLXY = winkelPunkt(knieLXY, s.unL, SEGMENT.unterschenkel)
  const knieRXY = winkelPunkt(s.huefte, s.obR, SEGMENT.oberschenkel)
  const fussRXY = winkelPunkt(knieRXY, s.unR, SEGMENT.unterschenkel)

  // Boden-Verankerung: tiefster Fuß auf BODEN_Y minus Flughöhe
  const dy = BODEN_Y - Math.max(fussLXY.y, fussRXY.y) - (s.flugHoehe ?? 0)
  for (const p of [
    schulterXY, nackenXY, kopfXY, ellbogenXY, handgelenkXY, schlaegerKopfXY,
    knieLXY, fussLXY, knieRXY, fussRXY,
  ]) {
    p.y += dy
  }
  const huefteXY = { x: s.huefte.x, y: s.huefte.y + dy }

  // Tiefe: Arm hängt an der Schlagschulter, Beine an den Hüftseiten
  const eindreh = s.eindreh ?? 12
  const zS = schulterZ(eindreh)
  const zEllbogen = zS + Math.sin(rad(s.oberarmSeit ?? 0)) * SEGMENT.oberarm
  const zHandgelenk = zEllbogen + Math.sin(rad(s.unterarmSeit ?? 0)) * SEGMENT.unterarm
  const zSchlaegerKopf = zHandgelenk + Math.sin(rad(s.schlaegerSeit ?? 0)) * SEGMENT.schlaeger
  const zH = hueftZ(eindreh)
  const seitL = s.beinSeitL ?? -4
  const seitR = s.beinSeitR ?? 4
  const zKnieL = -zH + Math.sin(rad(seitL)) * SEGMENT.oberschenkel
  const zFussL = zKnieL + Math.sin(rad(seitL)) * SEGMENT.unterschenkel
  const zKnieR = zH + Math.sin(rad(seitR)) * SEGMENT.oberschenkel
  const zFussR = zKnieR + Math.sin(rad(seitR)) * SEGMENT.unterschenkel

  return {
    t,
    meta: { eindreh },
    joints: {
      kopf: { ...kopfXY, z: 0 },
      nacken: { ...nackenXY, z: 0 },
      schulter: { ...schulterXY, z: zS },
      ellbogen: { ...ellbogenXY, z: zEllbogen },
      handgelenk: { ...handgelenkXY, z: zHandgelenk },
      schlaegerKopf: { ...schlaegerKopfXY, z: zSchlaegerKopf },
      huefte: { ...huefteXY, z: 0 },
      knieL: { ...knieLXY, z: zKnieL },
      fussL: { ...fussLXY, z: zFussL },
      knieR: { ...knieRXY, z: zKnieR },
      fussR: { ...fussRXY, z: zFussR },
    },
  }
}

/* ---------- Wiederverwendbare Stellungs-Bausteine (visuell verifiziert) ---------- */

/** Aufrechte Grundstellung mit Schläger in Vorhalte. */
export function grundstellung(x = 44): Stellung {
  return {
    huefte: { x, y: 57.5 },
    rumpf: -88,
    oberarm: 55,
    unterarm: -25,
    schlaeger: -40,
    obL: 99, unL: 86,
    obR: 76, unR: 96,
    eindreh: 10,
    oberarmSeit: 4,
  }
}

/**
 * Überkopf-Ausholung: voll seitlich, Bogenspannung, Schläger fällt hinter den Rücken.
 * Winkel-REPRÄSENTATION bewusst < −180°: unterarm −218° ≡ 142°, schlaeger −255° ≡ 105°.
 * Die Interpolation lerpt Rohwerte — so fällt der Schläger RÜCKWÄRTS über die
 * Schulter (vorheriger Keyframe ≈ −60°) und peitscht anschließend ÜBER KOPF
 * nach vorn zum Treffpunkt (≈ −70°), statt vorn-unten durchzupendeln.
 */
export function ausholungUeberkopf(x = 42): Stellung {
  return {
    huefte: { x, y: 58 },
    rumpf: -99,
    kopf: -84,
    oberarm: -135,
    unterarm: -218,
    schlaeger: -255,
    obL: 96, unL: 80,
    obR: 62, unR: 100,
    eindreh: 78,
    oberarmSeit: 5,
    unterarmSeit: 4,
  }
}

/** Hoher Treffpunkt vor dem Körper — beim Treffen ist der Rumpf aufgedreht. */
export function treffpunktHoch(x = 45, vorlage = -80): Stellung {
  return {
    huefte: { x, y: 57.5 },
    rumpf: -86,
    kopf: -95,
    oberarm: vorlage,
    unterarm: vorlage + 4,
    schlaeger: vorlage + 8,
    obL: 102, unL: 84,
    obR: 70, unR: 98,
    eindreh: 32,
    oberarmSeit: 8,
    unterarmSeit: 6,
    schlaegerSeit: 5,
  }
}

/** Ausschwung nach vorn-unten mit Gewichtsübernahme. */
export function ausschwung(x = 47): Stellung {
  return {
    huefte: { x, y: 57 },
    rumpf: -84,
    oberarm: 5,
    unterarm: 45,
    schlaeger: 70,
    obL: 108, unL: 88,
    obR: 64, unR: 92,
    eindreh: 12,
    oberarmSeit: 8,
  }
}

/** Tiefer Ausfallschritt zum Netz (rechtes Bein vorn, Knie über Fuß). */
export function ausfallschritt(x = 52, tief = 0): Stellung {
  return {
    huefte: { x, y: 63 + tief },
    rumpf: -76,
    oberarm: 8,
    unterarm: -6,
    schlaeger: -14,
    obL: 138, unL: 112,
    obR: 38, unR: 88,
    eindreh: 16,
    oberarmSeit: 10,
    beinSeitL: -6,
    beinSeitR: 2,
  }
}

/** Abwehr-/Bereitschaftshocke (tief, breit, Schläger vor dem Körper). */
export function hocke(x = 44): Stellung {
  return {
    huefte: { x, y: 61.5 },
    rumpf: -84,
    oberarm: 38,
    unterarm: -32,
    schlaeger: -42,
    obL: 108, unL: 78,
    obR: 64, unR: 104,
    eindreh: 5,
    oberarmSeit: 6,
    beinSeitL: -9,
    beinSeitR: 9,
  }
}

/* ---------- Render-Geometrie: SEITE (React-Player UND Snapshot) ---------- */

export interface FigurTeile {
  glieder: {
    x1: number; y1: number; x2: number; y2: number; dick: number
    hinten?: boolean
    /** Schlagarm (Ober-/Unterarm) — wird im Player hervorgehoben. */
    arm?: boolean
  }[]
  gelenke: { x: number; y: number }[]
  kopf: { x: number; y: number; r: number }
  schlaegerLinie: { x1: number; y1: number; x2: number; y2: number }
  schlaegerKopf: { x: number; y: number; winkel: number; rx: number; ry: number }
}

export function figurTeile(pose: Pose): FigurTeile {
  const j = pose.joints
  const strich = (
    a: { x: number; y: number },
    b: { x: number; y: number },
    dick: number,
    hinten = false,
    arm = false,
  ) => ({ x1: a.x, y1: a.y, x2: b.x, y2: b.y, dick, hinten, arm })

  const schlaegerWinkel =
    (Math.atan2(j.schlaegerKopf.y - j.handgelenk.y, j.schlaegerKopf.x - j.handgelenk.x) * 180) /
    Math.PI

  return {
    glieder: [
      strich(j.huefte, j.knieL, 2.6, true),
      strich(j.knieL, j.fussL, 2.6, true),
      strich(j.huefte, j.knieR, 2.6),
      strich(j.knieR, j.fussR, 2.6),
      strich(j.huefte, j.schulter, 3),
      strich(j.schulter, j.nacken, 3),
      strich(j.schulter, j.ellbogen, 2.6, false, true),
      strich(j.ellbogen, j.handgelenk, 2.6, false, true),
    ],
    gelenke: [j.schulter, j.ellbogen, j.handgelenk, j.huefte, j.knieL, j.knieR],
    kopf: { x: j.kopf.x, y: j.kopf.y, r: SEGMENT.kopfRadius },
    schlaegerLinie: {
      x1: j.handgelenk.x,
      y1: j.handgelenk.y,
      x2: j.schlaegerKopf.x,
      y2: j.schlaegerKopf.y,
    },
    schlaegerKopf: {
      x: j.schlaegerKopf.x,
      y: j.schlaegerKopf.y,
      winkel: schlaegerWinkel,
      rx: 4.2,
      ry: 2.8,
    },
  }
}

/* ---------- Render-Geometrie: FRONT (Spiegel: +z = rechts im Bild) ---------- */

export interface FrontTeile {
  /** tiefe = Seiten-x (größer = näher am Netz = näher am Betrachter) */
  linien: {
    x1: number; y1: number; x2: number; y2: number; dick: number; tiefe: number
    /** Schlagarm (Ober-/Unterarm) — wird im Player hervorgehoben. */
    arm?: boolean
  }[]
  gelenke: { x: number; y: number; tiefe: number }[]
  kopf: { x: number; y: number; r: number; tiefe: number }
  schlaegerLinie: { x1: number; y1: number; x2: number; y2: number; tiefe: number }
  schlaegerKopf: { x: number; y: number; winkel: number; rx: number; ry: number; tiefe: number }
}

export function frontTeile(pose: Pose): FrontTeile {
  const j = pose.joints
  const e = pose.meta?.eindreh ?? 12
  const fx = (z: number | undefined) => FRONT_MITTE + (z ?? 0)
  const zS = schulterZ(e)
  const zH = hueftZ(e)

  const linie = (
    a: { x: number; y: number; z?: number },
    b: { x: number; y: number; z?: number },
    dick: number,
    arm = false,
  ) => ({ x1: fx(a.z), y1: a.y, x2: fx(b.z), y2: b.y, dick, tiefe: (a.x + b.x) / 2, arm })

  const hueftL = { x: j.huefte.x, y: j.huefte.y, z: -zH }
  const hueftR = { x: j.huefte.x, y: j.huefte.y, z: zH }
  const schulterL = { x: j.schulter.x, y: j.schulter.y, z: -zS }

  const schlaegerWinkel =
    (Math.atan2(j.schlaegerKopf.y - j.handgelenk.y, fx(j.schlaegerKopf.z) - fx(j.handgelenk.z)) *
      180) /
    Math.PI

  return {
    linien: [
      // Beine ab den Hüftseiten
      linie(hueftL, j.knieL, 2.6),
      linie(j.knieL, j.fussL, 2.6),
      linie(hueftR, j.knieR, 2.6),
      linie(j.knieR, j.fussR, 2.6),
      // Hüftachse + Rumpf + Schulterachse (zeigen das Eindrehen!)
      linie(hueftL, hueftR, 3),
      linie(j.huefte, j.nacken, 3),
      linie(schulterL, j.schulter, 3),
      // Schlagarm
      linie(j.schulter, j.ellbogen, 2.6, true),
      linie(j.ellbogen, j.handgelenk, 2.6, true),
    ],
    gelenke: [
      { x: fx(j.schulter.z), y: j.schulter.y, tiefe: j.schulter.x },
      { x: fx(j.ellbogen.z), y: j.ellbogen.y, tiefe: j.ellbogen.x },
      { x: fx(j.handgelenk.z), y: j.handgelenk.y, tiefe: j.handgelenk.x },
      { x: fx(j.knieL.z), y: j.knieL.y, tiefe: j.knieL.x },
      { x: fx(j.knieR.z), y: j.knieR.y, tiefe: j.knieR.x },
    ],
    kopf: { x: fx(j.kopf.z), y: j.kopf.y, r: SEGMENT.kopfRadius, tiefe: j.kopf.x },
    schlaegerLinie: {
      x1: fx(j.handgelenk.z),
      y1: j.handgelenk.y,
      x2: fx(j.schlaegerKopf.z),
      y2: j.schlaegerKopf.y,
      tiefe: j.schlaegerKopf.x,
    },
    schlaegerKopf: {
      x: fx(j.schlaegerKopf.z),
      y: j.schlaegerKopf.y,
      winkel: schlaegerWinkel,
      rx: 4.2,
      ry: 2.8,
      tiefe: j.schlaegerKopf.x,
    },
  }
}
