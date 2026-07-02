/**
 * Zentraler Zustand-Store mit Persist auf localStorage (§2, §11).
 * Schlüssel: badminton-planer:v1 — schemaVersion im State, Migration vorgesehen.
 */
import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { nanoid } from 'nanoid'
import type {
  AppState,
  Einheit,
  Gruppe,
  Profil,
  Programm,
  ProgrammZuweisung,
  SkillId,
  Termin,
  Turnier,
  Uebung,
} from '../datenmodell'
import { AKTUELLE_SCHEMA_VERSION, leererAppState } from '../datenmodell'
import { findeEinheitMitVorlagen, findeProgramm } from '../data/programme'
import { erzeugeAbhakLog } from '../utils/tracking'
import { erzeugeDemoDaten } from '../data/demo'
import {
  alleSpieleBeendet,
  aktuelleSchweizerRunde,
  erzeugeSpielplan,
  koPhaseStarten as engineKoStarten,
  gruppenphaseFertig,
  istRundeKomplett,
  schweizerRundeAuslosen as engineSchweizerRunde,
  schweizerRundenzahl,
  setzeZwischenstand,
  trageErgebnisEin,
  weiseFelderZu,
} from '../engine/turnier'

interface AppActions {
  // Profile (§7)
  profilAnlegen: (name: string, niveau: Profil['niveau'], notizen?: string) => Profil
  profilAktualisieren: (profil: Profil) => void
  profilLoeschen: (id: string) => void

  // Gruppen (§7)
  gruppeAnlegen: (name: string, mitgliederIds: string[]) => Gruppe
  gruppeAktualisieren: (gruppe: Gruppe) => void
  gruppeLoeschen: (id: string) => void

  // Tracking (§7)
  einschaetzungenSpeichern: (profilId: string, werte: Partial<Record<SkillId, number>>) => void
  logHinzufuegen: (profilIds: string[], einheitId: string, datum: string) => void
  logEntfernen: (id: string) => void

  // Eigene Übungen (Phase 2)
  uebungSpeichern: (uebung: Uebung) => void
  uebungLoeschen: (id: string) => void

  // Einheiten (Phase 3)
  einheitSpeichern: (einheit: Einheit) => void
  einheitLoeschen: (id: string) => void
  einheitDuplizieren: (id: string) => Einheit | undefined

  // Programme & Zuweisungen (§6)
  programmSpeichern: (programm: Programm) => void
  programmLoeschen: (id: string) => void
  zuweisungAnlegen: (
    programmId: string,
    zielId: string,
    zielTyp: 'profil' | 'gruppe',
    startDatum: string,
  ) => ProgrammZuweisung
  zuweisungLoeschen: (id: string) => void
  abhaken: (zuweisungId: string, woche: number, einheitId: string) => void
  abhakenZuruecknehmen: (zuweisungId: string, woche: number, einheitId: string) => void

  // Turniere (§9)
  turnierAnlegen: (daten: Omit<Turnier, 'id' | 'matches' | 'status'>) => Turnier
  turnierAktualisieren: (turnier: Turnier) => void
  turnierLoeschen: (id: string) => void
  spielplanErzeugen: (turnierId: string) => void
  spielplanZuruecksetzen: (turnierId: string) => void
  ergebnisEintragen: (
    turnierId: string,
    matchId: string,
    saetze: { a: number; b: number }[],
    folgenVerwerfen?: boolean,
  ) => void
  zwischenstandSpeichern: (turnierId: string, matchId: string, saetze: { a: number; b: number }[]) => void
  felderZuweisen: (turnierId: string) => number
  feldFreigeben: (turnierId: string, matchId: string) => void
  turnierKoPhaseStarten: (turnierId: string, manuelleReihung?: string[]) => void
  turnierSchweizerRundeAuslosen: (turnierId: string) => void

  // Import / Export / Reset
  terminAnlegen: (termin: Omit<Termin, 'id'>) => Termin
  terminAktualisieren: (termin: Termin) => void
  terminLoeschen: (id: string) => void

  importErsetzen: (daten: AppState) => void
  turniereHinzufuegen: (turniere: Turnier[]) => void
  einheitenHinzufuegen: (einheiten: Einheit[], eigeneUebungen?: Uebung[]) => void
  allesLoeschen: () => void
  demoLaden: () => void
  demoEntfernen: () => void
}

export type AppStore = AppState & AppActions

