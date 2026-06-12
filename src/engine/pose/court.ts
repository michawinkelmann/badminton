/**
 * Court-Geometrie (§8.1): maßstabsgetreues Feld 13,40 m × 6,10 m.
 * Koordinaten in METERN — Draufsicht: x = Länge (0–13,40), y = Breite (0–6,10),
 * Netz bei x = 6,70. Seitenansicht: x = Länge, h = Höhe (Netz 1,55 m).
 * Render-Skalierung: 40 px pro Meter.
 */

export const COURT = {
  laenge: 13.4,
  breite: 6.1,
  netzX: 6.7,
  einzelSeitenrand: 0.46, // Abstand Einzel-Seitenlinie von außen
  kurzeAufschlagAbstand: 1.98, // von der Netzlinie
  doppelHinten: 0.76, // hintere Doppel-Aufschlaglinie von der Grundlinie
  netzHoehe: 1.55,
  skala: 40,
} as const

export interface CourtLinie {
  x1: number
  y1: number
  x2: number
  y2: number
  staerke: number
}

/** Alle Linien der Draufsicht (Meter); Einzel-/Doppelfeld unterscheidbar. */
export function courtLinienOben(): CourtLinie[] {
  const { laenge: L, breite: B, netzX, einzelSeitenrand: e, kurzeAufschlagAbstand, doppelHinten } = COURT
  const duenn = 0.04
  const kurzA = netzX - kurzeAufschlagAbstand
  const kurzB = netzX + kurzeAufschlagAbstand
  return [
    // Außenlinien (Doppelfeld)
    { x1: 0, y1: 0, x2: L, y2: 0, staerke: duenn },
    { x1: 0, y1: B, x2: L, y2: B, staerke: duenn },
    { x1: 0, y1: 0, x2: 0, y2: B, staerke: duenn },
    { x1: L, y1: 0, x2: L, y2: B, staerke: duenn },
    // Einzel-Seitenlinien
    { x1: 0, y1: e, x2: L, y2: e, staerke: duenn },
    { x1: 0, y1: B - e, x2: L, y2: B - e, staerke: duenn },
    // kurze Aufschlaglinien
    { x1: kurzA, y1: 0, x2: kurzA, y2: B, staerke: duenn },
    { x1: kurzB, y1: 0, x2: kurzB, y2: B, staerke: duenn },
    // hintere Doppel-Aufschlaglinien
    { x1: doppelHinten, y1: 0, x2: doppelHinten, y2: B, staerke: duenn },
    { x1: L - doppelHinten, y1: 0, x2: L - doppelHinten, y2: B, staerke: duenn },
    // Mittellinien (von Grundlinie bis kurze Aufschlaglinie)
    { x1: 0, y1: B / 2, x2: kurzA, y2: B / 2, staerke: duenn },
    { x1: kurzB, y1: B / 2, x2: L, y2: B / 2, staerke: duenn },
  ]
}

/** ViewBox-Werte für die Draufsicht (0,5 m Rand). */
export function viewBoxOben(): string {
  const s = COURT.skala
  const rand = 0.5 * s
  return `${-rand} ${-rand} ${COURT.laenge * s + 2 * rand} ${COURT.breite * s + 2 * rand}`
}

/** Seitenansicht: Bodenlinie, Netzpfosten/-kante, Markierungen (Meter, h nach oben). */
export interface SeitenAnsicht {
  bodenY: number // px
  netz: { x: number; vonY: number; bisY: number }
  marken: { x: number; label: string }[]
  hoehePx: (meterHoehe: number) => number
  xPx: (meterX: number) => number
}

export const SEITE_MAX_HOEHE = 4 // Meter Bildhöhe

export function seitenAnsicht(): SeitenAnsicht {
  const s = COURT.skala
  const bodenY = SEITE_MAX_HOEHE * s
  const hoehePx = (h: number) => bodenY - h * s
  const xPx = (x: number) => x * s
  return {
    bodenY,
    netz: { x: xPx(COURT.netzX), vonY: bodenY, bisY: hoehePx(COURT.netzHoehe) },
    marken: [
      { x: xPx(0), label: 'Grundlinie' },
      { x: xPx(COURT.netzX), label: 'Netz' },
      { x: xPx(COURT.laenge), label: 'Grundlinie' },
    ],
    hoehePx,
    xPx,
  }
}

export function viewBoxSeite(): string {
  const s = COURT.skala
  const rand = 0.5 * s
  return `${-rand} ${-rand} ${COURT.laenge * s + 2 * rand} ${SEITE_MAX_HOEHE * s + 2 * rand}`
}
