/** Animation 24: Flugbahnen-Vergleich Clear/Drop/Smash/Drive (Seitenansicht mit Netz). */
import type { BewegungsAnimation } from '../../datenmodell'
import { bezierBahn } from '../../engine/pose/interpolation'

export const animFlugbahnen: BewegungsAnimation = {
  id: 'anim-flugbahnen',
  name: 'Flugbahnen-Vergleich (Seitenansicht)',
  typ: 'court',
  courtAnsicht: 'seite',
  dauerMs: 6600,
  beschreibung:
    'Vier Grundschläge, vier Flugkurven: Höhe, Länge und Tempo entscheiden, wie viel Zeit der Gegner bekommt — und wie viel Risiko im Schlag steckt.',
  spieler: [
    { id: 'a', label: 'A', seite: 'a', bahn: [{ t: 0, x: 1.6, y: 0 }, { t: 6600, x: 1.6, y: 0 }] },
    { id: 'b', label: 'B', seite: 'b', bahn: [{ t: 0, x: 10.2, y: 0 }, { t: 6600, x: 10.2, y: 0 }] },
  ],
  bahnen: [
    {
      label: 'Clear',
      punkte: bezierBahn({ x: 1.6, y: 2.7 }, { x: 6.7, y: 5.4 }, { x: 12.6, y: 0.1 }, 100, 1700, 14),
    },
    {
      label: 'Drop',
      punkte: bezierBahn({ x: 1.6, y: 2.7 }, { x: 5.8, y: 3.4 }, { x: 8.3, y: 0.05 }, 1900, 3300, 12),
    },
    {
      label: 'Smash',
      punkte: bezierBahn({ x: 1.6, y: 3.1 }, { x: 6.4, y: 2.5 }, { x: 9.6, y: 0.05 }, 3600, 4300, 10),
    },
    {
      label: 'Drive',
      punkte: bezierBahn({ x: 2.2, y: 1.7 }, { x: 6.7, y: 1.95 }, { x: 11.6, y: 0.9 }, 4600, 5500, 10),
    },
  ],
  phasen: [
    {
      vonT: 0, bisT: 1900,
      label: 'Clear: hoch & weit',
      lehrtext: 'Die höchste Kurve: Der Clear kauft Zeit und schiebt den Gegner an die Grundlinie. Defensiv hoch, offensiv flacher und schneller.',
    },
    {
      vonT: 1900, bisT: 3600,
      label: 'Drop: kurz hinter das Netz',
      lehrtext: 'Gleiche Ausholbewegung, sanfte Kurve: Der Drop fällt kurz hinter dem Netz. Je flacher er gespielt wird, desto weniger Zeit hat der Gegner — und desto höher das Risiko.',
    },
    {
      vonT: 3600, bisT: 4600,
      label: 'Smash: steil nach unten',
      lehrtext: 'Die schnellste und steilste Bahn — nur möglich, wenn der Treffpunkt hoch und vor dem Körper liegt. Der Winkel entscheidet, nicht die Kraft.',
    },
    {
      vonT: 4600, bisT: 6600,
      label: 'Drive: flach übers Band',
      lehrtext: 'Fast parallel zum Boden, knapp über die Netzkante: Der Drive ist das Tempo-Duell im Mittelfeld — wer zuerst nach unten spielt, gewinnt den Ballwechsel.',
    },
  ],
}
