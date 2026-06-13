/**
 * Ausführliche Übungsdetails (Beschreibung + Skizze), per ID gemerged in die
 * Bibliothek (siehe src/data/uebungen.ts). Getrennt von den Grunddaten gehalten,
 * damit die Kategorie-Dateien kompakt bleiben.
 */
import type { UebungsDetails } from './typen'
import { aufwaermenDetails } from './aufwaermen'
import { schlagtechnikDetails } from './schlagtechnik'
import { footworkDetails } from './footwork'
import { taktikEinzelDetails, taktikDoppelDetails } from './taktik'
import { konditionDetails, spielformenDetails } from './konditionSpielformen'

export type { UebungsDetails } from './typen'

export const uebungsDetails: Record<string, UebungsDetails> = {
  ...aufwaermenDetails,
  ...schlagtechnikDetails,
  ...footworkDetails,
  ...taktikEinzelDetails,
  ...taktikDoppelDetails,
  ...konditionDetails,
  ...spielformenDetails,
}
