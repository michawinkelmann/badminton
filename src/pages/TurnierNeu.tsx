import { useMemo, useState } from 'react'
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom'
import {
  DndContext,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core'
import { SortableContext, arrayMove, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { nanoid } from 'nanoid'
import type { Disziplin, Teilnehmer, Turnier, TurnierFormat, Zaehlweise } from '../datenmodell'
import { ZAEHLWEISE_PRESETS, erzeugeRng, gruppenVorschlag, koPhaseMoeglich, mische, standardRunden } from '../engine/turnier'
import { useAppStore } from '../store'

const FORMATE: { wert: TurnierFormat; name: string; text: string }[] = [
  { wert: 'ko', name: 'K.o.-System', text: 'Wer verliert, scheidet aus. Schnell, spannend — mit Setzliste und optionalem Spiel um Platz 3.' },
  { wert: 'gruppen_ko', name: 'Gruppen + K.o.', text: 'Erst Round Robin in Gruppen, dann steigen die Besten in ein K.o. auf. Viele Spiele für alle.' },
  { wert: 'jeder_gegen_jeden', name: 'Jeder gegen Jeden', text: 'Alle spielen gegen alle, die Tabelle entscheidet. Fair, planbar — ideal für kleine Felder.' },
  { wert: 'schweizer', name: 'Schweizer System', text: 'Feste Rundenzahl, Paarungen nach Spielstärke, niemand scheidet aus. Stark bei großen Feldern.' },
]

const DISZIPLINEN: { wert: Disziplin; name: string }[] = [
  { wert: 'einzel', name: 'Einzel' },
  { wert: 'doppel', name: 'Doppel' },
  { wert: 'mixed', name: 'Mixed' },
]

function SetzZeile({ teilnehmer, platz }: { teilnehmer: Teilnehmer; platz: number }) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: teilnehmer.id })
  return (
    <li
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className="flex items-center gap-2 rounded-lg border-2 border-court/25 bg-linie p-2"
    >
      <button
        type="button"
        {...listeners}
        {...attributes}
        aria-label={`${teilnehmer.name} in der Setzliste verschieben`}
        className="min-h-11 min-w-9 cursor-grab touch-none rounded text-tinte/40 hover:text-court active:cursor-grabbing"
      >
        ⠿
      </button>
      <span className="schrift-display w-7 text-court">{platz}</span>
      <span className="flex-1 truncate text-sm font-semibold">{teilnehmer.name}</span>
    </li>
  )
}

