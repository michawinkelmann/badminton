/**
 * Zählweisen-Logik (§9.1): Validierung und Auswertung von Sätzen/Matches
 * gegen die konfigurierte Zaehlweise. Rein und UI-frei.
 */
import type { SatzErgebnis, Zaehlweise } from '../../datenmodell'

export type Seite = 'a' | 'b'

/** Sieger eines GÜLTIG BEENDETEN Satzes — undefined, wenn (noch) kein Endstand. */
export function satzSieger(satz: SatzErgebnis, zw: Zaehlweise): Seite | undefined {
  const max = Math.max(satz.a, satz.b)
  const min = Math.min(satz.a, satz.b)
  if (satz.a < 0 || satz.b < 0) return undefined

  if (zw.modus === 'zeit') {
    // Zeitspiel: Stand bei Zeitende; Gleichstand ist kein Endstand
    return satz.a === satz.b ? undefined : satz.a > satz.b ? 'a' : 'b'
  }

  if (max > zw.maxPunkte) return undefined
  let beendet = false
  if (zw.verlaengerung) {
    beendet =
      (max === zw.punkteProSatz && max - min >= 2) ||
      (max > zw.punkteProSatz && max < zw.maxPunkte && max - min === 2) ||
      (max === zw.maxPunkte && max > min)
  } else {
    beendet = max === zw.punkteProSatz && max > min
  }
  if (!beendet) return undefined
  return satz.a > satz.b ? 'a' : 'b'
}

export interface MatchAuswertung {
  gueltig: boolean
  fehler?: string
  fertig: boolean
  siegerSeite?: Seite
  saetzeA: number
  saetzeB: number
}

/** Komplettes Ergebnis prüfen: jeder Satz gültig, Match entschieden, kein Satz zu viel. */
export function pruefeSaetze(saetze: SatzErgebnis[], zw: Zaehlweise): MatchAuswertung {
  const noetig = zw.modus === 'zeit' ? 1 : zw.saetzeZumSieg
  let a = 0
  let b = 0
  for (let i = 0; i < saetze.length; i++) {
    const satz = saetze[i]!
    if (!Number.isInteger(satz.a) || !Number.isInteger(satz.b) || satz.a < 0 || satz.b < 0) {
      return { gueltig: false, fehler: `Satz ${i + 1}: ungültige Punktzahl.`, fertig: false, saetzeA: a, saetzeB: b }
    }
    if (a >= noetig || b >= noetig) {
      return { gueltig: false, fehler: `Satz ${i + 1}: Das Match war bereits entschieden.`, fertig: false, saetzeA: a, saetzeB: b }
    }
    const sieger = satzSieger(satz, zw)
    if (!sieger) {
      const grund =
        zw.modus === 'zeit'
          ? 'Beim Zeitspiel braucht es einen Punktunterschied (Gleichstand: nächster Punkt entscheidet).'
          : zw.verlaengerung
            ? `Kein gültiger Endstand (bis ${zw.punkteProSatz}, Verlängerung mit 2 Punkten Abstand, Kappung bei ${zw.maxPunkte}).`
            : `Kein gültiger Endstand (Satz endet bei ${zw.punkteProSatz} Punkten).`
      return { gueltig: false, fehler: `Satz ${i + 1} (${satz.a}:${satz.b}): ${grund}`, fertig: false, saetzeA: a, saetzeB: b }
    }
    if (sieger === 'a') a++
    else b++
  }
  const fertig = a >= noetig || b >= noetig
  return {
    gueltig: true,
    fertig,
    ...(fertig ? { siegerSeite: (a > b ? 'a' : 'b') as Seite } : {}),
    saetzeA: a,
    saetzeB: b,
  }
}

/** Ballpunkte über alle Sätze (für Tabellen/Tiebreaker). */
export function ballpunkte(saetze: SatzErgebnis[]): { a: number; b: number } {
  return saetze.reduce((s, x) => ({ a: s.a + x.a, b: s.b + x.b }), { a: 0, b: 0 })
}

/** Zählweisen-Presets (§9.3). */
export const ZAEHLWEISE_PRESETS: { name: string; zaehlweise: Zaehlweise }[] = [
  {
    name: 'Offiziell 2×21',
    zaehlweise: { modus: 'punkte', saetzeZumSieg: 2, punkteProSatz: 21, verlaengerung: true, maxPunkte: 30 },
  },
  {
    name: 'Neu 3×15 (ab 2027)',
    zaehlweise: { modus: 'punkte', saetzeZumSieg: 2, punkteProSatz: 15, verlaengerung: true, maxPunkte: 21 },
  },
  {
    name: 'Schule 1×15',
    zaehlweise: { modus: 'punkte', saetzeZumSieg: 1, punkteProSatz: 15, verlaengerung: true, maxPunkte: 21 },
  },
  {
    name: 'Zeitspiel 10 Min',
    zaehlweise: { modus: 'zeit', saetzeZumSieg: 1, punkteProSatz: 0, verlaengerung: false, maxPunkte: 999, zeitspielMin: 10 },
  },
]
