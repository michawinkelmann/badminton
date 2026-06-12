/** Animation 12: Langer Aufschlag (Vorhand) — hoch und bis ganz nach hinten. */
import type { BewegungsAnimation } from '../../datenmodell'
import { figurPose, grundstellung } from '../../engine/pose/figur'
import { bezierBahn } from '../../engine/pose/interpolation'

export const animAufschlagLang: BewegungsAnimation = {
  id: 'anim-aufschlag-lang',
  name: 'Aufschlag lang (Vorhand)',
  typ: 'figur',
  dauerMs: 2800,
  netzX: 86,
  beschreibung:
    'Der Standard im Einzel: hoher Bogen bis in die hintere Aufschlagzone — der Shuttle fällt senkrecht und ist schwer anzugreifen.',
  posen: [
    // Schrittstellung, Gewicht hinten
    figurPose(0, {
      huefte: { x: 40, y: 58 },
      rumpf: -92,
      oberarm: 95, unterarm: 70, schlaeger: 95,
      eindreh: 28, oberarmSeit: 10,
      obL: 102, unL: 88, obR: 70, unR: 96,
    }),
    // Ausholen hinten-unten
    figurPose(700, {
      huefte: { x: 39, y: 58 },
      rumpf: -96,
      oberarm: 128, unterarm: 108, schlaeger: 145,
      eindreh: 30, oberarmSeit: 14, unterarmSeit: 8,
      obL: 100, unL: 84, obR: 66, unR: 100,
    }),
    // Treffpunkt vor dem Körper, Fläche öffnet nach oben
    figurPose(1300, {
      huefte: { x: 42, y: 57.5 },
      rumpf: -86,
      oberarm: 68, unterarm: 28, schlaeger: 25,
      eindreh: 22, oberarmSeit: 8, unterarmSeit: 4, schlaegerSeit: 2,
      obL: 106, unL: 90, obR: 64, unR: 94,
    }),
    // hoher Durchschwung über die linke Schulter
    figurPose(1900, {
      huefte: { x: 43, y: 57.5 },
      rumpf: -84,
      oberarm: -52, unterarm: -88, schlaeger: -118,
      eindreh: 10, oberarmSeit: -2, unterarmSeit: -8, schlaegerSeit: -10,
      obL: 108, unL: 90, obR: 62, unR: 94,
    }),
    figurPose(2800, grundstellung(42)),
  ],
  phasen: [
    {
      vonT: 0, bisT: 700,
      label: 'Schrittstellung, Gewicht hinten',
      lehrtext: 'Linker Fuß vorn (Rechtshänder), Gewicht auf dem hinteren Bein, Shuttle vor dem Körper — Ruhe vor dem Schwung.',
    },
    {
      vonT: 700, bisT: 1300,
      label: 'Schwung von unten',
      lehrtext: 'Der Schläger schwingt in einem Bogen von hinten-unten nach vorn. Beide Füße bleiben bis zum Treffpunkt am Boden (Regel!).',
    },
    {
      vonT: 1300, bisT: 1550,
      label: 'Treffpunkt vor dem Körper',
      lehrtext: 'Unterhalb der Taille treffen, die Fläche zeigt schräg nach oben — Hüfte und Gewicht schieben in den Schlag.',
    },
    {
      vonT: 1550, bisT: 2800,
      label: 'Durchschwung & Grundposition',
      lehrtext: 'Vollständig über die gegenüberliegende Schulter ausschwingen — dann sofort in die zentrale Position, der Return kommt.',
    },
  ],
  shuttleBahn: [
    // vor dem Körper gehalten, beim Schwungbeginn fallen gelassen
    { t: 0, x: 60, y: 48, z: 5 },
    { t: 1080, x: 60, y: 48, z: 5 },
    { t: 1295, x: 67, y: 56.5, z: 7 },
    ...bezierBahn({ x: 68, y: 57 }, { x: 82, y: -12 }, { x: 97, y: 40 }, 1300, 2300, 12, { von: 7, bis: 2 }),
  ],
}
