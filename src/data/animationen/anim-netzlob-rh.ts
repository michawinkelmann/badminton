/** Animation 10: Netz-Lob Rückhand — vom Netz hoch und tief in die Grundlinie. */
import type { BewegungsAnimation } from '../../datenmodell'
import { ausfallschritt, figurPose, grundstellung, hocke } from '../../engine/pose/figur'
import { bezierBahn } from '../../engine/pose/interpolation'

export const animNetzlobRh: BewegungsAnimation = {
  id: 'anim-netzlob-rh',
  name: 'Netz-Lob Rückhand',
  typ: 'figur',
  dauerMs: 2600,
  netzX: 80,
  beschreibung:
    'Die sichere Antwort auf den Netzdrop: den tiefen Shuttle mit kurzem Schwung hoch über den Gegner heben — Höhe schlägt Eile.',
  posen: [
    figurPose(0, grundstellung(30)),
    figurPose(400, hocke(31)),
    figurPose(900, {
      huefte: { x: 44, y: 60 },
      rumpf: -80,
      oberarm: 22, unterarm: -110, schlaeger: -135,
      eindreh: 18, oberarmSeit: -14, unterarmSeit: -18, schlaegerSeit: -14,
      obL: 116, unL: 96, obR: 48, unR: 92,
    }),
    // tiefer Treffpunkt vor dem Knie (Rückhandseite)
    figurPose(1350, {
      ...ausfallschritt(48, 1),
      oberarm: 81, unterarm: -28, schlaeger: 40,
      oberarmSeit: -12, unterarmSeit: -10, schlaegerSeit: -8,
    }),
    // Schwung aus dem Unterarm steil nach oben
    figurPose(1700, {
      ...ausfallschritt(48, 0),
      oberarm: 35, unterarm: -60, schlaeger: -85,
      oberarmSeit: -8, unterarmSeit: -6, schlaegerSeit: -6,
    }),
    figurPose(2150, {
      huefte: { x: 46, y: 60 },
      rumpf: -84,
      oberarm: 24, unterarm: -34, schlaeger: -36,
      eindreh: 12,
      obL: 114, unL: 94, obR: 52, unR: 96,
    }),
    figurPose(2600, grundstellung(30)),
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
    ...bezierBahn({ x: 90, y: 16 }, { x: 84, y: 10 }, { x: 74, y: 50 }, 950, 1330, 12, { von: 2, bis: -0.5 }),
    ...bezierBahn({ x: 74, y: 51 }, { x: 82, y: -2 }, { x: 97, y: 8 }, 1420, 2050, 10, { von: -0.5, bis: 1 }),
  ],
}
