/**
 * Animation 22: Doppel-Angriffsformation (vorne/hinten) mit Rotation.
 * Konsistenter Ballwechsel: Jede Richtungsänderung des Shuttles passiert
 * exakt an der Position eines Spielers zum Schlagzeitpunkt.
 */
import type { BewegungsAnimation } from '../../datenmodell'
import { bezierBahn } from '../../engine/pose/interpolation'

export const animDoppelAngriff: BewegungsAnimation = {
  id: 'anim-doppel-angriff',
  name: 'Doppel: Angriffsformation & Rotation',
  typ: 'court',
  courtAnsicht: 'oben',
  dauerMs: 7200,
  beschreibung:
    'Solange der Shuttle nach unten geht, spielt das Doppel hintereinander: hinten Druck, vorne töten. Die Rotation hält die Formation am Leben.',
  spieler: [
    {
      id: 'a1',
      label: 'A1',
      seite: 'a',
      bahn: [
        { t: 0, x: 5.3, y: 3.05 },
        { t: 1300, x: 5.3, y: 3.05 },
        { t: 1850, x: 6.0, y: 2.6 }, // fängt den Block ab (Schlag bei 1900)
        { t: 2400, x: 6.0, y: 2.6 },
        { t: 3300, x: 5.4, y: 3.0 }, // zurück auf die T-Position
        { t: 4900, x: 5.4, y: 3.0 },
        { t: 5350, x: 6.2, y: 2.4 }, // steht für den Kill bereit (Schlag bei 5400)
        { t: 6400, x: 5.6, y: 2.8 },
        { t: 7200, x: 5.6, y: 2.8 },
      ],
    },
    {
      id: 'a2',
      label: 'A2',
      seite: 'a',
      bahn: [
        { t: 0, x: 2.1, y: 3.0 }, // Smash bei 400 von hier
        { t: 2600, x: 2.1, y: 3.0 },
        { t: 3700, x: 1.6, y: 2.75 }, // rückt unter den Heber (Schlag bei 3900)
        { t: 3900, x: 1.5, y: 2.7 },
        { t: 5200, x: 1.9, y: 3.0 },
        { t: 7200, x: 2.0, y: 3.05 },
      ],
    },
    {
      id: 'b1',
      label: 'B1',
      seite: 'b',
      bahn: [
        { t: 0, x: 10.0, y: 1.7 },
        { t: 1900, x: 10.0, y: 1.7 },
        { t: 2550, x: 7.4, y: 1.9 }, // holt den kurzen Ball (Schlag bei 2600)
        { t: 2900, x: 7.4, y: 1.9 },
        { t: 3800, x: 10.1, y: 1.9 }, // zurück — Block bei 4600 von hier
        { t: 5400, x: 10.0, y: 1.8 },
        { t: 7200, x: 10.0, y: 1.7 },
      ],
    },
    {
      id: 'b2',
      label: 'B2',
      seite: 'b',
      bahn: [
        { t: 0, x: 10.0, y: 4.4 },
        { t: 1050, x: 10.2, y: 4.3 }, // Block bei 1100
        { t: 2200, x: 10.0, y: 4.4 },
        { t: 7200, x: 10.0, y: 4.4 },
      ],
    },
  ],
  // Schlagfolge: A2-Smash → B2-Block → A1 fängt ab & legt kurz → B1 hebt →
  // A2-Smash → B1-Block → A1 tötet vorn. Danach liegt der Shuttle (Punkt).
  shuttleBahn: [
    { t: 0, x: 2.1, y: 3.0 },
    ...bezierBahn({ x: 2.1, y: 3.0 }, { x: 6.2, y: 3.7 }, { x: 10.2, y: 4.3 }, 400, 1100, 8),
    ...bezierBahn({ x: 10.2, y: 4.3 }, { x: 8.0, y: 3.4 }, { x: 6.0, y: 2.6 }, 1100, 1900, 8),
    ...bezierBahn({ x: 6.0, y: 2.6 }, { x: 6.6, y: 2.1 }, { x: 7.4, y: 1.9 }, 1900, 2600, 6),
    ...bezierBahn({ x: 7.4, y: 1.9 }, { x: 4.4, y: 1.9 }, { x: 1.5, y: 2.7 }, 2600, 3900, 8),
    ...bezierBahn({ x: 1.5, y: 2.7 }, { x: 6.0, y: 2.2 }, { x: 10.1, y: 1.9 }, 3900, 4600, 8),
    ...bezierBahn({ x: 10.1, y: 1.9 }, { x: 8.2, y: 2.0 }, { x: 6.2, y: 2.4 }, 4600, 5400, 8),
    ...bezierBahn({ x: 6.2, y: 2.4 }, { x: 6.7, y: 2.1 }, { x: 7.3, y: 2.0 }, 5400, 6000, 6),
    { t: 7200, x: 7.3, y: 2.0 }, // Punkt: Shuttle liegt
  ],
  phasen: [
    {
      vonT: 0, bisT: 1400,
      label: 'Formation: vorne/hinten',
      lehrtext: 'Im Angriff steht das Paar hintereinander: A2 hinten mit Smash und Drop, A1 vorn mit Schläger über Netzkante — bereit für alles Kurze.',
    },
    {
      vonT: 1400, bisT: 2600,
      label: 'Vorne abfangen',
      lehrtext: 'Den Block des Gegners fängt der Netzspieler A1 ab und legt ihn wieder eng — A2 bleibt hinten! Niemals beide auf denselben Ball.',
    },
    {
      vonT: 2600, bisT: 3900,
      label: 'Heber kommt: hinten bleibt hinten',
      lehrtext: 'Hebt der Gegner hoch, läuft NICHT der Netzspieler zurück: A2 deckt das Hinterfeld, A1 hält das Vorfeld — die Formation bleibt.',
    },
    {
      vonT: 3900, bisT: 5400,
      label: 'Nächste Angriffswelle',
      lehrtext: 'A2 smasht erneut, der Gegner kann nur noch flach blocken — und genau dort lauert wieder der Netzspieler.',
    },
    {
      vonT: 5400, bisT: 7200,
      label: 'Vorne macht den Punkt',
      lehrtext: 'A1 tötet den zu hohen Block am Netz. Dafür steht er dort: Hinten erzwingt die Chance, vorne verwertet sie.',
    },
  ],
}
