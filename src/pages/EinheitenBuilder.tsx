import { useMemo, useState } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  closestCenter,
  useDraggable,
  useDroppable,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
} from '@dnd-kit/core'
import {
  SortableContext,
  arrayMove,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { nanoid } from 'nanoid'
import type { Einheit, Kategorie, SkillId, Uebung } from '../datenmodell'
import { alleUebungen, findeUebung } from '../data/uebungen'
import { ALLE_KATEGORIEN, KATEGORIE_NAMEN } from '../data/skills'
import { filtereUebungen } from '../utils/uebungsFilter'
import { einheitGesamtdauer } from '../utils/vorschlag'
import { findeEinheitMitVorlagen } from '../data/programme'
import { useAppStore } from '../store'

interface BlockEntwurf {
  lokalId: string
  uebungId: string
  dauerMin: number
  notiz?: string
}

function aufFuenf(min: number): number {
  return Math.max(5, Math.round(min / 5) * 5)
}

/* ---------- Bibliotheks-Eintrag (draggable) ---------- */
function BibliotheksEintrag({
  uebung,
  onHinzufuegen,
}: {
  uebung: Uebung
  onHinzufuegen: () => void
}) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `bib-${uebung.id}`,
    data: { typ: 'bibliothek', uebungId: uebung.id },
  })

  return (
    <div
      ref={setNodeRef}
      className={`flex items-center gap-2 rounded-lg border-2 border-court/25 bg-linie p-2 ${
        isDragging ? 'opacity-40' : ''
      }`}
    >
      <button
        type="button"
        {...listeners}
        {...attributes}
        aria-label={`${uebung.name} in die Einheit ziehen`}
        className="min-h-11 min-w-9 cursor-grab touch-none rounded text-tinte/40 hover:text-court active:cursor-grabbing"
      >
        ⠿
      </button>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold">{uebung.name}</p>
        <p className="ziffern text-xs text-tinte/60">
          {KATEGORIE_NAMEN[uebung.kategorie]} · ~{uebung.dauerMin} Min
        </p>
      </div>
      <button
        type="button"
        onClick={onHinzufuegen}
        aria-label={`${uebung.name} ans Ende der Einheit anfügen`}
        className="min-h-11 min-w-11 rounded-md border-2 border-court text-lg font-bold text-court hover:bg-court hover:text-linie"
      >
        +
      </button>
    </div>
  )
}

/* ---------- Zeitleisten-Block (sortable) ---------- */
function ZeitleistenBlock({
  block,
  uebung,
  nummer,
  onDauer,
  onNotiz,
  onEntfernen,
}: {
  block: BlockEntwurf
  uebung: Uebung | undefined
  nummer: number
  onDauer: (delta: number) => void
  onNotiz: (notiz: string) => void
  onEntfernen: () => void
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: block.lokalId, data: { typ: 'block' } })

  return (
    <li
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className={`rounded-lg border-2 border-court/30 bg-linie p-3 ${
        isDragging ? 'z-10 opacity-60 shadow-lg' : ''
      }`}
    >
      <div className="flex items-center gap-2">
        <button
          type="button"
          {...listeners}
          {...attributes}
          aria-label={`Block ${nummer} verschieben`}
          className="min-h-11 min-w-9 cursor-grab touch-none rounded text-tinte/40 hover:text-court active:cursor-grabbing"
        >
          ⠿
        </button>
        <span className="ziffern schrift-display w-6 shrink-0 text-court">{nummer}</span>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-bold">
            {uebung?.name ?? 'Übung nicht mehr vorhanden'}
          </p>
          {uebung && (
            <p className="text-xs text-tinte/60">{KATEGORIE_NAMEN[uebung.kategorie]}</p>
          )}
        </div>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => onDauer(-5)}
            aria-label="5 Minuten kürzer"
            className="ziffern min-h-11 min-w-11 rounded-md border-2 border-court/40 font-bold text-court hover:border-court"
          >
            −5
          </button>
          <span className="ziffern w-14 text-center text-sm font-bold">
            {block.dauerMin} Min
          </span>
          <button
            type="button"
            onClick={() => onDauer(5)}
            aria-label="5 Minuten länger"
            className="ziffern min-h-11 min-w-11 rounded-md border-2 border-court/40 font-bold text-court hover:border-court"
          >
            +5
          </button>
        </div>
        <button
          type="button"
          onClick={onEntfernen}
          aria-label={`Block ${nummer} entfernen`}
          className="min-h-11 min-w-11 rounded-md text-lg font-bold text-tinte/40 hover:bg-red-50 hover:text-red-700"
        >
          ×
        </button>
      </div>
      <input
        value={block.notiz ?? ''}
        onChange={(e) => onNotiz(e.target.value)}
        placeholder="Notiz zum Block (z. B. Fokus, Gruppeneinteilung) …"
        className="mt-2 min-h-9 w-full rounded-md border border-court/25 bg-boden/60 px-2 text-sm"
      />
    </li>
  )
}

