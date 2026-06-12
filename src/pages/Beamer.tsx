import { useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import type { Match, Turnier } from '../datenmodell'
import {
  berechneTabelle,
  gruppenAusMatches,
  naechsteSpiele,
  schweizerTabelle,
} from '../engine/turnier'
import { useAppStore } from '../store'

type Ansicht = 'felder' | 'naechste' | 'stand'
const ROTATION_MS = 12000

function rundenName(runde: number, maxRunde: number): string {
  const diff = maxRunde - runde
  if (diff === 0) return 'Finale'
  if (diff === 1) return 'Halbfinale'
  if (diff === 2) return 'Viertelfinale'
  if (diff === 3) return 'Achtelfinale'
  return `Runde ${runde}`
}

/**
 * Beamer-Modus (§10): Vollbild, sehr große Typografie, maximaler Kontrast.
 * Live-Sync ohne Backend: storage-Event + Polling-Fallback rehydrieren den Store,
 * sodass Eingaben im Bedien-Tab hier sofort erscheinen.
 */
export default function Beamer() {
  const { turnierId } = useParams()
  const turnier = useAppStore((s) => s.turniere).find((t) => t.id === turnierId)

  const [ansicht, setAnsicht] = useState<Ansicht>('felder')
  const [rotation, setRotation] = useState(true)
  const [uhr, setUhr] = useState(() => new Date())

  /* ---------- Live-Sync (§10): storage-Event + Polling-Fallback ---------- */
  useEffect(() => {
    const lausche = (e: StorageEvent) => {
      if (e.key === 'badminton-planer:v1') void useAppStore.persist.rehydrate()
    }
    window.addEventListener('storage', lausche)
    const polling = window.setInterval(() => {
      if (document.visibilityState === 'visible') void useAppStore.persist.rehydrate()
    }, 3000)
    return () => {
      window.removeEventListener('storage', lausche)
      window.clearInterval(polling)
    }
  }, [])

  /* ---------- Uhr ---------- */
  useEffect(() => {
    const t = window.setInterval(() => setUhr(new Date()), 15000)
    return () => window.clearInterval(t)
  }, [])

  /* ---------- Rotation ---------- */
  useEffect(() => {
    if (!rotation) return
    const reihenfolge: Ansicht[] = ['felder', 'naechste', 'stand']
    const t = window.setInterval(() => {
      setAnsicht((a) => reihenfolge[(reihenfolge.indexOf(a) + 1) % reihenfolge.length]!)
    }, ROTATION_MS)
    return () => window.clearInterval(t)
  }, [rotation])

  const name = useMemo(() => {
    const map = new Map(turnier?.teilnehmer.map((t) => [t.id, t.name]) ?? [])
    return (id?: string) => (id ? (map.get(id) ?? '?') : '–')
  }, [turnier])

  if (!turnier || turnier.status === 'setup') {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-[#070d0a] p-8 text-center text-white">
        <h1 className="schrift-display text-5xl text-signal sm:text-7xl">Beamer-Modus</h1>
        <p className="mt-6 max-w-3xl text-2xl text-white/75">
          {turnier
            ? 'Dieses Turnier ist noch im Setup — erzeuge zuerst den Spielplan.'
            : 'Turnier nicht gefunden.'}
        </p>
        <Link to={turnier ? `/turniere/${turnier.id}` : '/turniere'} className="mt-8 rounded-md border-2 border-white/40 px-5 py-3 text-lg text-white/80 hover:border-signal hover:text-signal">
          Zur Bedienung
        </Link>
      </div>
    )
  }

  const beendet = turnier.status === 'beendet'

  return (
    <div className="flex min-h-screen flex-col bg-[#070d0a] text-white">
      {/* ---------- Kopfzeile ---------- */}
      <header className="flex items-baseline justify-between gap-4 border-b-4 border-signal px-6 py-4 sm:px-10">
        <h1 className="schrift-display truncate text-3xl sm:text-5xl">{turnier.name}</h1>
        <p className="ziffern shrink-0 text-2xl text-white/70 sm:text-4xl">
          {uhr.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' })}
        </p>
      </header>

      {/* ---------- Inhalt ---------- */}
      <main className="flex-1 px-6 py-6 sm:px-10">
        {beendet ? (
          <Podium turnier={turnier} name={name} />
        ) : ansicht === 'felder' ? (
          <FelderAnsicht turnier={turnier} name={name} />
        ) : ansicht === 'naechste' ? (
          <NaechsteAnsicht turnier={turnier} name={name} />
        ) : (
          <StandAnsicht turnier={turnier} name={name} />
        )}
      </main>

      {/* ---------- Steuerleiste (dezent) ---------- */}
      {!beendet && (
        <footer className="flex flex-wrap items-center gap-2 px-6 pb-4 opacity-50 transition-opacity hover:opacity-100 print:hidden sm:px-10">
          {(
            [
              ['felder', 'Felder'],
              ['naechste', 'Als Nächstes'],
              ['stand', 'Stand'],
            ] as const
          ).map(([wert, label]) => (
            <button
              key={wert}
              type="button"
              onClick={() => {
                setAnsicht(wert)
                setRotation(false)
              }}
              aria-pressed={ansicht === wert}
              className={`min-h-11 rounded-md border-2 px-4 text-sm font-semibold ${
                ansicht === wert ? 'border-signal text-signal' : 'border-white/30 text-white/70 hover:border-white'
              }`}
            >
              {label}
            </button>
          ))}
          <button
            type="button"
            onClick={() => setRotation((r) => !r)}
            aria-pressed={rotation}
            className={`min-h-11 rounded-md border-2 px-4 text-sm font-semibold ${
              rotation ? 'border-signal text-signal' : 'border-white/30 text-white/70 hover:border-white'
            }`}
          >
            {rotation ? 'Rotation an' : 'Rotation aus'}
          </button>
          <Link
            to={`/turniere/${turnier.id}`}
            className="ml-auto min-h-11 inline-flex items-center rounded-md border-2 border-white/30 px-4 text-sm font-semibold text-white/70 hover:border-white"
          >
            Zur Bedienung
          </Link>
        </footer>
      )}
    </div>
  )
}

/* ================= Felder ================= */

function FelderAnsicht({ turnier, name }: { turnier: Turnier; name: (id?: string) => string }) {
  const felder = Array.from({ length: turnier.felderAnzahl }, (_, i) => i + 1)
  const proFeld = (feld: number) =>
    turnier.matches.find((m) => m.feld === feld && m.status !== 'beendet')

  return (
    <div className={`grid h-full gap-6 ${turnier.felderAnzahl > 1 ? 'lg:grid-cols-2' : ''} ${turnier.felderAnzahl > 4 ? '2xl:grid-cols-3' : ''}`}>
      {felder.map((feld) => {
        const match = proFeld(feld)
        const aktuellerSatz = match?.saetze.length ? match.saetze.length - 1 : -1
        return (
          <section key={feld} className={`flex flex-col rounded-2xl border-4 p-6 ${match ? 'border-signal' : 'border-white/15'}`}>
            <p className="schrift-display text-2xl text-signal sm:text-3xl">Feld {feld}</p>
            {match ? (
              <div className="mt-3 grid flex-1 grid-cols-[1fr_auto] items-center gap-x-6 gap-y-2">
                {(['a', 'b'] as const).map((seite) => {
                  const id = seite === 'a' ? match.teilnehmerAId : match.teilnehmerBId
                  return (
                    <div key={seite} className="contents">
                      <p className="truncate text-3xl font-bold leading-tight sm:text-5xl">{name(id)}</p>
                      <p className="ziffern text-right text-4xl sm:text-6xl">
                        {match.saetze.map((s, i) => (
                          <span key={i} className={`ml-5 ${i === aktuellerSatz ? 'text-signal' : 'text-white/60'}`}>
                            {seite === 'a' ? s.a : s.b}
                          </span>
                        ))}
                        {match.saetze.length === 0 && <span className="text-white/40">–</span>}
                      </p>
                    </div>
                  )
                })}
              </div>
            ) : (
              <p className="mt-3 flex-1 text-3xl text-white/35">frei</p>
            )}
          </section>
        )
      })}
    </div>
  )
}

/* ================= Als Nächstes ================= */

function NaechsteAnsicht({ turnier, name }: { turnier: Turnier; name: (id?: string) => string }) {
  const naechste = naechsteSpiele(turnier.matches).slice(0, 6)
  return (
    <div>
      <h2 className="schrift-display text-3xl text-signal sm:text-4xl">Als Nächstes — macht euch bereit</h2>
      {naechste.length === 0 ? (
        <p className="mt-6 text-3xl text-white/50">Keine wartenden Spiele.</p>
      ) : (
        <ol className="mt-6 space-y-4">
          {naechste.map((m, i) => (
            <li key={m.id} className="flex items-baseline gap-6 border-b-2 border-white/15 pb-4">
              <span className="schrift-display w-12 text-3xl text-signal sm:text-5xl">{i + 1}</span>
              <span className="text-3xl font-bold sm:text-5xl">
                {name(m.teilnehmerAId)} <span className="font-normal text-white/40">vs.</span> {name(m.teilnehmerBId)}
              </span>
            </li>
          ))}
        </ol>
      )}
    </div>
  )
}

/* ================= Stand (Tabelle / Bracket-Liste) ================= */

function StandAnsicht({ turnier, name }: { turnier: Turnier; name: (id?: string) => string }) {
  const koMatches = turnier.matches.filter(
    (m) => m.bracketTyp === 'haupt' && (turnier.format === 'ko' || m.phase === 'ko'),
  )

  /* K.o.: letzte zwei Runden als Liste */
  if ((turnier.format === 'ko' || (turnier.format === 'gruppen_ko' && koMatches.length > 0)) && koMatches.length > 0) {
    const maxRunde = Math.max(...koMatches.map((m) => m.runde ?? 1))
    const runden = [maxRunde - 1, maxRunde].filter((r) => r >= 1)
    return (
      <div className="grid gap-10 lg:grid-cols-2">
        {runden.map((r) => (
          <div key={r}>
            <h2 className="schrift-display text-3xl text-signal sm:text-4xl">{rundenName(r, maxRunde)}</h2>
            <ul className="mt-5 space-y-3">
              {koMatches
                .filter((m) => m.runde === r)
                .sort((a, b) => (a.bracketSlot ?? 0) - (b.bracketSlot ?? 0))
                .map((m) => (
                  <BeamerMatchZeile key={m.id} match={m} name={name} />
                ))}
            </ul>
          </div>
        ))}
      </div>
    )
  }

  /* Gruppenphase: Mini-Tabellen je Gruppe */
  if (turnier.format === 'gruppen_ko') {
    const gruppen = gruppenAusMatches(turnier.matches)
    return (
      <div className="grid gap-8 lg:grid-cols-2">
        {[...gruppen.keys()].sort().map((g) => (
          <BeamerTabelle
            key={g}
            titel={`Gruppe ${g}`}
            zeilen={berechneTabelle(
              [...gruppen.get(g)!],
              turnier.matches.filter((m) => m.phase === 'gruppe' && m.gruppeId === g),
              turnier.zaehlweise,
            ).map((z) => ({ platz: z.platz, name: name(z.teilnehmerId), rechts: `${z.siege}–${z.niederlagen}` }))}
          />
        ))}
      </div>
    )
  }

  if (turnier.format === 'schweizer') {
    return (
      <BeamerTabelle
        titel="Stand"
        zeilen={schweizerTabelle(turnier.teilnehmer.map((t) => t.id), turnier.matches, turnier.zaehlweise)
          .slice(0, 10)
          .map((z) => ({ platz: z.platz, name: name(z.teilnehmerId), rechts: `${z.punkte} P · BH ${z.buchholz}` }))}
      />
    )
  }

  return (
    <BeamerTabelle
      titel="Tabelle"
      zeilen={berechneTabelle(turnier.teilnehmer.map((t) => t.id), turnier.matches, turnier.zaehlweise)
        .slice(0, 10)
        .map((z) => ({ platz: z.platz, name: name(z.teilnehmerId), rechts: `${z.siege}–${z.niederlagen}` }))}
    />
  )
}

function BeamerMatchZeile({ match, name }: { match: Match; name: (id?: string) => string }) {
  const freilos = (match.teilnehmerAId === undefined) !== (match.teilnehmerBId === undefined)
  return (
    <li className="flex flex-wrap items-baseline gap-x-4 border-b-2 border-white/15 pb-3 text-2xl sm:text-4xl">
      <span className={match.siegerId && match.siegerId === match.teilnehmerAId ? 'font-bold text-signal' : 'font-semibold'}>
        {name(match.teilnehmerAId)}
      </span>
      <span className="text-white/40">–</span>
      <span className={match.siegerId && match.siegerId === match.teilnehmerBId ? 'font-bold text-signal' : 'font-semibold'}>
        {freilos ? 'Freilos' : name(match.teilnehmerBId)}
      </span>
      <span className="ziffern ml-auto text-white/70">
        {match.saetze.map((s) => `${s.a}:${s.b}`).join('  ')}
      </span>
    </li>
  )
}

function BeamerTabelle({ titel, zeilen }: { titel: string; zeilen: { platz: number; name: string; rechts: string }[] }) {
  return (
    <div>
      <h2 className="schrift-display text-3xl text-signal sm:text-4xl">{titel}</h2>
      <ol className="mt-5 space-y-2">
        {zeilen.map((z) => (
          <li key={z.platz} className="flex items-baseline gap-5 border-b-2 border-white/15 pb-2 text-2xl sm:text-4xl">
            <span className="ziffern w-12 text-signal">{z.platz}.</span>
            <span className="truncate font-semibold">{z.name}</span>
            <span className="ziffern ml-auto shrink-0 text-white/70">{z.rechts}</span>
          </li>
        ))}
      </ol>
    </div>
  )
}

/* ================= Podium ================= */

function Podium({ turnier, name }: { turnier: Turnier; name: (id?: string) => string }) {
  const plaetze: { platz: number; text: string }[] = []

  if (turnier.format === 'ko' || turnier.format === 'gruppen_ko') {
    const ko = turnier.matches.filter(
      (m) => m.bracketTyp === 'haupt' && (turnier.format === 'ko' || m.phase === 'ko'),
    )
    const finale = ko.reduce<Match | undefined>((b, m) => ((m.runde ?? 0) > (b?.runde ?? 0) ? m : b), undefined)
    if (finale?.siegerId) {
      const zweiter = finale.siegerId === finale.teilnehmerAId ? finale.teilnehmerBId : finale.teilnehmerAId
      plaetze.push({ platz: 1, text: name(finale.siegerId) }, { platz: 2, text: name(zweiter) })
      const p3 = turnier.matches.find((m) => m.bracketTyp === 'platz3' && (turnier.format === 'ko' || m.phase === 'ko'))
      if (p3?.siegerId) plaetze.push({ platz: 3, text: name(p3.siegerId) })
    }
  } else {
    const tabelle =
      turnier.format === 'schweizer'
        ? schweizerTabelle(turnier.teilnehmer.map((t) => t.id), turnier.matches, turnier.zaehlweise)
        : berechneTabelle(turnier.teilnehmer.map((t) => t.id), turnier.matches, turnier.zaehlweise)
    for (const z of tabelle.slice(0, 3)) plaetze.push({ platz: z.platz, text: name(z.teilnehmerId) })
  }

  const groessen = ['text-5xl sm:text-8xl', 'text-4xl sm:text-6xl', 'text-3xl sm:text-5xl']
  return (
    <div className="flex h-full flex-col items-center justify-center text-center">
      <h2 className="schrift-display text-3xl text-white/70 sm:text-4xl">Endstand</h2>
      <ol className="mt-10 space-y-8">
        {plaetze.map((p, i) => (
          <li key={p.platz} className={`${groessen[i] ?? groessen[2]} ${i === 0 ? 'schrift-display text-signal' : 'font-bold'}`}>
            <span className="ziffern mr-5 text-white/50">{p.platz}.</span>
            {p.text}
          </li>
        ))}
      </ol>
    </div>
  )
}
