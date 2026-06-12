/**
 * Animation 23: Doppel-Abwehrformation (nebeneinander) und Wechsel in den Angriff.
 * Konsistenter Ballwechsel: Schläge nur an Spielerpositionen; beide Wechsel
 * (B in den Angriff, A in die Abwehr) sind als Laufwege sichtbar.
 */
import type { BewegungsAnimation } from '../../datenmodell'
import { bezierBahn } from '../../engine/pose/interpolation'

export const animDoppelAbwehr: BewegungsAnimation = {
  id: 'anim-doppel-abwehr',
  name: 'Doppel: Abwehrformation & Wechsel in den Angriff',
  typ: 'court',
  courtAnsicht: 'oben',
  dauerMs: 6600,
  beschreibung:
    'In der Abwehr steht das Paar nebeneinander und teilt das Feld in zwei Hälften. Der Wechsel zurück in den Angriff passiert in dem Moment, in dem der Gegner heben muss.',
  posen: [],
  spieler: [
    {
      id: 'b1',
      label: 'B1',
      seite: 'b',
      bahn: [
        { t: 0, x: 10.0, y: 1.7 },
        { t: 1250, x: 10.4, y: 1.7 }, // Block bei 1300
        { t: 2400, x: 10.2, y: 1.8 },
        { t: 3300, x: 12.1, y: 3.1 }, // ruft & geht unter den Heber (Smash bei 3400)
        { t: 4500, x: 11.2, y: 3.05 }, // bleibt hinten: B ist im Angriff
        { t: 6600, x: 11.2, y: 3.05 },
      ],
    },
    {
      id: 'b2',
      label: 'B2',
      seite: 'b',
      bahn: [
        { t: 0, x: 10.0, y: 4.4 },
        { t: 2400, x: 10.0, y: 4.4 },
        { t: 3600, x: 8.6, y: 3.0 }, // rückt in die Netzposition vor
        { t: 4900, x: 8.6, y: 3.0 }, // tötet den flachen Return (Schlag bei 4900)
        { t: 6600, x: 8.8, y: 3.0 },
      ],
    },
    {
      id: 'a1',
      label: 'A1',
      seite: 'a',
      bahn: [
        { t: 0, x: 2.1, y: 3.0 }, // Smash bei 500 von hier
        { t: 2400, x: 2.1, y: 3.0 },
        { t: 3300, x: 3.5, y: 1.8 }, // nach dem Heber: nebeneinander sortieren
        { t: 4200, x: 3.5, y: 1.8 }, // Abwehr-Block bei 4200
        { t: 6600, x: 3.5, y: 1.8 },
      ],
    },
    {
      id: 'a2',
      label: 'A2',
      seite: 'a',
      bahn: [
        { t: 0, x: 5.4, y: 3.05 },
        { t: 1400, x: 5.4, y: 3.05 },
        { t: 2050, x: 6.4, y: 3.6 }, // erreicht den Block, MUSS heben (Schlag bei 2100)
        { t: 3300, x: 3.5, y: 4.3 }, // und sortiert sich nebeneinander
        { t: 6600, x: 3.5, y: 4.3 },
      ],
    },
  ],
  // Schlagfolge: A1-Smash → B1-Block → A2 hebt (Notlösung) → B1-Smash aus dem
  // Hinterfeld → A1-Block → B2 tötet vorn.
  shuttleBahn: [
    { t: 0, x: 2.1, y: 3.0 },
    ...bezierBahn({ x: 2.1, y: 3.0 }, { x: 6.4, y: 2.0 }, { x: 10.4, y: 1.7 }, 500, 1300, 8),
    ...bezierBahn({ x: 10.4, y: 1.7 }, { x: 8.4, y: 2.6 }, { x: 6.4, y: 3.6 }, 1300, 2100, 8),
    ...bezierBahn({ x: 6.4, y: 3.6 }, { x: 9.2, y: 3.5 }, { x: 12.1, y: 3.1 }, 2100, 3400, 8),
    ...bezierBahn({ x: 12.1, y: 3.1 }, { x: 7.8, y: 2.4 }, { x: 3.5, y: 1.8 }, 3400, 4200, 8),
    ...bezierBahn({ x: 3.5, y: 1.8 }, { x: 6.0, y: 2.3 }, { x: 8.6, y: 3.0 }, 4200, 4900, 8),
    ...bezierBahn({ x: 8.6, y: 3.0 }, { x: 7.9, y: 2.9 }, { x: 7.3, y: 2.7 }, 4900, 5400, 6),
    { t: 6600, x: 7.3, y: 2.7 }, // Punkt für B
  ],
  phasen: [
    {
      vonT: 0, bisT: 1300,
      label: 'Abwehr: nebeneinander',
      lehrtext: 'Gegen den Angriff steht Team B nebeneinander, jede:r deckt eine Feldhälfte: tief stehen, Schläger vor der Hüfte, Rückhandgriff.',
    },
    {
      vonT: 1300, bisT: 2400,
      label: 'Flach zurückblocken',
      lehrtext: 'B1 blockt den Smash flach hinter das Netz — hohe Abwehr würde sofort den nächsten Smash einladen. Der Gegner kommt nur noch mit Mühe heran.',
    },
    {
      vonT: 2400, bisT: 3400,
      label: 'Gegner hebt: JETZT wechseln',
      lehrtext: 'A2 muss hoch spielen. In diesem Moment wechselt B: Wer den hohen Ball nimmt (B1), ruft und geht nach hinten — B2 rückt automatisch in die Netzposition.',
    },
    {
      vonT: 3400, bisT: 4900,
      label: 'Angriff: vorne/hinten',
      lehrtext: 'Aus nebeneinander wurde hintereinander: B1 smasht, vorn lauert B2. Und Team A? Hat nach dem eigenen Heber sofort nebeneinander sortiert — „Wer hebt, geht zur Seite".',
    },
    {
      vonT: 4900, bisT: 6600,
      label: 'Vorne schließt ab',
      lehrtext: 'Den flachen Abwehr-Return von A tötet B2 direkt am Netz. Der ganze Punktgewinn begann mit einem sauberen Block und dem richtigen Wechselmoment.',
    },
  ],
}
