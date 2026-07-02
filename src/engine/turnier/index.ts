/**
 * Turnier-Engine (§9.1) — gemeinsame Einstiegspunkte, rein und UI-frei:
 * erzeugeSpielplan, trageErgebnisEin (mit Korrektur), Phasen-/Rundensteuerung.
 */
import type { Match, SatzErgebnis, Turnier } from '../../datenmodell'
import { erzeugeRng, type Rng } from './rng'
import { pruefeSaetze } from './zaehlweise'
import { erzeugeKoMatches, verteileSlots, propagiereSieger, betroffeneFolgematches, resetFolgen } from './ko'
import { erzeugeRoundRobinMatches } from './roundRobin'
import { naechsteSchweizerRunde, standardRunden } from './schweizer'
import {
  erzeugeGruppenMatches,
  gruppenAusMatches,
  gruppenphaseFertig,
  starteKoMatches,
  verteileGruppen,
} from './gruppenKo'

export * from './rng'
export * from './zaehlweise'
export * from './tabelle'
export * from './ko'
export * from './roundRobin'
export * from './schweizer'
export * from './gruppenKo'
export * from './scheduler'

/** Spielplan für ein Turnier im Status 'setup' erzeugen (§9.3 Schritt 4). */
export function erzeugeSpielplan(turnier: Turnier, rng: Rng = erzeugeRng()): Match[] {
  const ids = turnier.teilnehmer.map((t) => t.id)
  switch (turnier.format) {
    case 'ko': {
      const slots = verteileSlots(turnier.teilnehmer, rng)
      return erzeugeKoMatches(slots, {
        spielUmPlatz3: turnier.config.spielUmPlatz3 ?? false,
      })
    }
    case 'jeder_gegen_jeden':
      return erzeugeRoundRobinMatches(ids, {
        hinRueckrunde: turnier.config.hinRueckrunde ?? false,
      })
    case 'gruppen_ko': {
      const gruppen = verteileGruppen(
        turnier.teilnehmer,
        turnier.config.gruppenAnzahl ?? 2,
        rng,
      )
      return erzeugeGruppenMatches(gruppen)
    }
    case 'schweizer':
      return naechsteSchweizerRunde(turnier.teilnehmer, [], 1, rng)
  }
}

/** Anzahl Schweizer Runden dieses Turniers (Config oder Standard). */
export function schweizerRundenzahl(turnier: Turnier): number {
  return turnier.config.schweizerRunden ?? standardRunden(turnier.teilnehmer.length)
}

export function aktuelleSchweizerRunde(matches: Match[]): number {
  return Math.max(0, ...matches.map((m) => m.runde ?? 0))
}

export function istRundeKomplett(matches: Match[], runde: number): boolean {
  const rundenMatches = matches.filter((m) => m.runde === runde)
  return rundenMatches.length > 0 && rundenMatches.every((m) => m.status === 'beendet')
}

/** Nächste Schweizer Runde an die Matches anhängen (gibt NEUE Matchliste zurück). */
export function schweizerRundeAuslosen(turnier: Turnier, rng: Rng = erzeugeRng()): Match[] {
  const runde = aktuelleSchweizerRunde(turnier.matches) + 1
  const neue = naechsteSchweizerRunde(turnier.teilnehmer, turnier.matches, runde, rng)
  return [...turnier.matches, ...neue]
}

/** K.o.-Phase eines Gruppen+K.o.-Turniers starten (gibt NEUE Matchliste zurück). */
export function koPhaseStarten(turnier: Turnier, manuelleReihung: string[] = []): Match[] {
  if (!gruppenphaseFertig(turnier.matches)) {
    throw new Error('Die Gruppenphase ist noch nicht abgeschlossen.')
  }
  const gruppenMap = gruppenAusMatches(turnier.matches)
  const gruppen = [...gruppenMap.keys()].sort().map((k) => [...gruppenMap.get(k)!])
  const koMatches = starteKoMatches(
    gruppen,
    turnier.matches,
    turnier.zaehlweise,
    turnier.config.aufsteigerProGruppe ?? 2,
    turnier.config.spielUmPlatz3 ?? false,
    manuelleReihung,
  )
  return [...turnier.matches, ...koMatches]
}

export interface ErgebnisOption {
  /** Folge-Ergebnisse verwerfen (Korrektur). Ohne dieses Flag wirft die Engine,
   *  wenn abhängige Matches bereits Ergebnisse haben. */
  folgenVerwerfen?: boolean
  jetzt?: string
}

