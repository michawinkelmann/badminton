/**
 * Dev-Werkzeug: Kontaktbögen ALLER Animationen an den Phasenmitten
 * (= Stepper-Anker) zur Sichtprüfung. Aktiv nur mit POSE_SNAPSHOTS=1.
 *
 *   POSE_SNAPSHOTS=1 npx vitest run src/dev/snapshots.test.ts
 */
import { describe, expect, it } from 'vitest'
import { mkdirSync, writeFileSync } from 'node:fs'
import type { BewegungsAnimation, Pose } from '../datenmodell'
import { BODEN_Y, FRONT_MITTE, figurTeile, frontTeile } from '../engine/pose/figur'
import { bahnBisJetzt, interpoliereBahn, interpolierePose } from '../engine/pose/interpolation'
import { COURT, courtLinienOben, seitenAnsicht } from '../engine/pose/court'
import { alleAnimationen } from '../data/animationen'

const aktiv = process.env.POSE_SNAPSHOTS === '1'
const F = { court: '#0e6b4a', kork: '#b4793b', signal: '#f5c518', linie: '#fbfbf6', tinte: '#15241d', boden: '#eef0ea' }
const S = COURT.skala

function xml(text: string): string {
  return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}

function phasenMitten(a: BewegungsAnimation): { t: number; label: string }[] {
  return a.phasen.map((p, i) => ({
    t: p.vonT + (p.bisT - p.vonT) / 2,
    label: `${i + 1}·${p.label}`,
  }))
}

/* ---------- Figur-Frame (100×100) ---------- */
function frontFrame(a: BewegungsAnimation, t: number): string {
  const pose = interpolierePose(a.posen, t)
  const teile = frontTeile(pose)
  const shuttle = a.shuttleBahn ? interpoliereBahn(a.shuttleBahn, t) : undefined
  const fx = (z?: number) => FRONT_MITTE + (z ?? 7)
  const out: string[] = [
    `<rect width="100" height="100" fill="${F.boden}"/>`,
    `<line x1="2" y1="${BODEN_Y}" x2="98" y2="${BODEN_Y}" stroke="${F.tinte}" stroke-opacity="0.3" stroke-width="0.8"/>`,
  ]
  if (a.netzX !== undefined) {
    out.push(`<line x1="4" y1="${BODEN_Y - 62}" x2="96" y2="${BODEN_Y - 62}" stroke="${F.tinte}" stroke-opacity="0.4" stroke-width="1.2" stroke-dasharray="3 2"/>`)
  }
  for (const g of [...teile.linien].sort((x, y) => x.tiefe - y.tiefe)) {
    out.push(`<line x1="${g.x1}" y1="${g.y1}" x2="${g.x2}" y2="${g.y2}" stroke="${F.court}" stroke-width="${g.dick}" stroke-linecap="round"/>`)
  }
  out.push(`<circle cx="${teile.kopf.x}" cy="${teile.kopf.y}" r="${teile.kopf.r}" fill="${F.court}"/>`)
  out.push(
    `<line x1="${teile.schlaegerLinie.x1}" y1="${teile.schlaegerLinie.y1}" x2="${teile.schlaegerLinie.x2}" y2="${teile.schlaegerLinie.y2}" stroke="${F.kork}" stroke-width="1.6" stroke-linecap="round"/>`,
    `<ellipse cx="${teile.schlaegerKopf.x}" cy="${teile.schlaegerKopf.y}" rx="4.2" ry="2.8" transform="rotate(${teile.schlaegerKopf.winkel} ${teile.schlaegerKopf.x} ${teile.schlaegerKopf.y})" fill="none" stroke="${F.kork}" stroke-width="1.3"/>`,
  )
  if (shuttle) out.push(`<circle cx="${fx(shuttle.z)}" cy="${shuttle.y}" r="1.7" fill="${F.signal}" stroke="${F.tinte}" stroke-width="0.5"/>`)
  return out.join('')
}