/** Turnier-Setup (§9.3, Schritte 1–4) — auch für Turniere im Status „setup". */
export default function TurnierNeu() {
  const { turnierId } = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const gruppen = useAppStore((s) => s.gruppen)
  const profile = useAppStore((s) => s.profile)
  const turniere = useAppStore((s) => s.turniere)
  const turnierAnlegen = useAppStore((s) => s.turnierAnlegen)
  const turnierAktualisieren = useAppStore((s) => s.turnierAktualisieren)
  const spielplanErzeugen = useAppStore((s) => s.spielplanErzeugen)

  const vorhandenes = turniere.find((t) => t.id === turnierId && t.status === 'setup')
  const vorabGruppe = (location.state as { gruppeId?: string } | null)?.gruppeId

  const [name, setName] = useState(vorhandenes?.name ?? '')
  const [datum, setDatum] = useState(vorhandenes?.datum ?? new Date().toISOString().slice(0, 10))
  const [disziplin, setDisziplin] = useState<Disziplin>(vorhandenes?.disziplin ?? 'einzel')
  const [format, setFormat] = useState<TurnierFormat>(vorhandenes?.format ?? 'ko')
  const [felder, setFelder] = useState(vorhandenes?.felderAnzahl ?? 2)
  const [preset, setPreset] = useState(0)
  const [zaehlweise, setZaehlweise] = useState<Zaehlweise>(
    vorhandenes?.zaehlweise ?? ZAEHLWEISE_PRESETS[0]!.zaehlweise,
  )
  const [config, setConfig] = useState<Turnier['config']>(
    vorhandenes?.config ?? { spielUmPlatz3: false, aufsteigerProGruppe: 2, gruppenAnzahl: 2 },
  )
  const [teilnehmer, setTeilnehmer] = useState<Teilnehmer[]>(() => {
    if (vorhandenes) return vorhandenes.teilnehmer
    if (vorabGruppe) {
      const g = gruppen.find((x) => x.id === vorabGruppe)
      if (g) {
        return g.mitgliederIds.flatMap((pid) => {
          const p = profile.find((x) => x.id === pid)
          return p ? [{ id: nanoid(8), name: p.name, profilIds: [p.id] }] : []
        })
      }
    }
    return []
  })
  const [schnelleingabe, setSchnelleingabe] = useState('')
  const [importGruppe, setImportGruppe] = useState('')
  const [fehler, setFehler] = useState<string>()

  const sensoren = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 6 } }))
  const gesetzte = useMemo(
    () => teilnehmer.filter((t) => t.setzplatz !== undefined).sort((a, b) => a.setzplatz! - b.setzplatz!),
    [teilnehmer],
  )

  function namenHinzufuegen() {
    const namen = schnelleingabe.split('\n').map((z) => z.trim()).filter(Boolean)
    if (namen.length === 0) return
    setTeilnehmer((alte) => [
      ...alte,
      ...namen.map((n) => ({ id: nanoid(8), name: n })),
    ])
    setSchnelleingabe('')
  }

  function gruppeImportieren() {
    const g = gruppen.find((x) => x.id === importGruppe)
    if (!g) return
    const vorhandeneProfilIds = new Set(teilnehmer.flatMap((t) => t.profilIds ?? []))
    const neue = g.mitgliederIds
      .filter((pid) => !vorhandeneProfilIds.has(pid))
      .flatMap((pid) => {
        const p = profile.find((x) => x.id === pid)
        return p ? [{ id: nanoid(8), name: p.name, profilIds: [p.id] }] : []
      })
    setTeilnehmer((alte) => [...alte, ...neue])
  }

  /** Doppel/Mixed: Einzelnamen zufällig zu Paaren auslosen (§9.3). */
  function paareAuslosen() {
    // Bestehende Paare zuerst wieder in Einzelpersonen auflösen — ein zweiter
    // Klick lost dann komplett neu aus, statt Paare ineinander zu verschachteln.
    const einzelne: Teilnehmer[] = teilnehmer.flatMap((t) => {
      const namen = t.name.split(' / ').map((n) => n.trim()).filter(Boolean)
      if (namen.length <= 1) return [t]
      const profilIds = t.profilIds ?? []
      return namen.map((n, i) => ({
        id: nanoid(8),
        name: n,
        ...(profilIds.length === namen.length ? { profilIds: [profilIds[i]!] } : {}),
      }))
    })
    if (einzelne.length % 2 === 1) {
      // Bei ungerader Anzahl nichts ersetzen — sonst verschwindet still eine Person.
      setFehler(
        `Ungerade Anzahl (${einzelne.length}) — für die Paar-Auslosung eine Person entfernen oder eine weitere eintragen. Die Liste wurde nicht verändert.`,
      )
      return
    }
    const gemischt = mische(einzelne, erzeugeRng())
    const paare: Teilnehmer[] = []
    for (let i = 0; i + 1 < gemischt.length; i += 2) {
      const x = gemischt[i]!
      const y = gemischt[i + 1]!
      paare.push({
        id: nanoid(8),
        name: `${x.name} / ${y.name}`,
        profilIds: [...(x.profilIds ?? []), ...(y.profilIds ?? [])],
      })
    }
    setFehler(undefined)
    if (paare.length > 0) setTeilnehmer(paare)
  }

  function setzplatzUmschalten(id: string) {
    setTeilnehmer((alte) => {
      const t = alte.find((x) => x.id === id)!
      if (t.setzplatz !== undefined) {
        return alte.map((x) =>
          x.id === id
            ? { ...x, setzplatz: undefined }
            : x.setzplatz !== undefined && x.setzplatz > t.setzplatz!
              ? { ...x, setzplatz: x.setzplatz - 1 }
              : x,
        )
      }
      const max = Math.max(0, ...alte.flatMap((x) => (x.setzplatz !== undefined ? [x.setzplatz] : [])))
      return alte.map((x) => (x.id === id ? { ...x, setzplatz: max + 1 } : x))
    })
  }

  function setzlisteSortieren(e: DragEndEvent) {
    const { active, over } = e
    if (!over || active.id === over.id) return
    const reihenfolge = gesetzte.map((t) => t.id)
    const neu = arrayMove(reihenfolge, reihenfolge.indexOf(String(active.id)), reihenfolge.indexOf(String(over.id)))
    setTeilnehmer((alte) =>
      alte.map((t) => {
        const platz = neu.indexOf(t.id)
        return platz === -1 ? t : { ...t, setzplatz: platz + 1 }
      }),
    )
  }

  function speichern(mitSpielplan: boolean) {
    if (name.trim().length < 3) return setFehler('Gib dem Turnier einen Namen.')
    if (mitSpielplan && teilnehmer.length < 2) return setFehler('Mindestens 2 Teilnehmer eintragen.')
    if (
      mitSpielplan &&
      format === 'gruppen_ko' &&
      !koPhaseMoeglich(config.gruppenAnzahl ?? 2, config.aufsteigerProGruppe ?? 2)
    ) {
      return setFehler('Diese Kombination aus Gruppenzahl und Aufsteigern ergibt keine K.o.-Runde (Gesamtzahl muss 2, 4, 8 … sein).')
    }
    if (
      mitSpielplan &&
      format === 'gruppen_ko' &&
      teilnehmer.length < (config.gruppenAnzahl ?? 2) * 2
    ) {
      return setFehler(
        `Für ${config.gruppenAnzahl ?? 2} Gruppen braucht es mindestens ${(config.gruppenAnzahl ?? 2) * 2} Teilnehmer (2 pro Gruppe) — aktuell ${teilnehmer.length}.`,
      )
    }
    // Freie Zählweise klemmen — Zeitspiel (punkteProSatz 0) bleibt erlaubt.
    if (zaehlweise.modus === 'punkte' && !(zaehlweise.punkteProSatz >= 1)) {
      return setFehler('Zählweise: „Punkte/Satz" muss mindestens 1 sein.')
    }
    if (zaehlweise.modus === 'punkte' && !(zaehlweise.maxPunkte >= zaehlweise.punkteProSatz)) {
      return setFehler('Zählweise: „Kappung bei" darf nicht kleiner als „Punkte/Satz" sein.')
    }
    const daten = {
      name: name.trim(),
      datum,
      disziplin,
      format,
      zaehlweise,
      felderAnzahl: felder,
      teilnehmer,
      config,
    }
    const id = vorhandenes
      ? (turnierAktualisieren({ ...vorhandenes, ...daten }), vorhandenes.id)
      : turnierAnlegen(daten).id
    if (mitSpielplan) spielplanErzeugen(id)
    navigate(`/turniere/${id}`)
  }

  return (
    <div className="max-w-3xl">
      <h1 className="schrift-display doppellinie text-3xl">
        {vorhandenes ? 'Turnier-Setup bearbeiten' : 'Turnier anlegen'}
      </h1>

      {/* ---------- Grunddaten ---------- */}
      <section className="mt-6 space-y-4">
        <div className="grid gap-4 sm:grid-cols-[2fr_1fr]">
          <label className="block text-xs font-semibold text-tinte/70">
            Name
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="z. B. AG-Sommerturnier"
              className="mt-1 min-h-11 w-full rounded-md border-2 border-court/30 bg-linie px-3 text-base font-normal"
            />
          </label>
          <label className="block text-xs font-semibold text-tinte/70">
            Datum
            <input
              type="date"
              value={datum}
              onChange={(e) => setDatum(e.target.value)}
              className="mt-1 min-h-11 w-full rounded-md border-2 border-court/30 bg-linie px-3 text-sm font-normal"
            />
          </label>
        </div>

        <div className="flex flex-wrap items-end gap-4">
          <fieldset>
            <legend className="text-xs font-semibold text-tinte/70">Disziplin</legend>
            <div className="mt-1 flex overflow-hidden rounded-md border-2 border-court/40">
              {DISZIPLINEN.map((d) => (
                <button
                  key={d.wert}
                  type="button"
                  onClick={() => setDisziplin(d.wert)}
                  aria-pressed={disziplin === d.wert}
                  className={`min-h-11 px-4 text-sm font-semibold ${
                    disziplin === d.wert ? 'bg-court text-linie' : 'text-tinte/70 hover:bg-boden'
                  }`}
                >
                  {d.name}
                </button>
              ))}
            </div>
          </fieldset>
          <label className="block text-xs font-semibold text-tinte/70">
            Felder
            <div className="mt-1 flex items-center gap-1">
              <button type="button" onClick={() => setFelder((f) => Math.max(1, f - 1))} aria-label="Ein Feld weniger" className="ziffern min-h-11 min-w-11 rounded-md border-2 border-court/40 font-bold text-court">−</button>
              <span className="ziffern w-10 text-center text-lg font-bold">{felder}</span>
              <button type="button" onClick={() => setFelder((f) => Math.min(12, f + 1))} aria-label="Ein Feld mehr" className="ziffern min-h-11 min-w-11 rounded-md border-2 border-court/40 font-bold text-court">+</button>
            </div>
          </label>
        </div>

        {/* Format */}
        <fieldset>
          <legend className="text-xs font-semibold text-tinte/70">Format</legend>
          <div className="mt-1 grid gap-3 sm:grid-cols-2">
            {FORMATE.map((f) => (
              <button
                key={f.wert}
                type="button"
                onClick={() => setFormat(f.wert)}
                aria-pressed={format === f.wert}
                className={`rounded-xl border-2 p-3 text-left ${
                  format === f.wert ? 'border-court bg-court/5' : 'border-court/25 hover:border-court/60'
                }`}
              >
                <span className="font-bold">{f.name}</span>
                <span className="mt-1 block text-sm text-tinte/70">{f.text}</span>
              </button>
            ))}
          </div>
        </fieldset>

        {/* Format-Optionen */}
        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 rounded-lg bg-linie p-3 text-sm">
          {(format === 'ko' || format === 'gruppen_ko') && (
            <label className="flex min-h-11 items-center gap-2 font-semibold">
              <input
                type="checkbox"
                checked={config.spielUmPlatz3 ?? false}
                onChange={(e) => setConfig((c) => ({ ...c, spielUmPlatz3: e.target.checked }))}
                className="h-5 w-5 accent-court"
              />
              Spiel um Platz 3
            </label>
          )}
          {format === 'gruppen_ko' && (
            <>
              <label className="flex items-center gap-2">
                Gruppen:
                <select
                  value={config.gruppenAnzahl ?? 2}
                  onChange={(e) => setConfig((c) => ({ ...c, gruppenAnzahl: Number(e.target.value) }))}
                  className="min-h-11 rounded-md border-2 border-court/30 bg-linie px-2"
                >
                  {[2, 4, 8].map((g) => (
                    <option key={g} value={g}>{g}</option>
                  ))}
                </select>
                <span className="text-xs text-tinte/55">(Vorschlag: {gruppenVorschlag(teilnehmer.length)})</span>
              </label>
              <label className="flex items-center gap-2">
                Aufsteiger je Gruppe:
                <select
                  value={config.aufsteigerProGruppe ?? 2}
                  onChange={(e) => setConfig((c) => ({ ...c, aufsteigerProGruppe: Number(e.target.value) }))}
                  className="min-h-11 rounded-md border-2 border-court/30 bg-linie px-2"
                >
                  <option value={1}>1</option>
                  <option value={2}>2</option>
                </select>
              </label>
            </>
          )}
          {format === 'jeder_gegen_jeden' && (
            <label className="flex min-h-11 items-center gap-2 font-semibold">
              <input
                type="checkbox"
                checked={config.hinRueckrunde ?? false}
                onChange={(e) => setConfig((c) => ({ ...c, hinRueckrunde: e.target.checked }))}
                className="h-5 w-5 accent-court"
              />
              Hin- und Rückrunde
            </label>
          )}
          {format === 'schweizer' && (
            <label className="flex items-center gap-2">
              Runden:
              <input
                type="number"
                min={1}
                max={12}
                value={config.schweizerRunden ?? standardRunden(Math.max(2, teilnehmer.length))}
                onChange={(e) => setConfig((c) => ({ ...c, schweizerRunden: Number(e.target.value) }))}
                className="ziffern min-h-11 w-20 rounded-md border-2 border-court/30 bg-linie px-2"
              />
              <span className="text-xs text-tinte/55">(Standard: aufgerundetes log₂ der Teilnehmerzahl)</span>
            </label>
          )}
        </div>

        {/* Zählweise */}
        <fieldset className="rounded-lg border-2 border-court/25 bg-linie p-3">
          <legend className="px-1 text-xs font-semibold text-tinte/70">Zählweise</legend>
          <div className="flex flex-wrap gap-2">
            {ZAEHLWEISE_PRESETS.map((p, i) => (
              <button
                key={p.name}
                type="button"
                onClick={() => {
                  setPreset(i)
                  setZaehlweise(p.zaehlweise)
                }}
                aria-pressed={preset === i}
                className={`min-h-11 rounded-full border-2 px-3 text-sm font-semibold ${
                  preset === i ? 'border-court bg-court text-linie' : 'border-court/30 text-tinte/70 hover:border-court'
                }`}
              >
                {p.name}
              </button>
            ))}
          </div>
          <div className="ziffern mt-3 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm">
            <label className="flex items-center gap-2">
              Gewinnsätze:
              <select
                value={zaehlweise.saetzeZumSieg}
                onChange={(e) => setZaehlweise((z) => ({ ...z, saetzeZumSieg: Number(e.target.value) as 1 | 2 }))}
                className="min-h-11 rounded-md border-2 border-court/30 bg-linie px-2"
              >
                <option value={1}>1 (Best-of-1)</option>
                <option value={2}>2 (Best-of-3)</option>
              </select>
            </label>
            {zaehlweise.modus === 'punkte' ? (
              <>
                <label className="flex items-center gap-2">
                  Punkte/Satz:
                  <input
                    type="number" min={5} max={30}
                    value={zaehlweise.punkteProSatz}
                    onChange={(e) => setZaehlweise((z) => ({ ...z, punkteProSatz: Number(e.target.value) }))}
                    className="min-h-11 w-18 rounded-md border-2 border-court/30 bg-linie px-2"
                  />
                </label>
                <label className="flex min-h-11 items-center gap-2">
                  <input
                    type="checkbox"
                    checked={zaehlweise.verlaengerung}
                    onChange={(e) => setZaehlweise((z) => ({ ...z, verlaengerung: e.target.checked }))}
                    className="h-5 w-5 accent-court"
                  />
                  Verlängerung (2 Punkte Abstand)
                </label>
                <label className="flex items-center gap-2">
                  Kappung bei:
                  <input
                    type="number" min={zaehlweise.punkteProSatz} max={50}
                    value={zaehlweise.maxPunkte}
                    onChange={(e) => setZaehlweise((z) => ({ ...z, maxPunkte: Number(e.target.value) }))}
                    className="min-h-11 w-18 rounded-md border-2 border-court/30 bg-linie px-2"
                  />
                </label>
              </>
            ) : (
              <label className="flex items-center gap-2">
                Spielzeit (Min):
                <input
                  type="number" min={3} max={30}
                  value={zaehlweise.zeitspielMin ?? 10}
                  onChange={(e) => setZaehlweise((z) => ({ ...z, zeitspielMin: Number(e.target.value) }))}
                  className="min-h-11 w-18 rounded-md border-2 border-court/30 bg-linie px-2"
                />
              </label>
            )}
          </div>
        </fieldset>
      </section>

      {/* ---------- Teilnehmer ---------- */}
      <section className="mt-8">
        <h2 className="schrift-display doppellinie text-xl">
          Teilnehmer <span className="ziffern text-tinte/50">({teilnehmer.length})</span>
        </h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-xs font-semibold text-tinte/70">
              Schnelleingabe — eine Zeile = ein Name{disziplin !== 'einzel' && ' (oder festes Paar „Müller / Schmidt")'}
              <textarea
                value={schnelleingabe}
                rows={5}
                onChange={(e) => setSchnelleingabe(e.target.value)}
                placeholder={'Mia\nBen\nLena / Paul'}
                className="mt-1 w-full rounded-md border-2 border-court/30 bg-linie px-3 py-2 text-sm font-normal"
              />
            </label>
            <button
              type="button"
              onClick={namenHinzufuegen}
              className="mt-2 min-h-11 rounded-md bg-court px-4 text-sm font-semibold text-linie hover:bg-court-tief"
            >
              Namen hinzufügen
            </button>
          </div>
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-tinte/70">
                Aus Gruppe übernehmen
                <select
                  value={importGruppe}
                  onChange={(e) => setImportGruppe(e.target.value)}
                  className="mt-1 min-h-11 w-full rounded-md border-2 border-court/30 bg-linie px-2 text-sm font-normal"
                >
                  <option value="">Gruppe wählen …</option>
                  {gruppen.map((g) => (
                    <option key={g.id} value={g.id}>
                      {g.name} ({g.mitgliederIds.length})
                    </option>
                  ))}
                </select>
              </label>
              <button
                type="button"
                onClick={gruppeImportieren}
                disabled={!importGruppe}
                className="mt-2 min-h-11 rounded-md border-2 border-court px-4 text-sm font-semibold text-court hover:bg-linie disabled:opacity-40"
              >
                Mitglieder übernehmen
              </button>
            </div>
            {disziplin !== 'einzel' && (
              <div className="rounded-lg border-2 border-kork/40 bg-linie p-3">
                <p className="text-xs text-tinte/70">
                  {disziplin === 'doppel' ? 'Doppel' : 'Mixed'}: Trage feste Paare direkt ein —
                  oder lose aus der Namensliste zufällige Paare aus (ideal für Schulturniere).
                </p>
                <button
                  type="button"
                  onClick={paareAuslosen}
                  disabled={teilnehmer.length < 2}
                  className="mt-2 min-h-11 rounded-md border-2 border-court px-4 text-sm font-semibold text-court hover:bg-boden disabled:opacity-40"
                >
                  Paare zufällig auslosen
                </button>
              </div>
            )}
          </div>
        </div>

        {teilnehmer.length > 0 && (
          <ul className="mt-4 flex flex-wrap gap-2">
            {teilnehmer.map((t) => (
              <li key={t.id} className="flex items-center gap-1 rounded-full border-2 border-court/30 bg-linie pl-3 text-sm">
                <span className="font-semibold">{t.name}</span>
                {t.setzplatz !== undefined && (
                  <span className="ziffern rounded bg-signal px-1.5 text-xs font-bold">{t.setzplatz}</span>
                )}
                <button
                  type="button"
                  onClick={() => setzplatzUmschalten(t.id)}
                  aria-label={`${t.name} ${t.setzplatz !== undefined ? 'aus der Setzliste nehmen' : 'setzen'}`}
                  className={`min-h-9 px-1.5 text-xs font-semibold ${
                    t.setzplatz !== undefined ? 'text-kork' : 'text-tinte/50 hover:text-court'
                  }`}
                >
                  {t.setzplatz !== undefined ? 'gesetzt' : 'setzen'}
                </button>
                <button
                  type="button"
                  onClick={() => setTeilnehmer((alte) => alte.filter((x) => x.id !== t.id))}
                  aria-label={`${t.name} entfernen`}
                  className="min-h-9 min-w-8 rounded-r-full text-tinte/40 hover:bg-red-50 hover:text-red-700"
                >
                  ×
                </button>
              </li>
            ))}
          </ul>
        )}

        {/* Setzliste per Drag & Drop (§9.3) */}
        {gesetzte.length > 1 && (
          <div className="mt-4 max-w-md">
            <p className="text-xs font-semibold text-tinte/70">Setzliste (ziehen zum Sortieren)</p>
            <DndContext sensors={sensoren} collisionDetection={closestCenter} onDragEnd={setzlisteSortieren}>
              <SortableContext items={gesetzte.map((t) => t.id)} strategy={verticalListSortingStrategy}>
                <ol className="mt-1 space-y-1.5">
                  {gesetzte.map((t, i) => (
                    <SetzZeile key={t.id} teilnehmer={t} platz={i + 1} />
                  ))}
                </ol>
              </SortableContext>
            </DndContext>
          </div>
        )}
      </section>

      {fehler && (
        <p role="alert" className="mt-4 rounded-md border-2 border-red-700 bg-red-50 p-3 text-sm text-red-800">
          {fehler}
        </p>
      )}

      <div className="mt-6 flex flex-wrap gap-3 border-t-2 border-court/20 pt-5">
        <button
          type="button"
          onClick={() => speichern(true)}
          className="min-h-12 rounded-md bg-court px-5 text-sm font-semibold text-linie hover:bg-court-tief"
        >
          Spielplan erzeugen
        </button>
        <button
          type="button"
          onClick={() => speichern(false)}
          className="min-h-12 rounded-md border-2 border-court px-4 text-sm font-semibold text-court hover:bg-linie"
        >
          Als Entwurf speichern
        </button>
        <Link to="/turniere" className="inline-flex min-h-12 items-center rounded-md px-4 text-sm font-semibold text-tinte/70 hover:text-tinte">
          Abbrechen
        </Link>
      </div>
    </div>
  )
}
