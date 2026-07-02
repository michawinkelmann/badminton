/**
 * K.o.-Format (§9.2): Auffüllen auf Zweierpotenz mit Freilosen, Setzliste
 * (1/2 entgegengesetzte Hälften, 3/4 gelost auf die verbleibenden Viertel,
 * Rest gelost, Freilose zuerst an Gesetzte), Sieger-Propagation, Platz 3.
 */
import { nanoid } from 'nanoid'
import type { Match, Teilnehmer } from '../../datenmodell'
import { mische, type Rng } from './rng'

export function naechsteZweierpotenz(n: number): number {
  let p = 1
  while (p < n) p *= 2
  return p
}

export function anzahlRunden(feldGroesse: number): number {
  return Math.round(Math.log2(feldGroesse))
}

/** Erstrunden-Slots besetzen: Anker für Seeds 1–4, Rest gelost, Freilose platzieren. */
export function verteileSlots(
  teilnehmer: Teilnehmer[],
  rng: Rng,
): (string | undefined)[] {
  const n = naechsteZweierpotenz(Math.max(2, teilnehmer.length))
  const slots: (string | undefined)[] = Array(n).fill(undefined)

  const gesetzte = teilnehmer
    .filter((t) => t.setzplatz !== undefined)
    .sort((a, b) => a.setzplatz! - b.setzplatz!)
  const rest = mische(
    teilnehmer.filter((t) => t.setzplatz === undefined),
    rng,
  )

  // Anker: Seed 1 → Slot 0 (obere Hälfte), Seed 2 → Slot n-1 (untere Hälfte),
  // Seeds 3/4 GELOST auf die beiden mittleren Viertel-Anker.
  const anker34 = mische([n / 2 - 1, n / 2], rng)
  const anker: number[] = [0, n - 1, anker34[0]!, anker34[1]!]
  const platzierteGesetzte = gesetzte.slice(0, 4)
  platzierteGesetzte.forEach((t, i) => {
    slots[anker[i]!] = t.id
  })

  // Freilose: Partner-Slots der Gesetzten zuerst (Reihenfolge der Setzliste),
  // dann gelost auf weitere freie Paare.
  const byes = n - teilnehmer.length
  const byeSlots = new Set<number>()
  for (let i = 0; i < platzierteGesetzte.length && byeSlots.size < byes; i++) {
    const partner = anker[i]! ^ 1
    // Nur freie Partner-Slots (bei kleinen Feldern kann dort ein Anker sitzen)
    if (slots[partner] === undefined && !byeSlots.has(partner)) byeSlots.add(partner)
  }
  if (byeSlots.size < byes) {
    const freiePaare = mische(
      Array.from({ length: n / 2 }, (_, p) => p).filter(
        (p) =>
          slots[2 * p] === undefined &&
          slots[2 * p + 1] === undefined &&
          !byeSlots.has(2 * p) &&
          !byeSlots.has(2 * p + 1),
      ),
      rng,
    )
    for (const p of freiePaare) {
      if (byeSlots.size >= byes) break
      byeSlots.add(2 * p + 1)
    }
  }

  // Übrige Teilnehmer (inkl. Seeds 5+) gelost auf die freien Slots
  const uebrige = mische([...gesetzte.slice(4), ...rest], rng)
  let k = 0
  for (let s = 0; s < n; s++) {
    if (slots[s] === undefined && !byeSlots.has(s)) {
      slots[s] = uebrige[k]?.id
      k++
    }
  }
  return slots
}

/** Komplettes K.o.-Bracket (alle Runden + optional Spiel um Platz 3). */
export function erzeugeKoMatches(
  slots: (string | undefined)[],
  optionen: { spielUmPlatz3: boolean; phase?: 'ko' },
): Match[] {
  const n = slots.length
  const runden = anzahlRunden(n)
  const matches: Match[] = []

  for (let r = 1; r <= runden; r++) {
    const anzahl = n / 2 ** r
    for (let s = 0; s < anzahl; s++) {
      matches.push({
        id: nanoid(),
        saetze: [],
        status: 'offen',
        runde: r,
        bracketSlot: s,
        bracketTyp: 'haupt',
        ...(optionen.phase ? { phase: optionen.phase } : {}),
        ...(r === 1 ? { teilnehmerAId: slots[2 * s], teilnehmerBId: slots[2 * s + 1] } : {}),
      })
    }
  }
  if (optionen.spielUmPlatz3 && runden >= 2) {
    matches.push({
      id: nanoid(),
      saetze: [],
      status: 'offen',
      runde: runden,
      bracketSlot: 0,
      bracketTyp: 'platz3',
      ...(optionen.phase ? { phase: optionen.phase } : {}),
    })
  }

  // Freilose sofort auswerten und durchreichen
  for (const m of matches.filter((m) => m.runde === 1 && m.bracketTyp === 'haupt')) {
    const a = m.teilnehmerAId
    const b = m.teilnehmerBId
    if ((a === undefined) !== (b === undefined)) {
      m.status = 'beendet'
      m.siegerId = a ?? b
      propagiereSieger(matches, m)
    }
  }
  return matches
}