function figurFrame(a: BewegungsAnimation, t: number): string {
  const pose: Pose = interpolierePose(a.posen, t)
  const teile = figurTeile(pose)
  const shuttle = a.shuttleBahn ? interpoliereBahn(a.shuttleBahn, t) : undefined
  const spur = [250, 190, 130, 70].map((d) =>
    interpolierePose(a.posen, Math.max(0, t - d)).joints.schlaegerKopf,
  )
  const out: string[] = [
    `<rect width="100" height="100" fill="${F.boden}"/>`,
    `<line x1="2" y1="${BODEN_Y}" x2="98" y2="${BODEN_Y}" stroke="${F.tinte}" stroke-opacity="0.3" stroke-width="0.8"/>`,
  ]
  if (a.netzX !== undefined) {
    out.push(
      `<line x1="${a.netzX}" y1="${BODEN_Y}" x2="${a.netzX}" y2="${BODEN_Y - 62}" stroke="${F.tinte}" stroke-width="1"/>`,
      `<line x1="${a.netzX - 1.6}" y1="${BODEN_Y - 62}" x2="${a.netzX + 1.6}" y2="${BODEN_Y - 62}" stroke="${F.tinte}" stroke-width="1.6" stroke-linecap="round"/>`,
    )
  }
  spur.forEach((p, i) =>
    out.push(`<circle cx="${p.x}" cy="${p.y}" r="1.1" fill="${F.kork}" opacity="${0.12 + (i / 3) * 0.3}"/>`),
  )
  for (const g of teile.glieder) {
    out.push(
      `<line x1="${g.x1}" y1="${g.y1}" x2="${g.x2}" y2="${g.y2}" stroke="${F.court}" stroke-opacity="${g.hinten ? 0.45 : 1}" stroke-width="${g.dick}" stroke-linecap="round"/>`,
    )
  }
  out.push(`<circle cx="${teile.kopf.x}" cy="${teile.kopf.y}" r="${teile.kopf.r}" fill="${F.court}"/>`)
  out.push(
    `<line x1="${teile.schlaegerLinie.x1}" y1="${teile.schlaegerLinie.y1}" x2="${teile.schlaegerLinie.x2}" y2="${teile.schlaegerLinie.y2}" stroke="${F.kork}" stroke-width="1.6" stroke-linecap="round"/>`,
    `<ellipse cx="${teile.schlaegerKopf.x}" cy="${teile.schlaegerKopf.y}" rx="4.2" ry="2.8" transform="rotate(${teile.schlaegerKopf.winkel} ${teile.schlaegerKopf.x} ${teile.schlaegerKopf.y})" fill="none" stroke="${F.kork}" stroke-width="1.3"/>`,
  )
  if (shuttle) out.push(`<circle cx="${shuttle.x}" cy="${shuttle.y}" r="1.7" fill="${F.signal}" stroke="${F.tinte}" stroke-width="0.5"/>`)
  return out.join('')
}

/* ---------- Court-Frame oben (auf 100×50 skaliert in eine 100×100-Zelle) ---------- */
function courtFrameOben(a: BewegungsAnimation, t: number, modus?: 'einzel' | 'doppel'): string {
  const out: string[] = [`<rect width="100" height="100" fill="${F.boden}"/>`]
  // Court 616×284 → Skalierung in 96×44, zentriert (y-Versatz 28)
  out.push(`<g transform="translate(2,28) scale(0.1558)">`)
  out.push(`<rect x="0" y="0" width="${13.4 * S}" height="${6.1 * S}" fill="${F.court}"/>`)
  for (const z of (a.zonen ?? []).filter((z) => t >= z.vonT && t <= z.bisT && (!z.modus || z.modus === modus))) {
    out.push(
      `<rect x="${z.x * S}" y="${z.y * S}" width="${z.breite * S}" height="${z.hoehe * S}" fill="${F.signal}" fill-opacity="0.4" stroke="${F.signal}" stroke-width="2"/>`,
    )
  }
  for (const l of courtLinienOben()) {
    out.push(`<line x1="${l.x1 * S}" y1="${l.y1 * S}" x2="${l.x2 * S}" y2="${l.y2 * S}" stroke="${F.linie}" stroke-width="${l.staerke * S}"/>`)
  }
  out.push(`<line x1="${6.7 * S}" y1="-6" x2="${6.7 * S}" y2="${6.1 * S + 6}" stroke="${F.tinte}" stroke-width="3" stroke-dasharray="6 4"/>`)
  for (const sp of a.spieler ?? []) {
    const weg = bahnBisJetzt(sp.bahn, t)
    if (weg.length > 1)
      out.push(
        `<polyline points="${weg.map((p) => `${p.x * S},${p.y * S}`).join(' ')}" fill="none" stroke="${sp.seite === 'a' ? F.signal : F.linie}" stroke-width="2.5" stroke-dasharray="7 6" opacity="0.85"/>`,
      )
    const pos = interpoliereBahn(sp.bahn, Math.min(Math.max(t, sp.bahn[0]!.t), sp.bahn[sp.bahn.length - 1]!.t)) ?? sp.bahn[0]!
    out.push(
      `<circle cx="${pos.x * S}" cy="${pos.y * S}" r="10" fill="${sp.seite === 'a' ? F.signal : F.linie}" stroke="${F.tinte}" stroke-width="1.5"/>`,
      `<text x="${pos.x * S}" y="${pos.y * S + 4}" text-anchor="middle" font-size="11" font-weight="800" fill="${F.tinte}">${sp.label}</text>`,
    )
  }
  const shuttle = a.shuttleBahn ? interpoliereBahn(a.shuttleBahn, t) : undefined
  if (shuttle) out.push(`<circle cx="${shuttle.x * S}" cy="${shuttle.y * S}" r="6" fill="${F.linie}" stroke="${F.tinte}" stroke-width="2"/>`)
  out.push('</g>')
  return out.join('')
}

