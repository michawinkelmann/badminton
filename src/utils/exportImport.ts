/**
 * Export/Import des kompletten AppState sowie einzelner Turniere/Einheiten (§11).
 * Import immer über zod-Validierung — niemals ungeprüft übernehmen.
 */
import type { AppState, Einheit, Turnier, Uebung } from '../datenmodell'
import { AKTUELLE_SCHEMA_VERSION } from '../datenmodell'
import {
  AppStateSchema,
  EinheitExportSchema,
  TurnierExportSchema,
} from '../schemas/appState'

// ---------- Export ----------

export function exportDateiname(datum: Date = new Date()): string {
  const iso = datum.toISOString().slice(0, 10) // YYYY-MM-DD
  return `badminton-planer-export-${iso}.json`
}

export function erzeugeVollExport(daten: AppState): string {
  return JSON.stringify(daten, null, 2)
}

export function erzeugeTurnierExport(turnier: Turnier): string {
  return JSON.stringify(
    { typ: 'turnier-export', schemaVersion: AKTUELLE_SCHEMA_VERSION, turnier },
    null,
    2,
  )
}

/** Einheit exportieren; referenzierte eigene Übungen reisen mit. */
export function erzeugeEinheitExport(einheit: Einheit, eigeneUebungen: Uebung[]): string {
  const referenziert = new Set(einheit.bloecke.map((b) => b.uebungId))
  const mitgereiste = eigeneUebungen.filter((u) => referenziert.has(u.id))
  return JSON.stringify(
    {
      typ: 'einheit-export',
      schemaVersion: AKTUELLE_SCHEMA_VERSION,
      einheit,
      eigeneUebungen: mitgereiste,
    },
    null,
    2,
  )
}

/** JSON-Datei im Browser herunterladen. */
export function downloadTextDatei(dateiname: string, inhalt: string): void {
  const blob = new Blob([inhalt], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = dateiname
  a.click()
  URL.revokeObjectURL(url)
}

// ---------- Import ----------

export type ImportErgebnis =
  | { typ: 'voll'; daten: AppState }
  | { typ: 'turnier'; turnier: Turnier }
  | { typ: 'einheit'; einheit: Einheit; eigeneUebungen: Uebung[] }
  | { typ: 'fehler'; fehler: string }

export function parseImport(json: string): ImportErgebnis {
  let roh: unknown
  try {
    roh = JSON.parse(json)
  } catch {
    return { typ: 'fehler', fehler: 'Die Datei ist kein gültiges JSON.' }
  }

  if (typeof roh !== 'object' || roh === null) {
    return { typ: 'fehler', fehler: 'Die Datei enthält kein Datenobjekt.' }
  }

  const schemaVersion = (roh as { schemaVersion?: unknown }).schemaVersion
  if (typeof schemaVersion === 'number' && schemaVersion > AKTUELLE_SCHEMA_VERSION) {
    return {
      typ: 'fehler',
      fehler: `Die Datei stammt aus einer neueren Version des Badminton-Planers (Schema ${schemaVersion}). Aktualisiere zuerst die App.`,
    }
  }
  // Hinweis: schemaVersion < AKTUELL → hier künftige Migrationen einhängen.

  const istEinzelExport = 'typ' in roh

  if (istEinzelExport) {
    const alsTurnier = TurnierExportSchema.safeParse(roh)
    if (alsTurnier.success) return { typ: 'turnier', turnier: alsTurnier.data.turnier }

    const alsEinheit = EinheitExportSchema.safeParse(roh)
    if (alsEinheit.success) {
      return {
        typ: 'einheit',
        einheit: alsEinheit.data.einheit,
        eigeneUebungen: alsEinheit.data.eigeneUebungen,
      }
    }
    return {
      typ: 'fehler',
      fehler: 'Die Datei sieht aus wie ein Einzel-Export, ist aber unvollständig oder beschädigt.',
    }
  }

  const alsVoll = AppStateSchema.safeParse(roh)
  if (alsVoll.success) return { typ: 'voll', daten: alsVoll.data }

  const erstesProblem = alsVoll.error.issues[0]
  const pfad = erstesProblem?.path.join('.') || '(Wurzel)'
  return {
    typ: 'fehler',
    fehler: `Die Datei entspricht nicht dem erwarteten Format. Erstes Problem bei „${pfad}": ${erstesProblem?.message ?? 'unbekannt'}`,
  }
}
