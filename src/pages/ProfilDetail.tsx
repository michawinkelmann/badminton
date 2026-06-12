import { useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { ALLE_NIVEAUS, NIVEAU_NAMEN, SKILL_NAMEN } from '../data/skills'
import { alleEinheitenMitVorlagen, findeEinheitMitVorlagen, findeProgramm } from '../data/programme'
import { findeUebung } from '../data/uebungen'
import {
  einschaetzungZum,
  kennzahlen,
  radarDaten,
  skillMinuten,
  zuweisungFortschritt,
} from '../utils/tracking'
import { useAppStore } from '../store'
import SkillRadar from '../components/training/SkillRadar'
import VolumenBalken from '../components/training/VolumenBalken'
import EinschaetzungsMaske from '../components/training/EinschaetzungsMaske'
import BestaetigungsDialog from '../components/ui/BestaetigungsDialog'

export default function ProfilDetail() {
  const { profilId } = useParams()
  const navigate = useNavigate()
  const profile = useAppStore((s) => s.profile)
  const gruppen = useAppStore((s) => s.gruppen)
  const logs = useAppStore((s) => s.logs)
  const einschaetzungen = useAppStore((s) => s.einschaetzungen)
  const einheiten = useAppStore((s) => s.einheiten)
  const programme = useAppStore((s) => s.programme)
  const zuweisungen = useAppStore((s) => s.zuweisungen)
  const profilAktualisieren = useAppStore((s) => s.profilAktualisieren)
  const profilLoeschen = useAppStore((s) => s.profilLoeschen)
  const einschaetzungenSpeichern = useAppStore((s) => s.einschaetzungenSpeichern)
  const logHinzufuegen = useAppStore((s) => s.logHinzufuegen)
  const logEntfernen = useAppStore((s) => s.logEntfernen)

  const profil = profile.find((p) => p.id === profilId)
  const [vergleichWochen, setVergleichWochen] = useState(4)
  const [loeschDialog, setLoeschDialog] = useState(false)
  const [logEinheitId, setLogEinheitId] = useState('')

  const findeE = useMemo(
    () => (id: string) => findeEinheitMitVorlagen(id, einheiten),
    [einheiten],
  )
  const eigeneLogs = useMemo(
    () => logs.filter((l) => profil && l.profilIds.includes(profil.id)),
    [logs, profil],
  )

  if (!profil) {
    return (
      <div>
        <h1 className="schrift-display doppellinie text-3xl">Profil nicht gefunden</h1>
        <Link to="/profile" className="mt-5 inline-flex min-h-11 items-center rounded-md border-2 border-court px-4 text-sm font-semibold text-court hover:bg-linie">
          Zu den Profilen
        </Link>
      </div>
    )
  }

  const radar = radarDaten(einschaetzungen, profil.id, SKILL_NAMEN, vergleichWochen)
  const minuten = skillMinuten(eigeneLogs, findeE, (id) => findeUebung(id, []))
  const zahlen = kennzahlen(eigeneLogs, findeE)
  const startWerte = einschaetzungZum(einschaetzungen, profil.id, new Date())

  const meineZuweisungen = zuweisungen.filter(
    (z) =>
      (z.zielTyp === 'profil' && z.zielId === profil.id) ||
      (z.zielTyp === 'gruppe' &&
        gruppen.find((g) => g.id === z.zielId)?.mitgliederIds.includes(profil.id)),
  )

  return (
    <div className="max-w-4xl">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="schrift-display doppellinie text-3xl">{profil.name}</h1>
          <div className="mt-4 flex flex-wrap items-center gap-3">
            <select
              value={profil.niveau}
              onChange={(e) =>
                profilAktualisieren({ ...profil, niveau: e.target.value as typeof profil.niveau })
              }
              aria-label="Niveau"
              className="min-h-11 rounded-md border-2 border-court/30 bg-linie px-2 text-sm"
            >
              {ALLE_NIVEAUS.map((n) => (
                <option key={n} value={n}>
                  {NIVEAU_NAMEN[n]}
                </option>
              ))}
            </select>
            {profil.archiviert && (
              <span className="rounded bg-tinte/10 px-2 py-1 text-xs font-semibold text-tinte/60">
                Archiviert
              </span>
            )}
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => profilAktualisieren({ ...profil, archiviert: !profil.archiviert })}
            className="min-h-11 rounded-md border-2 border-court px-3 text-sm font-semibold text-court hover:bg-linie"
          >
            {profil.archiviert ? 'Wiederherstellen' : 'Archivieren'}
          </button>
          <button
            type="button"
            onClick={() => setLoeschDialog(true)}
            className="min-h-11 rounded-md px-2 text-sm font-semibold text-red-800 hover:bg-red-50"
          >
            Löschen …
          </button>
        </div>
      </div>

      <label className="mt-4 block max-w-xl text-xs font-semibold text-tinte/70">
        Notizen
        <textarea
          value={profil.notizen ?? ''}
          rows={2}
          onChange={(e) => profilAktualisieren({ ...profil, notizen: e.target.value })}
          placeholder="z. B. Linkshänder, Knie schonen …"
          className="mt-1 w-full rounded-md border-2 border-court/30 bg-linie px-3 py-2 text-sm font-normal"
        />
      </label>

      {/* ---------- Kennzahlen ---------- */}
      <dl className="ziffern mt-6 grid grid-cols-3 gap-3 rounded-xl border-2 border-court/25 bg-linie p-4 text-center text-sm">
        <div>
          <dt className="text-xs font-semibold text-tinte/60">Einheiten (4 Wochen)</dt>
          <dd className="schrift-display text-2xl text-court">{zahlen.einheitenLetzte4Wochen}</dd>
        </div>
        <div>
          <dt className="text-xs font-semibold text-tinte/60">Einheiten gesamt</dt>
          <dd className="schrift-display text-2xl text-court">{zahlen.einheitenGesamt}</dd>
        </div>
        <div>
          <dt className="text-xs font-semibold text-tinte/60">Minuten gesamt</dt>
          <dd className="schrift-display text-2xl text-court">{zahlen.minutenGesamt}</dd>
        </div>
      </dl>

      {/* ---------- Skill-Radar ---------- */}
      <section className="mt-8 rounded-xl border-2 border-court/25 bg-linie p-5">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <h2 className="schrift-display text-lg">Skill-Radar</h2>
          <label className="flex items-center gap-2 text-sm text-tinte/70">
            Vergleich:
            <select
              value={vergleichWochen}
              onChange={(e) => setVergleichWochen(Number(e.target.value))}
              className="min-h-11 rounded-md border-2 border-court/30 bg-linie px-2 text-sm"
            >
              <option value={4}>vor 4 Wochen</option>
              <option value={8}>vor 8 Wochen</option>
              <option value={12}>vor 12 Wochen</option>
            </select>
          </label>
        </div>
        {radar.hatAktuell ? (
          <SkillRadar
            punkte={radar.punkte}
            hatVergleich={radar.hatVergleich}
            vergleichLabel={`vor ${vergleichWochen} Wochen`}
          />
        ) : (
          <p className="mt-4 text-sm text-tinte/70">
            Noch keine Einschätzung — nutze die Maske unten, dann erscheint hier das Radar.
          </p>
        )}
      </section>

      {/* ---------- Einschätzungs-Maske ---------- */}
      <section className="mt-6 rounded-xl border-2 border-court/25 bg-linie p-5">
        <h2 className="schrift-display text-lg">Selbsteinschätzung</h2>
        <div className="mt-3">
          <EinschaetzungsMaske
            startWerte={startWerte}
            onSpeichern={(werte) => einschaetzungenSpeichern(profil.id, werte)}
          />
        </div>
      </section>

      {/* ---------- Trainingsvolumen ---------- */}
      <section className="mt-6 rounded-xl border-2 border-court/25 bg-linie p-5">
        <h2 className="schrift-display text-lg">Trainingsvolumen (Minuten je Skill)</h2>
        {zahlen.einheitenGesamt === 0 ? (
          <p className="mt-4 text-sm text-tinte/70">
            Noch keine Logs. Hake Programm-Einheiten ab oder logge unten eine Einheit.
          </p>
        ) : (
          <VolumenBalken minuten={minuten} />
        )}
      </section>

      {/* ---------- Laufende Programme ---------- */}
      <section className="mt-6">
        <h2 className="schrift-display doppellinie text-xl">Laufende Programme</h2>
        {meineZuweisungen.length === 0 ? (
          <p className="mt-4 text-sm text-tinte/70">
            Keine aktive Zuweisung.{' '}
            <Link to="/programme" className="font-semibold text-court underline-offset-2 hover:underline">
              Programm zuweisen
            </Link>
          </p>
        ) : (
          <ul className="mt-4 space-y-2">
            {meineZuweisungen.map((z) => {
              const programm = findeProgramm(z.programmId, programme)
              const f = zuweisungFortschritt(z, programm)
              return (
                <li key={z.id}>
                  <Link
                    to={`/programme/zuweisungen/${z.id}`}
                    className="block rounded-xl border-2 border-court/25 bg-linie p-4 hover:border-court"
                  >
                    <div className="flex flex-wrap items-baseline justify-between gap-2">
                      <span className="font-bold">{programm?.name ?? 'Programm'}</span>
                      <span className="ziffern text-sm text-tinte/65">
                        {f.erledigt}/{f.gesamt} Einheiten
                      </span>
                    </div>
                    <div className="mt-2 h-2.5 overflow-hidden rounded-full bg-boden">
                      <div className="h-full bg-court" style={{ width: `${f.prozent}%` }} />
                    </div>
                  </Link>
                </li>
              )
            })}
          </ul>
        )}
      </section>

      {/* ---------- Einheiten-Historie ---------- */}
      <section className="mt-8">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <h2 className="schrift-display doppellinie text-xl">Einheiten-Historie</h2>
          <div className="flex items-end gap-2">
            <label className="block text-xs font-semibold text-tinte/70">
              Einheit nachtragen
              <select
                value={logEinheitId}
                onChange={(e) => setLogEinheitId(e.target.value)}
                className="mt-1 block min-h-11 w-56 rounded-md border-2 border-court/30 bg-linie px-2 text-sm font-normal"
              >
                <option value="">Einheit wählen …</option>
                {alleEinheitenMitVorlagen(einheiten).map((e) => (
                  <option key={e.id} value={e.id}>
                    {e.name}
                  </option>
                ))}
              </select>
            </label>
            <button
              type="button"
              onClick={() => {
                if (!logEinheitId) return
                logHinzufuegen([profil.id], logEinheitId, new Date().toISOString())
                setLogEinheitId('')
              }}
              className="min-h-11 rounded-md bg-court px-3 text-sm font-semibold text-linie hover:bg-court-tief"
            >
              Loggen
            </button>
          </div>
        </div>
        {eigeneLogs.length === 0 ? (
          <p className="mt-4 text-sm text-tinte/70">Noch keine absolvierten Einheiten.</p>
        ) : (
          <ul className="mt-4 space-y-2">
            {[...eigeneLogs]
              .sort((a, b) => b.datum.localeCompare(a.datum))
              .map((l) => {
                const einheit = findeE(l.einheitId)
                return (
                  <li
                    key={l.id}
                    className="flex flex-wrap items-center justify-between gap-2 rounded-lg border-2 border-court/20 bg-linie p-3 text-sm"
                  >
                    <span className="font-semibold">{einheit?.name ?? 'Einheit'}</span>
                    <span className="ziffern text-tinte/60">
                      {new Date(l.datum).toLocaleDateString('de-DE')} ·{' '}
                      {l.absolvierteUebungIds.length} Übungen
                      {l.profilIds.length > 1 && ` · Gruppe (${l.profilIds.length})`}
                    </span>
                    <button
                      type="button"
                      onClick={() => logEntfernen(l.id)}
                      aria-label="Log entfernen"
                      className="min-h-9 rounded px-2 text-xs font-semibold text-red-800 hover:bg-red-50"
                    >
                      Entfernen
                    </button>
                  </li>
                )
              })}
          </ul>
        )}
      </section>

      <Link to="/profile" className="mt-8 inline-flex min-h-11 items-center rounded-md border-2 border-court px-4 text-sm font-semibold text-court hover:bg-linie">
        Zu den Profilen
      </Link>

      <BestaetigungsDialog
        offen={loeschDialog}
        titel="Profil löschen?"
        bestaetigenLabel="Endgültig löschen"
        destruktiv
        onBestaetigen={() => {
          profilLoeschen(profil.id)
          setLoeschDialog(false)
          navigate('/profile')
        }}
        onAbbrechen={() => setLoeschDialog(false)}
      >
        „{profil.name}" wird aus allen Gruppen entfernt und gelöscht. Logs und Einschätzungen
        bleiben im Datenbestand, sind aber keinem Profil mehr zugeordnet. Tipp: Archivieren
        statt löschen behält die Historie.
      </BestaetigungsDialog>
    </div>
  )
}
