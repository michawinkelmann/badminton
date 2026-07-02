/**
 * Gesamtverifikation Teil A (Schritt 6, UMSETZUNG-STAND):
 *  H1 Segment-Schrumpfung  → Ziel: < 2 % überall
 *  H2 Kontakt-Distanz      → Ziel: < 3 Einheiten überall
 *  H4 Kontakt-Tempo        → Ziel: > 50 % vom Peak (Schlag-Animationen)
 *  H7 Fußbodenkontakt      → Ziel: 0 ± 0,5 auf Boden (außer Flugphasen)
 *
 * Ausführen (tsx nötig):  node --import tsx docs/review/analyse-neu.ts
 */
import { alleAnimationen } from '../../src/data/animationen/index'
import {
  figurPoseZuZeit,
  interpoliereBahn,
  interpoliereStellung,
} from '../../src/engine/pose/interpolation'
import { BODEN_Y, SEGMENT } from '../../src/engine/pose/figur'

const d2 = (a: { x: number; y: number }, b: { x: number; y: number }) =>
  Math.hypot(a.x - b.x, a.y - b.y)

const SEGS = [
  { name: 'Oberarm', von: 'schulter', bis: 'ellbogen', soll: SEGMENT.oberarm },
  { name: 'Unterarm', von: 'ellbogen', bis: 'handgelenk', soll: SEGMENT.unterarm },
  { name: 'Schläger', von: 'handgelenk', bis: 'schlaegerKopf', soll: SEGMENT.schlaeger },
  { name: 'Rumpf', von: 'huefte', bis: 'schulter', soll: SEGMENT.rumpf },
  { name: 'OberschenkelL', von: 'huefte', bis: 'knieL', soll: SEGMENT.oberschenkel },
  { name: 'UnterschenkelL', von: 'knieL', bis: 'fussL', soll: SEGMENT.unterschenkel },
  { name: 'OberschenkelR', von: 'huefte', bis: 'knieR', soll: SEGMENT.oberschenkel },
  { name: 'UnterschenkelR', von: 'knieR', bis: 'fussR', soll: SEGMENT.unterschenkel },
] as const

const figuren = alleAnimationen.filter((a) => a.typ === 'figur' && a.stellungen)
let fehler = 0

console.log('=== H1: Segment-Schrumpfung (xy vs. Soll, Maximum über t) — Ziel < 2 % ===')
for (const a of figuren) {
  let schlimmste = { seg: '', proz: -Infinity, t: 0 }
  for (let t = 0; t <= a.dauerMs; t += 10) {
    const j = figurPoseZuZeit(a.stellungen!, t).joints as Record<string, { x: number; y: number }>
    for (const s of SEGS) {
      const proz = (1 - d2(j[s.von]!, j[s.bis]!) / s.soll) * 100
      if (proz > schlimmste.proz) schlimmste = { seg: s.name, proz, t }
    }
  }
  const ok = schlimmste.proz < 2
  if (!ok) fehler++
  console.log(
    `${a.id.padEnd(22)} max ${schlimmste.proz.toFixed(3)} % (${schlimmste.seg} @t=${schlimmste.t}) ${ok ? 'OK' : '!! ZIEL VERFEHLT'}`,
  )
}

console.log('\n=== H2: Kontakt-Distanz — Ziel < 3 Einheiten ===')
for (const a of figuren) {
  if (a.kontaktT === undefined || !a.shuttleBahn) continue
  const sh = interpoliereBahn(a.shuttleBahn, a.kontaktT)
  const tip = figurPoseZuZeit(a.stellungen!, a.kontaktT).joints.schlaegerKopf
  const d = sh ? d2(tip, sh) : Infinity
  const ok = d < 3
  if (!ok) fehler++
  console.log(`${a.id.padEnd(22)} d=${d.toFixed(2)} (≈${((d / 40) * 100).toFixed(1)} cm) ${ok ? 'OK' : '!! ZIEL VERFEHLT'}`)
}

console.log('\n=== H4: Schlägerkopf-Tempo am Kontakt — Ziel > 50 % vom Peak im Schlagfenster (±300 ms) ===')
// Peak im Fenster um den Kontakt: misst den SCHLAG (A2). Läufe ans Netz
// (Körpertranslation trägt den Schlägerkopf, z. B. Netzdrop) verzerren den
// globalen Peak — er wird informativ mit ausgewiesen.
for (const a of figuren) {
  if (a.kontaktT === undefined) continue
  let peakGlobal = { t: 0, v: 0 }
  let peakFenster = { t: 0, v: 0 }
  let vKontakt = 0
  let prev = figurPoseZuZeit(a.stellungen!, 0).joints.schlaegerKopf
  for (let t = 10; t <= a.dauerMs; t += 10) {
    const cur = figurPoseZuZeit(a.stellungen!, t).joints.schlaegerKopf
    const v = d2(prev, cur)
    if (v > peakGlobal.v) peakGlobal = { t, v }
    if (Math.abs(t - a.kontaktT) <= 300 && v > peakFenster.v) peakFenster = { t, v }
    if (Math.abs(t - a.kontaktT) <= 5) vKontakt = v
    prev = cur
  }
  const proz = (vKontakt / peakFenster.v) * 100
  const global = (vKontakt / peakGlobal.v) * 100
  const ok = proz > 50
  if (!ok) fehler++
  console.log(
    `${a.id.padEnd(22)} Kontakt ${proz.toFixed(0)} % vom Fenster-Peak (@t=${peakFenster.t}, Versatz ${peakFenster.t - a.kontaktT} ms) | global ${global.toFixed(0)} % ${ok ? 'OK' : '!! ZIEL VERFEHLT'}`,
  )
}

console.log('\n=== H7: Fußbodenkontakt (tieferer Fuß vs. BODEN_Y) — Ziel 0 ± 0,5 außer Flug ===')
for (const a of figuren) {
  let maxAbw = 0
  let flugMax = 0
  for (let t = 0; t <= a.dauerMs; t += 10) {
    const s = interpoliereStellung(a.stellungen!, t)
    const j = figurPoseZuZeit(a.stellungen!, t).joints
    const tiefster = Math.max(j.fussL.y, j.fussR.y)
    const flug = s.flugHoehe ?? 0
    if (flug > 0.01) {
      flugMax = Math.max(flugMax, BODEN_Y - tiefster)
    } else {
      maxAbw = Math.max(maxAbw, Math.abs(tiefster - BODEN_Y))
    }
  }
  const ok = maxAbw <= 0.5
  if (!ok) fehler++
  console.log(
    `${a.id.padEnd(22)} Abweichung ±${maxAbw.toFixed(3)}${flugMax > 0 ? ` | Flug bis ${flugMax.toFixed(1)}` : ''} ${ok ? 'OK' : '!! ZIEL VERFEHLT'}`,
  )
}

console.log(fehler === 0 ? '\nALLE ZIELE ERREICHT ✓' : `\n!! ${fehler} ZIELVERFEHLUNGEN`)
