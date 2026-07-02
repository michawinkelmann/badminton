/** Animation 13: Töten am Netz (Netz-Kill) — kurzer Stich statt Ausholen. */
import type { BewegungsAnimation } from '../../datenmodell'
import { bezierBahn } from '../../engine/pose/interpolation'

export const animNetzkill: BewegungsAnimation = {
  id: 'anim-netzkill',
  name: 'Töten am Netz (Netz-Kill)',
  typ: 'figur',
  dauerMs: 2000,
  kontaktT: 690,
  netzX: 74,
  beschreibung:
    'Zu hohe Bälle über der Kante werden sofort nach unten getötet. Die Kunst: maximal kurzer Schlag — sonst droht die Netzberührung (Fehler!).',
  stellungen: [
    // Bereit am Netz: Schlägerkopf über Kantenhöhe
    { t: 0, s: {
      huefte: { x: 38.5, y: 58 },
      rumpf: -86,
      oberarm: -32, unterarm: -16, schlaeger: -24,
      obL: 102, unL: 84, obR: 66, unR: 100,
      eindreh: 6, oberarmSeit: 8, unterarmSeit: 6, schlaegerSeit: 4,
    } },
    // minimales Laden (nur Handgelenk)
    { t: 700, schlag: true, s: {
      huefte: { x: 38.5, y: 58 },
      rumpf: -86,
      oberarm: -30, unterarm: -20, schlaeger: -44,
      eindreh: 6, oberarmSeit: 8, unterarmSeit: 6, schlaegerSeit: 4,
      obL: 102, unL: 84, obR: 66, unR: 100,
    } },
    // Stich: kurzer Schlag nach vorn-unten, Bewegung stoppt vor dem Netz
    { t: 950, halt: true, s: {
      huefte: { x: 40.5, y: 58.5 },
      rumpf: -82,
      oberarm: -20, unterarm: 70, schlaeger: 85,
      eindreh: 8, oberarmSeit: 8, unterarmSeit: 6, schlaegerSeit: 4,
      obL: 106, unL: 86, obR: 60, unR: 96,
    } },
    // sofort wieder hoch
    { t: 1400, s: {
      huefte: { x: 38.5, y: 58 },
      rumpf: -86,
      oberarm: -32, unterarm: -16, schlaeger: -24,
      obL: 102, unL: 84, obR: 66, unR: 100,
      eindreh: 6, oberarmSeit: 8, unterarmSeit: 6, schlaegerSeit: 4,
    } },
    { t: 2000, s: {
      huefte: { x: 38.5, y: 58 },
      rumpf: -86,
      oberarm: -32, unterarm: -16, schlaeger: -24,
      obL: 102, unL: 84, obR: 66, unR: 100,
      eindreh: 6, oberarmSeit: 8, unterarmSeit: 6, schlaegerSeit: 4,
    } },
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
    ...bezierBahn({ x: 93, y: 20 }, { x: 83.61, y: -15.1 }, { x: 67.18, y: 25.11 }, 400, 690, 10, { von: 3, bis: 9.5 }),
    // Kill: flach über die Kante, direkt dahinter steil nach unten
    ...bezierBahn({ x: 67.18, y: 25.11 }, { x: 70.5, y: 26.3 }, { x: 74.5, y: 29 }, 690, 810, 8, { von: 9.5, bis: 8 }),
    ...bezierBahn({ x: 74.5, y: 29 }, { x: 78, y: 38 }, { x: 84, y: 68 }, 810, 1050, 8, { von: 8, bis: 5 }),
  ],
}
