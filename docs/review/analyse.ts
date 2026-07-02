/**
 * Quantitative Analyse der Bewegungs-Animationen:
 * H1 Segment-Schrumpfung durch Positions-Lerp, H2 Kontaktpräzision,
 * H3 Keyframe-Dichte, H4 Geschwindigkeitsprofil des Schlägerkopfs,
 * H7 Fußbodenkontakt.
 */
import { alleAnimationen } from '/sessions/hopeful-gifted-einstein/mnt/Badminton/src/data/animationen/index'
import { interpolierePose, interpoliereBahn } from '/sessions/hopeful-gifted-einstein/mnt/Badminton/src/engine/pose/interpolation'
import { SEGMENT, BODEN_Y } from '/sessions/hopeful-gifted-einstein/mnt/Badminton/src/engine/pose/figur'

const KONTAKTE: Record<string, number> = {
  'anim-clear': 1450, 'anim-drop': 1480, 'anim-smash': 1400,
  'anim-sprungsmash': 1300, 'anim-rh-clear': 1500, 'anim-drive-vh': 800,
  'anim-drive-rh': 800, 'anim-unterhand-clear': 1400, 'anim-netzdrop': 1410,
  'anim-netzlob-rh': 1420, 'anim-aufschlag-kurz': 1150, 'anim-aufschlag-lang': 1300,
  'anim-netzkill': 790, 'anim-block': 950,
}

const d2 = (a: {x:number,y:number}, b: {x:number,y:number}) => Math.hypot(a.x-b.x, a.y-b.y)

type Seg = { name: string; von: string; bis: string; soll: number }
const SEGS: Seg[] = [
  { name: 'Oberarm', von: 'schulter', bis: 'ellbogen', soll: SEGMENT.oberarm },
  { name: 'Unterarm', von: 'ellbogen', bis: 'handgelenk', soll: SEGMENT.unterarm },
  { name: 'Schläger', von: 'handgelenk', bis: 'schlaegerKopf', soll: SEGMENT.schlaeger },
  { name: 'Rumpf', von: 'huefte', bis: 'schulter', soll: SEGMENT.rumpf },
  { name: 'OberschenkelL', von: 'huefte', bis: 'knieL', soll: SEGMENT.oberschenkel },
  { name: 'UnterschenkelL', von: 'knieL', bis: 'fussL', soll: SEGMENT.unterschenkel },
  { name: 'OberschenkelR', von: 'huefte', bis: 'knieR', soll: SEGMENT.oberschenkel },
  { name: 'UnterschenkelR', von: 'knieR', bis: 'fussR', soll: SEGMENT.unterschenkel },
]

console.log('=== H1: Segment-Schrumpfung (xy-Länge vs. Soll, Minimum über t) ===')
for (const a of alleAnimationen) {
  if (a.typ !== 'figur') continue
  let schlimmste = { seg: '', proz: 0, t: 0 }
  const armMin: Record<string, {len:number,t:number}> = {}
  for (let t = 0; t <= a.dauerMs; t += 10) {
    const p = interpolierePose(a.posen, t)
    for (const s of SEGS) {
      const len = d2((p.joints as any)[s.von], (p.joints as any)[s.bis])
      const proz = (1 - len / s.soll) * 100
      if (proz > schlimmste.proz) schlimmste = { seg: s.name, proz, t }
      if (!armMin[s.name] || len < armMin[s.name].len) armMin[s.name] = { len, t }
    }
  }
  // Gesamter Arm+Schläger (Schulter→Schlägerkopf max. Reichweite als Referenz nicht fix — nur Segmente melden)
  const arm = ['Oberarm','Unterarm','Schläger'].map(n => `${n} −${((1-armMin[n].len/SEGS.find(s=>s.name===n)!.soll)*100).toFixed(0)}%@${armMin[n].t}`).join('  ')
  console.log(`${a.id.padEnd(22)} schlimmstes Segment: ${schlimmste.seg} −${schlimmste.proz.toFixed(1)}% @t=${schlimmste.t} | ${arm}`)
}

