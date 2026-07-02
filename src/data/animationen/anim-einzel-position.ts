/**
 * Animation 21: Zentrale Position & Felddeckung im Einzel.
 * Konsistenter Ballwechsel über 5 Schläge — A kehrt nach jedem Schlag
 * zur (leicht verschobenen) Mitte zurück.
 */
import type { BewegungsAnimation } from '../../datenmodell'
import { bezierBahn } from '../../engine/pose/interpolation'

export const animEinzelPosition: BewegungsAnimation = {
  id: 'anim-einzel-position',
  name: 'Zentrale Position & Felddeckung (Einzel)',
  typ: 'court',
  courtAnsicht: 'oben',
  dauerMs: 6400,
  beschreibung:
    'Die Mitte ist der Punkt mit den kürzesten Wegen in alle Ecken. Nach JEDEM eigenen Schlag geht es dorthin zurück — leicht zur Shuttle-Seite verschoben.',
  spieler: [
    {
      id: 'a',
      label: 'A',
      seite: 'a',
      bahn: [
        { t: 0, x: 3.4, y: 3.05 }, // Clear bei 300
        { t: 1500, x: 3.4, y: 3.05 },
        { t: 2550, x: 5.6, y: 4.5 }, // erläuft den Drop (Schlag bei 2600)
        { t: 3600, x: 3.6, y: 3.2 }, // Mitte, leicht zur Shuttle-Seite
        { t: 5150, x: 1.4, y: 2.7 }, // lange Diagonale (Schlag bei 5200)
        { t: 6400, x: 3.4, y: 3.05 },
      ],
    },
    {
      id: 'b',
      label: 'B',
      seite: 'b',
      bahn: [
        { t: 0, x: 10.0, y: 3.05 },
        { t: 1250, x: 12.2, y: 1.4 }, // nimmt den Clear (Schlag bei 1300)
        { t: 2500, x: 10.0, y: 3.05 },
        { t: 3850, x: 11.9, y: 4.5 }, // nimmt den Lob (Schlag bei 3900)
        { t: 5000, x: 10.0, y: 3.05 },
        { t: 6400, x: 10.0, y: 3.05 },
      ],
    },
  ],
  zonen: [
    { vonT: 0, bisT: 1500, x: 2.6, y: 2.25, breite: 1.7, hoehe: 1.6, label: 'Mitte' },
  ],
  // Schlagfolge: A-Clear → B-Drop → A-Lob → B-Clear → A-Clear zurück auf B.
  shuttleBahn: [
    { t: 0, x: 3.4, y: 3.0 },
    ...bezierBahn({ x: 3.4, y: 3.0 }, { x: 8.2, y: 1.8 }, { x: 12.2, y: 1.4 }, 300, 1300, 8),
    ...bezierBahn({ x: 12.2, y: 1.4 }, { x: 8.6, y: 3.2 }, { x: 5.6, y: 4.5 }, 1300, 2600, 8),
    ...bezierBahn({ x: 5.6, y: 4.5 }, { x: 8.8, y: 4.9 }, { x: 11.9, y: 4.5 }, 2600, 3900, 8),
    ...bezierBahn({ x: 11.9, y: 4.5 }, { x: 6.6, y: 3.4 }, { x: 1.4, y: 2.7 }, 3900, 5200, 8),
    ...bezierBahn({ x: 1.4, y: 2.7 }, { x: 6.8, y: 2.6 }, { x: 10.0, y: 3.0 }, 5200, 6200, 8),
    { t: 6400, x: 10.0, y: 3.0 },
  ],
  phasen: [
    {
      vonT: 0, bisT: 1500,
      label: 'Die Mitte als Basis',
      lehrtext: 'Zentrale Position knapp hinter dem T-Punkt: Von hier ist jede Ecke gleich weit. Der eigene Clear läuft — Zeit, die Basis zu beziehen.',
    },
    {
      vonT: 1500, bisT: 2700,
      label: 'Zum Shuttle — und der Plan zurück',
      lehrtext: 'A erläuft den Drop am Netz. Schon beim Hinlaufen gilt: Nach dem Schlag geht es SOFORT zurück Richtung Mitte, nicht stehen bleiben.',
    },
    {
      vonT: 2700, bisT: 4100,
      label: 'Leicht zur Shuttle-Seite',
      lehrtext: 'Die „Mitte" wandert minimal in Richtung des eigenen Schlags: Nach dem Lob von rechts vorn deckt A etwas weiter rechts — die wahrscheinliche Antwort ist kürzer.',
    },
    {
      vonT: 4100, bisT: 6400,
      label: 'Lange Diagonale abdecken',
      lehrtext: 'Auf den Clear ins Hinterfeld wieder: erlaufen, schlagen, Mitte. Wer die Rückwege spart, verliert die nächste Ecke.',
    },
  ],
}
