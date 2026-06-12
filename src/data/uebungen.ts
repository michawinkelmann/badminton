/**
 * Übungsbibliothek (§4): 75 mitgelieferte Übungen als statische Bundle-Daten.
 * Aufgeteilt nach Kategorien in src/data/uebungen/, hier zusammengeführt.
 *
 * Verteilung: Aufwärmen 10, Schlagtechnik 20, Footwork 12, Taktik Einzel 8,
 * Taktik Doppel 8, Kondition 10, Spielformen 7.
 */
import type { Uebung } from '../datenmodell'
import { aufwaermen } from './uebungen/aufwaermen'
import { schlagtechnik } from './uebungen/schlagtechnik'
import { footwork } from './uebungen/footwork'
import { taktikEinzel } from './uebungen/taktikEinzel'
import { taktikDoppel } from './uebungen/taktikDoppel'
import { kondition } from './uebungen/kondition'
import { spielformen } from './uebungen/spielformen'

export const uebungsBibliothek: Uebung[] = [
  ...aufwaermen,
  ...schlagtechnik,
  ...footwork,
  ...taktikEinzel,
  ...taktikDoppel,
  ...kondition,
  ...spielformen,
]

/** Bibliothek + eigene Übungen zusammenführen (eigene zuletzt). */
export function alleUebungen(eigene: Uebung[]): Uebung[] {
  return [...uebungsBibliothek, ...eigene]
}

/** Übung per ID in Bibliothek und eigenen Übungen finden. */
export function findeUebung(id: string, eigene: Uebung[]): Uebung | undefined {
  return uebungsBibliothek.find((u) => u.id === id) ?? eigene.find((u) => u.id === id)
}

/** Stammt die Übung aus der mitgelieferten Bibliothek? */
export function istBibliotheksUebung(id: string): boolean {
  return uebungsBibliothek.some((u) => u.id === id)
}

/** Alle in der Bibliothek (+ eigenen) vorkommenden Materialien, alphabetisch. */
export function alleMaterialien(eigene: Uebung[]): string[] {
  const set = new Set<string>()
  for (const u of alleUebungen(eigene)) for (const m of u.material) set.add(m)
  return [...set].sort((a, b) => a.localeCompare(b, 'de'))
}
