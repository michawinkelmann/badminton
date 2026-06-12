/** Animation 5: Rückhand-Überkopf-Clear — der Notschlag aus der tiefen Rückhand-Ecke. */
import type { BewegungsAnimation } from '../../datenmodell'
import { figurPose, grundstellung } from '../../engine/pose/figur'
import { bezierBahn } from '../../engine/pose/interpolation'

export const animRhClear: BewegungsAnimation = {
  id: 'anim-rh-clear',
  name: 'Rückhand-Überkopf-Clear',
  typ: 'figur',
  dauerMs: 2800,
  beschreibung:
    'Wenn Umlaufen nicht mehr geht: mit dem Rücken zum Netz aus kurzer Bewegung befreien. Kraft kommt aus der Unterarm-Außenrotation — „der Daumen schiebt".',
  posen: [
    figurPose(0, grundstellung(44)),
    // Eindrehen: Rücken zeigt Richtung Netz, Ellbogen hebt zum Shuttle
    figurPose(800, {
      huefte: { x: 43, y: 58 },
      rumpf: -76,
      kopf: -58,
      oberarm: -38, unterarm: 115, schlaeger: 150,
      eindreh: 55, oberarmSeit: -26, unterarmSeit: -8,
      obL: 96, unL: 84, obR: 70, unR: 96,
    }),
    // Treffpunkt: Arm schnellt gestreckt nach oben-vorn
    figurPose(1500, {
      huefte: { x: 44, y: 57.5 },
      rumpf: -80,
      kopf: -62,
      oberarm: -48, unterarm: -50, schlaeger: -46,
      eindreh: 38, oberarmSeit: -24, unterarmSeit: -12, schlaegerSeit: -10,
      obL: 100, unL: 84, obR: 68, unR: 98,
    }),
    // kompakt zurück
    figurPose(1950, {
      huefte: { x: 45, y: 57.5 },
      rumpf: -84,
      oberarm: -10, unterarm: 35, schlaeger: 60,
      eindreh: 18, oberarmSeit: -4,
      obL: 102, unL: 86, obR: 68, unR: 96,
    }),
    figurPose(2800, grundstellung(45)),
  ],
  phasen: [
    {
      vonT: 0, bisT: 800,
      label: 'Eindrehen — Rücken zum Netz',
      lehrtext: 'In die Ecke drehen, der Rücken zeigt Richtung Netz. Der Ellbogen hebt und zeigt zum Shuttle — das ist das Visier des Schlags.',
    },
    {
      vonT: 800, bisT: 1430,
      label: 'Kompakte Spannung',
      lehrtext: 'Kein großes Ausholen wie bei der Vorhand! Der Unterarm ist angewinkelt, die Spannung sitzt in Unterarm und Handgelenk.',
    },
    {
      vonT: 1430, bisT: 1640,
      label: 'Treffpunkt: Daumen schiebt',
      lehrtext: 'Kurzer „Peitschenschlag" aus der Unterarm-Außenrotation, der Daumen drückt gegen den Griff. Treffpunkt hoch über der Schulter.',
    },
    {
      vonT: 1640, bisT: 2800,
      label: 'Zurückdrehen',
      lehrtext: 'Die Bewegung stoppt kompakt, kein Durchschwingen. Sofort ausdrehen und zurück zur Mitte arbeiten.',
    },
  ],
  shuttleBahn: [
    ...bezierBahn({ x: 98, y: 24 }, { x: 84, y: 0 }, { x: 70, y: 11 }, 700, 1480, 10, { von: 4, bis: -3.5 }),
    ...bezierBahn({ x: 70, y: 11 }, { x: 84, y: -6 }, { x: 99, y: 10 }, 1520, 2150, 10, { von: -3.5, bis: 0 }),
  ],
}
