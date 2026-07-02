/**
 * zod-Schemas für alle persistierten Daten (§2, §11).
 * Pflicht-Validierung beim JSON-Import. Spiegelt src/datenmodell.ts.
 */
import { z } from 'zod'

export const NiveauSchema = z.enum(['anfaenger', 'fortgeschritten', 'leistung'])

export const SkillIdSchema = z.enum([
  'clear',
  'drop',
  'smash',
  'drive',
  'netzspiel',
  'aufschlag',
  'beinarbeit',
  'schnelligkeit',
  'ausdauer',
  'taktik_einzel',
  'taktik_doppel',
])

export const KategorieSchema = z.enum([
  'aufwaermen',
  'schlagtechnik',
  'footwork',
  'taktik_einzel',
  'taktik_doppel',
  'kondition',
  'spielformen',
])

export const ProfilSchema = z.object({
  id: z.string(),
  name: z.string(),
  niveau: NiveauSchema,
  erstelltAm: z.string(),
  notizen: z.string().optional(),
  archiviert: z.boolean().optional(),
})

export const GruppeSchema = z.object({
  id: z.string(),
  name: z.string(),
  mitgliederIds: z.array(z.string()),
})

export const SkillEinschaetzungSchema = z.object({
  id: z.string(),
  profilId: z.string(),
  skill: SkillIdSchema,
  wert: z.number().min(1).max(10),
  datum: z.string(),
})

export const TrainingsLogSchema = z.object({
  id: z.string(),
  profilIds: z.array(z.string()),
  einheitId: z.string(),
  datum: z.string(),
  absolvierteUebungIds: z.array(z.string()),
  notizen: z.string().optional(),
})

const SkizzenPunktSchema = z.object({ x: z.number(), y: z.number() })

export const UebungsSkizzeSchema = z.object({
  spieler: z
    .array(
      z.object({
        pos: SkizzenPunktSchema,
        label: z.string(),
        partei: z.enum(['a', 'b']).optional(),
      }),
    )
    .optional(),
  huetchen: z.array(SkizzenPunktSchema).optional(),
  zonen: z
    .array(
      z.object({
        x: z.number(),
        y: z.number(),
        b: z.number(),
        h: z.number(),
        label: z.string().optional(),
      }),
    )
    .optional(),
  laufwege: z
    .array(
      z.object({
        von: SkizzenPunktSchema,
        bis: SkizzenPunktSchema,
        gebogen: z.boolean().optional(),
      }),
    )
    .optional(),
  shuttlewege: z
    .array(z.object({ von: SkizzenPunktSchema, bis: SkizzenPunktSchema }))
    .optional(),
  hinweis: z.string().optional(),
})

export const UebungSchema = z.object({
  id: z.string(),
  name: z.string(),
  kategorie: KategorieSchema,
  skills: z.array(SkillIdSchema),
  niveau: z.array(NiveauSchema),
  dauerMin: z.number().positive(),
  personen: z.enum(['allein', 'paar', 'gruppe']),
  material: z.array(z.string()),
  kurzbeschreibung: z.string(),
  durchfuehrung: z.array(z.string()),
  beschreibung: z.array(z.string()).optional(),
  skizze: UebungsSkizzeSchema.optional(),
  variationen: z.array(z.string()).optional(),
  fehlerbilder: z.array(z.string()).optional(),
  animationId: z.string().optional(),
})

export const EinheitBlockSchema = z.object({
  uebungId: z.string(),
  dauerMin: z.number().positive(),
  notiz: z.string().optional(),
})

export const EinheitSchema = z.object({
  id: z.string(),
  name: z.string(),
  zielSkills: z.array(SkillIdSchema),
  bloecke: z.array(EinheitBlockSchema),
  istVorlage: z.boolean(),
})

export const ProgrammWocheSchema = z.object({
  nummer: z.number().int().positive(),
  fokus: z.string(),
  einheitIds: z.array(z.string()),
  progressionsHinweis: z.string().optional(),
})

export const ProgrammSchema = z.object({
  id: z.string(),
  name: z.string(),
  beschreibung: z.string(),
  zielniveau: NiveauSchema,
  wochen: z.array(ProgrammWocheSchema),
  istVorlage: z.boolean(),
})

