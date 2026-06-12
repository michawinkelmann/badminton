import { useRef, useState } from 'react'
import { useAppStore, nurDaten } from '../store'
import {
  downloadTextDatei,
  erzeugeVollExport,
  exportDateiname,
  parseImport,
  type ImportErgebnis,
} from '../utils/exportImport'
import BestaetigungsDialog from '../components/ui/BestaetigungsDialog'

type Vorschau = Exclude<ImportErgebnis, { typ: 'fehler' }>

export default function Einstellungen() {
  const store = useAppStore()
  const dateiInput = useRef<HTMLInputElement>(null)

  const [importFehler, setImportFehler] = useState<string>()
  const [vorschau, setVorschau] = useState<Vorschau>()
  const [meldung, setMeldung] = useState<string>()
  const [ersetzenDialog, setErsetzenDialog] = useState(false)
  const [loeschenDialog, setLoeschenDialog] = useState(false)

  // Auswahl für „Nur ausgewählte hinzufügen" (Voll-Import)
  const [gewaehlteTurniere, setGewaehlteTurniere] = useState<Set<string>>(new Set())
  const [gewaehlteEinheiten, setGewaehlteEinheiten] = useState<Set<string>>(new Set())

  function exportieren() {
    downloadTextDatei(exportDateiname(), erzeugeVollExport(nurDaten(store)))
    setMeldung('Export heruntergeladen. Bewahre die Datei als Backup auf.')
  }

  async function dateiGewaehlt(datei: File | undefined) {
    setImportFehler(undefined)
    setVorschau(undefined)
    setMeldung(undefined)
    if (!datei) return
    const ergebnis = parseImport(await datei.text())
    if (ergebnis.typ === 'fehler') {
      setImportFehler(ergebnis.fehler)
      return
    }
    setVorschau(ergebnis)
    if (ergebnis.typ === 'voll') {
      setGewaehlteTurniere(new Set(ergebnis.daten.turniere.map((t) => t.id)))
      setGewaehlteEinheiten(new Set(ergebnis.daten.einheiten.map((e) => e.id)))
    }
  }

  function importAbschliessen(text: string) {
    setVorschau(undefined)
    setMeldung(text)
    if (dateiInput.current) dateiInput.current.value = ''
  }

  function allesErsetzen() {
    if (vorschau?.typ !== 'voll') return
    store.importErsetzen(vorschau.daten)
    setErsetzenDialog(false)
    importAbschliessen('Import abgeschlossen — alle Daten wurden ersetzt.')
  }

  function ausgewaehlteHinzufuegen() {
    if (vorschau?.typ !== 'voll') return
    const turniere = vorschau.daten.turniere.filter((t) => gewaehlteTurniere.has(t.id))
    const einheiten = vorschau.daten.einheiten.filter((e) => gewaehlteEinheiten.has(e.id))
    store.turniereHinzufuegen(turniere)
    store.einheitenHinzufuegen(einheiten, vorschau.daten.eigeneUebungen)
    importAbschliessen(
      `${turniere.length} Turnier(e) und ${einheiten.length} Einheit(en) hinzugefügt.`,
    )
  }

  function einzelImport() {
    if (vorschau?.typ === 'turnier') {
      store.turniereHinzufuegen([vorschau.turnier])
      importAbschliessen(`Turnier „${vorschau.turnier.name}" hinzugefügt.`)
    } else if (vorschau?.typ === 'einheit') {
      store.einheitenHinzufuegen([vorschau.einheit], vorschau.eigeneUebungen)
      importAbschliessen(`Einheit „${vorschau.einheit.name}" hinzugefügt.`)
    }
  }

  function umschalten(set: Set<string>, id: string): Set<string> {
    const neu = new Set(set)
    if (neu.has(id)) neu.delete(id)
    else neu.add(id)
    return neu
  }

  const daten = nurDaten(store)
  const zaehler: [string, number][] = [
    ['Profile', daten.profile.length],
    ['Gruppen', daten.gruppen.length],
    ['Eigene Übungen', daten.eigeneUebungen.length],
    ['Einheiten', daten.einheiten.length],
    ['Programme', daten.programme.length],
    ['Zuweisungen', daten.zuweisungen.length],
    ['Trainings-Logs', daten.logs.length],
    ['Einschätzungen', daten.einschaetzungen.length],
    ['Turniere', daten.turniere.length],
  ]

  return (
    <div className="max-w-3xl">
      <h1 className="schrift-display doppellinie text-3xl">Einstellungen</h1>

      {/* ---------- Datensicherung ---------- */}
      <section className="mt-8 rounded-xl border-2 border-court bg-linie p-5">
        <h2 className="schrift-display text-lg">Datensicherung</h2>
        <p className="mt-2 text-sm text-tinte/75">
          Alle Daten liegen ausschließlich lokal in diesem Browser. Es gibt keinen
          Server und keine automatische Sicherung — dein Backup ist der Export.
          Exportiere regelmäßig, besonders vor Browser-Wechsel oder dem Löschen von
          Websitedaten.
        </p>
        <dl className="ziffern mt-4 grid grid-cols-2 gap-x-6 gap-y-1 text-sm sm:grid-cols-3">
          {zaehler.map(([label, anzahl]) => (
            <div key={label} className="flex justify-between gap-2 border-b border-boden py-1">
              <dt className="text-tinte/70">{label}</dt>
              <dd className="font-semibold">{anzahl}</dd>
            </div>
          ))}
        </dl>
        <button
          type="button"
          onClick={exportieren}
          className="mt-5 min-h-11 rounded-md bg-court px-5 text-sm font-semibold text-linie hover:bg-court-tief"
        >
          Daten exportieren
        </button>
      </section>

      {/* ---------- Import ---------- */}
      <section className="mt-6 rounded-xl border-2 border-court bg-linie p-5">
        <h2 className="schrift-display text-lg">Daten importieren</h2>
        <p className="mt-2 text-sm text-tinte/75">
          Wähle einen Voll-Export oder einen Einzel-Export (Turnier/Einheit). Du
          siehst zuerst eine Vorschau — nichts wird ohne deine Entscheidung
          übernommen.
        </p>
        <input
          ref={dateiInput}
          type="file"
          accept="application/json,.json"
          onChange={(e) => void dateiGewaehlt(e.target.files?.[0])}
          className="mt-4 block w-full cursor-pointer rounded-md border-2 border-court/40 p-2 text-sm file:mr-3 file:min-h-9 file:cursor-pointer file:rounded file:border-0 file:bg-court file:px-4 file:font-semibold file:text-linie"
        />

        {importFehler && (
          <p role="alert" className="mt-4 rounded-md border-2 border-red-700 bg-red-50 p-3 text-sm text-red-800">
            {importFehler}
          </p>
        )}

        {vorschau?.typ === 'voll' && (
          <div className="mt-4 rounded-lg border-2 border-court/30 bg-boden p-4">
            <h3 className="font-semibold">Vorschau: Voll-Export</h3>
            <ul className="ziffern mt-2 grid grid-cols-2 gap-x-6 text-sm sm:grid-cols-3">
              <li>{vorschau.daten.profile.length} Profile</li>
              <li>{vorschau.daten.gruppen.length} Gruppen</li>
              <li>{vorschau.daten.eigeneUebungen.length} eigene Übungen</li>
              <li>{vorschau.daten.einheiten.length} Einheiten</li>
              <li>{vorschau.daten.programme.length} Programme</li>
              <li>{vorschau.daten.zuweisungen.length} Zuweisungen</li>
              <li>{vorschau.daten.logs.length} Logs</li>
              <li>{vorschau.daten.einschaetzungen.length} Einschätzungen</li>
              <li>{vorschau.daten.turniere.length} Turniere</li>
            </ul>

            {(vorschau.daten.turniere.length > 0 || vorschau.daten.einheiten.length > 0) && (
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                {vorschau.daten.turniere.length > 0 && (
                  <fieldset>
                    <legend className="text-sm font-semibold">Turniere zum Hinzufügen</legend>
                    {vorschau.daten.turniere.map((t) => (
                      <label key={t.id} className="mt-1 flex min-h-9 items-center gap-2 text-sm">
                        <input
                          type="checkbox"
                          checked={gewaehlteTurniere.has(t.id)}
                          onChange={() => setGewaehlteTurniere((s) => umschalten(s, t.id))}
                          className="h-5 w-5 accent-court"
                        />
                        {t.name} ({t.datum})
                      </label>
                    ))}
                  </fieldset>
                )}
                {vorschau.daten.einheiten.length > 0 && (
                  <fieldset>
                    <legend className="text-sm font-semibold">Einheiten zum Hinzufügen</legend>
                    {vorschau.daten.einheiten.map((e) => (
                      <label key={e.id} className="mt-1 flex min-h-9 items-center gap-2 text-sm">
                        <input
                          type="checkbox"
                          checked={gewaehlteEinheiten.has(e.id)}
                          onChange={() => setGewaehlteEinheiten((s) => umschalten(s, e.id))}
                          className="h-5 w-5 accent-court"
                        />
                        {e.name}
                      </label>
                    ))}
                  </fieldset>
                )}
              </div>
            )}

            <div className="mt-5 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => setErsetzenDialog(true)}
                className="min-h-11 rounded-md bg-red-700 px-4 text-sm font-semibold text-linie hover:bg-red-800"
              >
                Alles ersetzen …
              </button>
              <button
                type="button"
                onClick={ausgewaehlteHinzufuegen}
                disabled={gewaehlteTurniere.size + gewaehlteEinheiten.size === 0}
                className="min-h-11 rounded-md bg-court px-4 text-sm font-semibold text-linie hover:bg-court-tief disabled:cursor-not-allowed disabled:opacity-40"
              >
                Ausgewählte hinzufügen
              </button>
              <button
                type="button"
                onClick={() => importAbschliessen('Import verworfen.')}
                className="min-h-11 rounded-md px-3 text-sm font-semibold text-tinte/70 hover:text-tinte"
              >
                Verwerfen
              </button>
            </div>
          </div>
        )}

        {(vorschau?.typ === 'turnier' || vorschau?.typ === 'einheit') && (
          <div className="mt-4 rounded-lg border-2 border-court/30 bg-boden p-4">
            <h3 className="font-semibold">
              {vorschau.typ === 'turnier'
                ? `Vorschau: Turnier „${vorschau.turnier.name}"`
                : `Vorschau: Einheit „${vorschau.einheit.name}"`}
            </h3>
            <p className="mt-1 text-sm text-tinte/75">
              {vorschau.typ === 'turnier'
                ? `${vorschau.turnier.teilnehmer.length} Teilnehmer, ${vorschau.turnier.matches.length} Spiele, Status: ${vorschau.turnier.status}`
                : `${vorschau.einheit.bloecke.length} Blöcke${vorschau.eigeneUebungen.length > 0 ? `, bringt ${vorschau.eigeneUebungen.length} eigene Übung(en) mit` : ''}`}
            </p>
            <div className="mt-4 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={einzelImport}
                className="min-h-11 rounded-md bg-court px-4 text-sm font-semibold text-linie hover:bg-court-tief"
              >
                Hinzufügen
              </button>
              <button
                type="button"
                onClick={() => importAbschliessen('Import verworfen.')}
                className="min-h-11 rounded-md px-3 text-sm font-semibold text-tinte/70 hover:text-tinte"
              >
                Verwerfen
              </button>
            </div>
          </div>
        )}

        {meldung && (
          <p role="status" className="mt-4 rounded-md border-2 border-court/40 bg-boden p-3 text-sm">
            {meldung}
          </p>
        )}
      </section>

      {/* ---------- Gefahrenzone ---------- */}
      <section className="mt-6 rounded-xl border-2 border-red-700/50 bg-linie p-5">
        <h2 className="schrift-display text-lg text-red-800">Gefahrenzone</h2>
        <p className="mt-2 text-sm text-tinte/75">
          Löscht sämtliche Daten dieses Browsers unwiderruflich. Exportiere vorher!
        </p>
        <button
          type="button"
          onClick={() => setLoeschenDialog(true)}
          className="mt-4 min-h-11 rounded-md border-2 border-red-700 px-4 text-sm font-semibold text-red-800 hover:bg-red-50"
        >
          Alle Daten löschen …
        </button>
      </section>

      <BestaetigungsDialog
        offen={ersetzenDialog}
        titel="Alles ersetzen?"
        bestaetigenLabel="Alles ersetzen"
        destruktiv
        onBestaetigen={allesErsetzen}
        onAbbrechen={() => setErsetzenDialog(false)}
      >
        Deine aktuellen Daten werden vollständig durch den Inhalt der Datei
        ersetzt. Das lässt sich nicht rückgängig machen.
      </BestaetigungsDialog>

      <BestaetigungsDialog
        offen={loeschenDialog}
        titel="Alle Daten löschen?"
        bestaetigenLabel="Endgültig löschen"
        destruktiv
        onBestaetigen={() => {
          store.allesLoeschen()
          setLoeschenDialog(false)
          setMeldung('Alle Daten wurden gelöscht.')
        }}
        onAbbrechen={() => setLoeschenDialog(false)}
      >
        Profile, Gruppen, Einheiten, Programme, Logs und Turniere werden
        unwiderruflich gelöscht. Ohne vorherigen Export gibt es kein Zurück.
      </BestaetigungsDialog>
    </div>
  )
}
