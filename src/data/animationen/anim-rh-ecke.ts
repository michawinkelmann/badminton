/** Animation 18: Lauf in die Rückhand-Ecke — Umlaufen statt Rückhand. */
import type { BewegungsAnimation } from '../../datenmodell'

export const animRhEcke: BewegungsAnimation = {
  id: 'anim-rh-ecke',
  name: 'Lauf in die Rückhand-Ecke (Umlaufen)',
  typ: 'court',
  courtAnsicht: 'oben',
  dauerMs: 4000,
  beschreibung:
    'Die tiefe Rückhand-Ecke ist die schwächste Zone — wer den Laufweg leicht außen herum legt, kann statt der Rückhand die starke Vorhand spielen.',
  spieler: [
    {
      id: 'a',
      label: 'A',
      seite: 'a',
      bahn: [
        { t: 0, x: 3.5, y: 3.05 },
        { t: 800, x: 3.5, y: 3.05 },
        // Umlauf-Kurve: nicht direkt zur Ecke, sondern hinter den Treffpunkt
        { t: 1400, x: 2.5, y: 2.3 },
        { t: 2000, x: 1.5, y: 1.9 },
        { t: 2400, x: 0.9, y: 1.35 },
        // Umsprung-Schlag, Landung zieht nach vorn
        { t: 2700, x: 1.15, y: 1.6 },
        { t: 4000, x: 3.5, y: 3.05 },
      ],
    },
  ],
  phasen: [
    {
      vonT: 0, bisT: 800,
      label: 'Auftakt & Eindrehen',
      lehrtext: 'Split-Step in der Mitte, dann sofort die Schulterachse eindrehen — der Blick bleibt am Shuttle.',
    },
    {
      vonT: 800, bisT: 2000,
      label: 'Umlaufen: außen herum',
      lehrtext: 'Der Laufweg macht einen kleinen Bogen, damit der Körper HINTER und seitlich neben den Treffpunkt kommt — nur so ist die Vorhand spielbar.',
    },
    {
      vonT: 2000, bisT: 2700,
      label: 'Umsprung & Vorhand-Schlag',
      lehrtext: 'In der Ecke Umsprung mit Vorhand-Überkopfschlag: Die Rückhand bleibt der Notfall, das Umlaufen ist der Plan.',
    },
    {
      vonT: 2700, bisT: 4000,
      label: 'Tempo zurück zur Mitte',
      lehrtext: 'Die Landung des Umsprungs zieht bereits Richtung Mitte — diesen Schwung mitnehmen, die Diagonale ist lang.',
    },
  ],
}
