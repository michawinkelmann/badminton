/** Animation 16: Ausfallschritt zum Netz — Lunge mit Knie über dem Fuß. */
import type { BewegungsAnimation } from '../../datenmodell'
import { ausfallschritt, grundstellung } from '../../engine/pose/figur'

export const animAusfallschritt: BewegungsAnimation = {
  id: 'anim-ausfallschritt',
  name: 'Ausfallschritt zum Netz',
  typ: 'figur',
  dauerMs: 2600,
  netzX: 84,
  beschreibung:
    'Der letzte Schritt ans Netz ist immer ein langer Ausfallschritt: Er bremst die Bewegung, schützt das Knie und bringt Reichweite.',
  stellungen: [
    { t: 0, s: grundstellung(36) },
    // Anlauf mit kleinen Schritten
    { t: 700, s: {
      huefte: { x: 46, y: 59.5 },
      rumpf: -82,
      oberarm: 18, unterarm: -16, schlaeger: 40,
      eindreh: 14, oberarmSeit: 8,
      obL: 114, unL: 94, obR: 52, unR: 94,
    } },
    // tiefer Ausfallschritt — Arm tief nach vorn-unten, Schlägerkopf bleibt vor dem Netz
    { t: 1200, s: { ...ausfallschritt(56, 2), oberarm: 45, unterarm: 10, schlaeger: 78 } },
    // Position halten (Lehrmoment)
    { t: 1550, s: { ...ausfallschritt(56, 2), oberarm: 45, unterarm: 10, schlaeger: 78 } },
    // aktiv zurückdrücken — Schläger erst tief lassen, dann heben (bleibt vorm Netz)
    { t: 2000, s: {
      huefte: { x: 47, y: 59.5 },
      rumpf: -86,
      oberarm: 20, unterarm: -40, schlaeger: 30,
      eindreh: 14, oberarmSeit: 8,
      obL: 112, unL: 92, obR: 54, unR: 96,
    } },
    { t: 2600, s: grundstellung(36) },
  ],
  phasen: [
    {
      vonT: 0, bisT: 900,
      label: 'Anlauf mit kleinen Schritten',
      lehrtext: 'Tempo aus kleinen, schnellen Schritten aufbauen — der lange Schritt kommt erst ganz am Ende.',
    },
    {
      vonT: 900, bisT: 1300,
      label: 'Langer letzter Schritt',
      lehrtext: 'Die Ferse setzt zuerst auf und bremst. Das vordere Knie bleibt ÜBER dem Fuß — nie darüber hinausschieben.',
    },
    {
      vonT: 1300, bisT: 1650,
      label: 'Tiefe Position',
      lehrtext: 'Oberkörper aufrecht, hinteres Bein lang als Gegengewicht, Schlägerarm gestreckt voraus — Reichweite kommt aus dem Schritt, nicht aus dem Rücken.',
    },
    {
      vonT: 1650, bisT: 2600,
      label: 'Aktiv zurückdrücken',
      lehrtext: 'Über das vordere Bein kraftvoll abdrücken und rückwärts lösen — zurück zur Mitte mit kleinen, schnellen Schritten.',
    },
  ],
}
