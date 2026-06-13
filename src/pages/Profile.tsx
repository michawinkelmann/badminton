import { useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import type { Gruppe, Profil } from '../datenmodell'
import { ALLE_NIVEAUS, NIVEAU_NAMEN } from '../data/skills'
import { alleEinheitenMitVorlagen } from '../data/programme'
import { useAppStore } from '../store'
import BestaetigungsDialog from '../components/ui/BestaetigungsDialog'

export default function Profile() {
  const navigate = useNavigate()
  const profile = useAppStore((s) => s.profile)
  const gruppen = useAppStore((s) => s.gruppen)
  const einheiten = useAppStore((s) => s.einheiten)
  const profilAnlegen = useAppStore((s) => s.profilAnlegen)
  const gruppeAnlegen = useAppStore((s) => s.gruppeAnlegen)
  const gruppeAktualisieren = useAppStore((s) => s.gruppeAktualisieren)
  const gruppeLoeschen = useAppStore((s) => s.gruppeLoeschen)
  const logHinzufuegen = useAppStore((s) => s.logHinzufuegen)

  const [zeigeArchivierte, setZeigeArchivierte] = useState(false)
  const [name, setName] = useState('')
  const [niveau, setNiveau] = useState<Profil['niveau']>('anfaenger')

  const [schnellListe, setSchnellListe] = useState('')
  const [schnellNiveau, setSchnellNiveau] = useState<Profil['niveau']>('anfaenger')
  const [schnellGruppe, setSchnellGruppe] = useState('')
  const [schnellMeldung, setSchnellMeldung] = useState<string>()

  const [gruppenForm, setGruppenForm] = useState<Gruppe | 'neu'>()
  const [gruppenName, setGruppenName] = useState('')
  const [mitglieder, setMitglieder] = useState<string[]>([])
  const [loeschGruppe, setLoeschGruppe] = useState<Gruppe>()

  const [logGruppe, setLogGruppe] = useState<Gruppe>()
  const [logEinheitId, setLogEinheitId] = useState('')
  const [logMeldung, setLogMeldung] = useState<string>()

  const sichtbare = profile.filter((p) => zeigeArchivierte || !p.archiviert)
  const alleEinheiten = useMemo(() => alleEinheitenMitVorlagen(einheiten), [einheiten])

  function gruppeSpeichern() {
    if (gruppenName.trim().length < 2) return
    if (gruppenForm === 'neu') {
      gruppeAnlegen(gruppenName.trim(), mitglieder)
    } else if (gruppenForm) {
      gruppeAktualisieren({ ...gruppenForm, name: gruppenName.trim(), mitgliederIds: mitglieder })
    }
    setGruppenForm(undefined)
  }

  return (
    <div>
      <h1 className="schrift-display doppellinie text-3xl">Profile & Gruppen</h1>

      {/* ---------- Profil anlegen ---------- */}
      <section className="mt-6 rounded-xl border-2 border-court bg-linie p-5">
        <h2 className="schrift-display text-lg">Profil anlegen</h2>
        <div className="mt-3 flex flex-wrap items-end gap-3">
          <label className="block text-xs font-semibold text-tinte/70">
            Name
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="z. B. Alex"
              className="mt-1 block min-h-11 w-56 rounded-md border-2 border-court/30 bg-linie px-3 text-base font-normal"
            />
          </label>
          <label className="block text-xs font-semibold text-tinte/70">
            Niveau
            <select
              value={niveau}
              onChange={(e) => setNiveau(e.target.value as Profil['niveau'])}
              className="mt-1 block min-h-11 rounded-md border-2 border-court/30 bg-linie px-2 text-sm font-normal"
            >
              {ALLE_NIVEAUS.map((n) => (
                <option key={n} value={n}>
                  {NIVEAU_NAMEN[n]}
                </option>
              ))}
            </select>
          </label>
          <button
            type="button"
            onClick={() => {
              if (name.trim().length < 2) return
              const p = profilAnlegen(name.trim(), niveau)
              setName('')
              navigate(`/profile/${p.id}`)
            }}
            className="min-h-11 rounded-md bg-court px-4 text-sm font-semibold text-linie hover:bg-court-tief"
          >
            Profil anlegen
          </button>
        </div>

        {/* Schnelleingabe: ganze Klasse/Gruppe auf einmal */}
        <details className="mt-4 rounded-lg border-2 border-court/20 bg-boden/50 p-3 open:pb-4">
          <summary className="cursor-pointer select-none text-sm font-semibold text-court">
            Schnelleingabe: Namensliste einfügen (z. B. ganze Klasse)
          </summary>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            <label className="block text-xs font-semibold text-tinte/70">
              Ein Name pro Zeile
              <textarea
                value={schnellListe}
                onChange={(e) => setSchnellListe(e.target.value)}
                rows={6}
                placeholder={'Lena\nBen\nMia\n…'}
                className="mt-1 block w-full rounded-md border-2 border-court/30 bg-linie px-3 py-2 text-base font-normal"
              />
            </label>
            <div className="space-y-3">
              <label className="block text-xs font-semibold text-tinte/70">
                Niveau für alle
                <select
                  value={schnellNiveau}
                  onChange={(e) => setSchnellNiveau(e.target.value as Profil['niveau'])}
                  className="mt-1 block min-h-11 w-full rounded-md border-2 border-court/30 bg-linie px-2 text-sm font-normal"
                >
                  {ALLE_NIVEAUS.map((n) => (
                    <option key={n} value={n}>{NIVEAU_NAMEN[n]}</option>
                  ))}
                </select>
              </label>
              <label className="block text-xs font-semibold text-tinte/70">
                Direkt als Gruppe anlegen (optional)
                <input
                  value={schnellGruppe}
                  onChange={(e) => setSchnellGruppe(e.target.value)}
                  placeholder="z. B. Klasse 8b"
                  className="mt-1 block min-h-11 w-full rounded-md border-2 border-court/30 bg-linie px-3 text-base font-normal"
                />
              </label>
              <button
                type="button"
                onClick={() => {
                  const namen = [...new Set(
                    schnellListe.split('\n').map((z) => z.trim()).filter((z) => z.length >= 2),
                  )]
                  if (namen.length === 0) return
                  const ids = namen.map((n) => profilAnlegen(n, schnellNiveau).id)
                  if (schnellGruppe.trim().length >= 2) gruppeAnlegen(schnellGruppe.trim(), ids)
                  setSchnellMeldung(
                    `${ids.length} Profile angelegt${schnellGruppe.trim().length >= 2 ? ` und zur Gruppe „${schnellGruppe.trim()}" zusammengefasst` : ''}.`,
                  )
                  setSchnellListe('')
                  setSchnellGruppe('')
                }}
                disabled={schnellListe.trim().length < 2}
                className="min-h-11 w-full rounded-md bg-court px-4 text-sm font-semibold text-linie hover:bg-court-tief disabled:opacity-40"
              >
                Alle anlegen
              </button>
              {schnellMeldung && (
                <p role="status" className="rounded-md border-2 border-court/40 bg-linie p-2 text-sm text-court">
                  {schnellMeldung}
                </p>
              )}
            </div>
          </div>
        </details>
      </section>

      {/* ---------- Profilliste ---------- */}
      <section className="mt-8">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <h2 className="schrift-display doppellinie text-xl">Profile</h2>
          {profile.some((p) => p.archiviert) && (
            <label className="flex items-center gap-2 text-sm text-tinte/70">
              <input
                type="checkbox"
                checked={zeigeArchivierte}
                onChange={(e) => setZeigeArchivierte(e.target.checked)}
                className="h-4 w-4 accent-court"
              />
              Archivierte zeigen
            </label>
          )}
        </div>
        {sichtbare.length === 0 ? (
          <p className="mt-5 rounded-xl border-2 border-kork/40 bg-linie p-6 text-sm text-tinte/70">
            Noch keine Profile. Leg oben das erste an — Spieler tauchen dann im Tracking auf
            und lassen sich in Gruppen und Turniere übernehmen.
          </p>
        ) : (
          <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {sichtbare.map((p) => (
              <Link
                key={p.id}
                to={`/profile/${p.id}`}
                className="rounded-xl border-2 border-court/25 bg-linie p-4 hover:border-court"
              >
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-bold">{p.name}</h3>
                  {p.archiviert && (
                    <span className="rounded bg-tinte/10 px-2 py-0.5 text-xs font-semibold text-tinte/60">
                      Archiviert
                    </span>
                  )}
                </div>
                <p className="mt-1 text-sm text-tinte/65">{NIVEAU_NAMEN[p.niveau]}</p>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* ---------- Gruppen ---------- */}
      <section className="mt-8">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <h2 className="schrift-display doppellinie text-xl">Gruppen</h2>
          <button
            type="button"
            onClick={() => {
              setGruppenForm('neu')
              setGruppenName('')
              setMitglieder([])
            }}
            className="min-h-11 rounded-md bg-court px-4 text-sm font-semibold text-linie hover:bg-court-tief"
          >
            Gruppe anlegen
          </button>
        </div>

        {gruppenForm && (
          <div className="mt-4 rounded-xl border-2 border-court bg-linie p-4">
            <label className="block text-xs font-semibold text-tinte/70">
              Gruppenname
              <input
                value={gruppenName}
                onChange={(e) => setGruppenName(e.target.value)}
                placeholder="z. B. Badminton-AG Mittwoch"
                className="mt-1 block min-h-11 w-full max-w-md rounded-md border-2 border-court/30 bg-linie px-3 text-base font-normal"
              />
            </label>
            <p className="mt-3 text-xs font-semibold text-tinte/70">Mitglieder</p>
            <div className="mt-1 flex flex-wrap gap-2">
              {profile.filter((p) => !p.archiviert).map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() =>
                    setMitglieder((m) =>
                      m.includes(p.id) ? m.filter((x) => x !== p.id) : [...m, p.id],
                    )
                  }
                  aria-pressed={mitglieder.includes(p.id)}
                  className={`min-h-11 rounded-full border-2 px-3 text-sm font-semibold ${
                    mitglieder.includes(p.id)
                      ? 'border-court bg-court text-linie'
                      : 'border-court/30 text-tinte/70 hover:border-court'
                  }`}
                >
                  {p.name}
                </button>
              ))}
              {profile.filter((p) => !p.archiviert).length === 0 && (
                <p className="text-sm text-tinte/60">Erst Profile anlegen.</p>
              )}
            </div>
            <div className="mt-4 flex gap-3">
              <button
                type="button"
                onClick={gruppeSpeichern}
                className="min-h-11 rounded-md bg-court px-4 text-sm font-semibold text-linie hover:bg-court-tief"
              >
                Gruppe speichern
              </button>
              <button
                type="button"
                onClick={() => setGruppenForm(undefined)}
                className="min-h-11 rounded-md px-3 text-sm font-semibold text-tinte/70 hover:text-tinte"
              >
                Abbrechen
              </button>
            </div>
          </div>
        )}

        {gruppen.length === 0 && !gruppenForm ? (
          <p className="mt-4 rounded-xl border-2 border-kork/40 bg-linie p-6 text-sm text-tinte/70">
            Noch keine Gruppen. Eine Gruppe bündelt Profile — fürs gemeinsame Loggen,
            Programm-Zuweisungen und später die Turnier-Teilnahme.
          </p>
        ) : (
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {gruppen.map((g) => {
              const namen = g.mitgliederIds
                .map((id) => profile.find((p) => p.id === id)?.name)
                .filter(Boolean)
              return (
                <div key={g.id} className="rounded-xl border-2 border-court/25 bg-linie p-4">
                  <h3 className="font-bold">{g.name}</h3>
                  <p className="ziffern mt-1 text-sm text-tinte/65">
                    {namen.length} Mitglieder{namen.length > 0 && `: ${namen.join(', ')}`}
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2 border-t border-boden pt-3">
                    <button
                      type="button"
                      onClick={() => {
                        setLogGruppe(g)
                        setLogEinheitId('')
                        setLogMeldung(undefined)
                      }}
                      className="min-h-11 rounded-md bg-court px-3 text-sm font-semibold text-linie hover:bg-court-tief"
                    >
                      Einheit loggen
                    </button>
                    <button
                      type="button"
                      onClick={() => navigate('/turniere/neu', { state: { gruppeId: g.id } })}
                      className="min-h-11 rounded-md border-2 border-court px-3 text-sm font-semibold text-court hover:bg-boden"
                    >
                      Als Turnier-Teilnehmer übernehmen
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setGruppenForm(g)
                        setGruppenName(g.name)
                        setMitglieder(g.mitgliederIds)
                      }}
                      className="min-h-11 rounded-md border-2 border-court px-3 text-sm font-semibold text-court hover:bg-boden"
                    >
                      Bearbeiten
                    </button>
                    <button
                      type="button"
                      onClick={() => setLoeschGruppe(g)}
                      className="min-h-11 rounded-md px-2 text-sm font-semibold text-red-800 hover:bg-red-50"
                    >
                      Löschen …
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </section>

      {/* ---------- Einheit für Gruppe loggen ---------- */}
      <BestaetigungsDialog
        offen={logGruppe !== undefined}
        titel={`Einheit loggen: ${logGruppe?.name ?? ''}`}
        bestaetigenLabel="Für alle Mitglieder loggen"
        onBestaetigen={() => {
          if (logGruppe && logEinheitId) {
            logHinzufuegen(logGruppe.mitgliederIds, logEinheitId, new Date().toISOString())
            setLogMeldung(`Geloggt für ${logGruppe.mitgliederIds.length} Mitglieder.`)
          }
          setLogGruppe(undefined)
        }}
        onAbbrechen={() => setLogGruppe(undefined)}
      >
        <label className="block text-xs font-semibold text-tinte/70">
          Welche Einheit wurde absolviert?
          <select
            value={logEinheitId}
            onChange={(e) => setLogEinheitId(e.target.value)}
            className="mt-1 block min-h-11 w-full rounded-md border-2 border-court/30 bg-linie px-2 text-sm font-normal"
          >
            <option value="">Bitte wählen …</option>
            {alleEinheiten.map((e) => (
              <option key={e.id} value={e.id}>
                {e.name}
              </option>
            ))}
          </select>
        </label>
        <p className="mt-2 text-xs text-tinte/60">
          Erzeugt einen Trainings-Log mit allen Übungen der Einheit für jedes Mitglied.
        </p>
      </BestaetigungsDialog>

      {logMeldung && (
        <p role="status" className="mt-4 rounded-md border-2 border-court/40 bg-linie p-3 text-sm">
          {logMeldung}
        </p>
      )}

      <BestaetigungsDialog
        offen={loeschGruppe !== undefined}
        titel="Gruppe löschen?"
        bestaetigenLabel="Endgültig löschen"
        destruktiv
        onBestaetigen={() => {
          if (loeschGruppe) gruppeLoeschen(loeschGruppe.id)
          setLoeschGruppe(undefined)
        }}
        onAbbrechen={() => setLoeschGruppe(undefined)}
      >
        „{loeschGruppe?.name}" wird gelöscht (Profile bleiben erhalten). Zuweisungen an diese
        Gruppe werden entfernt.
      </BestaetigungsDialog>
    </div>
  )
}
