/**
 * Seedbarer Zufall (mulberry32) — macht Auslosungen testbar und reproduzierbar.
 */
export type Rng = () => number

export function erzeugeRng(seed = Date.now()): Rng {
  let a = seed >>> 0
  return () => {
    a |= 0
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

/** Fisher-Yates, nicht mutierend. */
export function mische<T>(liste: T[], rng: Rng): T[] {
  const kopie = [...liste]
  for (let i = kopie.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1))
    ;[kopie[i], kopie[j]] = [kopie[j]!, kopie[i]!]
  }
  return kopie
}
