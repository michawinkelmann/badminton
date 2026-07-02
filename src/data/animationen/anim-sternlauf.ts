/**
 * Animation 20: 6-Punkte-Sternlauf (Referenz für die Court-Engine).
 * Draufsicht, Spieler A läuft aus der zentralen Position alle sechs
 * Feldbereiche an — Rückweg immer über die Mitte (Split-Step!).
 */
import type { BahnPunkt, BewegungsAnimation } from '../../datenmodell'

const MITTE = { x: 3.5, y: 3.05 }

const PUNKTE: { x: number; y: number; label: string; lehrtext: string }[] = [
  {
    x: 5.9, y: 4.65,
    label: 'Netz Vorhand',
    lehrtext: 'Split-Step, dann diagonal nach vorn — der letzte Schritt ist ein langer Ausfallschritt, Schlägerarm gestreckt voraus.',
  },
  {
    x: 5.9, y: 1.45,
    label: 'Netz Rückhand',
    lehrtext: 'Gleicher Weg auf der Rückhandseite: Ausfallschritt mit dem Netzbein, Oberkörper bleibt aufrecht.',
  },
  {
    x: 3.5, y: 5.5,
    label: 'Seite Vorhand',
    lehrtext: 'Sidesteps zur Seitenlinie, Hüfte bleibt frontal zum Netz — Abwehr-Schattenschlag auf Hüfthöhe.',
  },
  {
    x: 3.5, y: 0.6,
    label: 'Seite Rückhand',
    lehrtext: 'Sidesteps nach links, nicht kreuzen! Nach dem Schattenschlag sofort über die Mitte zurück.',
  },
  {
    x: 0.95, y: 4.65,
    label: 'Hinten Vorhand',
    lehrtext: 'Eindrehen und hinter den gedachten Shuttle arbeiten — Umsprung mit Überkopf-Schattenschlag, Landung zieht nach vorn.',
  },
  {
    x: 0.95, y: 1.45,
    label: 'Hinten Rückhand',
    lehrtext: 'Die lange Ecke: Umlaufen ansteuern, damit die Vorhand spielbar bleibt. Nach der Landung direkt Tempo zur Mitte.',
  },
]

const START_PAUSE = 300
const HIN = 700
const ZURUECK = 700

function bahn(): BahnPunkt[] {
  const punkte: BahnPunkt[] = [{ t: 0, x: MITTE.x, y: MITTE.y }]
  let t = START_PAUSE
  for (const p of PUNKTE) {
    punkte.push({ t, x: MITTE.x, y: MITTE.y })
    punkte.push({ t: t + HIN, x: p.x, y: p.y })
    punkte.push({ t: t + HIN + ZURUECK, x: MITTE.x, y: MITTE.y })
    t += HIN + ZURUECK
  }
  return punkte
}

const DAUER = START_PAUSE + PUNKTE.length * (HIN + ZURUECK)

export const animSternlauf: BewegungsAnimation = {
  id: 'anim-sternlauf',
  name: '6-Punkte-Sternlauf',
  typ: 'court',
  courtAnsicht: 'oben',
  dauerMs: DAUER,
  beschreibung:
    'Das komplette Laufmuster: alle sechs Feldbereiche aus der zentralen Position. Jeder Rückweg führt über die Mitte — dort gehört der Split-Step hin.',
  spieler: [{ id: 'a', label: 'A', seite: 'a', bahn: bahn() }],
  phasen: PUNKTE.map((p, i) => ({
    vonT: i === 0 ? 0 : START_PAUSE + i * (HIN + ZURUECK),
    bisT: START_PAUSE + (i + 1) * (HIN + ZURUECK),
    label: p.label,
    lehrtext: p.lehrtext,
  })),
}