export function findeFolgematch(matches: Match[], match: Match): Match | undefined {
  if (match.bracketTyp !== 'haupt' || match.runde === undefined || match.bracketSlot === undefined)
    return undefined
  return matches.find(
    (m) =>
      m.bracketTyp === 'haupt' &&
      m.phase === match.phase &&
      m.runde === match.runde! + 1 &&
      m.bracketSlot === Math.floor(match.bracketSlot! / 2),
  )
}

function findePlatz3(matches: Match[], phase: Match['phase']): Match | undefined {
  return matches.find((m) => m.bracketTyp === 'platz3' && m.phase === phase)
}

function maxHauptRunde(matches: Match[], phase: Match['phase']): number {
  return Math.max(
    ...matches.filter((m) => m.bracketTyp === 'haupt' && m.phase === phase).map((m) => m.runde ?? 0),
  )
}

/** Sieger (und ggf. Halbfinal-Verlierer → Platz 3) in die Folgematches eintragen. */
export function propagiereSieger(matches: Match[], match: Match): void {
  if (!match.siegerId || match.bracketTyp !== 'haupt') return
  const folge = findeFolgematch(matches, match)
  if (folge) {
    if (match.bracketSlot! % 2 === 0) folge.teilnehmerAId = match.siegerId
    else folge.teilnehmerBId = match.siegerId
  }
  // Halbfinal-Verlierer ins Spiel um Platz 3
  const finalRunde = maxHauptRunde(matches, match.phase)
  if (match.runde === finalRunde - 1) {
    const platz3 = findePlatz3(matches, match.phase)
    if (platz3 && match.teilnehmerAId && match.teilnehmerBId) {
      const verlierer =
        match.siegerId === match.teilnehmerAId ? match.teilnehmerBId : match.teilnehmerAId
      if (match.bracketSlot! % 2 === 0) platz3.teilnehmerAId = verlierer
      else platz3.teilnehmerBId = verlierer
    }
    // Freilos-Halbfinale liefern keinen Verlierer (z. B. 3 Teilnehmer): Sind alle
    // Halbfinals beendet und steht nur EIN Teilnehmer fest, endet Platz 3 als Freilos.
    if (platz3 && platz3.status === 'offen' && platz3.saetze.length === 0) {
      const halbfinals = matches.filter(
        (m) =>
          m.bracketTyp === 'haupt' && m.phase === match.phase && m.runde === finalRunde - 1,
      )
      const a = platz3.teilnehmerAId
      const b = platz3.teilnehmerBId
      if (
        halbfinals.every((m) => m.status === 'beendet') &&
        (a === undefined) !== (b === undefined)
      ) {
        platz3.status = 'beendet'
        platz3.siegerId = a ?? b
      }
    }
  }
}

/** Alle Matches, deren Ergebnis/Teilnehmer an diesem Match hängen (für Korrektur-Dialog). */
export function betroffeneFolgematches(matches: Match[], match: Match): Match[] {
  const betroffen: Match[] = []
  const besuchen = (m: Match) => {
    const folge = findeFolgematch(matches, m)
    const finalRunde = maxHauptRunde(matches, m.phase)
    const kandidaten: Match[] = []
    if (folge) kandidaten.push(folge)
    if (m.runde === finalRunde - 1) {
      const p3 = findePlatz3(matches, m.phase)
      if (p3) kandidaten.push(p3)
    }
    for (const k of kandidaten) {
      if (!betroffen.includes(k)) {
        betroffen.push(k)
        besuchen(k)
      }
    }
  }
  besuchen(match)
  return betroffen.filter((m) => m.saetze.length > 0 || m.status !== 'offen')
}

/** Folge-Kette zurücksetzen (bei Ergebnis-Korrektur): Teilnehmer & Ergebnisse raus. */
export function resetFolgen(matches: Match[], match: Match): void {
  const alterSieger = match.siegerId
  const folge = findeFolgematch(matches, match)
  const finalRunde = maxHauptRunde(matches, match.phase)
  const kandidaten: Match[] = []
  if (folge) kandidaten.push(folge)
  if (match.runde === finalRunde - 1) {
    const p3 = findePlatz3(matches, match.phase)
    if (p3) kandidaten.push(p3)
  }
  for (const k of kandidaten) {
    resetFolgen(matches, k)
    if (match.bracketSlot! % 2 === 0) k.teilnehmerAId = undefined
    else k.teilnehmerBId = undefined
    // Platz 3 bekommt den VERLIERER — bei Korrektur ebenfalls leeren
    if (k.bracketTyp === 'platz3' && alterSieger) {
      if (match.bracketSlot! % 2 === 0) k.teilnehmerAId = undefined
      else k.teilnehmerBId = undefined
    }
    k.saetze = []
    k.siegerId = undefined
    k.status = 'offen'
    k.beendetUm = undefined
    k.feld = undefined
  }
}
