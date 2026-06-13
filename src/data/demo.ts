/**
 * Beispieldaten (§-Erweiterung Onboarding): ein realistischer Datensatz zum
 * Kennenlernen der App. Alle Ids beginnen mit 'demo-' und lassen sich
 * rückstandsfrei wieder entfernen.
 */
import type {
  Einheit,
  Gruppe,
  Profil,
  ProgrammZuweisung,
  SkillEinschaetzung,
  Termin,
  TrainingsLog,
  Turnier,
} from '../datenmodell'
import { ALLE_SKILLS } from './skills'
import { alleSpieleBeendet, erzeugeRng, erzeugeSpielplan, trageErgebnisEin } from '../engine/turnier'

export interface DemoDaten {
  profile: Profil[]
  gruppen: Gruppe[]
  einheiten: Einheit[]
  zuweisungen: ProgrammZuweisung[]
  logs: TrainingsLog[]
  einschaetzungen: SkillEinschaetzung[]
  turniere: Turnier[]
  termine: Termin[]
}

const NAMEN = ['Lena', 'Ben', 'Mia', 'Jonas', 'Sofia', 'Paul', 'Emma', 'Noah']
const NIVEAUS: Profil['niveau'][] = [
  'fortgeschritten', 'fortgeschritten', 'anfaenger', 'leistung',
  'anfaenger', 'fortgeschritten', 'anfaenger', 'fortgeschritten',
]

