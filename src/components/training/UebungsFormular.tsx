import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { nanoid } from 'nanoid'
import type { Kategorie, Profil, SkillId, Uebung } from '../../datenmodell'
import {
  ALLE_KATEGORIEN,
  ALLE_NIVEAUS,
  ALLE_SKILLS,
  KATEGORIE_NAMEN,
  NIVEAU_NAMEN,
  PERSONEN_NAMEN,
  SKILL_NAMEN,
} from '../../data/skills'
import { useAppStore } from '../../store'

interface Props {
  vorhandene?: Uebung // gesetzt = Bearbeiten-Modus
}

function ListenFeld({
  label,
  hinweis,
  eintraege,
  onAendern,
}: {
  label: string
  hinweis?: string
  eintraege: string[]
  onAendern: (neu: string[]) => void
}) {
  return (
    <fieldset className="rounded-lg border-2 border-court/25 p-3">
      <legend className="px-1 text-xs font-semibold text-tinte/70">{label}</legend>
      {hinweis && <p className="mb-2 text-xs text-tinte/60">{hinweis}</p>}
      <div className="space-y-2">
        {eintraege.map((wert, i) => (
          <div key={i} className="flex gap-2">
            <textarea
              value={wert}
              rows={2}
              onChange={(e) =>
                onAendern(eintraege.map((alt, j) => (j === i ? e.target.value : alt)))
              }
              className="min-h-11 w-full rounded-md border-2 border-court/30 bg-linie px-2 py-1.5 text-sm"
            />
            <button
              type="button"
              onClick={() => onAendern(eintraege.filter((_, j) => j !== i))}
              aria-label={`${label}: Eintrag ${i + 1} entfernen`}
              className="min-h-11 min-w-11 rounded-md border-2 border-court/30 font-bold text-tinte/60 hover:border-red-700 hover:text-red-700"
            >
              ×
            </button>
          </div>
        ))}
      </div>
      <button
        type="button"
        onClick={() => onAendern([...eintraege, ''])}
        className="mt-2 min-h-11 rounded-md border-2 border-court px-3 text-sm font-semibold text-court hover:bg-boden"
      >
        Eintrag hinzufügen
      </button>
    </fieldset>
  )
}

