import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import type { Termin, TerminTyp } from '../datenmodell'
import { alleEinheitenMitVorlagen, findeProgramm } from '../data/programme'
import { useAppStore } from '../store'
import BestaetigungsDialog from '../components/ui/BestaetigungsDialog'

const WOCHENTAGE = ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So']
const MONATE = [
  'Januar', 'Februar', 'März', 'April', 'Mai', 'Juni',
  'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember',
]
const TYP_NAMEN: Record<TerminTyp, string> = { training: 'Training', turnier: 'Turnier', sonstig: 'Sonstiges' }
const TYP_FARBEN: Record<TerminTyp, string> = {
  training: 'bg-court text-linie',
  turnier: 'bg-signal text-tinte',
  sonstig: 'bg-kork text-linie',
}

/* ---------- Datums-Helfer (lokal, ohne Zeitzonen-Fallen) ---------- */

function iso(jahr: number, monat: number, tag: number): string {
  return `${jahr}-${String(monat + 1).padStart(2, '0')}-${String(tag).padStart(2, '0')}`
}

function heuteIso(): string {
  const d = new Date()
  return iso(d.getFullYear(), d.getMonth(), d.getDate())
}

/** ISO-Datum um n Tage verschieben (rein über UTC, daher DST-sicher). */
function verschiebe(isoDatum: string, tage: number): string {
  const [j, m, t] = isoDatum.split('-').map(Number)
  const d = new Date(Date.UTC(j!, m! - 1, t! + tage))
  return iso(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate())
}

/** Montag der Woche, in der das Datum liegt. */
function montagVon(isoDatum: string): string {
  const [j, m, t] = isoDatum.split('-').map(Number)
  const d = new Date(Date.UTC(j!, m! - 1, t!))
  return verschiebe(isoDatum, -((d.getUTCDay() + 6) % 7))
}

function formatiere(isoDatum: string): string {
  const [j, m, t] = isoDatum.split('-').map(Number)
  return `${t}. ${MONATE[m! - 1]} ${j}`
}

/* ---------- Seite ---------- */

interface TagesEintrag {
  art: 'termin' | 'turnier' | 'programm' | 'log'
  text: string
  badge: string
  link?: string
  termin?: Termin
}

