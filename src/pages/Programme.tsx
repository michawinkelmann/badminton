import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import type { Programm } from '../datenmodell'
import { NIVEAU_NAMEN } from '../data/skills'
import { findeProgramm, programmVorlagen } from '../data/programme'
import { programmGesamtEinheiten, zuweisungFortschritt } from '../utils/tracking'
import { useAppStore } from '../store'
import BestaetigungsDialog from '../components/ui/BestaetigungsDialog'

function ProgrammKarte({ programm, onZuweisen }: { programm: Programm; onZuweisen: () => void }) {
  return (
    <div className="flex flex-col rounded-xl border-2 border-court/25 bg-linie p-4">
      <div className="flex items-start justify-between gap-2">
        <h3 className="font-bold leading-snug">{programm.name}</h3>
        {programm.istVorlage && (
          <span className="shrink-0 rounded bg-court px-2 py-0.5 text-xs font-semibold text-linie">
            Vorlage
          </span>
        )}
      </div>
      <p className="ziffern mt-1 text-sm text-tinte/65">
        {programm.wochen.length} Wochen · {programmGesamtEinheiten(programm)} Einheiten ·{' '}
        {NIVEAU_NAMEN[programm.zielniveau]}
      </p>
      <p className="mt-2 line-clamp-3 text-sm text-tinte/75">{programm.beschreibung}</p>
      <div className="mt-3 flex flex-wrap gap-2 border-t border-boden pt-3">
        <Link
          to={`/programme/${programm.id}`}
          className="min-h-11 rounded-md border-2 border-court px-3 py-2 text-sm font-semibold text-court hover:bg-boden"
        >
          Wochenplan
        </Link>
        <button
          type="button"
          onClick={onZuweisen}
          className="min-h-11 rounded-md bg-court px-3 text-sm font-semibold text-linie hover:bg-court-tief"
        >
          Zuweisen
        </button>
      </div>
    </div>
  )
}