/* ---------- Builder-Seite ---------- */
export default function EinheitenBuilder() {
  const { einheitId } = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const eigeneUebungen = useAppStore((s) => s.eigeneUebungen)
  const einheiten = useAppStore((s) => s.einheiten)
  const einheitSpeichern = useAppStore((s) => s.einheitSpeichern)

  const gespeicherte = einheiten.find((e) => e.id === einheitId)
  // Vorlagen lassen sich öffnen — gespeichert wird dann eine eigene Kopie
  const vorlage = !gespeicherte && einheitId ? findeEinheitMitVorlagen(einheitId, []) : undefined
  const vorhandene = gespeicherte ?? vorlage
  const entwurf = (location.state as { entwurf?: Einheit; zielzeit?: number } | null)
    ?.entwurf

  const [name, setName] = useState(
    vorlage ? `${vorlage.name} (Kopie)` : (vorhandene?.name ?? entwurf?.name ?? 'Neue Einheit'),
  )
  const [zielzeit, setZielzeit] = useState(
    (location.state as { zielzeit?: number } | null)?.zielzeit ??
      (vorhandene ? einheitGesamtdauer(vorhandene.bloecke) : 90),
  )
  const [bloecke, setBloecke] = useState<BlockEntwurf[]>(() =>
    (vorhandene?.bloecke ?? entwurf?.bloecke ?? []).map((b) => ({
      ...b,
      lokalId: nanoid(6),
    })),
  )
  const [suche, setSuche] = useState('')
  const [kategorie, setKategorie] = useState<Kategorie | ''>('')
  const [aktiveDragUebung, setAktiveDragUebung] = useState<Uebung>()
  const [meldung, setMeldung] = useState<string>()

  const uebungen = useMemo(() => alleUebungen(eigeneUebungen), [eigeneUebungen])
  const bibliothek = useMemo(
    () =>
      filtereUebungen(uebungen, {
        suche: suche || undefined,
        kategorie: kategorie || undefined,
      }),
    [uebungen, suche, kategorie],
  )

  const gesamt = einheitGesamtdauer(bloecke)
  const differenz = gesamt - zielzeit

  const sensoren = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
  )

  const { setNodeRef: zeitleisteRef, isOver: zeitleisteIsOver } = useDroppable({
    id: 'zeitleiste',
  })

  function blockHinzufuegen(uebungId: string, anPosition?: number) {
    const uebung = findeUebung(uebungId, eigeneUebungen)
    if (!uebung) return
    const neu: BlockEntwurf = {
      lokalId: nanoid(6),
      uebungId,
      dauerMin: aufFuenf(uebung.dauerMin),
    }
    setBloecke((alte) => {
      const kopie = [...alte]
      kopie.splice(anPosition ?? kopie.length, 0, neu)
      return kopie
    })
  }

  function dragStart(e: DragStartEvent) {
    const daten = e.active.data.current as { typ: string; uebungId?: string } | undefined
    if (daten?.typ === 'bibliothek' && daten.uebungId) {
      setAktiveDragUebung(findeUebung(daten.uebungId, eigeneUebungen))
    }
  }

  function dragEnd(e: DragEndEvent) {
    setAktiveDragUebung(undefined)
    const { active, over } = e
    if (!over) return
    const daten = active.data.current as { typ: string; uebungId?: string } | undefined

    if (daten?.typ === 'bibliothek' && daten.uebungId) {
      // Aus der Bibliothek in die Zeitleiste ziehen
      const zielIndex =
        over.id === 'zeitleiste'
          ? bloecke.length
          : bloecke.findIndex((b) => b.lokalId === over.id)
      blockHinzufuegen(daten.uebungId, zielIndex < 0 ? bloecke.length : zielIndex)
      return
    }

    if (daten?.typ === 'block' && active.id !== over.id) {
      // Innerhalb der Zeitleiste sortieren
      setBloecke((alte) => {
        const von = alte.findIndex((b) => b.lokalId === active.id)
        const nach = alte.findIndex((b) => b.lokalId === over.id)
        if (von < 0 || nach < 0) return alte
        return arrayMove(alte, von, nach)
      })
    }
  }

  function speichern() {
    if (bloecke.length === 0) {
      setMeldung('Füge mindestens einen Block hinzu, bevor du speicherst.')
      return
    }
    // Ziel-Skills automatisch aus den Übungen der Blöcke ableiten
    const skills = new Set<SkillId>()
    for (const b of bloecke) {
      for (const s of findeUebung(b.uebungId, eigeneUebungen)?.skills ?? []) skills.add(s)
    }
    const einheit: Einheit = {
      id: gespeicherte?.id ?? entwurf?.id ?? nanoid(),
      name: name.trim() || 'Unbenannte Einheit',
      zielSkills: [...skills],
      bloecke: bloecke.map(({ lokalId: _l, notiz, ...rest }) => ({
        ...rest,
        ...(notiz?.trim() ? { notiz: notiz.trim() } : {}),
      })),
      istVorlage: false,
    }
    einheitSpeichern(einheit)
    setMeldung('Gespeichert.')
    if (!vorhandene) navigate(`/einheiten/${einheit.id}`, { replace: true })
  }

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-3">
        <h1 className="schrift-display doppellinie text-3xl">Einheiten-Builder</h1>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => navigate('/einheiten')}
            className="min-h-11 rounded-md px-3 text-sm font-semibold text-tinte/70 hover:text-tinte"
          >
            Zur Übersicht
          </button>
          {(vorhandene || einheitId === undefined) && bloecke.length > 0 && vorhandene && (
            <button
              type="button"
              onClick={() => navigate(`/einheiten/${vorhandene.id}/drucken`)}
              className="min-h-11 rounded-md border-2 border-court px-4 text-sm font-semibold text-court hover:bg-linie"
            >
              Druckansicht
            </button>
          )}
          <button
            type="button"
            onClick={speichern}
            className="min-h-11 rounded-md bg-court px-5 text-sm font-semibold text-linie hover:bg-court-tief"
          >
            Einheit speichern
          </button>
        </div>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-[1fr_auto]">
        <label className="block text-xs font-semibold text-tinte/70">
          Name der Einheit
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 min-h-11 w-full rounded-md border-2 border-court/30 bg-linie px-3 text-base font-normal"
          />
        </label>
        <label className="block text-xs font-semibold text-tinte/70">
          Zielzeit
          <div className="mt-1 flex items-center gap-1">
            <button
              type="button"
              onClick={() => setZielzeit((z) => Math.max(20, z - 5))}
              aria-label="Zielzeit 5 Minuten kürzer"
              className="ziffern min-h-11 min-w-11 rounded-md border-2 border-court/40 font-bold text-court hover:border-court"
            >
              −5
            </button>
            <span className="ziffern w-20 text-center text-base font-bold">{zielzeit} Min</span>
            <button
              type="button"
              onClick={() => setZielzeit((z) => Math.min(240, z + 5))}
              aria-label="Zielzeit 5 Minuten länger"
              className="ziffern min-h-11 min-w-11 rounded-md border-2 border-court/40 font-bold text-court hover:border-court"
            >
              +5
            </button>
          </div>
        </label>
      </div>

      {meldung && (
        <p role="status" className="mt-3 rounded-md border-2 border-court/40 bg-linie p-2.5 text-sm">
          {meldung}
        </p>
      )}

      <DndContext
        sensors={sensoren}
        collisionDetection={closestCenter}
        onDragStart={dragStart}
        onDragEnd={dragEnd}
      >
        <div className="mt-6 grid gap-6 lg:grid-cols-[5fr_7fr]">
          {/* ---------- Bibliothek ---------- */}
          <section className="rounded-xl border-2 border-court/25 bg-boden p-4">
            <h2 className="schrift-display text-lg">Bibliothek</h2>
            <p className="mt-1 text-xs text-tinte/60">
              Ziehen oder mit + ans Ende anfügen.
            </p>
            <input
              type="search"
              value={suche}
              onChange={(e) => setSuche(e.target.value)}
              placeholder="Übung suchen …"
              aria-label="Übungen durchsuchen"
              className="mt-3 min-h-11 w-full rounded-md border-2 border-court/30 bg-linie px-3 text-sm"
            />
            <select
              value={kategorie}
              onChange={(e) => setKategorie(e.target.value as Kategorie | '')}
              aria-label="Nach Kategorie filtern"
              className="mt-2 min-h-11 w-full rounded-md border-2 border-court/30 bg-linie px-2 text-sm"
            >
              <option value="">Alle Kategorien</option>
              {ALLE_KATEGORIEN.map((k) => (
                <option key={k} value={k}>
                  {KATEGORIE_NAMEN[k]}
                </option>
              ))}
            </select>
            <div className="mt-3 max-h-[28rem] space-y-2 overflow-y-auto pr-1">
              {bibliothek.map((u) => (
                <BibliotheksEintrag
                  key={u.id}
                  uebung={u}
                  onHinzufuegen={() => blockHinzufuegen(u.id)}
                />
              ))}
              {bibliothek.length === 0 && (
                <p className="p-3 text-sm text-tinte/60">Keine Treffer.</p>
              )}
            </div>
          </section>

          {/* ---------- Zeitleiste ---------- */}
          <section>
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <h2 className="schrift-display text-lg">Zeitleiste</h2>
              <p className="ziffern text-sm font-bold" role="status">
                {gesamt} / {zielzeit} Min{' '}
                {differenz === 0 ? (
                  <span className="text-court">— passt exakt</span>
                ) : differenz > 0 ? (
                  <span className="text-red-700">— {differenz} Min über Ziel</span>
                ) : (
                  <span className="text-kork">— noch {-differenz} Min frei</span>
                )}
              </p>
            </div>

            <div
              ref={zeitleisteRef}
              className={`mt-3 rounded-xl border-2 border-dashed p-3 transition-colors ${
                zeitleisteIsOver ? 'border-signal bg-signal/10' : 'border-court/40'
              }`}
            >
              {bloecke.length === 0 ? (
                <p className="p-6 text-center text-sm text-tinte/60">
                  Zieh Übungen aus der Bibliothek hierher — oder nutze den +‑Button.
                </p>
              ) : (
                <SortableContext
                  items={bloecke.map((b) => b.lokalId)}
                  strategy={verticalListSortingStrategy}
                >
                  <ol className="space-y-2">
                    {bloecke.map((b, i) => (
                      <ZeitleistenBlock
                        key={b.lokalId}
                        block={b}
                        nummer={i + 1}
                        uebung={findeUebung(b.uebungId, eigeneUebungen)}
                        onDauer={(delta) =>
                          setBloecke((alte) =>
                            alte.map((x) =>
                              x.lokalId === b.lokalId
                                ? { ...x, dauerMin: Math.max(5, x.dauerMin + delta) }
                                : x,
                            ),
                          )
                        }
                        onNotiz={(notiz) =>
                          setBloecke((alte) =>
                            alte.map((x) =>
                              x.lokalId === b.lokalId ? { ...x, notiz } : x,
                            ),
                          )
                        }
                        onEntfernen={() =>
                          setBloecke((alte) => alte.filter((x) => x.lokalId !== b.lokalId))
                        }
                      />
                    ))}
                  </ol>
                </SortableContext>
              )}
            </div>
          </section>
        </div>

        <DragOverlay>
          {aktiveDragUebung && (
            <div className="rounded-lg border-2 border-signal bg-linie p-3 text-sm font-semibold shadow-xl">
              {aktiveDragUebung.name}
            </div>
          )}
        </DragOverlay>
      </DndContext>
    </div>
  )
}
