import { useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import type { Match, Turnier } from '../datenmodell'
import {
  berechneTabelle,
  gruppenAusMatches,
  gruppenphaseFertig,
  istRundeKomplett,
  aktuelleSchweizerRunde,
  naechsteSpiele,
  schweizerRundenzahl,
  schweizerTabelle,
} from '../engine/turnier'
import { erzeugeTurnierExport, downloadTextDatei } from '../utils/exportImport'
import { useAppStore } from '../store'
import Bracket from '../components/turnier/Bracket'
import GruppenTabelle, { SchweizerTabelleAnsicht } from '../components/turnier/GruppenTabelle'
import MatchListe from '../components/turnier/MatchListe'
import ErgebnisDialog from '../components/turnier/ErgebnisDialog'
import BestaetigungsDialog from '../components/ui/BestaetigungsDialog'

const FORMAT_NAMEN = {
  ko: 'K.o.-System',
  gruppen_ko: 'Gruppen + K.o.',
  jeder_gegen_jeden: 'Jeder gegen Jeden',
  schweizer: 'Schweizer System',
} as const

function zaehlweiseText(t: Turnier): string {
  const z = t.zaehlweise
  if (z.modus === 'zeit') return `Zeitspiel ${z.zeitspielMin ?? 10} Min`
  return `${z.saetzeZumSieg} ${z.saetzeZumSieg === 1 ? 'Gewinnsatz' : 'Gewinnsätze'} bis ${z.punkteProSatz}${z.verlaengerung ? `, Verlängerung bis ${z.maxPunkte}` : ''}`
}

export default function TurnierDetail() {
  const { turnierId } = useParams()
  const turniere = useAppStore((s) => s.turniere)
  const felderZuweisen = useAppStore((s) => s.felderZuweisen)
  const spielplanZuruecksetzen = useAppStore((s) => s.spielplanZuruecksetzen)
  const turnierKoPhaseStarten = useAppStore((s) => s.turnierKoPhaseStarten)
  const turnierSchweizerRundeAuslosen = useAppStore((s) => s.turnierSchweizerRundeAuslosen)

  const turnier = turniere.find((t) => t.id === turnierId)
  const [dialogMatch, setDialogMatch] = useState<Match>()
  const [setupDialog, setSetupDialog] = useState(false)
  const [koStartDialog, setKoStartDialog] = useState(false)

  const name = useMemo(() => {
    const map = new Map(turnier?.teilnehmer.map((t) => [t.id, t.name]) ?? [])
    return (id?: string) => (id ? (map.get(id) ?? '?') : '–')
  }, [turnier])

  if (!turnier) {
    return (
      <div>
        <h1 className="schrift-display doppellinie text-3xl">Turnier nicht gefunden</h1>
        <Link to="/turniere" className="mt-5 inline-flex min-h-11 items-center rounded-md border-2 border-court px-4 text-sm font-semibold text-court hover:bg-linie">
          Zu den Turnieren
        </Link>
      </div>
    )
  }

  const hatErgebnisse = turnier.matches.some((m) => m.status === 'beendet' && m.teilnehmerAId && m.teilnehmerBId)
  const laufende = turnier.matches.filter((m) => m.feld !== undefined && m.status !== 'beendet')
  const naechste = naechsteSpiele(turnier.matches).slice(0, 5)
  const dialogAktuell = dialogMatch ? turnier.matches.find((m) => m.id === dialogMatch.id) : undefined

  /* ---------- Format-Inhalte vorbereiten ---------- */
  const hauptKo = turnier.matches.filter(
    (m) => m.bracketTyp === 'haupt' && (turnier.format === 'ko' || m.phase === 'ko'),
  )
  const platz3 = turnier.matches.find(
    (m) => m.bracketTyp === 'platz3' && (turnier.format === 'ko' || m.phase === 'ko'),
  )
  const gruppenMap = turnier.format === 'gruppen_ko' ? gruppenAusMatches(turnier.matches) : new Map<string, Set<string>>()
  const gruppenFertig = turnier.format === 'gruppen_ko' && gruppenphaseFertig(turnier.matches)
  const koGestartet = turnier.matches.some((m) => m.phase === 'ko')
  const schweizerRunde = aktuelleSchweizerRunde(turnier.matches)
  const schweizerZiel = schweizerRundenzahl(turnier)

  /* ---------- Endstand ---------- */
  function endstand(): { platz: number; text: string }[] {
    if (turnier!.status !== 'beendet') return []
    if (turnier!.format === 'ko' || turnier!.format === 'gruppen_ko') {
      const finale = hauptKo.reduce<Match | undefined>(
        (best, m) => ((m.runde ?? 0) > (best?.runde ?? 0) ? m : best),
        undefined,
      )
      if (!finale?.siegerId) return []
      const zweiter = finale.siegerId === finale.teilnehmerAId ? finale.teilnehmerBId : finale.teilnehmerAId
      const liste = [
        { platz: 1, text: name(finale.siegerId) },
        { platz: 2, text: name(zweiter) },
      ]
      if (platz3?.siegerId) {
        const vierter = platz3.siegerId === platz3.teilnehmerAId ? platz3.teilnehmerBId : platz3.teilnehmerAId
        liste.push({ platz: 3, text: name(platz3.siegerId) }, { platz: 4, text: name(vierter) })
      }
      return liste
    }
    if (turnier!.format === 'jeder_gegen_jeden') {
      return berechneTabelle(turnier!.teilnehmer.map((t) => t.id), turnier!.matches, turnier!.zaehlweise)
        .slice(0, 4)
        .map((z) => ({ platz: z.platz, text: name(z.teilnehmerId) }))
    }
    return schweizerTabelle(turnier!.teilnehmer.map((t) => t.id), turnier!.matches, turnier!.zaehlweise)
      .slice(0, 4)
      .map((z) => ({ platz: z.platz, text: name(z.teilnehmerId) }))
  }

  return (
    <div>
      {/* ---------- Kopf ---------- */}
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="schrift-display doppellinie text-3xl">{turnier.name}</h1>
          <p className="mt-4 text-sm text-tinte/70">
            {new Date(turnier.datum).toLocaleDateString('de-DE')} · {FORMAT_NAMEN[turnier.format]} ·{' '}
            {turnier.teilnehmer.length} Teilnehmer · {turnier.felderAnzahl} Felder ·{' '}
            {zaehlweiseText(turnier)}
          </p>
        </div>
        <div className="flex flex-wrap gap-2 print:hidden">
          <Link
            to={`/beamer/${turnier.id}`}
            target="_blank"
            className="min-h-11 inline-flex items-center rounded-md border-2 border-court px-3 text-sm font-semibold text-court hover:bg-linie"
          >
            Beamer-Modus
          </Link>
          <Link
            to={`/turniere/${turnier.id}/drucken`}
            className="min-h-11 inline-flex items-center rounded-md border-2 border-court px-3 text-sm font-semibold text-court hover:bg-linie"
          >
            Drucken
          </Link>
          <button
            type="button"
            onClick={() =>
              downloadTextDatei(
                `turnier-${turnier.name.toLowerCase().replace(/[^a-z0-9äöüß]+/g, '-')}.json`,
                erzeugeTurnierExport(turnier),
              )
            }
            className="min-h-11 rounded-md border-2 border-court px-3 text-sm font-semibold text-court hover:bg-linie"
          >
            Exportieren
          </button>
          {turnier.status !== 'setup' && (
            <button
              type="button"
              onClick={() => setSetupDialog(true)}
              className="min-h-11 rounded-md px-2 text-sm font-semibold text-tinte/60 hover:text-tinte"
            >
              Setup ändern …
            </button>
          )}
        </div>
      </div>

      {/* ---------- Setup-Status ---------- */}
      {turnier.status === 'setup' && (
        <div className="mt-6 rounded-xl border-2 border-kork/50 bg-linie p-5">
          <p className="text-sm text-tinte/80">
            Dieses Turnier ist noch im Setup. {turnier.teilnehmer.length} Teilnehmer eingetragen.
          </p>
          <Link
            to={`/turniere/${turnier.id}/setup`}
            className="mt-3 inline-flex min-h-11 items-center rounded-md bg-court px-4 text-sm font-semibold text-linie hover:bg-court-tief"
          >
            Setup fortsetzen & Spielplan erzeugen
          </Link>
        </div>
      )}

      {turnier.status !== 'setup' && (
        <>
          {/* ---------- Felder ---------- */}
          <section className="mt-6 print:hidden">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <h2 className="schrift-display doppellinie text-xl">Felder</h2>
              {turnier.status === 'laufend' && (
                <button
                  type="button"
                  onClick={() => felderZuweisen(turnier.id)}
                  className="min-h-11 rounded-md bg-court px-4 text-sm font-semibold text-linie hover:bg-court-tief"
                >
                  Felder automatisch besetzen
                </button>
              )}
            </div>
            <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: turnier.felderAnzahl }, (_, i) => i + 1).map((feld) => {
                const match = laufende.find((m) => m.feld === feld)
                return (
                  <div key={feld} className={`rounded-xl border-2 p-4 ${match ? 'border-signal bg-linie' : 'border-court/20 bg-boden/50'}`}>
                    <p className="schrift-display text-sm text-court">Feld {feld}</p>
                    {match ? (
                      <>
                        <p className="mt-1 font-bold leading-snug">
                          {name(match.teilnehmerAId)} <span className="font-normal text-tinte/50">vs.</span>{' '}
                          {name(match.teilnehmerBId)}
                        </p>
                        <p className="ziffern mt-0.5 text-sm text-tinte/65">
                          {match.saetze.map((s) => `${s.a}:${s.b}`).join('  ') || 'Noch kein Stand'}
                        </p>
                        <button
                          type="button"
                          onClick={() => setDialogMatch(match)}
                          className="mt-2 min-h-11 rounded-md bg-court px-3 text-sm font-semibold text-linie hover:bg-court-tief"
                        >
                          Ergebnis eintragen
                        </button>
                      </>
                    ) : (
                      <p className="mt-1 text-sm text-tinte/50">frei</p>
                    )}
                  </div>
                )
              })}
            </div>
            {naechste.length > 0 && (
              <div className="mt-4">
                <p className="text-xs font-semibold text-tinte/60">Als Nächstes (längste Pause zuerst):</p>
                <ol className="mt-1 flex flex-wrap gap-2 text-sm">
                  {naechste.map((m, i) => (
                    <li key={m.id} className="rounded-full border-2 border-court/25 bg-linie px-3 py-1.5">
                      <span className="schrift-display mr-1 text-court">{i + 1}</span>
                      {name(m.teilnehmerAId)} – {name(m.teilnehmerBId)}
                    </li>
                  ))}
                </ol>
              </div>
            )}
          </section>

          {/* ---------- K.o. / Bracket ---------- */}
          {(turnier.format === 'ko' || koGestartet) && hauptKo.length > 0 && (
            <section className="mt-8">
              <h2 className="schrift-display doppellinie text-xl">
                {turnier.format === 'gruppen_ko' ? 'K.o.-Phase' : 'Bracket'}
              </h2>
              <div className="mt-4">
                <Bracket matches={hauptKo} platz3={platz3} name={name} onMatch={setDialogMatch} />
              </div>
            </section>
          )}

          {/* ---------- Gruppenphase ---------- */}
          {turnier.format === 'gruppen_ko' && (
            <section className="mt-8">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <h2 className="schrift-display doppellinie text-xl">Gruppenphase</h2>
                {gruppenFertig && !koGestartet && (
                  <button
                    type="button"
                    onClick={() => setKoStartDialog(true)}
                    className="min-h-11 rounded-md bg-court px-4 text-sm font-semibold text-linie hover:bg-court-tief"
                  >
                    K.o.-Phase starten
                  </button>
                )}
              </div>
              <div className="mt-4 grid gap-5 lg:grid-cols-2">
                {[...gruppenMap.keys()].sort().map((gruppeId) => {
                  const ids = [...gruppenMap.get(gruppeId)!]
                  const gruppenMatches = turnier.matches.filter(
                    (m) => m.phase === 'gruppe' && m.gruppeId === gruppeId,
                  )
                  const zeilen = berechneTabelle(ids, gruppenMatches, turnier.zaehlweise)
                  return (
                    <div key={gruppeId} className="space-y-3">
                      <GruppenTabelle zeilen={zeilen} name={name} titel={`Gruppe ${gruppeId}`} />
                      <MatchListe matches={gruppenMatches} name={name} onMatch={setDialogMatch} />
                    </div>
                  )
                })}
              </div>
            </section>
          )}

          {/* ---------- Jeder gegen Jeden ---------- */}
          {turnier.format === 'jeder_gegen_jeden' && (
            <section className="mt-8 grid gap-5 lg:grid-cols-2">
              <div>
                <h2 className="schrift-display doppellinie text-xl">Tabelle</h2>
                <div className="mt-4">
                  <GruppenTabelle
                    zeilen={berechneTabelle(turnier.teilnehmer.map((t) => t.id), turnier.matches, turnier.zaehlweise)}
                    name={name}
                  />
                </div>
              </div>
              <div>
                <h2 className="schrift-display doppellinie text-xl">Spiele</h2>
                <div className="mt-4 space-y-4">
                  {[...new Set(turnier.matches.map((m) => m.runde ?? 1))].sort((a, b) => a - b).map((r) => (
                    <MatchListe
                      key={r}
                      titel={`Runde ${r}`}
                      matches={turnier.matches.filter((m) => (m.runde ?? 1) === r)}
                      name={name}
                      onMatch={setDialogMatch}
                    />
                  ))}
                </div>
              </div>
            </section>
          )}

          {/* ---------- Schweizer System ---------- */}
          {turnier.format === 'schweizer' && (
            <section className="mt-8 grid gap-5 lg:grid-cols-2">
              <div>
                <h2 className="schrift-display doppellinie text-xl">
                  Tabelle <span className="ziffern text-sm text-tinte/50">(Runde {schweizerRunde}/{schweizerZiel})</span>
                </h2>
                <div className="mt-4">
                  <SchweizerTabelleAnsicht
                    zeilen={schweizerTabelle(turnier.teilnehmer.map((t) => t.id), turnier.matches, turnier.zaehlweise)}
                    name={name}
                  />
                </div>
                {istRundeKomplett(turnier.matches, schweizerRunde) && schweizerRunde < schweizerZiel && (
                  <button
                    type="button"
                    onClick={() => turnierSchweizerRundeAuslosen(turnier.id)}
                    className="mt-4 min-h-11 rounded-md bg-court px-4 text-sm font-semibold text-linie hover:bg-court-tief"
                  >
                    Runde {schweizerRunde + 1} auslosen
                  </button>
                )}
              </div>
              <div>
                <h2 className="schrift-display doppellinie text-xl">Runden</h2>
                <div className="mt-4 space-y-4">
                  {Array.from({ length: schweizerRunde }, (_, i) => i + 1).map((r) => (
                    <MatchListe
                      key={r}
                      titel={`Runde ${r}`}
                      matches={turnier.matches.filter((m) => m.runde === r)}
                      name={name}
                      onMatch={setDialogMatch}
                    />
                  ))}
                </div>
              </div>
            </section>
          )}

          {/* ---------- Endstand ---------- */}
          {turnier.status === 'beendet' && (
            <section className="mt-8 rounded-xl border-2 border-court bg-linie p-5">
              <h2 className="schrift-display doppellinie text-xl">Endstand</h2>
              <ol className="mt-4 space-y-1.5">
                {endstand().map((p) => (
                  <li key={p.platz} className="flex items-center gap-3 text-lg">
                    <span className={`schrift-display w-9 text-center ${p.platz === 1 ? 'text-signal drop-shadow' : 'text-court'}`}>
                      {p.platz}.
                    </span>
                    <span className={p.platz === 1 ? 'schrift-display' : 'font-semibold'}>{p.text}</span>
                  </li>
                ))}
              </ol>
            </section>
          )}
        </>
      )}

      <Link to="/turniere" className="mt-8 inline-flex min-h-11 items-center rounded-md border-2 border-court px-4 text-sm font-semibold text-court hover:bg-linie print:hidden">
        Zu den Turnieren
      </Link>

      {/* ---------- Dialoge ---------- */}
      {dialogAktuell && (
        <ErgebnisDialog
          turnier={turnier}
          match={dialogAktuell}
          name={name}
          onClose={() => setDialogMatch(undefined)}
        />
      )}

      <BestaetigungsDialog
        offen={setupDialog}
        titel="Zurück ins Setup?"
        bestaetigenLabel="Spielplan verwerfen"
        destruktiv
        onBestaetigen={() => {
          spielplanZuruecksetzen(turnier.id)
          setSetupDialog(false)
        }}
        onAbbrechen={() => setSetupDialog(false)}
      >
        {hatErgebnisse
          ? 'Achtung: Es sind bereits Ergebnisse eingetragen — Spielplan UND alle Ergebnisse werden verworfen. Die Teilnehmerliste bleibt erhalten.'
          : 'Der Spielplan wird verworfen und neu erzeugt (Teilnehmerliste bleibt erhalten).'}
      </BestaetigungsDialog>

      <BestaetigungsDialog
        offen={koStartDialog}
        titel="K.o.-Phase starten?"
        bestaetigenLabel="K.o.-Phase starten"
        onBestaetigen={() => {
          turnierKoPhaseStarten(turnier.id)
          setKoStartDialog(false)
        }}
        onAbbrechen={() => setKoStartDialog(false)}
      >
        Die Aufsteiger werden aus den Gruppentabellen übernommen (Kreuzpaarungen: A1–B2,
        B1–A2 …). Steht in einer Tabelle „Los nötig", entscheidet die aktuelle Reihenfolge —
        prüfe sie vorher.
      </BestaetigungsDialog>
    </div>
  )
}
