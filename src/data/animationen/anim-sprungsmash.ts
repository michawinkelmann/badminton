/** Animation 4: Sprungsmash — Absprung, Schere in der Luft, federnde Landung. */
import type { BewegungsAnimation } from '../../datenmodell'
import { grundstellung } from '../../engine/pose/figur'
import { bezierBahn } from '../../engine/pose/interpolation'

export const animSprungsmash: BewegungsAnimation = {
  id: 'anim-sprungsmash',
  name: 'Sprungsmash',
  typ: 'figur',
  dauerMs: 3000,
  kontaktT: 1300,
  beschreibung:
    'Der Smash aus dem Sprung: noch höherer Treffpunkt, noch steilerer Winkel. Entscheidend sind das Timing des Absprungs und die Landung.',
  stellungen: [
    { t: 0, s: grundstellung(44) },
    // Absprunghocke mit Armspannung
    { t: 800, s: {
      huefte: { x: 43, y: 62 },
      rumpf: -94,
      oberarm: -120, unterarm: -55, schlaeger: -45,
      obL: 112, unL: 70, obR: 60, unR: 108,
      eindreh: 68, oberarmSeit: 5, beinSeitL: -8, beinSeitR: 8,
    } },
    // Flug: Treffpunkt im höchsten Punkt, Beine scheren
    { t: 1300, schlag: true, s: {
      huefte: { x: 45, y: 49 },
      rumpf: -88,
      kopf: -95,
      oberarm: -64, unterarm: -60, schlaeger: -54,
      obL: 52, unL: 96, obR: 128, unR: 78,
      eindreh: 32, oberarmSeit: 8, unterarmSeit: 6, schlaegerSeit: 4, beinSeitL: -7, beinSeitR: 7,
      flugHoehe: 14.14,
    } },
    // Landung: hinteres Bein setzt zuerst, Knie federn
    { t: 1750, s: {
      huefte: { x: 47, y: 61 },
      rumpf: -80,
      oberarm: 30, unterarm: 70, schlaeger: 95,
      obL: 118, unL: 92, obR: 50, unR: 102,
      eindreh: 14, oberarmSeit: 8, beinSeitL: -9, beinSeitR: 9,
    } },
    { t: 3000, s: grundstellung(46) },
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
    ...bezierBahn({ x: 98, y: 14 }, { x: 77.61, y: -1.62 }, { x: 63.23, y: 3.76 }, 550, 1300, 10, { von: 4, bis: 9 }),
    ...bezierBahn( { x: 63.23, y: 3.76 }, { x: 73.61, y: 30.38 }, { x: 90, y: 84 }, 1300, 1650, 10, { von: 9, bis: 3 }),
  ],
}
