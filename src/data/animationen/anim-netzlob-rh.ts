/** Animation 10: Netz-Lob Rückhand — vom Netz hoch und tief in die Grundlinie. */
import type { BewegungsAnimation } from '../../datenmodell'
import { ausfallschritt, grundstellung, hocke } from '../../engine/pose/figur'
import { bezierBahn } from '../../engine/pose/interpolation'

export const animNetzlobRh: BewegungsAnimation = {
  id: 'anim-netzlob-rh',
  name: 'Netz-Lob Rückhand',
  typ: 'figur',
  dauerMs: 2600,
  kontaktT: 1460,
  netzX: 80,
  beschreibung:
    'Die sichere Antwort auf den Netzdrop: den tiefen Shuttle mit kurzem Schwung hoch über den Gegner heben — Höhe schlägt Eile.',
  stellungen: [
    { t: 0, s: grundstellung(30) },
    { t: 400, s: hocke(31) },
    { t: 900, s: {
      huefte: { x: 44, y: 60 },
      rumpf: -80,
      oberarm: 22, unterarm: -110, schlaeger: -135,
      eindreh: 18, oberarmSeit: -14, unterarmSeit: -18, schlaegerSeit: -14,
      obL: 116, unL: 96, obR: 48, unR: 92,
    } },
    // tiefer Treffpunkt vor dem Knie (Rückhandseite)
    { t: 1350, schlag: true, s: {
      ...ausfallschritt(46.5, 1),
      oberarm: 81, unterarm: -28, schlaeger: 40,
      oberarmSeit: -12, unterarmSeit: -10, schlaegerSeit: -8,
    } },
    // Schwung aus dem Unterarm steil nach oben
    { t: 1700, s: {
      ...ausfallschritt(46.5, 0),
      oberarm: 26, unterarm: -72, schlaeger: -95,
      oberarmSeit: -8, unterarmSeit: -6, schlaegerSeit: -6,
    } },
    { t: 2150, s: {
      huefte: { x: 46, y: 60 },
      rumpf: -84,
      oberarm: 24, unterarm: -34, schlaeger: -36,
      eindreh: 12,
      obL: 114, unL: 94, obR: 52, unR: 96,
    } },
    { t: 2600, s: grundstellung(30) },
  ],
  phasen: [
    {
      vonT: 0, bisT: 900,
      label: 'Weg ans Netz (Rückhandseite)',
      lehrtext: 'Split-Step, dann diagonal nach vorn links. Der Schläger lädt schon im Lauf kompakt vor dem Körper.',
    },
    {
      vonT: 900, bisT: 1500,
      label: 'Tiefer Treffpunkt',
      lehrtext: 'Den fallenden Shuttle vor dem Knie nehmen — Ausfallschritt lang, Oberkörper bleibt aufrecht.',
    },
    {
      vonT: 1500, bisT: 1850,
      label: 'Schwung steil nach oben',
      lehrtext: 'Kurzer, schneller Schwung aus Unterarm und Handgelenk: hoch über den ausgestreckten Schläger eines gedachten Gegners.',
    },
    {
      vonT: 1850, bisT: 2600,
      label: 'Lösen & Mitte',
      lehrtext: 'Der hohe Lob kauft Zeit — rückwärts zur zentralen Position, Blick bleibt vorn.',
    },
  ],
  shuttleBahn: [
    // Anflug: enger Netzdrop des Gegners — Apex knapp über der Kante, dann steiler Fall
    ...bezierBahn({ x: 90, y: 16 }, { x: 85, y: 14 }, { x: 80.5, y: 26 }, 950, 1250, 8, { von: 2, bis: 1.2 }),
    ...bezierBahn({ x: 80.5, y: 26 }, { x: 77.85, y: 36.9 }, { x: 76.74, y: 61.1 }, 1250, 1460, 8, { von: 1.2, bis: 1 }),
    // Lob: steil über die Kante, hoch Richtung Grundlinie
    ...bezierBahn( { x: 76.74, y: 61.1 }, { x: 78.55, y: -10.56 }, { x: 97, y: 8 }, 1460, 2050, 12, { von: 1, bis: 1 }),
  ],
}
