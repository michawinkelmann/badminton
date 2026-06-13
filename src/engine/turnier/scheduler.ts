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

/* ---------- Zeitschätzung & Wartezeit (§-Erweiterung Turnierleitung) ---------- */

const MIN_MS = 60_000

/**
 * Voraussichtliches Turnierende über den Durchsatz: mittlerer Abstand zwischen
 * den letzten Match-Enden × Zahl der offenen Spiele. Lange Lücken (Pausen)
 * werden gekappt, damit die Schätzung nicht explodiert.
 * undefined, solange weniger als zwei Spiele beendet sind.
 */
export function geschaetztesEnde(matches: Match[], jetzt: number): number | undefined {
  const enden = matches
    .filter((m) => m.beendetUm !== undefined)
    .map((m) => Date.parse(m.beendetUm!))
    .sort((a, b) => a - b)
  const offene = matches.filter((m) => m.status !== 'beendet').length
  if (enden.length < 2 || offene === 0) return undefined

  const letzte = enden.slice(-8) // jüngere Spiele zählen mehr als der Turnierstart
  const abstaende: number[] = []
  for (let i = 1; i < letzte.length; i++) {
    const diff = letzte[i]! - letzte[i - 1]!
    abstaende.push(Math.min(Math.max(diff, MIN_MS), 40 * MIN_MS))
  }
  const proSpiel = abstaende.reduce((a, b) => a + b, 0) / abstaende.length
  const basis = Math.max(enden[enden.length - 1]!, jetzt)
  return basis + offene * proSpiel
}

/**
 * Minuten, die eine Paarung schon wartet: seit dem späteren der letzten
 * Match-Enden beider Beteiligter. undefined, wenn noch niemand gespielt hat.
 */
export function wartezeitMin(match: Match, matches: Match[], jetzt: number): number | undefined {
  const letztesEnde = (teilnehmerId: string): number | undefined => {
    const enden = matches
      .filter(
        (m) =>
          m.beendetUm !== undefined &&
          (m.teilnehmerAId === teilnehmerId || m.teilnehmerBId === teilnehmerId),
      )
      .map((m) => Date.parse(m.beendetUm!))
    return enden.length > 0 ? Math.max(...enden) : undefined
  }
  const basisWerte = [match.teilnehmerAId, match.teilnehmerBId]
    .filter((id): id is string => id !== undefined)
    .map(letztesEnde)
    .filter((w): w is number => w !== undefined)
  if (basisWerte.length === 0) return undefined
  return Math.max(0, Math.floor((jetzt - Math.max(...basisWerte)) / MIN_MS))
}
