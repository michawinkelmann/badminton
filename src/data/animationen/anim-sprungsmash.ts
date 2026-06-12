/** Animation 4: Sprungsmash — Absprung, Schere in der Luft, federnde Landung. */
import type { BewegungsAnimation } from '../../datenmodell'
import { figurPose, grundstellung } from '../../engine/pose/figur'
import { bezierBahn } from '../../engine/pose/interpolation'

export const animSprungsmash: BewegungsAnimation = {
  id: 'anim-sprungsmash',
  name: 'Sprungsmash',
  typ: 'figur',
  dauerMs: 3000,
  beschreibung:
    'Der Smash aus dem Sprung: noch höherer Treffpunkt, noch steilerer Winkel. Entscheidend sind das Timing des Absprungs und die Landung.',
  posen: [
    figurPose(0, grundstellung(44)),
    // Absprunghocke mit Armspannung
    figurPose(800, {
      huefte: { x: 43, y: 62 },
      rumpf: -94,
      oberarm: -120, unterarm: -55, schlaeger: -45,
      obL: 112, unL: 70, obR: 60, unR: 108,
      eindreh: 68, oberarmSeit: 5, beinSeitL: -8, beinSeitR: 8,
    }),
    // Flug: Treffpunkt im höchsten Punkt, Beine scheren
    figurPose(1300, {
      huefte: { x: 45, y: 49 },
      rumpf: -88,
      kopf: -95,
      oberarm: -64, unterarm: -60, schlaeger: -54,
      obL: 52, unL: 96, obR: 128, unR: 78,
      eindreh: 32, oberarmSeit: 8, unterarmSeit: 6, schlaegerSeit: 4, beinSeitL: -7, beinSeitR: 7,
    }),
    // Landung: hinteres Bein setzt zuerst, Knie federn
    figurPose(1750, {
      huefte: { x: 47, y: 61 },
      rumpf: -80,
      oberarm: 30, unterarm: 70, schlaeger: 95,
      obL: 118, unL: 92, obR: 50, unR: 102,
      eindreh: 14, oberarmSeit: 8, beinSeitL: -9, beinSeitR: 9,
    }),
    figurPose(3000, grundstellung(46)),
  ],
  phasen: [
    {
      vonT: 0, bisT: 800,
      label: 'Timing & Absprunghocke',
      lehrtext: 'Erst springen, wenn der Shuttle fällt! Tief in die Hocke, Arm bereits gespannt — der Absprung geht nach OBEN, nicht nach vorn.',
    },
    {
      vonT: 800, bisT: 1230,
      label: 'Absprung',
      lehrtext: 'Beidbeinig explosiv abdrücken. Die Hüfte dreht im Flug ein, der Ellbogen führt nach oben.',
    },
    {
      vonT: 1230, bisT: 1430,
      label: 'Treffpunkt im höchsten Punkt',
      lehrtext: 'Im Scheitelpunkt des Sprungs treffen — vor dem Körper, Fläche abwärts. Die Beine scheren: Schlagbein nach vorn.',
    },
    {
      vonT: 1430, bisT: 2100,
      label: 'Schere & Landung',
      lehrtext: 'Das hintere Bein landet zuerst und drückt sofort nach vorn ab. Landung federnd über die Ballen — nie steifbeinig!',
    },
    {
      vonT: 2100, bisT: 3000,
      label: 'Aufrichten & Rückweg',
      lehrtext: 'Aus der Landung direkt in den ersten Schritt Richtung Mitte — der Sprung ist erst mit dem Rückweg vollständig.',
    },
  ],
  shuttleBahn: [
    ...bezierBahn({ x: 98, y: 14 }, { x: 78, y: -2 }, { x: 64, y: 3 }, 550, 1280, 10, { von: 4, bis: 9 }),
    ...bezierBahn({ x: 64, y: 3 }, { x: 74, y: 30 }, { x: 90, y: 84 }, 1330, 1650, 10, { von: 9, bis: 3 }),
  ],
}
