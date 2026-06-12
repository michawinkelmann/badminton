import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import type { Kategorie, Profil, SkillId, Uebung } from '../datenmodell'
import { alleMaterialien, alleUebungen } from '../data/uebungen'
import {
  ALLE_KATEGORIEN,
  ALLE_NIVEAUS,
  ALLE_SKILLS,
  KATEGORIE_NAMEN,
  NIVEAU_NAMEN,
  PERSONEN_NAMEN,
  SKILL_NAMEN,
} from '../data/skills'
import { filtereUebungen, type UebungsFilter } from '../utils/uebungsFilter'
import { useAppStore } from '../store'
import UebungsKarte from '../components/training/UebungsKarte'

function Auswahl<T extends string>({
  label,
  wert,
  onWert,
  optionen,
  namen,
}: {
  label: string
  wert: T | ''
  onWert: (w: T | '') => void
  optionen: readonly T[]
  namen: (o: T) => string
}) {
  return (
    <label className="flex flex-col gap-1 text-xs font-semibold text-tinte/70">
      {label}
      <select
        value={wert}
        onChange={(e) => onWert(e.target.value as T | '')}
        className="min-h-11 rounded-md border-2 border-court/30 bg-linie px-2 text-sm font-normal text-tinte"
      >
        <option value="">Alle</option>
        {optionen.map((o) => (
          <option key={o} value={o}>
            {namen(o)}
          </option>
        ))}
      </select>
    </label>
  )
}

export default function Uebungen() {
  const eigene = useAppStore((s) => s.eigeneUebungen)

  const [suche, setSuche] = useState('')
  const [kategorie, setKategorie] = useState<Kategorie | ''>('')
  const [skill, setSkill] = useState<SkillId | ''>('')
  const [niveau, setNiveau] = useState<Profil['niveau'] | ''>('')
  const [personen, setPersonen] = useState<Uebung['personen'] | ''>('')
  const [material, setMaterial] = useState('')
  const [maxDauer, setMaxDauer] = useState('')

  const filter: UebungsFilter = useMemo(
    () => ({
      suche: suche || undefined,
      kategorie: kategorie || undefined,
      skill: skill || undefined,
      niveau: niveau || undefined,
      personen: personen || undefined,
      material: material || undefined,
      maxDauer: maxDauer ? Number(maxDauer) : undefined,
    }),
    [suche, kategorie, skill, niveau, personen, material, maxDauer],
  )

  const treffer = useMemo(
    () => filtereUebungen(alleUebungen(eigene), filter),
    [eigene, filter],
  )
  const eigeneIds = useMemo(() => new Set(eigene.map((u) => u.id)), [eigene])
  const materialien = useMemo(() => alleMaterialien(eigene), [eigene])

  const aktiveFilter = Object.values(filter).filter((v) => v !== undefined).length

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-3">
        <h1 className="schrift-display doppellinie text-3xl">Übungsbibliothek</h1>
        <Link
          to="/uebungen/neu"
          className="min-h-11 rounded-md bg-court px-4 py-2.5 text-sm font-semibold text-linie hover:bg-court-tief"
        >
          Eigene Übung anlegen
        </Link>
      </div>

      {/* ---------- Filterleiste ---------- */}
      <div className="mt-6 rounded-xl border-2 border-court/25 bg-linie p-4">
        <input
          type="search"
          value={suche}
          onChange={(e) => setSuche(e.target.value)}
          placeholder="Suchen: Name, Beschreibung, Durchführung …"
          aria-label="Übungen durchsuchen"
          className="min-h-11 w-full rounded-md border-2 border-court/30 bg-linie px-3 text-sm"
        />
        <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          <Auswahl
            label="Kategorie"
            wert={kategorie}
            onWert={setKategorie}
            optionen={ALLE_KATEGORIEN}
            namen={(k) => KATEGORIE_NAMEN[k]}
          />
          <Auswahl
            label="Skill"
            wert={skill}
            onWert={setSkill}
            optionen={ALLE_SKILLS}
            namen={(s) => SKILL_NAMEN[s]}
          />
          <Auswahl
            label="Niveau"
            wert={niveau}
            onWert={setNiveau}
            optionen={ALLE_NIVEAUS}
            namen={(n) => NIVEAU_NAMEN[n]}
          />
          <Auswahl
            label="Personen"
            wert={personen}
            onWert={setPersonen}
            optionen={['allein', 'paar', 'gruppe'] as const}
            namen={(p) => PERSONEN_NAMEN[p]}
          />
          <label className="flex flex-col gap-1 text-xs font-semibold text-tinte/70">
            Material
            <select
              value={material}
              onChange={(e) => setMaterial(e.target.value)}
              className="min-h-11 rounded-md border-2 border-court/30 bg-linie px-2 text-sm font-normal text-tinte"
            >
              <option value="">Alle</option>
              {materialien.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
          </label>
          <label className="flex flex-col gap-1 text-xs font-semibold text-tinte/70">
            Dauer
            <select
              value={maxDauer}
              onChange={(e) => setMaxDauer(e.target.value)}
              className="min-h-11 rounded-md border-2 border-court/30 bg-linie px-2 text-sm font-normal text-tinte"
            >
              <option value="">Alle</option>
              <option value="10">bis 10 Min</option>
              <option value="15">bis 15 Min</option>
              <option value="20">bis 20 Min</option>
            </select>
          </label>
        </div>
        <p className="ziffern mt-3 text-sm text-tinte/70" role="status">
          {treffer.length} von {alleUebungen(eigene).length} Übungen
          {aktiveFilter > 0 && (
            <button
              type="button"
              onClick={() => {
                setSuche('')
                setKategorie('')
                setSkill('')
                setNiveau('')
                setPersonen('')
                setMaterial('')
                setMaxDauer('')
              }}
              className="ml-3 font-semibold text-court underline-offset-2 hover:underline"
            >
              Filter zurücksetzen
            </button>
          )}
        </p>
      </div>

      {/* ---------- Trefferliste ---------- */}
      {treffer.length === 0 ? (
        <p className="mt-8 rounded-xl border-2 border-kork/40 bg-linie p-6 text-center text-tinte/70">
          Keine Übung passt zu dieser Filterkombination. Setz einzelne Filter zurück —
          oder leg genau dafür eine eigene Übung an.
        </p>
      ) : (
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {treffer.map((u) => (
            <UebungsKarte key={u.id} uebung={u} istEigene={eigeneIds.has(u.id)} />
          ))}
        </div>
      )}
    </div>
  )
}