/** Datenfelder aus dem Store herausgreifen (für Export & Persistenz). */
function istDemo(e: { id: string }): boolean {
  return e.id.startsWith('demo-')
}

/** Entfernt alle Demodaten (Ids mit 'demo-'-Präfix) aus dem State. */
function ohneDemo(s: AppState) {
  return {
    profile: s.profile.filter((e) => !istDemo(e)),
    gruppen: s.gruppen.filter((e) => !istDemo(e)),
    einheiten: s.einheiten.filter((e) => !istDemo(e)),
    zuweisungen: s.zuweisungen.filter((e) => !istDemo(e)),
    logs: s.logs.filter((e) => !istDemo(e)),
    einschaetzungen: s.einschaetzungen.filter((e) => !istDemo(e)),
    turniere: s.turniere.filter((e) => !istDemo(e)),
    termine: s.termine.filter((e) => !istDemo(e)),
  }
}

export function nurDaten(s: AppState): AppState {
  return {
    schemaVersion: s.schemaVersion,
    profile: s.profile,
    gruppen: s.gruppen,
    eigeneUebungen: s.eigeneUebungen,
    einheiten: s.einheiten,
    programme: s.programme,
    zuweisungen: s.zuweisungen,
    logs: s.logs,
    einschaetzungen: s.einschaetzungen,
    turniere: s.turniere,
    termine: s.termine,
  }
}

/** Beim Hinzufügen: ID-Kollisionen vermeiden, indem Duplikate neue IDs bekommen. */
function mitFrischerIdBeiKollision<T extends { id: string }>(
  neue: T[],
  vorhandene: T[],
): T[] {
  const ids = new Set(vorhandene.map((e) => e.id))
  return neue.map((e) => (ids.has(e.id) ? { ...e, id: nanoid() } : e))
}

