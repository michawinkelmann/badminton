/**
 * CSV-Exporte für die Notenliste (§-Erweiterung Lehrer):
 * Semikolon-getrennt + BOM, damit deutsches Excel Umlaute und Spalten korrekt liest.
 */
import type { Einheit, Profil, SkillEinschaetzung, TrainingsLog } from '../datenmodell'
import { ALLE_SKILLS, NIVEAU_NAMEN, SKILL_NAMEN } from '../data/skills'

const BOM = '﻿'

function feld(wert: string | number): string {
  let text = String(wert)
  // Formel-Injection-Schutz: führende =, +, -, @ neutralisiert Excel als Text.
  // Reine Zahlen (auch "-3") bleiben unverändert.
  if (/^[=+\-@]/.test(text) && Number.isNaN(Number(text))) text = `'${text}`
  return /[;"\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text
}

export function zeilenZuCsv(zeilen: (string | number)[][]): string {
  return BOM + zeilen.map((z) => z.map(feld).join(';')).join('\r\n') + '\r\n'
}

/**
 * Breites Format, eine Zeile pro Profil: Name;Niveau;<je Skill aktuellster Wert>;Stand.
 * Historie wird auf den jeweils neuesten Wert pro Skill reduziert.
 */
export function einschaetzungenCsv(profile: Profil[], einschaetzungen: SkillEinschaetzung[]): string {
  const kopf = ['Name', 'Niveau', ...ALLE_SKILLS.map((s) => SKILL_NAMEN[s]), 'Stand']
  const zeilen: (string | number)[][] = [kopf]

  for (const profil of profile.filter((p) => !p.archiviert)) {
    const eigene = einschaetzungen.filter((e) => e.profilId === profil.id)
    let neuestes = ''
    const werte = ALLE_SKILLS.map((skill) => {
      const passende = eigene.filter((e) => e.skill === skill)
      if (passende.length === 0) return ''
      const aktuell = passende.reduce((a, b) => (a.datum >= b.datum ? a : b))
      if (aktuell.datum > neuestes) neuestes = aktuell.datum
      return aktuell.wert
    })
    zeilen.push([profil.name, NIVEAU_NAMEN[profil.niveau], ...werte, neuestes.slice(0, 10)])
  }
  return zeilenZuCsv(zeilen)
}

/** Eine Zeile pro Person und geloggter Einheit: Datum;Name;Einheit;Minuten;Übungen. */
export function logsCsv(profile: Profil[], logs: TrainingsLog[], einheiten: Einheit[]): string {
  const zeilen: (string | number)[][] = [['Datum', 'Name', 'Einheit', 'Minuten', 'Übungen']]
  const sortiert = [...logs].sort((a, b) => a.datum.localeCompare(b.datum))

  for (const log of sortiert) {
    const einheit = einheiten.find((e) => e.id === log.einheitId)
    const minuten = einheit
      ? einheit.bloecke
          .filter((b) => log.absolvierteUebungIds.includes(b.uebungId))
          .reduce((summe, b) => summe + b.dauerMin, 0)
      : 0
    for (const profilId of log.profilIds) {
      const profil = profile.find((p) => p.id === profilId)
      if (!profil) continue
      zeilen.push([
        log.datum.slice(0, 10),
        profil.name,
        einheit?.name ?? 'Unbekannte Einheit',
        minuten,
        log.absolvierteUebungIds.length,
      ])
    }
  }
  return zeilenZuCsv(zeilen)
}
