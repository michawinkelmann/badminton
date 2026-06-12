/** Animation 19: Sidesteps zur Seitenlinie — Breite verteidigen ohne zu kreuzen. */
import type { BewegungsAnimation } from '../../datenmodell'

export const animSidesteps: BewegungsAnimation = {
  id: 'anim-sidesteps',
  name: 'Sidesteps zur Seitenlinie',
  typ: 'court',
  courtAnsicht: 'oben',
  dauerMs: 4400,
  beschreibung:
    'Seitliche Bälle werden mit Sidesteps erlaufen: Die Hüfte bleibt zum Netz gerichtet, die Füße kreuzen nie — so bleibt jede Richtung offen.',
  posen: [],
  spieler: [
    {
      id: 'a',
      label: 'A',
      seite: 'a',
      bahn: [
        { t: 0, x: 3.5, y: 3.05 },
        { t: 300, x: 3.5, y: 3.05 },
        { t: 1100, x: 3.5, y: 5.35 },
        { t: 1300, x: 3.5, y: 5.35 },
        { t: 2100, x: 3.5, y: 3.05 },
        { t: 2400, x: 3.5, y: 3.05 },
        { t: 3200, x: 3.5, y: 0.75 },
        { t: 3400, x: 3.5, y: 0.75 },
        { t: 4400, x: 3.5, y: 3.05 },
      ],
    },
  ],
  phasen: [
    {
      vonT: 0, bisT: 1300,
      label: 'Sidesteps zur Vorhand-Seite',
      lehrtext: 'Schritt-schließ-Schritt: Die Füße bleiben auseinander und kreuzen nie. Am Ende Ausfallschritt mit Abwehr-Schattenschlag.',
    },
    {
      vonT: 1300, bisT: 2400,
      label: 'Über die Mitte (Split-Step!)',
      lehrtext: 'Auf dem Rückweg an der Mitte kurz den Split-Step setzen — von hier muss jede neue Richtung möglich sein.',
    },
    {
      vonT: 2400, bisT: 3400,
      label: 'Sidesteps zur Rückhand-Seite',
      lehrtext: 'Gleiches Muster nach links. Die Hüfte bleibt tief und frontal zum Netz — wer sich aufrichtet, wird langsam.',
    },
    {
      vonT: 3400, bisT: 4400,
      label: 'Zurück zur Mitte',
      lehrtext: 'Abdrücken über das äußere Bein und zügig zurück — die Mitte ist der einzige Ort, von dem aus alles erreichbar ist.',
    },
  ],
}
