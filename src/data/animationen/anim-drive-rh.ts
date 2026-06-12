/** Animation 7: Drive Rückhand — Ellbogen führt, Daumen drückt. */
import type { BewegungsAnimation } from '../../datenmodell'
import { figurPose } from '../../engine/pose/figur'
import { bezierBahn } from '../../engine/pose/interpolation'

export const animDriveRh: BewegungsAnimation = {
  id: 'anim-drive-rh',
  name: 'Drive Rückhand',
  typ: 'figur',
  dauerMs: 1800,
  beschreibung:
    'Der Rückhand-Drive deckt die linke Körperseite: Schläger quer vor dem Körper laden, dann streckt der Arm — Druck kommt vom Daumen.',
  posen: [
    figurPose(0, {
      huefte: { x: 45, y: 59 },
      rumpf: -86,
      oberarm: 28, unterarm: -42, schlaeger: -28,
      obL: 104, unL: 80, obR: 66, unR: 102,
      eindreh: 8, oberarmSeit: 4, unterarmSeit: 2,
    }),
    figurPose(350, {
      huefte: { x: 45, y: 59 },
      rumpf: -86,
      oberarm: 28, unterarm: -42, schlaeger: -28,
      obL: 104, unL: 80, obR: 66, unR: 102,
      eindreh: 8, oberarmSeit: 4, unterarmSeit: 2,
    }),
    // Laden: Unterarm klappt quer vor den Körper (Rückhandseite)
    figurPose(500, {
      huefte: { x: 45, y: 59 },
      rumpf: -88,
      oberarm: 35, unterarm: -135, schlaeger: -160,
      eindreh: 12, oberarmSeit: -18, unterarmSeit: -26, schlaegerSeit: -20,
      obL: 104, unL: 80, obR: 66, unR: 102,
    }),
    // Treffpunkt: Arm streckt nach vorn, Handrücken voraus
    figurPose(800, {
      huefte: { x: 45, y: 58.5 },
      rumpf: -84,
      oberarm: -2, unterarm: -4, schlaeger: -10,
      eindreh: 10, oberarmSeit: -10, unterarmSeit: -10, schlaegerSeit: -6,
      obL: 102, unL: 82, obR: 64, unR: 100,
    }),
    figurPose(1050, {
      huefte: { x: 45, y: 59 },
      rumpf: -85,
      oberarm: 8, unterarm: 6, schlaeger: 2,
      eindreh: 8, oberarmSeit: -2,
      obL: 103, unL: 81, obR: 65, unR: 101,
    }),
    figurPose(1800, {
      huefte: { x: 45, y: 59 },
      rumpf: -86,
      oberarm: 28, unterarm: -42, schlaeger: -28,
      obL: 104, unL: 80, obR: 66, unR: 102,
      eindreh: 8, oberarmSeit: 4, unterarmSeit: 2,
    }),
  ],
  phasen: [
    {
      vonT: 0, bisT: 500,
      label: 'Vorhalte mit Rückhandgriff',
      lehrtext: 'Im Mittelfeld ist der Rückhandgriff die Grundstellung — der Daumen liegt breit an der Griffkante und gibt später den Druck.',
    },
    {
      vonT: 500, bisT: 770,
      label: 'Laden vor dem Körper',
      lehrtext: 'Der Unterarm klappt kurz quer vor den Körper, der Ellbogen zeigt zum Shuttle. Mehr Ausholweg braucht der Drive nicht.',
    },
    {
      vonT: 770, bisT: 1010,
      label: 'Treffpunkt: Daumen drückt',
      lehrtext: 'Arm streckt explosiv nach vorn, der Daumen drückt den Schläger durch den Treffpunkt — flach übers Band.',
    },
    {
      vonT: 1010, bisT: 1800,
      label: 'Zurück in die Mitte-Haltung',
      lehrtext: 'Schläger sofort wieder neutral vor den Körper — bereit für Vorhand ODER Rückhand.',
    },
  ],
  shuttleBahn: [
    ...bezierBahn({ x: 98, y: 33 }, { x: 88, y: 33 }, { x: 79, y: 34 }, 350, 780, 8, { von: 4, bis: 1.5 }),
    ...bezierBahn({ x: 79, y: 34 }, { x: 88, y: 30 }, { x: 98, y: 31 }, 820, 1200, 8, { von: 1.5, bis: 3 }),
  ],
}
