/**
 * Felder-Scheduler (§9.1): verteilt offene Spiele auf die Felder.
 * Das nächste Spiel bekommt das Paar mit der LÄNGSTEN Pause; keine Person
 * steht in zwei laufenden Spielen gleichzeitig.
 */
import type { Match } from '../../datenmodell'

/** Spielbereit: beide Teilnehmer bekannt, offen, noch ohne Feld. */
export function spielbereiteMatches(matches: Match[]): Match[] {
  const beschaeftigt = new Set<string>()
  for (const m of matches) {
    if (m.feld !== undefined && m.status !== 'beendet') {
      if (m.teilnehmerAId) beschaeftigt.add(m.teilnehmerAId)
      if (m.teilnehmerBId) beschaeftigt.add(m.teilnehmerBId)
    }
  }
  return matches.filter(
    (m) =>
      m.status === 'offen' &&
      m.feld === undefined &&
      m.teilnehmerAId !== undefined &&
      m.teilnehmerBId !== undefined &&
      !beschaeftigt.has(m.teilnehmerAId) &&
      !beschaeftigt.has(m.teilnehmerBId),
  )
}

/** Letzter Einsatz je Teilnehmer (beendetUm der beendeten Spiele). */
function letzterEinsatz(matches: Match[]): Map<string, string> {
  const letzter = new Map<string, string>()
  for (const m of matches) {
    if (m.status !== 'beendet' || !m.beendetUm) continue
    for (const id of [m.teilnehmerAId, m.teilnehmerBId]) {
      if (!id) continue
      const bisher = letzter.get(id)
      if (!bisher || m.beendetUm > bisher) letzter.set(id, m.beendetUm)
    }
  }
  return letzter
}

/**
 * Wartezeit-faire Reihenfolge der spielbereiten Matches:
 * Wer am längsten pausiert (bzw. noch gar nicht gespielt hat), kommt zuerst.
 */
export function naechsteSpiele(matches: Match[]): Match[] {
  const letzter = letzterEinsatz(matches)
  const schluessel = (m: Match) => {
    const a = letzter.get(m.teilnehmerAId!) ?? ''
    const b = letzter.get(m.teilnehmerBId!) ?? ''
    return a > b ? a : b // jüngste Aktivität des Paars
  }
  return [...spielbereiteMatches(matches)].sort(
    (x, y) =>
      schluessel(x).localeCompare(schluessel(y)) ||
      (x.runde ?? 0) - (y.runde ?? 0) ||
      (x.bracketSlot ?? 0) - (y.bracketSlot ?? 0),
  )
}

/** Freie Felder ermitteln und Zuweisungen vorschlagen (mutiert nicht). */
export function weiseFelderZu(
  matches: Match[],
  felderAnzahl: number,
): { matchId: string; feld: number }[] {
  const belegt = new Set(
    matches.filter((m) => m.feld !== undefined && m.status !== 'beendet').map((m) => m.feld!),
  )
  const frei = Array.from({ length: felderAnzahl }, (_, i) => i + 1).filter((f) => !belegt.has(f))
  const zuweisungen: { matchId: string; feld: number }[] = []
  const vergeben = new Set<string>()

  for (const feld of frei) {
    // nach jeder Zuweisung neu filtern: dieselbe Person darf nicht doppelt
    const kandidaten = naechsteSpiele(
      matches.map((m) =>
        zuweisungen.some((z) => z.matchId === m.id) ? { ...m, feld: 0, status: 'laufend' as const } : m,
      ),
    ).filter((m) => !vergeben.has(m.id))
    const naechstes = kandidaten[0]
    if (!naechstes) break
    zuweisungen.push({ matchId: naechstes.id, feld })
    vergeben.add(naechstes.id)
  }
  return zuweisungen
}
