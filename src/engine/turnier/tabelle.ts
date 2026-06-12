/**
 * Tabellenlogik (§9.1) für Round Robin / Gruppenphase.
 * Tiebreaker-Reihenfolge: 1. Siege → 2. direkter Vergleich → 3. Satzdifferenz
 * → 4. Ballpunktdifferenz → 5. manuell/Los (UI bietet Entscheidung an).
 */
import type { Match, Zaehlweise } from '../../datenmodell'
import { ballpunkte, pruefeSaetze } from './zaehlweise'

export interface TabellenZeile {
  teilnehmerId: string
  spiele: number
  siege: number
  niederlagen: number
  saetzeFuer: number
  saetzeGegen: number
  punkteFuer: number
  punkteGegen: number
  /** Platz nach Sortierung (1-basiert). */
  platz: number
  /** true, wenn der Platz nur per manueller Entscheidung/Los vergeben werden konnte. */
  losNoetig: boolean
}

function leereZeile(id: string): TabellenZeile {
  return {
    teilnehmerId: id,
    spiele: 0,
    siege: 0,
    niederlagen: 0,
    saetzeFuer: 0,
    saetzeGegen: 0,
    punkteFuer: 0,
    punkteGegen: 0,
    platz: 0,
    losNoetig: false,
  }
}

function sammleStatistik(
  ids: string[],
  matches: Match[],
  zw: Zaehlweise,
): Map<string, TabellenZeile> {
  const zeilen = new Map(ids.map((id) => [id, leereZeile(id)]))
  for (const m of matches) {
    if (m.status !== 'beendet' || !m.teilnehmerAId || !m.teilnehmerBId || !m.siegerId) continue
    const za = zeilen.get(m.teilnehmerAId)
    const zb = zeilen.get(m.teilnehmerBId)
    if (!za || !zb) continue
    const auswertung = pruefeSaetze(m.saetze, zw)
    const baelle = ballpunkte(m.saetze)
    za.spiele++
    zb.spiele++
    za.saetzeFuer += auswertung.saetzeA
    za.saetzeGegen += auswertung.saetzeB
    zb.saetzeFuer += auswertung.saetzeB
    zb.saetzeGegen += auswertung.saetzeA
    za.punkteFuer += baelle.a
    za.punkteGegen += baelle.b
    zb.punkteFuer += baelle.b
    zb.punkteGegen += baelle.a
    if (m.siegerId === m.teilnehmerAId) {
      za.siege++
      zb.niederlagen++
    } else {
      zb.siege++
      za.niederlagen++
    }
  }
  return zeilen
}

/** Direkter Vergleich innerhalb einer punktgleichen Gruppe: Siege untereinander. */
function direkteSiege(gruppe: string[], matches: Match[]): Map<string, number> {
  const set = new Set(gruppe)
  const siege = new Map(gruppe.map((id) => [id, 0]))
  for (const m of matches) {
    if (m.status !== 'beendet' || !m.siegerId) continue
    if (!m.teilnehmerAId || !m.teilnehmerBId) continue
    if (!set.has(m.teilnehmerAId) || !set.has(m.teilnehmerBId)) continue
    siege.set(m.siegerId, (siege.get(m.siegerId) ?? 0) + 1)
  }
  return siege
}

/**
 * Tabelle berechnen und sortieren. `manuelleReihung` löst Patt-Situationen
 * (Tiebreaker 5) auf; verbleibende Pattplätze werden mit losNoetig markiert.
 */
export function berechneTabelle(
  teilnehmerIds: string[],
  matches: Match[],
  zw: Zaehlweise,
  manuelleReihung: string[] = [],
): TabellenZeile[] {
  const zeilen = sammleStatistik(teilnehmerIds, matches, zw)
  const liste = teilnehmerIds.map((id) => zeilen.get(id)!)

  // 1. Siege
  liste.sort((x, y) => y.siege - x.siege)

  // Innerhalb sieg-gleicher Gruppen: 2.–5.
  const sortiert: TabellenZeile[] = []
  let i = 0
  while (i < liste.length) {
    let j = i
    while (j < liste.length && liste[j]!.siege === liste[i]!.siege) j++
    const gruppe = liste.slice(i, j)
    if (gruppe.length > 1) {
      const direkt = direkteSiege(gruppe.map((z) => z.teilnehmerId), matches)
      gruppe.sort((x, y) => {
        const d = (direkt.get(y.teilnehmerId) ?? 0) - (direkt.get(x.teilnehmerId) ?? 0)
        if (d !== 0) return d
        const satz = y.saetzeFuer - y.saetzeGegen - (x.saetzeFuer - x.saetzeGegen)
        if (satz !== 0) return satz
        const ball = y.punkteFuer - y.punkteGegen - (x.punkteFuer - x.punkteGegen)
        if (ball !== 0) return ball
        // 5. manuell/Los
        const mi = manuelleReihung.indexOf(x.teilnehmerId)
        const mj = manuelleReihung.indexOf(y.teilnehmerId)
        if (mi !== -1 && mj !== -1) return mi - mj
        return 0
      })
      // Patt markieren: benachbarte Paare, die nach allen Kriterien gleich sind
      for (let k = 0; k < gruppe.length - 1; k++) {
        const x = gruppe[k]!
        const y = gruppe[k + 1]!
        const gleich =
          (direkt.get(x.teilnehmerId) ?? 0) === (direkt.get(y.teilnehmerId) ?? 0) &&
          x.saetzeFuer - x.saetzeGegen === y.saetzeFuer - y.saetzeGegen &&
          x.punkteFuer - x.punkteGegen === y.punkteFuer - y.punkteGegen &&
          !(manuelleReihung.includes(x.teilnehmerId) && manuelleReihung.includes(y.teilnehmerId))
        if (gleich) {
          x.losNoetig = true
          y.losNoetig = true
        }
      }
    }
    sortiert.push(...gruppe)
    i = j
  }

  sortiert.forEach((z, index) => {
    z.platz = index + 1
  })
  return sortiert
}