/** Betroffene Folgematches MIT Ergebnis — Grundlage für den Bestätigungsdialog (§9.3). */
export function korrekturBetroffene(turnier: Turnier, matchId: string): Match[] {
  const match = turnier.matches.find((m) => m.id === matchId)
  if (!match) return []
  if (turnier.format === 'ko' || (turnier.format === 'gruppen_ko' && match.phase === 'ko')) {
    return betroffeneFolgematches(turnier.matches, match)
  }
  if (turnier.format === 'schweizer' && match.status === 'beendet') {
    const runde = match.runde ?? 0
    return turnier.matches.filter((m) => (m.runde ?? 0) > runde)
  }
  if (turnier.format === 'gruppen_ko' && match.phase === 'gruppe' && match.status === 'beendet') {
    return turnier.matches.filter((m) => m.phase === 'ko' && (m.saetze.length > 0 || m.teilnehmerAId !== undefined))
  }
  return []
}

/**
 * Ergebnis eintragen (oder korrigieren). Validiert gegen die Zählweise und
 * propagiert im K.o. den Sieger. Gibt die NEUE Matchliste zurück.
 */
export function trageErgebnisEin(
  turnier: Turnier,
  matchId: string,
  saetze: SatzErgebnis[],
  option: ErgebnisOption = {},
): Match[] {
  const matches = turnier.matches.map((m) => ({ ...m, saetze: [...m.saetze.map((s) => ({ ...s }))] }))
  const match = matches.find((m) => m.id === matchId)
  if (!match) throw new Error('Match nicht gefunden.')
  if (!match.teilnehmerAId || !match.teilnehmerBId) {
    throw new Error('Für dieses Spiel stehen die Teilnehmer noch nicht fest.')
  }

  const auswertung = pruefeSaetze(saetze, turnier.zaehlweise)
  if (!auswertung.gueltig) throw new Error(auswertung.fehler)
  if (!auswertung.fertig) {
    throw new Error(
      `Das Ergebnis ist unvollständig — es braucht ${turnier.zaehlweise.saetzeZumSieg} Gewinnsatz/-sätze.`,
    )
  }

  const istKorrektur = match.status === 'beendet'
  const betroffene = korrekturBetroffene({ ...turnier, matches }, matchId)
  if (istKorrektur && betroffene.length > 0) {
    if (!option.folgenVerwerfen) {
      throw new Error('Folgespiele haben bereits Ergebnisse — Korrektur muss bestätigt werden.')
    }
    if (turnier.format === 'schweizer') {
      // spätere Runden komplett verwerfen
      const runde = match.runde ?? 0
      for (let i = matches.length - 1; i >= 0; i--) {
        if ((matches[i]!.runde ?? 0) > runde) matches.splice(i, 1)
      }
    } else if (turnier.format === 'gruppen_ko' && match.phase === 'gruppe') {
      // K.o.-Phase verwerfen
      for (let i = matches.length - 1; i >= 0; i--) {
        if (matches[i]!.phase === 'ko') matches.splice(i, 1)
      }
    } else {
      resetFolgen(matches, match)
    }
  } else if (istKorrektur && (turnier.format === 'ko' || match.phase === 'ko')) {
    // Folgematches ohne Ergebnis: alten Sieger sauber zurückziehen
    resetFolgen(matches, match)
  }

  match.saetze = saetze.map((s) => ({ ...s }))
  match.siegerId = auswertung.siegerSeite === 'a' ? match.teilnehmerAId : match.teilnehmerBId
  match.status = 'beendet'
  match.beendetUm = option.jetzt ?? new Date().toISOString()

  if (turnier.format === 'ko' || match.phase === 'ko') {
    propagiereSieger(matches, match)
  }
  return matches
}

/** Zwischenstand fürs Live-/Beamer-Bild (Match läuft, keine End-Validierung). */
export function setzeZwischenstand(
  turnier: Turnier,
  matchId: string,
  saetze: SatzErgebnis[],
): Match[] {
  return turnier.matches.map((m) =>
    m.id === matchId && m.status !== 'beendet'
      ? {
          ...m,
          saetze: saetze.map((s) => ({ ...s })),
          // Nur mit Feldzuweisung 'laufend' — sonst fiele das Match dauerhaft
          // aus der Scheduler-Warteschlange (spielbereiteMatches, §9.1).
          status: m.feld !== undefined ? ('laufend' as const) : ('offen' as const),
        }
      : m,
  )
}

/** Sind alle Spiele beendet (für Status 'beendet' & Endplatzierung)? */
export function alleSpieleBeendet(matches: Match[]): boolean {
  return matches.length > 0 && matches.every((m) => m.status === 'beendet')
}
