/** Animation 3: Smash — Treffpunkt deutlich vor dem Körper, Fläche schlägt abwärts. */
import type { BewegungsAnimation } from '../../datenmodell'
import { ausholungUeberkopf, grundstellung, treffpunktHoch } from '../../engine/pose/figur'
import { bezierBahn } from '../../engine/pose/interpolation'

export const animSmash: BewegungsAnimation = {
  id: 'anim-smash',
  name: 'Smash',
  typ: 'figur',
  dauerMs: 2600,
  kontaktT: 1400,
  beschreibung:
    'Der Punktschlag: gleiche Kette wie beim Clear, aber der Treffpunkt liegt weiter vorn — die Schlagfläche zeigt im Treffmoment schräg nach unten.',
  stellungen: [
    { t: 0, s: grundstellung(44) },
    { t: 650, s: {
      huefte: { x: 43, y: 58 },
      rumpf: -96,
      oberarm: -128, unterarm: -68, schlaeger: -58,
      obL: 97, unL: 82, obR: 68, unR: 99,
      eindreh: 72, oberarmSeit: 4,
    } },
    { t: 1250, s: ausholungUeberkopf(42) },
    { t: 1400, schlag: true, s: treffpunktHoch(46, -66) },
    // steiler Durchschwung nach vorn-unten
    { t: 1800, s: {
      huefte: { x: 48, y: 57 },
      rumpf: -82,
      oberarm: 22, unterarm: 62, schlaeger: 86,
      eindreh: 10, oberarmSeit: 8,
      obL: 110, unL: 88, obR: 62, unR: 92,
    } },
    { t: 2600, s: grundstellung(45) },
  ],
  phasen: [
    {
      vonT: 0, bisT: 650,
      label: 'Auftakt & Stellung',
      lehrtext: 'Seitlich eindrehen, hinter den Shuttle kommen — gesmashed wird nur, was VOR dem Körper liegt.',
    },
    {
      vonT: 650, bisT: 1330,
      label: 'Ausholen & Bogenspannung',
      lehrtext: 'Volle Spannung wie beim Clear. Die Höhe des Treffpunkts entscheidet über den Winkel — je höher, desto steiler.',
    },
    {
      vonT: 1330, bisT: 1560,
      label: 'Treffpunkt vor dem Körper',
      lehrtext: 'Merkbild: „über den Ball greifen". Das Handgelenk schnappt über den Shuttle, die Fläche zeigt abwärts — Winkel schlägt Kraft.',
    },
    {
      vonT: 1560, bisT: 2600,
      label: 'Steiler Ausschwung',
      lehrtext: 'Der Arm zieht steil nach vorn-unten durch, das Gewicht kommt mit. Danach sofort bereit für den Return.',
    },
  ],
  shuttleBahn: [
    ...bezierBahn({ x: 98, y: 18 }, { x: 78.78, y: 3.26 }, { x: 63.55, y: 14.53 }, 600, 1400, 10, { von: 4, bis: 9 }),
    ...bezierBahn( { x: 63.55, y: 14.53 }, { x: 74.78, y: 35.27 }, { x: 92, y: 82 }, 1400, 1750, 10, { von: 9, bis: 3 }),
  ],
}