export const useAppStore = create<AppStore>()(
  persist(
    (set, get) => ({
      ...leererAppState,

      /* ---------- Profile ---------- */
      profilAnlegen: (name, niveau, notizen) => {
        const profil: Profil = {
          id: nanoid(),
          name,
          niveau,
          erstelltAm: new Date().toISOString(),
          ...(notizen ? { notizen } : {}),
        }
        set((s) => ({ profile: [...s.profile, profil] }))
        return profil
      },

      profilAktualisieren: (profil) =>
        set((s) => ({
          profile: s.profile.map((p) => (p.id === profil.id ? profil : p)),
        })),

      profilLoeschen: (id) =>
        set((s) => ({
          profile: s.profile.filter((p) => p.id !== id),
          gruppen: s.gruppen.map((g) => ({
            ...g,
            mitgliederIds: g.mitgliederIds.filter((m) => m !== id),
          })),
          // Keine verwaisten Referenzen hinterlassen (wie gruppeLoeschen):
          zuweisungen: s.zuweisungen.filter(
            (z) => !(z.zielTyp === 'profil' && z.zielId === id),
          ),
          einschaetzungen: s.einschaetzungen.filter((e) => e.profilId !== id),
          logs: s.logs
            .map((l) => ({ ...l, profilIds: l.profilIds.filter((p) => p !== id) }))
            .filter((l) => l.profilIds.length > 0),
        })),

      /* ---------- Gruppen ---------- */
      gruppeAnlegen: (name, mitgliederIds) => {
        const gruppe: Gruppe = { id: nanoid(), name, mitgliederIds }
        set((s) => ({ gruppen: [...s.gruppen, gruppe] }))
        return gruppe
      },

      gruppeAktualisieren: (gruppe) =>
        set((s) => ({
          gruppen: s.gruppen.map((g) => (g.id === gruppe.id ? gruppe : g)),
        })),

      gruppeLoeschen: (id) =>
        set((s) => ({
          gruppen: s.gruppen.filter((g) => g.id !== id),
          zuweisungen: s.zuweisungen.filter(
            (z) => !(z.zielTyp === 'gruppe' && z.zielId === id),
          ),
        })),

      /* ---------- Tracking ---------- */
      einschaetzungenSpeichern: (profilId, werte) => {
        const datum = new Date().toISOString()
        const neue = Object.entries(werte).map(([skill, wert]) => ({
          id: nanoid(),
          profilId,
          skill: skill as SkillId,
          wert: wert as number,
          datum,
        }))
        // Historisiert: immer anhängen, nie überschreiben (§7)
        set((s) => ({ einschaetzungen: [...s.einschaetzungen, ...neue] }))
      },

      logHinzufuegen: (profilIds, einheitId, datum) => {
        const einheit = findeEinheitMitVorlagen(einheitId, get().einheiten)
        if (!einheit || profilIds.length === 0) return
        const log = erzeugeAbhakLog(einheit, profilIds, datum)
        set((s) => ({ logs: [...s.logs, log] }))
      },

      logEntfernen: (id) => set((s) => ({ logs: s.logs.filter((l) => l.id !== id) })),

      /* ---------- Eigene Übungen ---------- */
      uebungSpeichern: (uebung) =>
        set((s) => ({
          eigeneUebungen: s.eigeneUebungen.some((u) => u.id === uebung.id)
            ? s.eigeneUebungen.map((u) => (u.id === uebung.id ? uebung : u))
            : [...s.eigeneUebungen, uebung],
        })),

      uebungLoeschen: (id) =>
        set((s) => ({
          eigeneUebungen: s.eigeneUebungen.filter((u) => u.id !== id),
        })),

      /* ---------- Einheiten ---------- */
      einheitSpeichern: (einheit) =>
        set((s) => ({
          einheiten: s.einheiten.some((e) => e.id === einheit.id)
            ? s.einheiten.map((e) => (e.id === einheit.id ? einheit : e))
            : [...s.einheiten, einheit],
        })),

      einheitLoeschen: (id) =>
        set((s) => ({
          einheiten: s.einheiten.filter((e) => e.id !== id),
        })),

      einheitDuplizieren: (id) => {
        const original =
          get().einheiten.find((e) => e.id === id) ?? findeEinheitMitVorlagen(id, [])
        if (!original) return undefined
        const kopie: Einheit = {
          ...original,
          id: nanoid(),
          name: `${original.name} (Kopie)`,
          istVorlage: false,
          bloecke: original.bloecke.map((b) => ({ ...b })),
        }
        set((s) => ({ einheiten: [...s.einheiten, kopie] }))
        return kopie
      },

      /* ---------- Programme & Zuweisungen ---------- */
      programmSpeichern: (programm) =>
        set((s) => ({
          programme: s.programme.some((p) => p.id === programm.id)
            ? s.programme.map((p) => (p.id === programm.id ? programm : p))
            : [...s.programme, programm],
        })),

      programmLoeschen: (id) =>
        set((s) => ({
          programme: s.programme.filter((p) => p.id !== id),
          zuweisungen: s.zuweisungen.filter((z) => z.programmId !== id),
        })),

      zuweisungAnlegen: (programmId, zielId, zielTyp, startDatum) => {
        const zuweisung: ProgrammZuweisung = {
          id: nanoid(),
          programmId,
          zielId,
          zielTyp,
          startDatum,
          abgehakt: [],
        }
        set((s) => ({ zuweisungen: [...s.zuweisungen, zuweisung] }))
        return zuweisung
      },

      zuweisungLoeschen: (id) =>
        set((s) => ({ zuweisungen: s.zuweisungen.filter((z) => z.id !== id) })),

      abhaken: (zuweisungId, woche, einheitId) => {
        const s = get()
        const zuweisung = s.zuweisungen.find((z) => z.id === zuweisungId)
        if (!zuweisung) return
        if (zuweisung.abgehakt.some((a) => a.woche === woche && a.einheitId === einheitId)) return
        const einheit = findeEinheitMitVorlagen(einheitId, s.einheiten)
        if (!einheit) return
        // Betroffene Profile: das Profil selbst ODER alle Gruppenmitglieder (§6)
        const profilIds =
          zuweisung.zielTyp === 'profil'
            ? [zuweisung.zielId]
            : (s.gruppen.find((g) => g.id === zuweisung.zielId)?.mitgliederIds ?? [])
        const datum = new Date().toISOString()
        const log = profilIds.length > 0 ? erzeugeAbhakLog(einheit, profilIds, datum) : undefined
        set((st) => ({
          logs: log ? [...st.logs, log] : st.logs,
          zuweisungen: st.zuweisungen.map((z) =>
            z.id === zuweisungId
              ? {
                  ...z,
                  abgehakt: [
                    ...z.abgehakt,
                    { woche, einheitId, datum, ...(log ? { logId: log.id } : {}) },
                  ],
                }
              : z,
          ),
        }))
      },

      abhakenZuruecknehmen: (zuweisungId, woche, einheitId) => {
        const zuweisung = get().zuweisungen.find((z) => z.id === zuweisungId)
        const eintrag = zuweisung?.abgehakt.find(
          (a) => a.woche === woche && a.einheitId === einheitId,
        )
        if (!zuweisung || !eintrag) return
        set((s) => ({
          logs: eintrag.logId ? s.logs.filter((l) => l.id !== eintrag.logId) : s.logs,
          zuweisungen: s.zuweisungen.map((z) =>
            z.id === zuweisungId
              ? {
                  ...z,
                  abgehakt: z.abgehakt.filter(
                    (a) => !(a.woche === woche && a.einheitId === einheitId),
                  ),
                }
              : z,
          ),
        }))
      },

      /* ---------- Turniere (§9) ---------- */
      turnierAnlegen: (daten) => {
        const turnier: Turnier = { ...daten, id: nanoid(), matches: [], status: 'setup' }
        set((s) => ({ turniere: [...s.turniere, turnier] }))
        return turnier
      },

      turnierAktualisieren: (turnier) =>
        set((s) => ({
          turniere: s.turniere.map((t) => (t.id === turnier.id ? turnier : t)),
        })),

      turnierLoeschen: (id) =>
        set((s) => ({ turniere: s.turniere.filter((t) => t.id !== id) })),

      spielplanErzeugen: (turnierId) => {
        const t = get().turniere.find((x) => x.id === turnierId)
        if (!t || t.teilnehmer.length < 2) return
        const matches = erzeugeSpielplan(t)
        set((s) => ({
          turniere: s.turniere.map((x) =>
            x.id === turnierId ? { ...x, matches, status: 'laufend' as const } : x,
          ),
        }))
      },

      spielplanZuruecksetzen: (turnierId) =>
        set((s) => ({
          turniere: s.turniere.map((x) =>
            x.id === turnierId ? { ...x, matches: [], status: 'setup' as const } : x,
          ),
        })),

      ergebnisEintragen: (turnierId, matchId, saetze, folgenVerwerfen = false) => {
        const t = get().turniere.find((x) => x.id === turnierId)
        if (!t) return
        const matches = trageErgebnisEin(t, matchId, saetze, { folgenVerwerfen })
        // Turnier fertig? (Format-abhängig)
        let status = t.status
        const alleFertig = alleSpieleBeendet(matches)
        if (alleFertig) {
          if (t.format === 'schweizer') {
            status = aktuelleSchweizerRunde(matches) >= schweizerRundenzahl(t) ? 'beendet' : 'laufend'
          } else if (t.format === 'gruppen_ko') {
            status = matches.some((m) => m.phase === 'ko') ? 'beendet' : 'laufend'
          } else {
            status = 'beendet'
          }
        } else {
          status = 'laufend'
        }
        set((s) => ({
          turniere: s.turniere.map((x) => (x.id === turnierId ? { ...x, matches, status } : x)),
        }))
      },

      zwischenstandSpeichern: (turnierId, matchId, saetze) => {
        const t = get().turniere.find((x) => x.id === turnierId)
        if (!t) return
        const matches = setzeZwischenstand(t, matchId, saetze)
        set((s) => ({
          turniere: s.turniere.map((x) => (x.id === turnierId ? { ...x, matches } : x)),
        }))
      },

      felderZuweisen: (turnierId) => {
        const t = get().turniere.find((x) => x.id === turnierId)
        if (!t) return 0
        const zuweisungen = weiseFelderZu(t.matches, t.felderAnzahl)
        if (zuweisungen.length === 0) return 0
        set((s) => ({
          turniere: s.turniere.map((x) =>
            x.id === turnierId
              ? {
                  ...x,
                  matches: x.matches.map((m) => {
                    const z = zuweisungen.find((z) => z.matchId === m.id)
                    return z ? { ...m, feld: z.feld, status: 'laufend' as const } : m
                  }),
                }
              : x,
          ),
        }))
        return zuweisungen.length
      },

      feldFreigeben: (turnierId, matchId) =>
        set((s) => ({
          turniere: s.turniere.map((x) =>
            x.id === turnierId
              ? {
                  ...x,
                  matches: x.matches.map((m) =>
                    m.id === matchId && m.status !== 'beendet'
                      ? { ...m, feld: undefined, status: 'offen' as const }
                      : m,
                  ),
                }
              : x,
          ),
        })),

      turnierKoPhaseStarten: (turnierId, manuelleReihung = []) => {
        const t = get().turniere.find((x) => x.id === turnierId)
        if (!t || !gruppenphaseFertig(t.matches)) return
        const matches = engineKoStarten(t, manuelleReihung)
        set((s) => ({
          turniere: s.turniere.map((x) =>
            x.id === turnierId ? { ...x, matches, status: 'laufend' as const } : x,
          ),
        }))
      },

      turnierSchweizerRundeAuslosen: (turnierId) => {
        const t = get().turniere.find((x) => x.id === turnierId)
        if (!t) return
        // Guard gegen Doppel-Auslosung: nur wenn die aktuelle Runde komplett
        // ist UND die Rundenzahl noch nicht erreicht wurde (wie die UI-Bedingung).
        const runde = aktuelleSchweizerRunde(t.matches)
        if (!istRundeKomplett(t.matches, runde) || runde >= schweizerRundenzahl(t)) return
        const matches = engineSchweizerRunde(t)
        set((s) => ({
          turniere: s.turniere.map((x) =>
            x.id === turnierId ? { ...x, matches, status: 'laufend' as const } : x,
          ),
        }))
      },

      /* ---------- Import / Export / Reset ---------- */
      terminAnlegen: (termin) => {
        const neu: Termin = { ...termin, id: `termin-${nanoid(8)}` }
        set((s) => ({ termine: [...s.termine, neu] }))
        return neu
      },
      terminAktualisieren: (termin) =>
        set((s) => ({ termine: s.termine.map((t) => (t.id === termin.id ? termin : t)) })),
      terminLoeschen: (id) =>
        set((s) => ({ termine: s.termine.filter((t) => t.id !== id) })),

      importErsetzen: (daten) => set(() => ({ ...daten })),

      turniereHinzufuegen: (turniere) => {
        const profilIds = new Set(get().profile.map((p) => p.id))
        const bereinigt = mitFrischerIdBeiKollision(turniere, get().turniere).map(
          (t) => ({
            ...t,
            teilnehmer: t.teilnehmer.map((tn) => ({
              ...tn,
              profilIds: tn.profilIds?.filter((id) => profilIds.has(id)),
            })),
          }),
        )
        set((s) => ({ turniere: [...s.turniere, ...bereinigt] }))
      },

      einheitenHinzufuegen: (einheiten, eigeneUebungen = []) => {
        const vorhandeneUebungIds = new Set(get().eigeneUebungen.map((u) => u.id))
        const neueUebungen = eigeneUebungen.filter(
          (u) => !vorhandeneUebungIds.has(u.id),
        )
        const neueEinheiten = mitFrischerIdBeiKollision(einheiten, get().einheiten)
        set((s) => ({
          eigeneUebungen: [...s.eigeneUebungen, ...neueUebungen],
          einheiten: [...s.einheiten, ...neueEinheiten],
        }))
      },

      allesLoeschen: () => set(() => ({ ...leererAppState })),
      demoLaden: () =>
        set((s) => {
          const ohne = ohneDemo(s)
          const demo = erzeugeDemoDaten()
          return {
            profile: [...ohne.profile, ...demo.profile],
            gruppen: [...ohne.gruppen, ...demo.gruppen],
            einheiten: [...ohne.einheiten, ...demo.einheiten],
            zuweisungen: [...ohne.zuweisungen, ...demo.zuweisungen],
            logs: [...ohne.logs, ...demo.logs],
            einschaetzungen: [...ohne.einschaetzungen, ...demo.einschaetzungen],
            turniere: [...ohne.turniere, ...demo.turniere],
            termine: [...ohne.termine, ...demo.termine],
          }
        }),
      demoEntfernen: () => set((s) => ohneDemo(s)),
    }),
    {
      name: 'badminton-planer:v1',
      version: AKTUELLE_SCHEMA_VERSION,
      storage: createJSONStorage(() => localStorage),
      partialize: (s) => nurDaten(s),
      migrate: (persistiert, version) => {
        // Migrationen über schemaVersion/Persist-Version (§11) — v1 braucht noch keine.
        switch (version) {
          case AKTUELLE_SCHEMA_VERSION:
          default:
            return persistiert as AppState
        }
      },
    },
  ),
)

/** Programm zur Zuweisung finden (Vorlagen + eigene). */
export function programmZuZuweisung(
  zuweisung: ProgrammZuweisung,
  eigene: Programm[],
): Programm | undefined {
  return findeProgramm(zuweisung.programmId, eigene)
}