/* ---------- Court-Frame Seite ---------- */
function courtFrameSeite(a: BewegungsAnimation, t: number): string {
  const seite = seitenAnsicht()
  const out: string[] = [`<rect width="100" height="100" fill="${F.boden}"/>`]
  out.push(`<g transform="translate(2,16) scale(0.1666)">`)
  out.push(`<line x1="0" y1="${seite.bodenY}" x2="${13.4 * S}" y2="${seite.bodenY}" stroke="${F.tinte}" stroke-width="2.5"/>`)
  out.push(`<line x1="${seite.netz.x}" y1="${seite.netz.vonY}" x2="${seite.netz.x}" y2="${seite.netz.bisY}" stroke="${F.tinte}" stroke-width="3"/>`)
  for (const b of a.bahnen ?? []) {
    const teil = bahnBisJetzt(b.punkte, t)
    if (teil.length > 1)
      out.push(
        `<polyline points="${teil.map((p) => `${p.x * S},${seite.hoehePx(p.y)}`).join(' ')}" fill="none" stroke="${F.court}" stroke-width="2.5" stroke-dasharray="2 5"/>`,
      )
    const fliegt = interpoliereBahn(b.punkte, t)
    if (fliegt) out.push(`<circle cx="${fliegt.x * S}" cy="${seite.hoehePx(fliegt.y)}" r="6" fill="${F.signal}" stroke="${F.tinte}" stroke-width="1.5"/>`)
  }
  out.push('</g>')
  return out.join('')
}

/** Eine Zeile = eine Animation; Figuren bekommen Seite (oben) + Front (unten). */
function zeile(a: BewegungsAnimation, modus?: 'einzel' | 'doppel'): { svg: string; hoehe: number } {
  const mitten = phasenMitten(a)
  const istFigur = a.typ === 'figur'
  const frames = mitten.map((m, i) => {
    const label = xml(m.label.length > 30 ? m.label.slice(0, 29) + '…' : m.label)
    if (istFigur) {
      return `<g transform="translate(${i * 103},10)">${figurFrame(a, m.t)}<g transform="translate(0,101)">${frontFrame(a, m.t)}</g><text x="50" y="206" text-anchor="middle" font-size="3.4" fill="${F.tinte}">${label} (t=${Math.round(m.t)})</text><rect width="100" height="201" fill="none" stroke="${F.tinte}" stroke-opacity="0.2" stroke-width="0.4"/></g>`
    }
    const inhalt =
      (a.courtAnsicht ?? 'oben') === 'oben'
        ? courtFrameOben(a, m.t, modus)
        : courtFrameSeite(a, m.t)
    return `<g transform="translate(${i * 103},10)">${inhalt}<text x="50" y="99" text-anchor="middle" font-size="3.4" fill="${F.tinte}">${label} (t=${Math.round(m.t)})</text><rect width="100" height="100" fill="none" stroke="${F.tinte}" stroke-opacity="0.2" stroke-width="0.4"/></g>`
  })
  const titel = xml(modus ? `${a.name} [${modus}]` : a.name)
  return {
    svg: `<g><text x="2" y="7" font-size="4.5" font-weight="bold" fill="${F.tinte}">${titel}</text>${frames.join('')}</g>`,
    hoehe: istFigur ? 222 : 114,
  }
}

describe.skipIf(!aktiv)('Audit-Kontaktbögen', () => {
  it('rendert alle Animationen an den Stepper-Frames', () => {
    mkdirSync('/tmp/pose-snapshots', { recursive: true })
    const zeilen: { svg: string; hoehe: number }[] = []
    for (const a of alleAnimationen) {
      zeilen.push(zeile(a, a.umschaltbar ? 'einzel' : undefined))
      if (a.umschaltbar) zeilen.push(zeile(a, 'doppel'))
    }
    // Bögen à max. 2 Zeilen (Figur-Zeilen sind doppelt hoch)
    let nr = 1
    for (let i = 0; i < zeilen.length; i += 2) {
      const teil = zeilen.slice(i, i + 2)
      let y = 0
      const inhalt = teil
        .map((z) => {
          const g = `<g transform="translate(0,${y})">${z.svg}</g>`
          y += z.hoehe
          return g
        })
        .join('')
      const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 620 ${y}" width="1860" height="${y * 3}"><rect width="620" height="${y}" fill="white"/>${inhalt}</svg>`
      writeFileSync(`/tmp/pose-snapshots/audit-${String(nr).padStart(2, '0')}.svg`, svg)
      nr++
    }
    expect(nr).toBeGreaterThan(1)
  })
})
