import { useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { nanoid } from 'nanoid'
import type { Profil, Programm, ProgrammWoche } from '../datenmodell'
import { ALLE_NIVEAUS, NIVEAU_NAMEN } from '../data/skills'
import { alleEinheitenMitVorlagen } from '../data/programme'
import { einheitGesamtdauer } from '../utils/vorschlag'
import { useAppStore } from '../store'

interface WochenEntwurf extends ProgrammWoche {
  lokalId: string
}

/** Eigene Programme aus gespeicherten Einheiten zusammenklicken (§6). */
export default function ProgrammEditor() {
  const { programmId } = useParams()
  const navigate = useNavigate()
  const einheiten = useAppStore((s) => s.einheiten)
  const programme = useAppStore((s) => s.programme)
  const programmSpeichern = useAppStore((s) => s.programmSpeichern)

  const vorhandenes = programme.find((p) => p.id === programmId)
  const auswahl = useMemo(() => alleEinheitenMitVorlagen(einheiten), [einheiten])

  const [name, setName] = useState(vorhandenes?.name ?? '')
  const [beschreibung, setBeschreibung] = useState(vorhandenes?.beschreibung ?? '')
  const [zielniveau, setZielniveau] = useState<Profil['niveau']>(
    vorhandenes?.zielniveau ?? 'anfaenger',
  )
  const [wochen, setWochen] = useState<WochenEntwurf[]>(
    () =>
      vorhandenes?.wochen.map((w) => ({ ...w, lokalId: nanoid(6) })) ?? [
        { lokalId: nanoid(6), nummer: 1, fokus: '', einheitIds: [], progressionsHinweis: '' },
      ],
  )
  const [fehler, setFehler] = useState<string>()

  function wocheAendern(lokalId: string, patch: Partial<ProgrammWoche>) {
    setWochen((alte) => alte.map((w) => (w.lokalId === lokalId ? { ...w, ...patch } : w)))
  }

  function einheitUmschalten(lokalId: string, einheitId: string) {
    setWochen((alte) =>
      alte.map((w) => {
        if (w.lokalId !== lokalId) return w
        const drin = w.einheitIds.includes(einheitId)
        if (!drin && w.einheitIds.length >= 3) return w // max 3 pro Woche (§3)
        return {
          ...w,
          einheitIds: drin
            ? w.einheitIds.filter((id) => id !== einheitId)
            : [...w.einheitIds, einheitId],
        }
      }),
    )
  }

  function speichern() {
    if (name.trim().length < 3) return setFehler('Gib dem Programm einen Namen.')
    if (wochen.length === 0) return setFehler('Mindestens eine Woche anlegen.')
    for (const w of wochen) {
      if (w.einheitIds.length === 0)
        return setFehler(`Woche ${w.nummer}: mindestens eine Einheit auswählen.`)
    }
    const programm: Programm = {
      id: vorhandenes?.id ?? nanoid(),
      name: name.trim(),
      beschreibung: beschreibung.trim(),
      zielniveau,
      istVorlage: false,
      wochen: wochen.map((w, i) => ({
        nummer: i + 1,
        fokus: w.fokus.trim() || `Woche ${i + 1}`,
        einheitIds: w.einheitIds,
        ...(w.progressionsHinweis?.trim()
          ? { progressionsHinweis: w.progressionsHinweis.trim() }
          : {}),
      })),
    }
    programmSpeichern(programm)
    navigate(`/programme/${programm.id}`)
  }

  return (
    <div className="max-w-3xl">
      <h1 className="schrift-display doppellinie text-3xl">
        {vorhandenes ? 'Programm bearbeiten' : 'Eigenes Programm'}
      </h1>

      <div className="mt-6 space-y-4">
        <label className="block text-xs font-semibold text-tinte/70">
          Name
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="z. B. Vereins-Vorbereitung Herbst"
            className="mt-1 min-h-11 w-full rounded-md border-2 border-court/30 bg-linie px-3 text-base font-normal"
          />
        </label>
        <label className="block text-xs font-semibold text-tinte/70">
          Beschreibung
          <textarea
            value={beschreibung}
            rows={2}
            onChange={(e) => setBeschreibung(e.target.value)}
            className="mt-1 w-full rounded-md border-2 border-court/30 bg-linie px-3 py-2 text-sm font-normal"
          />
        </label>
        <label className="block text-xs font-semibold text-tinte/70">
          Zielniveau
          <select
            value={zielniveau}
            onChange={(e) => setZielniveau(e.target.value as Profil['niveau'])}
            className="mt-1 block min-h-11 rounded-md border-2 border-court/30 bg-linie px-2 text-sm font-normal"
          >
            {ALLE_NIVEAUS.map((n) => (
              <option key={n} value={n}>
                {NIVEAU_NAMEN[n]}
              </option>
            ))}
          </select>
        </label>
      </div>

      <ol className="mt-6 space-y-4">
        {wochen.map((w, i) => (
          <li key={w.lokalId} className="rounded-xl border-2 border-court/25 bg-linie p-4">
            <div className="flex items-center justify-between gap-2">
              <span className="schrift-display text-court">Woche {i + 1}</span>
              <button
                type="button"
                onClick={() => setWochen((alte) => alte.filter((x) => x.lokalId !== w.lokalId))}
                aria-label={`Woche ${i + 1} entfernen`}
                className="min-h-9 rounded px-2 text-sm font-semibold text-red-800 hover:bg-red-50"
              >
                Entfernen
              </button>
            </div>
            <input
              value={w.fokus}
              onChange={(e) => wocheAendern(w.lokalId, { fokus: e.target.value })}
              placeholder={'Fokus, z. B. „Grundschläge festigen“'}
              className="mt-2 min-h-11 w-full rounded-md border-2 border-court/30 bg-linie px-3 text-sm"
            />
            <input
              value={w.progressionsHinweis ?? ''}
              onChange={(e) => wocheAendern(w.lokalId, { progressionsHinweis: e.target.value })}
              placeholder="Progressionshinweis: Was steigert diese Woche?"
              className="mt-2 min-h-11 w-full rounded-md border-2 border-court/30 bg-linie px-3 text-sm"
            />
            <p className="mt-3 text-xs font-semibold text-tinte/70">Einheiten (1–3)</p>
            <div className="mt-1 flex flex-wrap gap-2">
              {auswahl.map((e) => (
                <button
                  key={e.id}
                  type="button"
                  onClick={() => einheitUmschalten(w.lokalId, e.id)}
                  aria-pressed={w.einheitIds.includes(e.id)}
                  className={`min-h-11 rounded-full border-2 px-3 text-xs font-semibold ${
                    w.einheitIds.includes(e.id)
                      ? 'border-court bg-court text-linie'
                      : 'border-court/30 text-tinte/70 hover:border-court'
                  }`}
                >
                  {e.name} · {einheitGesamtdauer(e.bloecke)}′
                </button>
              ))}
            </div>
          </li>
        ))}
      </ol>

      <button
        type="button"
        onClick={() =>
          setWochen((alte) => [
            ...alte,
            {
              lokalId: nanoid(6),
              nummer: alte.length + 1,
              fokus: '',
              einheitIds: [],
              progressionsHinweis: '',
            },
          ])
        }
        className="mt-4 min-h-11 rounded-md border-2 border-court px-4 text-sm font-semibold text-court hover:bg-linie"
      >
        Woche hinzufügen
      </button>

      {fehler && (
        <p role="alert" className="mt-4 rounded-md border-2 border-red-700 bg-red-50 p-3 text-sm text-red-800">
          {fehler}
        </p>
      )}

      <div className="mt-6 flex flex-wrap gap-3 border-t-2 border-court/20 pt-5">
        <button
          type="button"
          onClick={speichern}
          className="min-h-11 rounded-md bg-court px-5 text-sm font-semibold text-linie hover:bg-court-tief"
        >
          Programm speichern
        </button>
        <Link
          to="/programme"
          className="inline-flex min-h-11 items-center rounded-md px-4 text-sm font-semibold text-tinte/70 hover:text-tinte"
        >
          Abbrechen
        </Link>
      </div>
    </div>
  )
}
