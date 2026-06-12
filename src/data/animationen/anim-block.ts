/** Animation 14: Abwehr-Block gegen Smash — nur hinhalten, das Tempo schlucken. */
import type { BewegungsAnimation } from '../../datenmodell'
import { figurPose, hocke } from '../../engine/pose/figur'
import { bezierBahn } from '../../engine/pose/interpolation'

export const animBlock: BewegungsAnimation = {
  id: 'anim-block',
  name: 'Abwehr-Block gegen Smash',
  typ: 'figur',
  dauerMs: 2200,
  netzX: 86,
  beschreibung:
    'Die ruhige Antwort auf den Smash: tief stehen, Schläger vor der Hüfte — der lockere Griff nimmt dem Shuttle das Tempo und legt ihn kurz hinters Netz.',
  posen: [
    figurPose(0, hocke(44)),
    figurPose(500, hocke(44)),
    // Block: minimale Bewegung zum Shuttle, Fläche leicht geöffnet
    figurPose(950, {
      ...hocke(45),
      oberarm: 34, unterarm: -18, schlaeger: -26,
    }),
    // kurzes Nachgeben — der Schläger federt das Tempo ab
    figurPose(1200, {
      ...hocke(45),
      oberarm: 36, unterarm: -14, schlaeger: -18,
    }),
    figurPose(2200, hocke(44)),
  ],
  phasen: [
    {
      vonT: 0, bisT: 500,
      label: 'Tiefe Abwehrposition',
      lehrtext: 'Beine breit, Schwerpunkt tief, Rückhandgriff, Schläger VOR der Hüfte — so ist jede Seite schnell erreichbar.',
    },
    {
      vonT: 500, bisT: 950,
      label: 'Smash kommt',
      lehrtext: 'Ruhig bleiben, den Shuttle früh lesen. Keine große Bewegung vorbereiten — Zeit ist nicht da.',
    },
    {
      vonT: 950, bisT: 1350,
      label: 'Block — nur hinhalten',
      lehrtext: 'Der Schläger wird dem Shuttle nur entgegengehalten, der lockere Griff schluckt das Tempo. Erst im Treffmoment kurz zupacken.',
    },
    {
      vonT: 1350, bisT: 2200,
      label: 'Bereit für den nächsten',
      lehrtext: 'Der Block fällt kurz hinter dem Netz — sofort zurück in die tiefe Bereitschaft, der Angriff kann weitergehen.',
    },
  ],
  shuttleBahn: [
    ...bezierBahn({ x: 97, y: 4 }, { x: 82, y: 22 }, { x: 76, y: 38 }, 450, 900, 8, { von: 10, bis: 7.5 }),
    ...bezierBahn({ x: 76, y: 38 }, { x: 82, y: 20 }, { x: 94, y: 36 }, 980, 1600, 10, { von: 7.5, bis: 2 }),
  ],
}