export default function Programme() {
  const navigate = useNavigate()
  const profile = useAppStore((s) => s.profile)
  const gruppen = useAppStore((s) => s.gruppen)
  const programme = useAppStore((s) => s.programme)
  const zuweisungen = useAppStore((s) => s.zuweisungen)
  const zuweisungAnlegen = useAppStore((s) => s.zuweisungAnlegen)
  const zuweisungLoeschen = useAppStore((s) => s.zuweisungLoeschen)

  const [zuweisenFuer, setZuweisenFuer] = useState<Programm>()
  const [ziel, setZiel] = useState('')
  const [startDatum, setStartDatum] = useState(() => new Date().toISOString().slice(0, 10))
  const [loeschZuweisung, setLoeschZuweisung] = useState<string>()

  const zielName = (zielId: string, zielTyp: 'profil' | 'gruppe') =>
    zielTyp === 'profil'
      ? profile.find((p) => p.id === zielId)?.name ?? 'Profil'
      : gruppen.find((g) => g.id === zielId)?.name ?? 'Gruppe'

  function zuweisen() {
    if (!zuweisenFuer || !ziel) return
    const [typ, id] = ziel.split(':') as ['profil' | 'gruppe', string]
    const z = zuweisungAnlegen(zuweisenFuer.id, id, typ, startDatum)
    setZuweisenFuer(undefined)
    navigate(`/programme/zuweisungen/${z.id}`)
  }

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-3">
        <h1 className="schrift-display doppellinie text-3xl">Programme</h1>
        <Link
          to="/programme/neu"
          className="min-h-11 rounded-md bg-court px-4 py-2.5 text-sm font-semibold text-linie hover:bg-court-tief"
        >
          Eigenes Programm erstellen
        </Link>
      </div>
      <p className="mt-5 max-w-2xl text-sm text-tinte/75">
        Mehrwochen-Programme mit Progression: einem Profil oder einer Gruppe zuweisen, Woche
        für Woche abhaken — jedes Abhaken erzeugt automatisch Trainings-Logs.
      </p>

      {/* ---------- Aktive Zuweisungen ---------- */}
      {zuweisungen.length > 0 && (
        <section className="mt-8">
          <h2 className="schrift-display doppellinie text-xl">Aktive Zuweisungen</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {zuweisungen.map((z) => {
              const programm = findeProgramm(z.programmId, programme)
              const f = zuweisungFortschritt(z, programm)
              return (
                <div key={z.id} className="rounded-xl border-2 border-court/25 bg-linie p-4">
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <span className="font-bold">{programm?.name ?? 'Programm'}</span>
                    <span className="text-sm text-tinte/65">
                      {zielName(z.zielId, z.zielTyp)}
                    </span>
                  </div>
                  <div className="mt-2 h-2.5 overflow-hidden rounded-full bg-boden">
                    <div className="h-full bg-court" style={{ width: `${f.prozent}%` }} />
                  </div>
                  <p className="ziffern mt-1 text-xs text-tinte/60">
                    {f.erledigt}/{f.gesamt} Einheiten · Start{' '}
                    {new Date(z.startDatum).toLocaleDateString('de-DE')}
                  </p>
                  <div className="mt-3 flex gap-2 border-t border-boden pt-3">
                    <Link
                      to={`/programme/zuweisungen/${z.id}`}
                      className="min-h-11 rounded-md bg-court px-3 py-2.5 text-sm font-semibold text-linie hover:bg-court-tief"
                    >
                      Wochen abhaken
                    </Link>
                    <button
                      type="button"
                      onClick={() => setLoeschZuweisung(z.id)}
                      className="min-h-11 rounded-md px-2 text-sm font-semibold text-red-800 hover:bg-red-50"
                    >
                      Beenden …
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        </section>
      )}

      {/* ---------- Vorlagen ---------- */}
      <section className="mt-8">
        <h2 className="schrift-display doppellinie text-xl">Mitgelieferte Vorlagen</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          {programmVorlagen.map((p) => (
            <ProgrammKarte key={p.id} programm={p} onZuweisen={() => setZuweisenFuer(p)} />
          ))}
        </div>
      </section>

      {/* ---------- Eigene ---------- */}
      <section className="mt-8">
        <h2 className="schrift-display doppellinie text-xl">Eigene Programme</h2>
        {programme.length === 0 ? (
          <p className="mt-4 rounded-xl border-2 border-kork/40 bg-linie p-6 text-sm text-tinte/70">
            Noch keine eigenen Programme. Bau dir eins aus gespeicherten Einheiten zusammen —
            oder starte mit einer Vorlage.
          </p>
        ) : (
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            {programme.map((p) => (
              <ProgrammKarte key={p.id} programm={p} onZuweisen={() => setZuweisenFuer(p)} />
            ))}
          </div>
        )}
      </section>

      {/* ---------- Zuweisen-Dialog ---------- */}
      <BestaetigungsDialog
        offen={zuweisenFuer !== undefined}
        titel={`Zuweisen: ${zuweisenFuer?.name ?? ''}`}
        bestaetigenLabel="Programm zuweisen"
        onBestaetigen={zuweisen}
        onAbbrechen={() => setZuweisenFuer(undefined)}
      >
        <label className="block text-xs font-semibold text-tinte/70">
          Profil oder Gruppe
          <select
            value={ziel}
            onChange={(e) => setZiel(e.target.value)}
            className="mt-1 block min-h-11 w-full rounded-md border-2 border-court/30 bg-linie px-2 text-sm font-normal"
          >
            <option value="">Bitte wählen …</option>
            {gruppen.length > 0 && (
              <optgroup label="Gruppen">
                {gruppen.map((g) => (
                  <option key={g.id} value={`gruppe:${g.id}`}>
                    {g.name} ({g.mitgliederIds.length})
                  </option>
                ))}
              </optgroup>
            )}
            {profile.filter((p) => !p.archiviert).length > 0 && (
              <optgroup label="Profile">
                {profile
                  .filter((p) => !p.archiviert)
                  .map((p) => (
                    <option key={p.id} value={`profil:${p.id}`}>
                      {p.name}
                    </option>
                  ))}
              </optgroup>
            )}
          </select>
        </label>
        <label className="mt-3 block text-xs font-semibold text-tinte/70">
          Startdatum
          <input
            type="date"
            value={startDatum}
            onChange={(e) => setStartDatum(e.target.value)}
            className="mt-1 block min-h-11 rounded-md border-2 border-court/30 bg-linie px-3 text-sm font-normal"
          />
        </label>
        {profile.length === 0 && gruppen.length === 0 && (
          <p className="mt-3 text-sm text-red-800">
            Es gibt noch keine Profile oder Gruppen — leg zuerst welche an.
          </p>
        )}
      </BestaetigungsDialog>

      <BestaetigungsDialog
        offen={loeschZuweisung !== undefined}
        titel="Zuweisung beenden?"
        bestaetigenLabel="Zuweisung beenden"
        destruktiv
        onBestaetigen={() => {
          if (loeschZuweisung) zuweisungLoeschen(loeschZuweisung)
          setLoeschZuweisung(undefined)
        }}
        onAbbrechen={() => setLoeschZuweisung(undefined)}
      >
        Die Zuweisung wird entfernt. Bereits erzeugte Trainings-Logs bleiben erhalten.
      </BestaetigungsDialog>
    </div>
  )
}