export default function UebungsFormular({ vorhandene }: Props) {
  const navigate = useNavigate()
  const uebungSpeichern = useAppStore((s) => s.uebungSpeichern)

  const [name, setName] = useState(vorhandene?.name ?? '')
  const [kategorie, setKategorie] = useState<Kategorie>(vorhandene?.kategorie ?? 'schlagtechnik')
  const [skills, setSkills] = useState<SkillId[]>(vorhandene?.skills ?? [])
  const [niveau, setNiveau] = useState<Profil['niveau'][]>(vorhandene?.niveau ?? [])
  const [dauerMin, setDauerMin] = useState(vorhandene?.dauerMin ?? 10)
  const [personen, setPersonen] = useState<Uebung['personen']>(vorhandene?.personen ?? 'paar')
  const [material, setMaterial] = useState((vorhandene?.material ?? []).join(', '))
  const [kurzbeschreibung, setKurzbeschreibung] = useState(vorhandene?.kurzbeschreibung ?? '')
  const [durchfuehrung, setDurchfuehrung] = useState<string[]>(
    vorhandene?.durchfuehrung ?? ['', ''],
  )
  const [variationen, setVariationen] = useState<string[]>(vorhandene?.variationen ?? [])
  const [fehlerbilder, setFehlerbilder] = useState<string[]>(vorhandene?.fehlerbilder ?? [])
  const [beschreibung, setBeschreibung] = useState((vorhandene?.beschreibung ?? []).join('\n\n'))
  const [fehler, setFehler] = useState<string>()

  function umschalten<T>(liste: T[], wert: T): T[] {
    return liste.includes(wert) ? liste.filter((x) => x !== wert) : [...liste, wert]
  }

  function speichern() {
    const schritte = durchfuehrung.map((s) => s.trim()).filter(Boolean)
    if (name.trim().length < 3) return setFehler('Gib der Übung einen Namen (mindestens 3 Zeichen).')
    if (skills.length === 0) return setFehler('Wähle mindestens einen Skill, auf den die Übung einzahlt.')
    if (niveau.length === 0) return setFehler('Wähle mindestens ein geeignetes Niveau.')
    if (!kurzbeschreibung.trim()) return setFehler('Schreib eine Kurzbeschreibung (1–2 Sätze).')
    if (schritte.length < 2) return setFehler('Beschreibe die Durchführung in mindestens 2 Schritten.')

    const uebung: Uebung = {
      id: vorhandene?.id ?? `eigen-${nanoid(8)}`,
      name: name.trim(),
      kategorie,
      skills,
      niveau,
      dauerMin: Math.max(5, Math.min(60, dauerMin)),
      personen,
      material: material.split(',').map((m) => m.trim()).filter(Boolean),
      kurzbeschreibung: kurzbeschreibung.trim(),
      durchfuehrung: schritte,
      ...(beschreibung.trim()
        ? { beschreibung: beschreibung.split(/\n\s*\n/).map((a) => a.trim()).filter(Boolean) }
        : {}),
      ...(vorhandene?.skizze ? { skizze: vorhandene.skizze } : {}),
      variationen: variationen.map((v) => v.trim()).filter(Boolean),
      fehlerbilder: fehlerbilder.map((f) => f.trim()).filter(Boolean),
      ...(vorhandene?.animationId ? { animationId: vorhandene.animationId } : {}),
    }
    uebungSpeichern(uebung)
    navigate(`/uebungen/${uebung.id}`)
  }

  return (
    <div className="max-w-3xl space-y-5">
      <label className="block text-xs font-semibold text-tinte/70">
        Name
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="z. B. Clear-Drop-Kette über Kreuz"
          className="mt-1 min-h-11 w-full rounded-md border-2 border-court/30 bg-linie px-3 text-base font-normal"
        />
      </label>

      <div className="grid gap-4 sm:grid-cols-3">
        <label className="block text-xs font-semibold text-tinte/70">
          Kategorie
          <select
            value={kategorie}
            onChange={(e) => setKategorie(e.target.value as Kategorie)}
            className="mt-1 min-h-11 w-full rounded-md border-2 border-court/30 bg-linie px-2 text-sm font-normal"
          >
            {ALLE_KATEGORIEN.map((k) => (
              <option key={k} value={k}>
                {KATEGORIE_NAMEN[k]}
              </option>
            ))}
          </select>
        </label>
        <label className="block text-xs font-semibold text-tinte/70">
          Personen
          <select
            value={personen}
            onChange={(e) => setPersonen(e.target.value as Uebung['personen'])}
            className="mt-1 min-h-11 w-full rounded-md border-2 border-court/30 bg-linie px-2 text-sm font-normal"
          >
            {(['allein', 'paar', 'gruppe'] as const).map((p) => (
              <option key={p} value={p}>
                {PERSONEN_NAMEN[p]}
              </option>
            ))}
          </select>
        </label>
        <label className="block text-xs font-semibold text-tinte/70">
          Dauer (Minuten, Richtwert)
          <input
            type="number"
            min={5}
            max={60}
            step={5}
            value={dauerMin}
            onChange={(e) => setDauerMin(Number(e.target.value))}
            className="ziffern mt-1 min-h-11 w-full rounded-md border-2 border-court/30 bg-linie px-3 text-sm font-normal"
          />
        </label>
      </div>

      <fieldset className="rounded-lg border-2 border-court/25 p-3">
        <legend className="px-1 text-xs font-semibold text-tinte/70">
          Skills (worauf zahlt die Übung ein?)
        </legend>
        <div className="flex flex-wrap gap-2">
          {ALLE_SKILLS.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setSkills(umschalten(skills, s))}
              aria-pressed={skills.includes(s)}
              className={`min-h-11 rounded-full border-2 px-3 text-sm font-semibold transition-colors ${
                skills.includes(s)
                  ? 'border-court bg-court text-linie'
                  : 'border-court/30 text-tinte/70 hover:border-court'
              }`}
            >
              {SKILL_NAMEN[s]}
            </button>
          ))}
        </div>
      </fieldset>

      <fieldset className="rounded-lg border-2 border-court/25 p-3">
        <legend className="px-1 text-xs font-semibold text-tinte/70">Geeignet für Niveau</legend>
        <div className="flex flex-wrap gap-2">
          {ALLE_NIVEAUS.map((n) => (
            <button
              key={n}
              type="button"
              onClick={() => setNiveau(umschalten(niveau, n))}
              aria-pressed={niveau.includes(n)}
              className={`min-h-11 rounded-full border-2 px-3 text-sm font-semibold transition-colors ${
                niveau.includes(n)
                  ? 'border-court bg-court text-linie'
                  : 'border-court/30 text-tinte/70 hover:border-court'
              }`}
            >
              {NIVEAU_NAMEN[n]}
            </button>
          ))}
        </div>
      </fieldset>

      <label className="block text-xs font-semibold text-tinte/70">
        Material (mit Komma trennen; Schläger & Shuttles nicht nötig)
        <input
          value={material}
          onChange={(e) => setMaterial(e.target.value)}
          placeholder="z. B. Hütchen, Shuttle-Korb"
          className="mt-1 min-h-11 w-full rounded-md border-2 border-court/30 bg-linie px-3 text-sm font-normal"
        />
      </label>

      <label className="block text-xs font-semibold text-tinte/70">
        Kurzbeschreibung (1–2 Sätze)
        <textarea
          value={kurzbeschreibung}
          rows={2}
          onChange={(e) => setKurzbeschreibung(e.target.value)}
          className="mt-1 w-full rounded-md border-2 border-court/30 bg-linie px-3 py-2 text-sm font-normal"
        />
      </label>

      <label className="block text-xs font-semibold text-tinte/70">
        Ausführliche Beschreibung (optional; Leerzeile = neuer Absatz)
        <textarea
          value={beschreibung}
          rows={5}
          onChange={(e) => setBeschreibung(e.target.value)}
          placeholder="Aufbau, Organisation und Ablauf für alle, die die Übung noch nicht kennen …"
          className="mt-1 w-full rounded-md border-2 border-court/30 bg-linie px-3 py-2 text-sm font-normal"
        />
      </label>

      <ListenFeld
        label="Durchführung (nummerierte Schritte)"
        hinweis={'Konkrete Schritte mit Wiederholungs- oder Zeitangaben, z. B. „3 × 10 Clears, dann Wechsel“.'}
        eintraege={durchfuehrung}
        onAendern={setDurchfuehrung}
      />
      <ListenFeld
        label="Variationen (leichter/schwerer)"
        eintraege={variationen}
        onAendern={setVariationen}
      />
      <ListenFeld
        label="Typische Fehler → Korrektur"
        hinweis="Format: Fehler → Korrekturhinweis"
        eintraege={fehlerbilder}
        onAendern={setFehlerbilder}
      />

      {fehler && (
        <p role="alert" className="rounded-md border-2 border-red-700 bg-red-50 p-3 text-sm text-red-800">
          {fehler}
        </p>
      )}

      <div className="flex flex-wrap gap-3 border-t-2 border-court/20 pt-5">
        <button
          type="button"
          onClick={speichern}
          className="min-h-11 rounded-md bg-court px-5 text-sm font-semibold text-linie hover:bg-court-tief"
        >
          Übung speichern
        </button>
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="min-h-11 rounded-md px-4 text-sm font-semibold text-tinte/70 hover:text-tinte"
        >
          Abbrechen
        </button>
      </div>
    </div>
  )
}
