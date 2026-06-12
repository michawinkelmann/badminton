/** Animation 13: Töten am Netz (Netz-Kill) — kurzer Stich statt Ausholen. */
import type { BewegungsAnimation } from '../../datenmodell'
import { figurPose } from '../../engine/pose/figur'
import { bezierBahn } from '../../engine/pose/interpolation'

export const animNetzkill: BewegungsAnimation = {
  id: 'anim-netzkill',
  name: 'Töten am Netz (Netz-Kill)',
  typ: 'figur',
  dauerMs: 2000,
  netzX: 74,
  beschreibung:
    'Zu hohe Bälle über der Kante werden sofort nach unten getötet. Die Kunst: maximal kurzer Schlag — sonst droht die Netzberührung (Fehler!).',
  posen: [
    // Bereit am Netz: Schlägerkopf über Kantenhöhe
    figurPose(0, {
      huefte: { x: 40, y: 58 },
      rumpf: -86,
      oberarm: -32, unterarm: -16, schlaeger: -24,
      obL: 102, unL: 84, obR: 66, unR: 100,
      eindreh: 6, oberarmSeit: 8, unterarmSeit: 6, schlaegerSeit: 4,
    }),
    // minimales Laden (nur Handgelenk)
    figurPose(700, {
      huefte: { x: 40, y: 58 },
      rumpf: -86,
      oberarm: -30, unterarm: -20, schlaeger: -44,
      eindreh: 6, oberarmSeit: 8, unterarmSeit: 6, schlaegerSeit: 4,
      obL: 102, unL: 84, obR: 66, unR: 100,
    }),
    // Stich: kurzer Schlag nach vorn-unten, Bewegung stoppt vor dem Netz
    figurPose(950, {
      huefte: { x: 42, y: 58.5 },
      rumpf: -82,
      oberarm: -8, unterarm: 10, schlaeger: 45,
      eindreh: 8, oberarmSeit: 8, unterarmSeit: 6, schlaegerSeit: 4,
      obL: 106, unL: 86, obR: 60, unR: 96,
    }),
    // sofort wieder hoch
    figurPose(1400, {
      huefte: { x: 40, y: 58 },
      rumpf: -86,
      oberarm: -32, unterarm: -16, schlaeger: -24,
      obL: 102, unL: 84, obR: 66, unR: 100,
      eindreh: 6, oberarmSeit: 8, unterarmSeit: 6, schlaegerSeit: 4,
    }),
    figurPose(2000, {
      huefte: { x: 40, y: 58 },
      rumpf: -86,
      oberarm: -32, unterarm: -16, schlaeger: -24,
      obL: 102, unL: 84, obR: 66, unR: 100,
      eindreh: 6, oberarmSeit: 8, unterarmSeit: 6, schlaegerSeit: 4,
    }),
  ],
  phasen: [
    {
      vonT: 0, bisT: 700,
      label: 'Schläger oben halten',
      lehrtext: 'Am Netz gehört der Schlägerkopf über die Kantenhöhe — nur so ist der Kill ohne Ausholen möglich.',
    },
    {
      vonT: 700, bisT: 1100,
      label: 'Kurzer Stich — kein Ausholen!',
      lehrtext: 'Nur das Handgelenk „hackt" steil nach unten. Die Bewegung stoppt VOR dem Netz — Netzberührung wäre ein Fehler.',
    },
    {
      vonT: 1100, bisT: 2000,
      label: 'Sofort wieder hoch',
      lehrtext: 'Nach dem Kill schnappt der Schläger direkt zurück über die Kante — falls der Gegner doch noch an den Ball kommt.',
    },
  ],
  shuttleBahn: [
    ...bezierBahn({ x: 93, y: 20 }, { x: 86, y: 21 }, { x: 72, y: 27 }, 400, 790, 10, { von: 3, bis: 9.5 }),
    ...bezierBahn({ x: 72, y: 27 }, { x: 78, y: 30 }, { x: 84, y: 68 }, 790, 1050, 10, { von: 9.5, bis: 5 }),
  ],
}
