/** Animation 9: Netzdrop Vorhand — früher, hoher Treffpunkt, eng über die Kante. */
import type { BewegungsAnimation } from '../../datenmodell'
import { ausfallschritt, figurPose, grundstellung, hocke } from '../../engine/pose/figur'
import { bezierBahn } from '../../engine/pose/interpolation'

export const animNetzdrop: BewegungsAnimation = {
  id: 'anim-netzdrop',
  name: 'Netzdrop Vorhand',
  typ: 'figur',
  dauerMs: 2600,
  netzX: 82,
  beschreibung:
    'Vom T-Punkt ans Netz: Je früher und höher der Treffpunkt, desto enger lässt sich der Shuttle über die Kante legen.',
  posen: [
    figurPose(0, grundstellung(30)),
    figurPose(400, hocke(31)),
    // Weg nach vorn, Schläger hebt schon im Lauf
    figurPose(900, {
      huefte: { x: 44, y: 60 },
      rumpf: -80,
      oberarm: 12, unterarm: -22, schlaeger: -18,
      eindreh: 16, oberarmSeit: 8,
      obL: 116, unL: 96, obR: 48, unR: 92,
    }),
    // Ausfallschritt: Arm weit vorgestreckt, Treffpunkt nahe Kantenhöhe
    figurPose(1400, {
      ...ausfallschritt(49, 0),
      oberarm: 57, unterarm: -63, schlaeger: -50,
    }),
    // zartes Nachgeben des Handgelenks
    figurPose(1650, {
      ...ausfallschritt(49, 0),
      oberarm: 57, unterarm: -58, schlaeger: -34,
    }),
    // rückwärts lösen
    figurPose(2100, {
      huefte: { x: 46, y: 60 },
      rumpf: -84,
      oberarm: 28, unterarm: -30, schlaeger: -30,
      eindreh: 12, oberarmSeit: 6,
      obL: 114, unL: 94, obR: 52, unR: 96,
    }),
    figurPose(2600, grundstellung(30)),
  ],
  phasen: [
    {
      vonT: 0, bisT: 400,
      label: 'Split-Step am T-Punkt',
      lehrtext: 'Der Auftakthüpfer landet genau im gegnerischen Schlagmoment — daraus entsteht der schnelle erste Schritt.',
    },
    {
      vonT: 400, bisT: 1200,
      label: 'Weg ans Netz',
      lehrtext: 'Schläger schon im Lauf anheben! Wer mit hängendem Schläger ankommt, trifft zu tief unter der Kante.',
    },
    {
      vonT: 1200, bisT: 1700,
      label: 'Früher, hoher Treffpunkt',
      lehrtext: 'Langer Ausfallschritt, Arm weit vorgestreckt — den Shuttle so früh wie möglich nehmen und nur über die Kante „tropfen" lassen.',
    },
    {
      vonT: 1700, bisT: 2600,
      label: 'Rückwärts zur Mitte',
      lehrtext: 'Über das vordere Bein abdrücken und rückwärts lösen — der Blick bleibt am Netz, die Antwort kann sofort kommen.',
    },
  ],
  shuttleBahn: [
    ...bezierBahn({ x: 94, y: 20 }, { x: 85, y: 24 }, { x: 73, y: 31.5 }, 1000, 1390, 8, { von: 4, bis: 8 }),
    ...bezierBahn({ x: 73, y: 31.5 }, { x: 79, y: 22 }, { x: 86, y: 36 }, 1430, 1950, 8, { von: 8, bis: 6 }),
  ],
}
