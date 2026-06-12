import { useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import type { Profil, SkillId } from '../datenmodell'
import { alleUebungen } from '../data/uebungen'
import { ALLE_NIVEAUS, ALLE_SKILLS, NIVEAU_NAMEN, SKILL_NAMEN } from '../data/skills'
import {
  einheitGesamtdauer,
  erstelleEinheitAutomatisch,
  schlageUebungenVor,
  type VorschlagsKriterien,
} from '../utils/vorschlag'
import { useAppStore } from '../store'
import BestaetigungsDialog from '../components/ui/BestaetigungsDialog'

export default function Einheiten() {
  const navigate = useNavigate()
  const einheiten = useAppStore((s) => s.einheiten)
  const eigeneUebungen = useAppStore((s) => s.eigeneUebungen)
  const einheitLoeschen = useAppStore((s) => s.einheitLoeschen)
  const einheitDuplizieren = useAppStore((s) => s.einheitDuplizieren)

  // ---------- Vorschlagssystem ----------
  const [zielSkills, setZielSkills] = useState<SkillId[]>([])
  const [niveau, setNiveau] = useState<Profil['niveau']>('anfaenger')
  const [zeitMin, setZeitMin] = useState(90)
  const [personen, setPersonen] = useState(2)
  const [nurGrundausstattung, setNurGrundausstattung] = useState(false)
  const [zeigeVorschlaege, setZeigeVorschlaege] = useState(false)
  const [hinweis, setHinweis] = useState<string>()
  const [loeschId, setLoeschId] = useState<string>()

  const uebungen = useMemo(() => alleUebungen(eigeneUebungen), [eigeneUebungen])

  const kriterien: VorschlagsKriterien = useMemo(
    () => ({
      zielSkills,
      niveau,
      zeitMin,
      personen,
      ...(nurGrundausstattung ? { material: [] as string[] } : {}),
    }),
    [zielSkills, niveau, zeitMin, personen, nurGrundausstattung],
  )

  const vorschlaege = useMemo(
    () => (zeigeVorschlaege ? schlageUebungenVor(uebungen, kriterien).slice(0, 12) : []),
    [zeigeVorschlaege, uebungen, kriterien],
  )

  function skillUmschalten(s: SkillId) {
    setHinweis(undefined)
    setZielSkills((alte) => {
      if (alte.includes(s)) return alte.filter((x) => x !== s)
      if (alte.length >= 3) {
        setHinweis('Maximal 3 Ziel-Skills — so bleibt die Einheit fokussiert.')
        return alte
      }
      return [...alte, s]
    })
  }

  function autoErstellen() {
    if (zielSkills.length === 0) {
      setHinweis('Wähle zuerst 1–3 Ziel-Skills aus.')
      return
    }
    const einheit = erstelleEinheitAutomatisch(uebungen, kriterien)
    if (!einheit) {
      setHinweis('Mit diesen Einschränkungen findet sich keine passende Übung — erhöh die Personenzahl oder erlaube mehr Material.')
      return
    }
    navigate('/einheiten/neu', { state: { entwurf: einheit, zielzeit: zeitMin } })
  }

  const loeschEinheit = einheiten.find((e) => e.id === loeschId)

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-3">
        <h1 className="schrift-display doppellinie text-3xl">Einheiten</h1>
        <Link
          to="/einheiten/neu"
          className="min-h-11 rounded-md bg-court px-4 py-2.5 text-sm font-semibold text-linie hover:bg-court-tief"
        >
          Leere Einheit anlegen
        </Link>
      </div>

      {/* ---------- Vorschlagssystem ---------- */}
      <section className="mt-6 rounded-xl border-2 border-court bg-linie p-5">
        <h2 className="schrift-display text-lg">Was willst du verbessern?</h2>
        <p className="mt-1 text-sm text-tinte/70">
          Wähle 1–3 Ziel-Skills und deine Rahmenbedingungen — du bekommst passende Übungen
          oder gleich eine komplette Einheit.
        </p>

        <div className="mt-4 flex flex-wrap gap-2">
          {ALLE_SKILLS.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => skillUmschalten(s)}
              aria-pressed={zielSkills.includes(s)}
              className={`min-h-11 rounded-full border-2 px-3 text-sm font-semibold transition-colors ${
                zielSkills.includes(s)
                  ? 'border-court bg-court text-linie'
                  : 'border-court/30 text-tinte/70 hover:border-court'
              }`}
            >
              {SKILL_NAMEN[s]}
            </button>
          ))}
        </div>

        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <label className="flex flex-col gap-1 text-xs font-semibold text-tinte/70">
            Niveau
            <select
              value={niveau}
              onChange={(e) => setNiveau(e.target.value as Profil['niveau'])}
              className="min-h-11 rounded-md border-2 border-court/30 bg-linie px-2 text-sm font-normal"
            >
              {ALLE_NIVEAUS.map((n) => (
                <option key={n} value={n}>
                  {NIVEAU_NAMEN[n]}
                </option>
              ))}
            </select>
          </label>
          <label className="flex flex-col gap-1 text-xs font-semibold text-tinte/70">
            Verfügbare Zeit
            <select
              value={zeitMin}
              onChange={(e) => setZeitMin(Number(e.target.value))}
              className="ziffern min-h-11 rounded-md border-2 border-court/30 bg-linie px-2 text-sm font-normal"
            >
              {[45, 60, 75, 90, 120].map((z) => (
                <option key={z} value={z}>
                  {z} Minuten
                </option>
              ))}
            </select>
          </label>
          <label className="flex flex-col gap-1 text-xs font-semibold text-tinte/70">
            Personenzahl
            <input
              type="number"
              min={1}
              max={40}
              value={personen}
              onChange={(e) => setPersonen(Math.max(1, Number(e.target.value)))}
              className="ziffern min-h-11 rounded-md border-2 border-court/30 bg-linie px-3 text-sm font-normal"
            />
          </label>
          <label className="flex min-h-11 items-end gap-2 pb-2 text-sm font-semibold text-tinte/80">
            <input
              type="checkbox"
              checked={nurGrundausstattung}
              onChange={(e) => setNurGrundausstattung(e.target.checked)}
              className="h-5 w-5 accent-court"
            />
            Nur Schläger & Shuttles da
          </label>
        </div>

        {hinweis && (
          <p role="status" className="mt-3 rounded-md border-2 border-kork/50 bg-boden p-2.5 text-sm">
            {hinweis}
          </p>
        )}

        <div className="mt-4 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => {
              if (zielSkills.length === 0) {
                setHinweis('Wähle zuerst 1–3 Ziel-Skills aus.')
                return
              }
              setZeigeVorschlaege(true)
            }}
            className="min-h-11 rounded-md border-2 border-court px-4 text-sm font-semibold text-court hover:bg-boden"
          >
            Übungen vorschlagen
          </button>
          <button
            type="button"
            onClick={autoErstellen}
            className="min-h-11 rounded-md bg-court px-4 text-sm font-semibold text-linie hover:bg-court-tief"
          >
            Einheit automatisch erstellen
          </button>
        </div>

        {zeigeVorschlaege && vorschlaege.length > 0 && (
          <ol className="mt-5 space-y-2 border-t-2 border-boden pt-4">
            {vorschlaege.map((v, i) => (
              <li key={v.uebung.id} className="flex flex-wrap items-center gap-x-3 gap-y-1 rounded-lg bg-boden p-3">
                <span className="ziffern schrift-display w-6 shrink-0 text-court">{i + 1}</span>
                <Link
                  to={`/uebungen/${v.uebung.id}`}
                  className="font-semibold underline-offset-2 hover:underline"
                >
                  {v.uebung.name}
                </Link>
                <span className="ziffern text-xs text-tinte/60">~{v.uebung.dauerMin} Min</span>
                <span className="flex flex-wrap gap-1">
                  {v.skillTreffer.map((s) => (
                    <span key={s} className="rounded-full bg-court px-2 py-0.5 text-xs font-semibold text-linie">
                      {SKILL_NAMEN[s]}
                    </span>
                  ))}
                  {!v.niveauPasst && (
                    <span className="rounded-full border border-kork px-2 py-0.5 text-xs text-kork">
                      anderes Niveau
                    </span>
                  )}
                </span>
              </li>
            ))}
          </ol>
        )}
        {zeigeVorschlaege && vorschlaege.length === 0 && (
          <p className="mt-4 text-sm text-tinte/70">
            Keine geeignete Übung gefunden — prüf Personenzahl und Material-Einschränkung.
          </p>
        )}
      </section>

      {/* ---------- Gespeicherte Einheiten ---------- */}
      <section className="mt-8">
        <h2 className="schrift-display doppellinie text-xl">Meine Einheiten</h2>
        {einheiten.length === 0 ? (
          <p className="mt-5 rounded-xl border-2 border-kork/40 bg-linie p-6 text-sm text-tinte/70">
            Noch keine Einheit gespeichert. Lass dir oben eine erstellen oder bau selbst eine
            im Builder zusammen.
          </p>
        ) : (
          <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {einheiten.map((e) => (
              <div key={e.id} className="flex flex-col rounded-xl border-2 border-court/25 bg-linie p-4">
                <h3 className="font-bold leading-snug">{e.name}</h3>
                <p className="ziffern mt-1 text-sm text-tinte/65">
                  {einheitGesamtdauer(e.bloecke)} Min · {e.bloecke.length} Blöcke
                </p>
                <div className="mt-2 flex flex-wrap gap-1">
                  {e.zielSkills.map((s) => (
                    <span key={s} className="rounded-full border border-court/40 px-2 py-0.5 text-xs text-court">
                      {SKILL_NAMEN[s]}
                    </span>
                  ))}
                </div>
                <div className="mt-4 flex flex-wrap gap-2 border-t border-boden pt-3">
                  <Link
                    to={`/einheiten/${e.id}`}
                    className="min-h-11 rounded-md bg-court px-3 py-2.5 text-sm font-semibold text-linie hover:bg-court-tief"
                  >
                    Öffnen
                  </Link>
                  <Link
                    to={`/einheiten/${e.id}/drucken`}
                    className="min-h-11 rounded-md border-2 border-court px-3 py-2 text-sm font-semibold text-court hover:bg-boden"
                  >
                    Drucken
                  </Link>
                  <button
                    type="button"
                    onClick={() => {
                      const kopie = einheitDuplizieren(e.id)
                      if (kopie) navigate(`/einheiten/${kopie.id}`)
                    }}
                    className="min-h-11 rounded-md border-2 border-court px-3 text-sm font-semibold text-court hover:bg-boden"
                  >
                    Duplizieren
                  </button>
                  <button
                    type="button"
                    onClick={() => setLoeschId(e.id)}
                    className="min-h-11 rounded-md px-2 text-sm font-semibold text-red-800 hover:bg-red-50"
                  >
                    Löschen …
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <BestaetigungsDialog
        offen={loeschId !== undefined}
        titel="Einheit löschen?"
        bestaetigenLabel="Endgültig löschen"
        destruktiv
        onBestaetigen={() => {
          if (loeschId) einheitLoeschen(loeschId)
          setLoeschId(undefined)
        }}
        onAbbrechen={() => setLoeschId(undefined)}
      >
        „{loeschEinheit?.name}" wird unwiderruflich gelöscht.
      </BestaetigungsDialog>
    </div>
  )
}
