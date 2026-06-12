/** Animation 6: Drive Vorhand — flach, schnell, kurzer Ausholweg. */
import type { BewegungsAnimation } from '../../datenmodell'
import { figurPose } from '../../engine/pose/figur'
import { bezierBahn } from '../../engine/pose/interpolation'

export const animDriveVh: BewegungsAnimation = {
  id: 'anim-drive-vh',
  name: 'Drive Vorhand',
  typ: 'figur',
  dauerMs: 1800,
  beschreibung:
    'Das schnelle Mittelfeld-Duell: Treffpunkt vor der Brust, Ausholweg maximal 30 cm — der Schlag kommt aus Unterarm und Handgelenk.',
  posen: [
    // Vorhalte: Schläger vor dem Körper auf Brusthöhe
    figurPose(0, {
      huefte: { x: 45, y: 59 },
      rumpf: -86,
      oberarm: 28, unterarm: -42, schlaeger: -28,
      obL: 104, unL: 80, obR: 66, unR: 102,
      eindreh: 8, oberarmSeit: 6, unterarmSeit: 8,
    }),
    // kurzes Ausholen
    figurPose(500, {
      huefte: { x: 45, y: 59 },
      rumpf: -88,
      oberarm: 42, unterarm: -8, schlaeger: 30,
      eindreh: 10, oberarmSeit: 10, unterarmSeit: 14,
      obL: 104, unL: 80, obR: 66, unR: 102,
    }),
    // Treffpunkt: Arm streckt nach vorn
    figurPose(800, {
      huefte: { x: 45, y: 58.5 },
      rumpf: -84,
      oberarm: -4, unterarm: 0, schlaeger: -6,
      eindreh: 8, oberarmSeit: 10, unterarmSeit: 12, schlaegerSeit: 10,
      obL: 102, unL: 82, obR: 64, unR: 100,
    }),
    // minimaler Auslauf
    figurPose(1050, {
      huefte: { x: 45, y: 59 },
      rumpf: -85,
      oberarm: 6, unterarm: 14, schlaeger: 10,
      eindreh: 8, oberarmSeit: 8, unterarmSeit: 8, schlaegerSeit: 6,
      obL: 103, unL: 81, obR: 65, unR: 101,
    }),
    // sofort zurück in die Vorhalte
    figurPose(1800, {
      huefte: { x: 45, y: 59 },
      rumpf: -86,
      oberarm: 28, unterarm: -42, schlaeger: -28,
      obL: 104, unL: 80, obR: 66, unR: 102,
      eindreh: 8, oberarmSeit: 6, unterarmSeit: 8,
    }),
  ],
  phasen: [
    {
      vonT: 0, bisT: 500,
      label: 'Vorhalte',
      lehrtext: 'Schläger VOR dem Körper auf Brusthöhe, leicht gebeugte Knie — aus dieser Position geht es in beide Richtungen am schnellsten.',
    },
    {
      vonT: 500, bisT: 770,
      label: 'Kurzes Ausholen',
      lehrtext: 'Der Ellbogen bleibt vorn! Nur Unterarm und Handgelenk laden — wer über die Schulter ausholt, verliert das Tempo-Duell.',
    },
    {
      vonT: 770, bisT: 1010,
      label: 'Treffpunkt vor der Brust',
      lehrtext: 'Flach und hart treffen, Fläche fast senkrecht. Ziel ist Tempo, nicht Höhe — der Shuttle bleibt knapp über Netzkante.',
    },
    {
      vonT: 1010, bisT: 1800,
      label: 'Sofort zurück',
      lehrtext: 'Kein Auslaufenlassen: Der Schläger schnappt direkt zurück in die Vorhalte. Im Drive-Duell zählt jede Zehntelsekunde.',
    },
  ],
  shuttleBahn: [
    ...bezierBahn({ x: 98, y: 33 }, { x: 88, y: 33 }, { x: 79, y: 34 }, 350, 780, 8, { von: 10, bis: 13 }),
    ...bezierBahn({ x: 79, y: 34 }, { x: 88, y: 30 }, { x: 98, y: 31 }, 820, 1200, 8, { von: 13, bis: 9 }),
  ],
}