export default function Kalender() {
  const termine = useAppStore((s) => s.termine)
  const turniere = useAppStore((s) => s.turniere)
  const zuweisungen = useAppStore((s) => s.zuweisungen)
  const programme = useAppStore((s) => s.programme)
  const profile = useAppStore((s) => s.profile)
  const gruppen = useAppStore((s) => s.gruppen)
  const logs = useAppStore((s) => s.logs)
  const einheiten = useAppStore((s) => s.einheiten)
  const terminAnlegen = useAppStore((s) => s.terminAnlegen)
  const terminAktualisieren = useAppStore((s) => s.terminAktualisieren)
  const terminLoeschen = useAppStore((s) => s.terminLoeschen)

  const heute = heuteIso()
  const [jahr, setJahr] = useState(() => Number(heute.slice(0, 4)))
  const [monat, setMonat] = useState(() => Number(heute.slice(5, 7)) - 1) // 0-basiert
  const [gewaehlt, setGewaehlt] = useState<string>(heute)
  const [form, setForm] = useState<Partial<Termin>>()
  const [loeschTermin, setLoeschTermin] = useState<Termin>()

  const alleEinheiten = useMemo(() => alleEinheitenMitVorlagen(einheiten), [einheiten])

  function zielName(zielTyp: 'profil' | 'gruppe', zielId: string): string {
    return zielTyp === 'profil'
      ? (profile.find((p) => p.id === zielId)?.name ?? '?')
      : (gruppen.find((g) => g.id === zielId)?.name ?? '?')
  }

  /** Alle Einträge eines Tages, quer über Termine, Turniere, Programm-Wochen und Logs. */
  const eintraegeFuer = useMemo(() => {
    return (tagIso: string): TagesEintrag[] => {
      const liste: TagesEintrag[] = []
      for (const t of termine.filter((t) => t.datum === tagIso)) {
        liste.push({
          art: 'termin',
          text: `${t.zeit ? `${t.zeit} · ` : ''}${t.titel}`,
          badge: TYP_NAMEN[t.typ],
          termin: t,
        })
      }
      for (const t of turniere.filter((t) => t.datum.slice(0, 10) === tagIso)) {
        liste.push({ art: 'turnier', text: t.name, badge: 'Turnier', link: `/turniere/${t.id}` })
      }
      // Programm-Wochen: erscheinen am Montag jeder Woche der Zuweisung
      for (const z of zuweisungen) {
        const programm = findeProgramm(z.programmId, programme)
        if (!programm || !z.startDatum) continue
        const start = montagVon(z.startDatum.slice(0, 10))
        for (let w = 0; w < programm.wochen.length; w++) {
          if (verschiebe(start, w * 7) === tagIso) {
            liste.push({
              art: 'programm',
              text: `${programm.name} — Woche ${w + 1}/${programm.wochen.length} (${zielName(z.zielTyp, z.zielId)})`,
              badge: 'Programm',
              link: `/programme/zuweisungen/${z.id}`,
            })
          }
        }
      }
      for (const log of logs.filter((l) => l.datum.slice(0, 10) === tagIso)) {
        const einheit = alleEinheiten.find((e) => e.id === log.einheitId)
        liste.push({
          art: 'log',
          text: `Geloggt: ${einheit?.name ?? 'Einheit'} (${log.profilIds.length} Pers.)`,
          badge: 'Log',
        })
      }
      return liste
    }
  }, [termine, turniere, zuweisungen, programme, logs, alleEinheiten, profile, gruppen])

  /* ---------- Monatsraster (Mo–So, volle Wochen) ---------- */
  const zellen = useMemo(() => {
    const erster = iso(jahr, monat, 1)
    let cursor = montagVon(erster)
    const tage: string[] = []
    do {
      for (let i = 0; i < 7; i++) {
        tage.push(cursor)
        cursor = verschiebe(cursor, 1)
      }
    } while (cursor.slice(0, 7) === erster.slice(0, 7))
    return tage
  }, [jahr, monat])

  function monatWechseln(delta: number) {
    const neu = new Date(Date.UTC(jahr, monat + delta, 1))
    setJahr(neu.getUTCFullYear())
    setMonat(neu.getUTCMonth())
  }

  /* ---------- Termin-Formular ---------- */
  function formSpeichern() {
    if (!form?.titel?.trim()) return
    const daten = {
      datum: form.datum ?? gewaehlt,
      titel: form.titel.trim(),
      typ: form.typ ?? 'training',
      zeit: form.zeit || undefined,
      notiz: form.notiz?.trim() || undefined,
      einheitId: form.einheitId || undefined,
      gruppeId: form.gruppeId || undefined,
    }
    if (form.id) terminAktualisieren({ ...daten, id: form.id })
    else terminAnlegen(daten)
    setForm(undefined)
  }

  const kommende = useMemo(() => {
    const liste = [
      ...termine.map((t) => ({ datum: t.datum, text: t.titel, zeit: t.zeit, link: undefined as string | undefined })),
      ...turniere.map((t) => ({ datum: t.datum.slice(0, 10), text: t.name, zeit: undefined, link: `/turniere/${t.id}` })),
    ]
    return liste.filter((e) => e.datum >= heute).sort((a, b) => a.datum.localeCompare(b.datum)).slice(0, 6)
  }, [termine, turniere, heute])

  const tagesEintraege = eintraegeFuer(gewaehlt)

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-3">
        <h1 className="schrift-display doppellinie text-3xl">Kalender</h1>
        <div className="flex items-center gap-1">
          <button type="button" onClick={() => monatWechseln(-1)} aria-label="Voriger Monat" className="min-h-11 w-11 rounded-md border-2 border-court font-bold text-court hover:bg-linie">‹</button>
          <button
            type="button"
            onClick={() => { setJahr(Number(heute.slice(0, 4))); setMonat(Number(heute.slice(5, 7)) - 1); setGewaehlt(heute) }}
            className="min-h-11 rounded-md border-2 border-court px-3 text-sm font-semibold text-court hover:bg-linie"
          >
            Heute
          </button>
          <button type="button" onClick={() => monatWechseln(1)} aria-label="Nächster Monat" className="min-h-11 w-11 rounded-md border-2 border-court font-bold text-court hover:bg-linie">›</button>
        </div>
      </div>

      <p className="schrift-display mt-5 text-xl text-court">{MONATE[monat]} {jahr}</p>

      {/* ---------- Raster ---------- */}
      <div className="mt-2 grid grid-cols-7 gap-px overflow-hidden rounded-xl border-2 border-court/25 bg-court/25">
        {WOCHENTAGE.map((w) => (
          <div key={w} className="bg-linie px-1 py-1.5 text-center text-xs font-bold text-tinte/60">{w}</div>
        ))}
        {zellen.map((tag) => {
          const imMonat = Number(tag.slice(5, 7)) - 1 === monat
          const eintraege = eintraegeFuer(tag)
          return (
            <button
              key={tag}
              type="button"
              onClick={() => { setGewaehlt(tag); setForm(undefined) }}
              aria-label={formatiere(tag)}
              className={`flex min-h-16 flex-col items-stretch gap-0.5 p-1 text-left align-top sm:min-h-20 ${
                imMonat ? 'bg-linie' : 'bg-boden/70'
              } ${gewaehlt === tag ? 'outline outline-2 -outline-offset-2 outline-signal' : ''} hover:bg-boden`}
            >
              <span className={`ziffern self-end text-xs ${tag === heute ? 'rounded bg-court px-1 font-bold text-linie' : imMonat ? 'text-tinte/70' : 'text-tinte/35'}`}>
                {Number(tag.slice(8, 10))}
              </span>
              {eintraege.slice(0, 2).map((e, i) => (
                <span
                  key={i}
                  className={`hidden truncate rounded px-1 text-[10px] font-semibold leading-4 sm:block ${
                    e.art === 'termin' ? TYP_FARBEN[e.termin!.typ]
                    : e.art === 'turnier' ? 'bg-signal text-tinte'
                    : e.art === 'programm' ? 'border border-court text-court'
                    : 'bg-boden text-tinte/60'
                  }`}
                >
                  {e.text}
                </span>
              ))}
              {eintraege.length > 2 && <span className="hidden text-[10px] text-tinte/50 sm:block">+{eintraege.length - 2} mehr</span>}
              {eintraege.length > 0 && (
                <span className="flex gap-0.5 sm:hidden">
                  {eintraege.slice(0, 4).map((e, i) => (
                    <span key={i} className={`h-1.5 w-1.5 rounded-full ${e.art === 'turnier' ? 'bg-signal' : e.art === 'programm' ? 'bg-kork' : 'bg-court'}`} />
                  ))}
                </span>
              )}
            </button>
          )
        })}
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        {/* ---------- Tagespanel ---------- */}
        <section className="rounded-xl border-2 border-court/25 bg-linie p-4">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <h2 className="schrift-display text-lg text-court">{formatiere(gewaehlt)}</h2>
            <button
              type="button"
              onClick={() => setForm({ datum: gewaehlt, typ: 'training' })}
              className="min-h-11 rounded-md bg-court px-4 text-sm font-semibold text-linie hover:bg-court-tief"
            >
              Termin anlegen
            </button>
          </div>

          {tagesEintraege.length === 0 && !form && (
            <p className="mt-3 text-sm text-tinte/60">Nichts geplant an diesem Tag.</p>
          )}

          <ul className="mt-3 space-y-2">
            {tagesEintraege.map((e, i) => (
              <li key={i} className="flex flex-wrap items-center gap-2 rounded-lg border-2 border-court/15 bg-boden/60 px-3 py-2 text-sm">
                <span className={`rounded px-1.5 py-0.5 text-xs font-bold ${
                  e.art === 'termin' ? TYP_FARBEN[e.termin!.typ]
                  : e.art === 'turnier' ? 'bg-signal text-tinte'
                  : e.art === 'programm' ? 'border border-court text-court'
                  : 'bg-linie text-tinte/60'
                }`}>{e.badge}</span>
                <span className="font-semibold">{e.text}</span>
                {e.link && <Link to={e.link} className="ml-auto text-sm font-semibold text-court underline hover:text-court-tief">Öffnen</Link>}
                {e.termin && (
                  <span className="ml-auto flex gap-1">
                    <button type="button" onClick={() => setForm({ ...e.termin })} className="min-h-9 rounded px-2 text-xs font-semibold text-court hover:bg-linie">Bearbeiten</button>
                    <button type="button" onClick={() => setLoeschTermin(e.termin)} className="min-h-9 rounded px-2 text-xs font-semibold text-red-800 hover:bg-red-50">Löschen</button>
                  </span>
                )}
              </li>
            ))}
          </ul>

          {/* Formular */}
          {form && (
            <div className="mt-4 space-y-3 rounded-lg border-2 border-court/30 bg-boden/50 p-3">
              <div className="grid gap-3 sm:grid-cols-2">
                <label className="block text-sm">
                  <span className="font-semibold">Titel</span>
                  <input
                    value={form.titel ?? ''}
                    onChange={(e) => setForm((f) => ({ ...f, titel: e.target.value }))}
                    placeholder="z. B. Vereinstraining"
                    className="mt-1 w-full min-h-11 rounded-md border-2 border-court/30 bg-linie px-3"
                  />
                </label>
                <label className="block text-sm">
                  <span className="font-semibold">Typ</span>
                  <select
                    value={form.typ ?? 'training'}
                    onChange={(e) => setForm((f) => ({ ...f, typ: e.target.value as TerminTyp }))}
                    className="mt-1 w-full min-h-11 rounded-md border-2 border-court/30 bg-linie px-2"
                  >
                    {(Object.keys(TYP_NAMEN) as TerminTyp[]).map((t) => (
                      <option key={t} value={t}>{TYP_NAMEN[t]}</option>
                    ))}
                  </select>
                </label>
                <label className="block text-sm">
                  <span className="font-semibold">Datum</span>
                  <input
                    type="date"
                    value={form.datum ?? gewaehlt}
                    onChange={(e) => setForm((f) => ({ ...f, datum: e.target.value }))}
                    className="mt-1 w-full min-h-11 rounded-md border-2 border-court/30 bg-linie px-3"
                  />
                </label>
                <label className="block text-sm">
                  <span className="font-semibold">Uhrzeit (optional)</span>
                  <input
                    type="time"
                    value={form.zeit ?? ''}
                    onChange={(e) => setForm((f) => ({ ...f, zeit: e.target.value }))}
                    className="mt-1 w-full min-h-11 rounded-md border-2 border-court/30 bg-linie px-3"
                  />
                </label>
                <label className="block text-sm">
                  <span className="font-semibold">Einheit (optional)</span>
                  <select
                    value={form.einheitId ?? ''}
                    onChange={(e) => setForm((f) => ({ ...f, einheitId: e.target.value }))}
                    className="mt-1 w-full min-h-11 rounded-md border-2 border-court/30 bg-linie px-2"
                  >
                    <option value="">—</option>
                    {alleEinheiten.map((e) => (
                      <option key={e.id} value={e.id}>{e.name}</option>
                    ))}
                  </select>
                </label>
                <label className="block text-sm">
                  <span className="font-semibold">Gruppe (optional)</span>
                  <select
                    value={form.gruppeId ?? ''}
                    onChange={(e) => setForm((f) => ({ ...f, gruppeId: e.target.value }))}
                    className="mt-1 w-full min-h-11 rounded-md border-2 border-court/30 bg-linie px-2"
                  >
                    <option value="">—</option>
                    {gruppen.map((g) => (
                      <option key={g.id} value={g.id}>{g.name}</option>
                    ))}
                  </select>
                </label>
              </div>
              <label className="block text-sm">
                <span className="font-semibold">Notiz (optional)</span>
                <input
                  value={form.notiz ?? ''}
                  onChange={(e) => setForm((f) => ({ ...f, notiz: e.target.value }))}
                  className="mt-1 w-full min-h-11 rounded-md border-2 border-court/30 bg-linie px-3"
                />
              </label>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={formSpeichern}
                  disabled={!form.titel?.trim()}
                  className="min-h-11 rounded-md bg-court px-4 text-sm font-semibold text-linie hover:bg-court-tief disabled:opacity-40"
                >
                  {form.id ? 'Termin aktualisieren' : 'Termin speichern'}
                </button>
                <button type="button" onClick={() => setForm(undefined)} className="min-h-11 rounded-md px-3 text-sm font-semibold text-tinte/70 hover:text-tinte">
                  Abbrechen
                </button>
              </div>
            </div>
          )}
        </section>

        {/* ---------- Nächste Termine ---------- */}
        <section>
          <h2 className="schrift-display doppellinie text-xl">Als Nächstes im Plan</h2>
          {kommende.length === 0 ? (
            <p className="mt-4 rounded-xl border-2 border-kork/40 bg-linie p-5 text-sm text-tinte/70">
              Noch nichts geplant. Lege Termine an oder setze bei einer Programm-Zuweisung
              ein Startdatum — die Wochen erscheinen dann automatisch hier im Kalender.
            </p>
          ) : (
            <ul className="mt-4 space-y-2">
              {kommende.map((e, i) => (
                <li key={i} className="flex flex-wrap items-baseline gap-x-3 rounded-lg border-2 border-court/20 bg-linie px-3 py-2 text-sm">
                  <span className="ziffern font-bold text-court">{formatiere(e.datum)}</span>
                  {e.zeit && <span className="ziffern text-tinte/60">{e.zeit}</span>}
                  <span className="font-semibold">{e.text}</span>
                  {e.link && <Link to={e.link} className="ml-auto font-semibold text-court underline hover:text-court-tief">Öffnen</Link>}
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>

      <BestaetigungsDialog
        offen={loeschTermin !== undefined}
        titel="Termin löschen?"
        bestaetigenLabel="Löschen"
        destruktiv
        onBestaetigen={() => { if (loeschTermin) terminLoeschen(loeschTermin.id); setLoeschTermin(undefined) }}
        onAbbrechen={() => setLoeschTermin(undefined)}
      >
        „{loeschTermin?.titel}" am {loeschTermin ? formatiere(loeschTermin.datum) : ''} wird gelöscht.
      </BestaetigungsDialog>
    </div>
  )
}