function isoTag(versatzTage: number): string {
  const d = new Date()
  d.setDate(d.getDate() + versatzTage)
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

/** Simuliert ein Turnier: trägt mit Seed-RNG plausible Ergebnisse ein. */
function simuliere(turnier: Turnier, anzahl: number | 'alle', startStunde = 10): Turnier {
  const rng = erzeugeRng(42)
  let aktuell = turnier
  let gespielt = 0
  let zeit = Date.parse(`${turnier.datum.slice(0, 10)}T${String(startStunde).padStart(2, '0')}:00:00`)

  for (let schutz = 0; schutz < 200; schutz++) {
    if (anzahl !== 'alle' && gespielt >= anzahl) break
    const offen = aktuell.matches.find(
      (m) => m.status !== 'beendet' && m.teilnehmerAId && m.teilnehmerBId,
    )
    if (!offen) break
    const noetig = turnier.zaehlweise.saetzeZumSieg
    const ziel = turnier.zaehlweise.punkteProSatz
    const saetze: { a: number; b: number }[] = []
    const aGewinnt = rng() > 0.45
    let saetzeA = 0
    let saetzeB = 0
    while (saetzeA < noetig && saetzeB < noetig) {
      const satzAnA = aGewinnt ? rng() > 0.25 : rng() > 0.75
      const verlierer = Math.floor(rng() * (ziel - 1)) // 0 … ziel-2 (immer 2 Punkte Abstand)
      saetze.push(satzAnA ? { a: ziel, b: verlierer } : { a: verlierer, b: ziel })
      if (satzAnA) saetzeA++
      else saetzeB++
    }
    zeit += (9 + Math.floor(rng() * 8)) * 60_000 // 9–16 Minuten pro Spiel
    const matches = trageErgebnisEin(aktuell, offen.id, saetze, { jetzt: new Date(zeit).toISOString() })
    aktuell = { ...aktuell, matches }
    gespielt++
  }
  if (alleSpieleBeendet(aktuell.matches)) aktuell = { ...aktuell, status: 'beendet' }
  return aktuell
}

export function erzeugeDemoDaten(): DemoDaten {
  const rng = erzeugeRng(7)

  /* ---------- Profile & Gruppe ---------- */
  const profile: Profil[] = NAMEN.map((name, i) => ({
    id: `demo-profil-${i + 1}`,
    name: `${name} (Demo)`,
    niveau: NIVEAUS[i]!,
    erstelltAm: isoTag(-70),
  }))
  const gruppen: Gruppe[] = [
    { id: 'demo-gruppe-1', name: 'Demo: Schul-AG', mitgliederIds: profile.slice(0, 6).map((p) => p.id) },
  ]

  /* ---------- Einschätzungen: zwei Zeitpunkte, sichtbarer Fortschritt ---------- */
  const einschaetzungen: SkillEinschaetzung[] = []
  for (const profil of profile.slice(0, 4)) {
    for (const skill of ALLE_SKILLS) {
      const basis = 2 + Math.floor(rng() * 4) // 2–5
      const zuwachs = Math.floor(rng() * 3) // 0–2
      einschaetzungen.push(
        { id: `demo-e-${profil.id}-${skill}-alt`, profilId: profil.id, skill, wert: basis, datum: isoTag(-56) },
        { id: `demo-e-${profil.id}-${skill}-neu`, profilId: profil.id, skill, wert: Math.min(10, basis + zuwachs), datum: isoTag(-3) },
      )
    }
  }

  /* ---------- Eigene Einheiten ---------- */
  const einheiten: Einheit[] = [
    {
      id: 'demo-einheit-1',
      name: 'Demo: Smash-Abend (90 Min)',
      zielSkills: ['smash', 'beinarbeit'],
      istVorlage: false,
      bloecke: [
        { uebungId: 'aw-01', dauerMin: 15 },
        { uebungId: 'te-01', dauerMin: 25, notiz: 'Fokus: Treffpunkt vor dem Körper' },
        { uebungId: 'fw-01', dauerMin: 20 },
        { uebungId: 'sf-01', dauerMin: 20 },
        { uebungId: 'ko-01', dauerMin: 10 },
      ],
    },
    {
      id: 'demo-einheit-2',
      name: 'Demo: Netzspiel kompakt (60 Min)',
      zielSkills: ['netzspiel', 'taktik_doppel'],
      istVorlage: false,
      bloecke: [
        { uebungId: 'aw-02', dauerMin: 10 },
        { uebungId: 'te-02', dauerMin: 25 },
        { uebungId: 'td-01', dauerMin: 25 },
      ],
    },
  ]

  /* ---------- Logs: 6 Wochen Training, 2× pro Woche ---------- */
  const logs: TrainingsLog[] = []
  let logNr = 0
  for (let woche = 6; woche >= 1; woche--) {
    for (const [tagVersatz, einheit] of [
      [-woche * 7 + 1, einheiten[0]!],
      [-woche * 7 + 4, einheiten[1]!],
    ] as const) {
      logNr++
      const alle = einheit.bloecke.map((b) => b.uebungId)
      logs.push({
        id: `demo-log-${logNr}`,
        profilIds: gruppen[0]!.mitgliederIds.slice(0, 4 + (logNr % 3)),
        einheitId: einheit.id,
        datum: isoTag(tagVersatz),
        absolvierteUebungIds: logNr % 4 === 0 ? alle.slice(0, -1) : alle,
      })
    }
  }

  /* ---------- Programm-Zuweisung mit Startdatum (Kalender!) ---------- */
  const zuweisungen: ProgrammZuweisung[] = [
    {
      id: 'demo-zuweisung-1',
      programmId: 'prog-grundlagen',
      zielTyp: 'gruppe',
      zielId: 'demo-gruppe-1',
      startDatum: isoTag(-14),
      abgehakt: [],
    },
  ]

  /* ---------- Termine ---------- */
  const termine: Termin[] = [
    { id: 'demo-termin-1', datum: isoTag(2), titel: 'Demo: Vereinstraining', typ: 'training', zeit: '17:30', gruppeId: 'demo-gruppe-1', einheitId: 'demo-einheit-1' },
    { id: 'demo-termin-2', datum: isoTag(9), titel: 'Demo: Vereinstraining', typ: 'training', zeit: '17:30', gruppeId: 'demo-gruppe-1' },
    { id: 'demo-termin-3', datum: isoTag(23), titel: 'Demo: Stadtmeisterschaft (auswärts)', typ: 'turnier', notiz: 'Meldung bis Ende des Monats' },
  ]

  /* ---------- Turnier 1: beendetes K.o. mit Platz 3 ---------- */
  const ko: Turnier = {
    id: 'demo-turnier-1',
    name: 'Demo: Vereinsmeisterschaft',
    datum: isoTag(-7),
    disziplin: 'einzel',
    format: 'ko',
    zaehlweise: { modus: 'punkte', saetzeZumSieg: 2, punkteProSatz: 21, verlaengerung: true, maxPunkte: 30 },
    felderAnzahl: 2,
    teilnehmer: NAMEN.map((name, i) => ({
      id: `demo-tn-${i + 1}`,
      name: `${name} (Demo)`,
      profilIds: [`demo-profil-${i + 1}`],
      ...(i < 2 ? { setzplatz: i + 1 } : {}),
    })),
    matches: [],
    config: { spielUmPlatz3: true },
    status: 'setup',
  }
  ko.matches = erzeugeSpielplan(ko, erzeugeRng(11))
  ko.status = 'laufend'
  const koFertig = simuliere(ko, 'alle')

  /* ---------- Turnier 2: laufendes Jeder-gegen-Jeden ---------- */
  const liga: Turnier = {
    id: 'demo-turnier-2',
    name: 'Demo: AG-Liga (läuft)',
    datum: isoTag(0),
    disziplin: 'einzel',
    format: 'jeder_gegen_jeden',
    zaehlweise: { modus: 'punkte', saetzeZumSieg: 1, punkteProSatz: 15, verlaengerung: true, maxPunkte: 21 },
    felderAnzahl: 2,
    teilnehmer: NAMEN.slice(0, 6).map((name, i) => ({
      id: `demo-liga-tn-${i + 1}`,
      name: `${name} (Demo)`,
      profilIds: [`demo-profil-${i + 1}`],
    })),
    matches: [],
    config: {},
    status: 'setup',
  }
  liga.matches = erzeugeSpielplan(liga, erzeugeRng(23))
  liga.status = 'laufend'
  const ligaLaufend = simuliere(liga, 6, Math.max(8, new Date().getHours() - 1))

  return { profile, gruppen, einheiten, zuweisungen, logs, einschaetzungen, turniere: [koFertig, ligaLaufend], termine }
}
