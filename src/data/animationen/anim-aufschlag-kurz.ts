/** Animation 11: Kurzer Aufschlag (Rückhand) — flach über die Kante, an die T-Linie. */
import type { BewegungsAnimation } from '../../datenmodell'
import { bezierBahn } from '../../engine/pose/interpolation'

export const animAufschlagKurz: BewegungsAnimation = {
  id: 'anim-aufschlag-kurz',
  name: 'Aufschlag kurz (Rückhand)',
  typ: 'figur',
  dauerMs: 2400,
  kontaktT: 1150,
  netzX: 88,
  beschreibung:
    'Der Standard im Doppel und auf hohem Niveau auch im Einzel: aus ruhiger Haltung flach über die Netzkante geschoben, Ziel ist die T-Linie.',
  stellungen: [
    // Ruhige Ausgangsposition: Schläger vor dem Körper, Kopf unter Handkante
    { t: 0, s: {
      huefte: { x: 42, y: 58 },
      rumpf: -87,
      oberarm: 58, unterarm: 4, schlaeger: 58,
      obL: 96, unL: 88, obR: 74, unR: 94,
      eindreh: 8, oberarmSeit: -8, unterarmSeit: -8, schlaegerSeit: -4,
    } },
    // sichtbares Laden: Schläger zieht leicht zurück-unten
    { t: 700, s: {
      huefte: { x: 42, y: 58 },
      rumpf: -87,
      oberarm: 52, unterarm: 14, schlaeger: 78,
      eindreh: 8, oberarmSeit: -8, unterarmSeit: -8, schlaegerSeit: -4,
      obL: 96, unL: 88, obR: 74, unR: 94,
    } },
    // kurzer Schub aus dem Unterarm
    { t: 1100, schlag: true, s: {
      huefte: { x: 42, y: 58 },
      rumpf: -86,
      oberarm: 50, unterarm: -8, schlaeger: 26,
      eindreh: 8, oberarmSeit: -8, unterarmSeit: -8, schlaegerSeit: -4,
      obL: 96, unL: 88, obR: 74, unR: 94,
    } },
    { t: 1400, s: {
      huefte: { x: 42, y: 58 },
      rumpf: -86,
      oberarm: 46, unterarm: -14, schlaeger: 8,
      eindreh: 8, oberarmSeit: -6, unterarmSeit: -6, schlaegerSeit: -2,
      obL: 96, unL: 88, obR: 74, unR: 94,
    } },
    { t: 2400, s: {
      huefte: { x: 42, y: 58 },
      rumpf: -87,
      oberarm: 58, unterarm: 4, schlaeger: 58,
      obL: 96, unL: 88, obR: 74, unR: 94,
      eindreh: 8, oberarmSeit: -8, unterarmSeit: -8, schlaegerSeit: -4,
    } },
  ],
  phasen: [
    {
      vonT: 0, bisT: 700,
      label: 'Ruhige Ausgangsposition',
      lehrtext: 'Shuttle an den Federn vor dem Körper, Schlägerkopf UNTER der Hand, Treffpunkt unter der Taille (offiziell: unter 1,15 m). Erst sammeln, dann servieren.',
    },
    {
      vonT: 700, bisT: 1300,
      label: 'Kurzer Schub',
      lehrtext: 'Kein Schwung, nur ein kontrollierter Schub aus dem Unterarm — die Füße bleiben bis zum Treffpunkt am Boden (Regel!).',
    },
    {
      vonT: 1300, bisT: 2400,
      label: 'Flach über die Kante',
      lehrtext: 'Die Flugkurve bleibt so flach wie möglich über dem Band und fällt direkt hinter der vorderen Aufschlaglinie — unangreifbar.',
    },
  ],
  shuttleBahn: [
    // gehalten von der (nicht gezeichneten) freien Hand, dann fallen lassen
    { t: 200, x: 68.83, y: 47.75, z: 2 },
    { t: 950, x: 68.83, y: 47.75, z: 2 },
    { t: 1140, x: 72.63, y: 54.45, z: 2.5 },
    ...bezierBahn({ x: 72.83, y: 54.75 }, { x: 84.41, y: 10.38 }, { x: 96, y: 42 }, 1150, 1950, 12, { von: 2.5, bis: 4 }),
  ],
}
