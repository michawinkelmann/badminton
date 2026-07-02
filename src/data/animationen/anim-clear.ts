/**
 * Animation 1: Vorhand-Überkopf-Clear (Referenz-Animation, visuell verifiziert).
 * Figur blickt nach rechts (zum Netz). Treffpunkt: höchster Punkt, vor dem
 * Körper, Arm gestreckt — Lehrtexte = Trainer-Knackpunkte.
 */
import type { BewegungsAnimation } from '../../datenmodell'
import { ausholungUeberkopf, ausschwung, grundstellung, treffpunktHoch } from '../../engine/pose/figur'
import { bezierBahn } from '../../engine/pose/interpolation'

export const animClear: BewegungsAnimation = {
  id: 'anim-clear',
  name: 'Vorhand-Überkopf-Clear',
  typ: 'figur',
  dauerMs: 2800,
  kontaktT: 1450,
  beschreibung:
    'Der Grundschlag des Badmintons: hoch und weit zur gegnerischen Grundlinie. Kraft entsteht aus der Kette Beine–Hüfte–Rumpf–Arm–Handgelenk.',
  stellungen: [
    { t: 0, s: grundstellung(44) },
    // Auftakt: eindrehen, Gewicht aufs hintere Bein, Arm hebt
    // Klassische Vorbereitung: Ellbogen hoch, Schlägerkopf zeigt nach OBEN
    { t: 700, s: {
      huefte: { x: 43, y: 58 },
      rumpf: -96,
      oberarm: -128,
      unterarm: -68,
      schlaeger: -58,
      obL: 97, unL: 82,
      obR: 68, unR: 99,
      eindreh: 72, oberarmSeit: 4,
    } },
    { t: 1300, s: ausholungUeberkopf(42) },
    { t: 1450, schlag: true, s: treffpunktHoch(45, -78) },
    { t: 1950, s: ausschwung(47) },
    { t: 2800, s: grundstellung(45) },
  ],
  phasen: [
    {
      vonT: 0,
      bisT: 700,
      label: 'Auftakt & Stellung',
      lehrtext:
        'Seitlich zum Netz eindrehen, Gewicht auf das hintere Bein, Schlagarm hebt — die Nicht-Schlagseite zeigt zum Shuttle.',
    },
    {
      vonT: 700,
      bisT: 1380,
      label: 'Ausholen & Bogenspannung',
      lehrtext:
        'Ellbogen hoch, Schlägerkopf fällt hinter den Rücken — der Körper spannt wie ein Bogen. Aus dieser Spannung kommt die Weite, nicht aus dem Armdrücken.',
    },
    {
      vonT: 1380,
      bisT: 1620,
      label: 'Treffpunkt',
      lehrtext:
        'Treffpunkt am höchsten Punkt, leicht VOR dem Körper, Arm gestreckt. Der Ellbogen führt die Bewegung an, das Handgelenk beschleunigt zuletzt.',
    },
    {
      vonT: 1620,
      bisT: 2800,
      label: 'Ausschwung & Rückweg',
      lehrtext:
        'Der Arm schwingt locker nach vorn-unten aus, das Gewicht kommt mit nach vorn — und sofort zurück in die zentrale Position.',
    },
  ],
  shuttleBahn: [
    ...bezierBahn({ x: 98, y: 22 }, { x: 79.5, y: 0.92 }, { x: 55.99, y: 11.84 }, 650, 1450, 10, { von: 4, bis: 9 }),
    ...bezierBahn( { x: 55.99, y: 11.84 }, { x: 79.5, y: -5.08 }, { x: 99, y: 14 }, 1450, 2100, 10, { von: 9, bis: 4 }),
  ],
}
