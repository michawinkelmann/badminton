/** Animation 15: Split-Step — der Auftakthüpfer, Timing ist alles. */
import type { BewegungsAnimation } from '../../datenmodell'
import { ausfallschritt, grundstellung, hocke } from '../../engine/pose/figur'

export const animSplitstep: BewegungsAnimation = {
  id: 'anim-splitstep',
  name: 'Split-Step',
  typ: 'figur',
  dauerMs: 2200,
  beschreibung:
    'Der kleine beidbeinige Hüpfer vor jedem gegnerischen Schlag. Die Landung fällt genau in den Schlagmoment — daraus entsteht der explosive erste Schritt.',
  stellungen: [
    { t: 0, s: grundstellung(44) },
    // leichtes Absinken (Vorspannung)
    { t: 500, s: hocke(44) },
    // flacher Absprung: ganze Figur hebt 2–3 cm
    { t: 720, s: {
      huefte: { x: 44, y: 53.5 },
      rumpf: -88,
      oberarm: 42, unterarm: -30, schlaeger: -38,
      obL: 96, unL: 90, obR: 80, unR: 92,
      eindreh: 6, beinSeitL: -5, beinSeitR: 5,
      flugHoehe: 1.2,
    } },
    // breite, federnde Landung
    { t: 950, s: {
      huefte: { x: 44, y: 62.5 },
      rumpf: -84,
      oberarm: 40, unterarm: -30, schlaeger: -40,
      obL: 118, unL: 70, obR: 54, unR: 112,
      eindreh: 6, beinSeitL: -15, beinSeitR: 15,
    } },
    // explosiver erster Schritt Richtung Netz
    { t: 1400, s: ausfallschritt(51, -1) },
    { t: 2200, s: grundstellung(44) },
  ],
  phasen: [
    {
      vonT: 0, bisT: 500,
      label: 'Lesen & absinken',
      lehrtext: 'Während der Gegner ausholt, leicht absinken — die Beine laden Vorspannung wie eine Feder.',
    },
    {
      vonT: 500, bisT: 800,
      label: 'Flacher Absprung',
      lehrtext: 'Nur 2–3 cm hoch! Der Split-Step ist ein Frequenz-Hüpfer, kein Sprung — zu hohe Hüpfer kosten Zeit.',
    },
    {
      vonT: 800, bisT: 1100,
      label: 'Landung im Schlagmoment',
      lehrtext: 'Beide Füße landen breit und federnd GENAU dann, wenn der Gegner trifft. Merkhilfe laut mitzählen: „tip-TAP".',
    },
    {
      vonT: 1100, bisT: 2200,
      label: 'Explosiver erster Schritt',
      lehrtext: 'Aus der gespannten Landung fällt der Körper in die Laufrichtung — der erste Schritt entscheidet, ob der Shuttle noch spielbar ist.',
    },
  ],
}
