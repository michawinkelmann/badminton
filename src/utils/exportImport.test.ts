/**
 * Phase-1-Abnahme (technischer Teil): Export → Import stellt alles wieder her.
 * Der manuelle Browser-Test (Browserdaten löschen) bleibt zusätzlich bestehen.
 */
import { describe, expect, it } from 'vitest'
import type { AppState, Einheit, Turnier, Uebung } from '../datenmodell'
import { leererAppState } from '../datenmodell'
import {
  erzeugeEinheitExport,
  erzeugeTurnierExport,
  erzeugeVollExport,
  exportDateiname,
  parseImport,
} from './exportImport'

const turnier: Turnier = {
  id: 't1',
  name: 'AG-Turnier Sommer',
  datum: '2026-06-12',
  disziplin: 'einzel',
  format: 'ko',
  zaehlweise: {
    modus: 'punkte',
    saetzeZumSieg: 2,
    punkteProSatz: 21,
    verlaengerung: true,
    maxPunkte: 30,
  },
  felderAnzahl: 2,
  teilnehmer: [
    { id: 'tn1', name: 'Mia' },
    { id: 'tn2', name: 'Ben', setzplatz: 1 },
  ],
  matches: [
    {
      id: 'm1',
      teilnehmerAId: 'tn1',
      teilnehmerBId: 'tn2',
      saetze: [{ a: 21, b: 15 }],
      status: 'offen',
      runde: 1,
      bracketSlot: 0,
      bracketTyp: 'haupt',
    },
  ],
  config: { spielUmPlatz3: false },
  status: 'setup',
}

const uebung: Uebung = {
  id: 'u-eigen-1',
  name: 'Clear-Zuspiel über Kreuz',
  kategorie: 'schlagtechnik',
  skills: ['clear', 'beinarbeit'],
  niveau: ['fortgeschritten'],
  dauerMin: 12,
  personen: 'paar',
  material: ['Shuttle-Korb'],
  kurzbeschreibung: 'Clears diagonal mit Laufweg zur Mitte.',
  durchfuehrung: ['Zuspiel hoch ins Hinterfeld', '10 Clears, dann Wechsel'],
  fehlerbilder: ['Treffpunkt hinter dem Körper → früher unter den Ball laufen'],
}

const einheit: Einheit = {
  id: 'e1',
  name: 'Clear-Schwerpunkt 90 Min',
  zielSkills: ['clear'],
  bloecke: [{ uebungId: 'u-eigen-1', dauerMin: 15, notiz: 'Fokus Treffpunkt' }],
  istVorlage: false,
}

const beispielState: AppState = {
  ...leererAppState,
  profile: [
    {
      id: 'p1',
      name: 'Alex',
      niveau: 'fortgeschritten',
      erstelltAm: '2026-01-10T10:00:00.000Z',
      notizen: 'Linkshänder',
    },
  ],
  gruppen: [{ id: 'g1', name: 'Badminton-AG Mittwoch', mitgliederIds: ['p1'] }],
  eigeneUebungen: [uebung],
  einheiten: [einheit],
  programme: [
    {
      id: 'prog1',
      name: 'Mini-Programm',
      beschreibung: 'Test',
      zielniveau: 'anfaenger',
      wochen: [{ nummer: 1, fokus: 'Grundschläge', einheitIds: ['e1'] }],
      istVorlage: false,
    },
  ],
  zuweisungen: [
    {
      id: 'z1',
      programmId: 'prog1',
      zielId: 'g1',
      zielTyp: 'gruppe',
      startDatum: '2026-02-01',
      abgehakt: [{ woche: 1, einheitId: 'e1', datum: '2026-02-04' }],
    },
  ],
  logs: [
    {
      id: 'l1',
      profilIds: ['p1'],
      einheitId: 'e1',
      datum: '2026-02-04',
      absolvierteUebungIds: ['u-eigen-1'],
    },
  ],
  einschaetzungen: [
    { id: 's1', profilId: 'p1', skill: 'clear', wert: 6, datum: '2026-02-01' },
  ],
  turniere: [turnier],
}

describe('Voll-Export/-Import', () => {
  it('stellt den kompletten AppState unverändert wieder her (Roundtrip)', () => {
    const json = erzeugeVollExport(beispielState)
    const ergebnis = parseImport(json)
    expect(ergebnis.typ).toBe('voll')
    if (ergebnis.typ === 'voll') expect(ergebnis.daten).toEqual(beispielState)
  })

  it('lehnt beschädigte Dateien mit verständlicher Meldung ab', () => {
    const kaputt = erzeugeVollExport(beispielState).replace('"fortgeschritten"', '"profi"')
    const ergebnis = parseImport(kaputt)
    expect(ergebnis.typ).toBe('fehler')
  })

  it('lehnt kein-JSON ab', () => {
    expect(parseImport('das ist kein json').typ).toBe('fehler')
  })

  it('lehnt Dateien aus neueren Schema-Versionen ab', () => {
    const zukunft = JSON.stringify({ ...beispielState, schemaVersion: 99 })
    const ergebnis = parseImport(zukunft)
    expect(ergebnis.typ).toBe('fehler')
    if (ergebnis.typ === 'fehler') expect(ergebnis.fehler).toContain('neueren Version')
  })
})

describe('Einzel-Exporte', () => {
  it('Turnier-Export-Roundtrip', () => {
    const ergebnis = parseImport(erzeugeTurnierExport(turnier))
    expect(ergebnis.typ).toBe('turnier')
    if (ergebnis.typ === 'turnier') expect(ergebnis.turnier).toEqual(turnier)
  })

  it('Einheit-Export nimmt referenzierte eigene Übungen mit', () => {
    const fremde: Uebung = { ...uebung, id: 'u-eigen-2', name: 'Nicht referenziert' }
    const ergebnis = parseImport(erzeugeEinheitExport(einheit, [uebung, fremde]))
    expect(ergebnis.typ).toBe('einheit')
    if (ergebnis.typ === 'einheit') {
      expect(ergebnis.einheit).toEqual(einheit)
      expect(ergebnis.eigeneUebungen).toEqual([uebung])
    }
  })
})

describe('Dateiname', () => {
  it('folgt dem Muster badminton-planer-export-YYYY-MM-DD.json', () => {
    expect(exportDateiname(new Date('2026-06-12T08:00:00Z'))).toBe(
      'badminton-planer-export-2026-06-12.json',
    )
  })
})
