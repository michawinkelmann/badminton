/** Animation 25: Aufschlagfelder & Aufschlagregeln — Einzel vs. Doppel, interaktiv umschaltbar. */
import type { BewegungsAnimation } from '../../datenmodell'

export const animAufschlagfelder: BewegungsAnimation = {
  id: 'anim-aufschlagfelder',
  name: 'Aufschlagfelder & Regeln (Einzel/Doppel)',
  typ: 'court',
  courtAnsicht: 'oben',
  dauerMs: 7500,
  umschaltbar: true,
  beschreibung:
    'Wohin muss der Aufschlag? Einzel: lang und schmal. Doppel: kurz und breit. Aufgeschlagen wird immer diagonal — von rechts bei gerader, von links bei ungerader eigener Punktzahl.',
  posen: [],
  spieler: [
    {
      id: 's',
      label: 'S',
      seite: 'a',
      bahn: [
        { t: 0, x: 4.0, y: 4.2 },
        { t: 2400, x: 4.0, y: 4.2 },
        { t: 3000, x: 4.0, y: 1.9 },
        { t: 5400, x: 4.0, y: 1.9 },
        { t: 6000, x: 4.0, y: 4.2 },
        { t: 7500, x: 4.0, y: 4.2 },
      ],
    },
    {
      id: 'r',
      label: 'R',
      seite: 'b',
      bahn: [
        { t: 0, x: 9.7, y: 1.8 },
        { t: 2400, x: 9.7, y: 1.8 },
        { t: 3000, x: 9.7, y: 4.3 },
        { t: 5400, x: 9.7, y: 4.3 },
        { t: 6000, x: 9.7, y: 1.8 },
        { t: 7500, x: 9.7, y: 1.8 },
      ],
    },
  ],
  shuttleBahn: [
    // Aufschlag 1 (von rechts), danach ausgeblendet, Aufschlag 2 (von links)
    { t: 500, x: 4.0, y: 4.2 },
    { t: 2000, x: 10.6, y: 1.75 },
    { t: 2100, x: 10.6, y: 1.75, unsichtbar: true },
    { t: 3090, x: 4.0, y: 1.9, unsichtbar: true },
    { t: 3100, x: 4.0, y: 1.9 },
    { t: 4600, x: 10.6, y: 4.35 },
    { t: 4700, x: 10.6, y: 4.35, unsichtbar: true },
    { t: 7500, x: 10.6, y: 4.35, unsichtbar: true },
  ],
  zonen: [
    // ---- Phase 1: Aufschlag von RECHTS (gerade Punktzahl) ----
    // Einzel: Aufschlagfeld lang & schmal
    { vonT: 0, bisT: 2500, modus: 'einzel', x: 0, y: 3.05, breite: 4.72, hoehe: 2.59, label: 'Aufschläger' },
    { vonT: 0, bisT: 2500, modus: 'einzel', x: 8.68, y: 0.46, breite: 4.72, hoehe: 2.59, label: 'Zielfeld' },
    // Doppel: kurz & breit
    { vonT: 0, bisT: 2500, modus: 'doppel', x: 0.76, y: 3.05, breite: 3.96, hoehe: 3.05, label: 'Aufschläger' },
    { vonT: 0, bisT: 2500, modus: 'doppel', x: 8.68, y: 0, breite: 3.96, hoehe: 3.05, label: 'Zielfeld' },
    // ---- Phase 2: Aufschlag von LINKS (ungerade Punktzahl) ----
    { vonT: 2500, bisT: 5400, modus: 'einzel', x: 0, y: 0.46, breite: 4.72, hoehe: 2.59, label: 'Aufschläger' },
    { vonT: 2500, bisT: 5400, modus: 'einzel', x: 8.68, y: 3.05, breite: 4.72, hoehe: 2.59, label: 'Zielfeld' },
    { vonT: 2500, bisT: 5400, modus: 'doppel', x: 0.76, y: 0, breite: 3.96, hoehe: 3.05, label: 'Aufschläger' },
    { vonT: 2500, bisT: 5400, modus: 'doppel', x: 8.68, y: 3.05, breite: 3.96, hoehe: 3.05, label: 'Zielfeld' },
  ],
  phasen: [
    {
      vonT: 0, bisT: 2500,
      label: 'Von rechts: gerade Punktzahl',
      lehrtext: 'Steht die EIGENE Punktzahl auf 0, 2, 4 …, wird vom rechten Aufschlagfeld DIAGONAL serviert. Der Shuttle muss im markierten Zielfeld landen — Linien zählen mit.',
    },
    {
      vonT: 2500, bisT: 5400,
      label: 'Von links: ungerade Punktzahl',
      lehrtext: 'Bei 1, 3, 5 … wird von links serviert. Im Einzel wechselt dieselbe Person die Seite, solange sie punktet — im Doppel bleibt die Aufstellung, bis ein eigener Punkt mit eigenem Aufschlag gelingt.',
    },
    {
      vonT: 5400, bisT: 7500,
      label: 'Regeln am Treffpunkt',
      lehrtext: 'Beim Aufschlag gilt: Treffpunkt unter der Taille (offiziell unter 1,15 m), Schlägerkopf zeigt abwärts, beide Füße am Boden, eine durchgehende Bewegung. Einzel-Feld: lang & schmal. Doppel-Feld: kurz & breit.',
    },
  ],
}
