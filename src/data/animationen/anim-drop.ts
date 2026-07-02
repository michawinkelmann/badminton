/** Animation 2: Überkopf-Drop — gleiche Ausholbewegung wie der Clear (Täuschung!). */
import type { BewegungsAnimation } from '../../datenmodell'
import { ausholungUeberkopf, grundstellung, treffpunktHoch } from '../../engine/pose/figur'
import { bezierBahn } from '../../engine/pose/interpolation'

export const animDrop: BewegungsAnimation = {
  id: 'anim-drop',
  name: 'Überkopf-Drop',
  typ: 'figur',
  dauerMs: 2800,
  kontaktT: 1480,
  beschreibung:
    'Sieht aus wie ein Clear — wird aber kurz hinter dem Netz langsam: Das Tempo wird erst im Treffpunkt herausgenommen, nicht im Ausholen.',
  stellungen: [
    { t: 0, s: grundstellung(44) },
    { t: 700, s: {
      huefte: { x: 43, y: 58 },
      rumpf: -96,
      oberarm: -128, unterarm: -68, schlaeger: -58,
      obL: 97, unL: 82, obR: 68, unR: 99,
      eindreh: 72, oberarmSeit: 4,
    } },
    { t: 1300, s: ausholungUeberkopf(42) },
    { t: 1480, schlag: true, s: treffpunktHoch(45, -76) },
    // weicher, kurzer Ausschwung — kein Durchschlagen
    { t: 1850, s: {
      huefte: { x: 46, y: 57.5 },
      rumpf: -86,
      oberarm: -40, unterarm: -18, schlaeger: 2,
      eindreh: 15, oberarmSeit: 8,
      obL: 102, unL: 84, obR: 70, unR: 98,
    } },
    { t: 2800, s: grundstellung(45) },
  ],
  phasen: [
    {
      vonT: 0, bisT: 700,
      label: 'Auftakt wie beim Clear',
      lehrtext: 'Identische Vorbereitung: seitlich eindrehen, Ellbogen hoch — der Gegner darf den Drop nicht erkennen.',
    },
    {
      vonT: 700, bisT: 1400,
      label: 'Ausholen — volle Täuschung',
      lehrtext: 'Auch das Ausholen bleibt gleich schnell wie beim Clear. Wer hier langsamer wird, verrät den Schlag.',
    },
    {
      vonT: 1400, bisT: 1650,
      label: 'Treffpunkt: Tempo raus',
      lehrtext: 'Hoher Treffpunkt vor dem Körper — aber statt durchzuziehen wird der Shuttle nur „gestreichelt": Handgelenk fest, Fläche führt kurz.',
    },
    {
      vonT: 1650, bisT: 2800,
      label: 'Kurzer Ausschwung',
      lehrtext: 'Der Arm läuft nur kurz aus. Sofort zurück zur Mitte — nach einem Drop kommt oft die Antwort ans Netz.',
    },
  ],
  shuttleBahn: [
    ...bezierBahn({ x: 98, y: 22 }, { x: 80.06, y: 0.59 }, { x: 57.12, y: 12.19 }, 650, 1480, 10, { von: 4, bis: 9 }),
    ...bezierBahn( { x: 57.12, y: 12.19 }, { x: 70.06, y: 8.59 }, { x: 82, y: 34 }, 1480, 2200, 10, { von: 9, bis: 5 }),
  ],
}