console.log('\n=== H2: Kontaktpräzision (Abstand Schlägerkopf↔Shuttle am Kontakt-t) ===')
for (const [id, kt] of Object.entries(KONTAKTE)) {
  const a = alleAnimationen.find(x => x.id === id)!
  if (!a.shuttleBahn) { console.log(`${id}: KEINE shuttleBahn`); continue }
  // feinste Minimalsuche ±150ms um Kontakt
  let best = { t: kt, d: Infinity }
  for (let t = kt - 150; t <= kt + 150; t += 5) {
    const sh = interpoliereBahn(a.shuttleBahn, t)
    if (!sh) continue
    const tip = interpolierePose(a.posen, t).joints.schlaegerKopf
    const d = d2(tip, sh)
    if (d < best.d) best = { t, d }
  }
  const shK = interpoliereBahn(a.shuttleBahn, kt)
  const tipK = interpolierePose(a.posen, kt).joints.schlaegerKopf
  const dK = shK ? d2(tipK, shK) : NaN
  const dzK = shK ? Math.abs((tipK.z ?? 0) - (shK.z ?? 0)) : NaN
  console.log(`${id.padEnd(22)} @Kontakt d=${dK.toFixed(1)} (≈${(dK/40*100).toFixed(0)} cm) dz=${dzK.toFixed(1)} | Minimum d=${best.d.toFixed(1)} @t=${best.t} (Versatz ${best.t-kt}ms)`)
}

console.log('\n=== H3: Keyframe-Dichte & Phasen ===')
for (const a of alleAnimationen) {
  if (a.typ !== 'figur') continue
  const ts = a.posen.map(p => p.t)
  const gaps = ts.slice(1).map((t, i) => t - ts[i])
  const kt = KONTAKTE[a.id]
  const phasenLuecken: string[] = []
  let cover = 0
  for (const ph of a.phasen) { if (ph.vonT > cover + 1) phasenLuecken.push(`Lücke ${cover}–${ph.vonT}`); cover = Math.max(cover, ph.bisT) }
  if (cover < a.dauerMs - 1) phasenLuecken.push(`Ende ${cover}<${a.dauerMs}`)
  console.log(`${a.id.padEnd(22)} ${ts.length} Posen [${ts.join(',')}] maxGap=${Math.max(...gaps)}ms${kt ? ` Kontakt@${kt}` : ''}${phasenLuecken.length ? ' PHASEN: '+phasenLuecken.join('; ') : ''}`)
}

console.log('\n=== H4: Schlägerkopf-Tempo — Peak vs. Kontakt ===')
for (const [id, kt] of Object.entries(KONTAKTE)) {
  const a = alleAnimationen.find(x => x.id === id)!
  let peak = { t: 0, v: 0 }
  let vKontakt = 0
  let prev = interpolierePose(a.posen, 0).joints.schlaegerKopf
  for (let t = 10; t <= a.dauerMs; t += 10) {
    const cur = interpolierePose(a.posen, t).joints.schlaegerKopf
    const v = d2(prev, cur) // Einheiten pro 10ms
    if (v > peak.v) peak = { t, v }
    if (Math.abs(t - kt) <= 5) vKontakt = v
    prev = cur
  }
  console.log(`${id.padEnd(22)} Peak ${peak.v.toFixed(2)} @t=${peak.t} | am Kontakt ${vKontakt.toFixed(2)} (${(vKontakt/peak.v*100).toFixed(0)}% vom Peak) | Versatz ${peak.t - kt}ms`)
}

console.log('\n=== H7: Fußbodenkontakt (fussY vs BODEN_Y=' + BODEN_Y + ', + = im Boden, − = schwebt) ===')
for (const a of alleAnimationen) {
  if (a.typ !== 'figur') continue
  let minL = Infinity, maxL = -Infinity, minR = Infinity, maxR = -Infinity
  for (let t = 0; t <= a.dauerMs; t += 10) {
    const j = interpolierePose(a.posen, t).joints
    minL = Math.min(minL, j.fussL.y); maxL = Math.max(maxL, j.fussL.y)
    minR = Math.min(minR, j.fussR.y); maxR = Math.max(maxR, j.fussR.y)
  }
  const f = (v: number) => (v - BODEN_Y).toFixed(1)
  console.log(`${a.id.padEnd(22)} fussL ${f(minL)}…${f(maxL)} | fussR ${f(minR)}…${f(maxR)}`)
}