export const ProgrammZuweisungSchema = z.object({
  id: z.string(),
  programmId: z.string(),
  zielId: z.string(),
  zielTyp: z.enum(['profil', 'gruppe']),
  startDatum: z.string(),
  abgehakt: z.array(
    z.object({
      woche: z.number().int().positive(),
      einheitId: z.string(),
      datum: z.string(),
      logId: z.string().optional(),
    }),
  ),
})

export const ZaehlweiseSchema = z.object({
  modus: z.enum(['punkte', 'zeit']),
  saetzeZumSieg: z.union([z.literal(1), z.literal(2)]),
  /** 0 erlaubt: Zeitspiel-Preset zählt keine festen Satzpunkte (§9.1). */
  punkteProSatz: z.number().int().min(0),
  verlaengerung: z.boolean(),
  maxPunkte: z.number().int().positive(),
  zeitspielMin: z.number().positive().optional(),
})

export const TeilnehmerSchema = z.object({
  id: z.string(),
  name: z.string(),
  profilIds: z.array(z.string()).optional(),
  setzplatz: z.number().int().positive().optional(),
})

export const SatzErgebnisSchema = z.object({
  a: z.number().int().min(0),
  b: z.number().int().min(0),
})

export const MatchSchema = z.object({
  id: z.string(),
  feld: z.number().int().positive().optional(),
  teilnehmerAId: z.string().optional(),
  teilnehmerBId: z.string().optional(),
  saetze: z.array(SatzErgebnisSchema),
  siegerId: z.string().optional(),
  status: z.enum(['offen', 'laufend', 'beendet']),
  beendetUm: z.string().optional(),
  runde: z.number().int().positive().optional(),
  bracketSlot: z.number().int().min(0).optional(),
  bracketTyp: z.enum(['haupt', 'platz3']).optional(),
  gruppeId: z.string().optional(),
  phase: z.enum(['gruppe', 'ko']).optional(),
})

export const TurnierSchema = z.object({
  id: z.string(),
  name: z.string(),
  datum: z.string(),
  disziplin: z.enum(['einzel', 'doppel', 'mixed']),
  format: z.enum(['ko', 'gruppen_ko', 'jeder_gegen_jeden', 'schweizer']),
  zaehlweise: ZaehlweiseSchema,
  felderAnzahl: z.number().int().positive(),
  teilnehmer: z.array(TeilnehmerSchema),
  matches: z.array(MatchSchema),
  config: z.object({
    gruppenAnzahl: z.number().int().positive().optional(),
    aufsteigerProGruppe: z.number().int().positive().optional(),
    schweizerRunden: z.number().int().positive().optional(),
    spielUmPlatz3: z.boolean().optional(),
    hinRueckrunde: z.boolean().optional(),
    doppelAuslosung: z.enum(['fest', 'zufall']).optional(),
  }),
  status: z.enum(['setup', 'laufend', 'beendet']),
})

/** Voll-Export: kompletter AppState */
export const TerminSchema = z.object({
  id: z.string(),
  datum: z.string(),
  titel: z.string(),
  typ: z.enum(['training', 'turnier', 'sonstig']),
  zeit: z.string().optional(),
  notiz: z.string().optional(),
  einheitId: z.string().optional(),
  gruppeId: z.string().optional(),
})

export const AppStateSchema = z.object({
  schemaVersion: z.number().int().positive(),
  profile: z.array(ProfilSchema),
  gruppen: z.array(GruppeSchema),
  eigeneUebungen: z.array(UebungSchema),
  einheiten: z.array(EinheitSchema),
  programme: z.array(ProgrammSchema),
  zuweisungen: z.array(ProgrammZuweisungSchema),
  logs: z.array(TrainingsLogSchema),
  einschaetzungen: z.array(SkillEinschaetzungSchema),
  turniere: z.array(TurnierSchema),
  /** Optional mit Default: ältere Exporte (vor Kalender) bleiben importierbar. */
  termine: z.array(TerminSchema).default([]),
})

/** Einzel-Export eines Turniers (zum Weitergeben an Kollegen) */
export const TurnierExportSchema = z.object({
  typ: z.literal('turnier-export'),
  schemaVersion: z.number().int().positive(),
  turnier: TurnierSchema,
})

/** Einzel-Export einer Einheit; referenzierte eigene Übungen reisen mit */
export const EinheitExportSchema = z.object({
  typ: z.literal('einheit-export'),
  schemaVersion: z.number().int().positive(),
  einheit: EinheitSchema,
  eigeneUebungen: z.array(UebungSchema),
})
