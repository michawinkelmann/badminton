/** Dump der ALTEN gebackenen Posen als Referenz für Bodenanker + Bahn-Rekalibrierung. */
import { writeFileSync } from 'node:fs'
import { alleAnimationen } from '/sessions/hopeful-gifted-einstein/mnt/Badminton/src/data/animationen/index'
import { interpolierePose } from '/sessions/hopeful-gifted-einstein/mnt/Badminton/src/engine/pose/interpolation'

const KONTAKTE: Record<string, number> = {
  'anim-clear': 1450, 'anim-drop': 1480, 'anim-smash': 1400,
  'anim-sprungsmash': 1300, 'anim-rh-clear': 1500, 'anim-drive-vh': 800,
  'anim-drive-rh': 800, 'anim-unterhand-clear': 1400, 'anim-netzdrop': 1410,
  'anim-netzlob-rh': 1420, 'anim-aufschlag-kurz': 1150, 'anim-aufschlag-lang': 1300,
  'anim-netzkill': 790, 'anim-block': 950,
}

const out: Record<string, unknown> = {}
for (const a of alleAnimationen) {
  if (a.typ !== 'figur') continue
  const keyframes = a.posen.map((p) => ({
    t: p.t,
    maxFussY: Math.max(p.joints.fussL.y, p.joints.fussR.y),
    huefte: { x: p.joints.huefte.x, y: p.joints.huefte.y },
  }))
  const tiefsterStand = Math.max(...keyframes.map((k) => k.maxFussY))
  const kt = KONTAKTE[a.id]
  const tip = kt !== undefined ? interpolierePose(a.posen, kt).joints.schlaegerKopf : undefined
  out[a.id] = {
    dauerMs: a.dauerMs,
    tiefsterStand,
    keyframes: keyframes.map((k) => ({
      ...k,
      // relative Flughöhe des Keyframes über dem tiefsten Stand der Animation
      relHoehe: +(tiefsterStand - k.maxFussY).toFixed(2),
    })),
    ...(kt !== undefined && tip
      ? { kontaktT: kt, altKontaktTip: { x: +tip.x.toFixed(2), y: +tip.y.toFixed(2), z: +(tip.z ?? 0).toFixed(2) } }
      : {}),
  }
}
writeFileSync('/sessions/hopeful-gifted-einstein/mnt/Badminton/docs/review/alte-messwerte.json', JSON.stringify(out, null, 1))
console.log('geschrieben: docs/review/alte-messwerte.json —', Object.keys(out).length, 'Animationen')
