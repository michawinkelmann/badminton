import { expect, type Locator, type Page } from '@playwright/test'

/** HashRouter: Route relativ zur baseURL ansteuern (./#/… erhält die Basis /badminton/). */
export async function geheZu(page: Page, route: string): Promise<void> {
  await page.goto(`./#${route}`)
}

/** Digit-freie Namen — wichtig, weil offene Bracket-Spiele über „enthält keine Ziffer" erkannt werden. */
export const NEUN_NAMEN = ['Anna', 'Ben', 'Carla', 'David', 'Emil', 'Frida', 'Gustav', 'Hanna', 'Ines']
export const VIER_NAMEN = NEUN_NAMEN.slice(0, 4)

interface TurnierOptionen {
  name: string
  teilnehmer: string[]
  /** Format-Kachel, z. B. /Gruppen \+ K\.o\./ oder /Schweizer System/ (Standard: K.o.). */
  format?: RegExp
  /** Zählweise-Preset-Button, z. B. 'Schule 1×15' (Best-of-1 → schnelle Tests). */
  preset?: string
  spielUmPlatz3?: boolean
}

/** Turnier-Setup-Flow (§9.3): anlegen, Teilnehmer per Schnelleingabe, Spielplan erzeugen. */
export async function turnierAnlegen(page: Page, o: TurnierOptionen): Promise<string> {
  await geheZu(page, '/turniere/neu')
  await page.getByLabel('Name', { exact: true }).fill(o.name)
  if (o.format) await page.getByRole('button', { name: o.format }).click()
  if (o.preset) await page.getByRole('button', { name: o.preset }).click()
  if (o.spielUmPlatz3) await page.getByRole('checkbox', { name: 'Spiel um Platz 3' }).check()
  await page.getByLabel(/Schnelleingabe/).fill(o.teilnehmer.join('\n'))
  await page.getByRole('button', { name: 'Namen hinzufügen' }).click()
  await expect(
    page.getByRole('heading', { name: `Teilnehmer (${o.teilnehmer.length})` }),
  ).toBeVisible()
  await page.getByRole('button', { name: 'Spielplan erzeugen' }).click()
  await expect(page.getByRole('heading', { name: o.name })).toBeVisible()
  // Turnier-ID aus der Hash-Route (/#/turniere/<id>) ziehen
  const id = new URL(page.url()).hash.replace('#/turniere/', '')
  expect(id).not.toHaveLength(0)
  return id
}

/** Der Ergebnis-Dialog (große Satz-Eingabe mit ± und Schnellwahl). */
export function ergebnisDialog(page: Page): Locator {
  return page.getByRole('dialog', { name: 'Ergebnis eintragen' })
}

/**
 * Punktzahl per Tastatur-Direkteingabe auf dem Zahlenfeld setzen
 * (zwei Ziffern innerhalb 800 ms — der Dialog unterstützt das explizit).
 * seite 0 = Teilnehmer A, 1 = Teilnehmer B; satz 0-basiert.
 */
export async function punkteTippen(
  dialog: Locator,
  satz: number,
  seite: 0 | 1,
  punkte: number,
): Promise<void> {
  const feld = dialog.getByRole('button', { name: /Punktzahl direkt wählen/ }).nth(satz * 2 + seite)
  for (const ziffer of String(punkte)) await feld.press(ziffer)
}

/** Namen beider Teilnehmer aus dem geöffneten Dialog lesen („A gegen B"). */
export async function dialogNamen(dialog: Locator): Promise<[string, string]> {
  const text = await dialog.locator('p').filter({ hasText: ' gegen ' }).first().innerText()
  const [a, b] = text.split(/\s+gegen\s+/)
  return [a!.trim(), b!.trim()]
}

/** Offenen Satz als Sieg eintragen und speichern (Dialog muss offen sein). */
export async function ergebnisSpeichern(dialog: Locator): Promise<void> {
  await expect(dialog.getByText(/^Sieg:/)).toBeVisible()
  await dialog.getByRole('button', { name: 'Ergebnis speichern' }).click()
  await expect(dialog).toBeHidden()
}

/** Bracket-Sektion der Turnierdetail-Seite (K.o.). */
export function bracketSektion(page: Page): Locator {
  return page.locator('section').filter({ has: page.getByRole('heading', { name: 'Bracket' }) })
}

/**
 * Spielbare, noch ergebnislose Bracket-Spiele: klickbare Boxen ohne Ziffern
 * (Freilos/TBD-Boxen sind disabled, beendete enthalten den Satzstand).
 * Setzt digit-freie Teilnehmernamen und nicht zugewiesene Felder voraus.
 */
export function offeneBracketSpiele(page: Page): Locator {
  return bracketSektion(page).locator('button:enabled').filter({ hasNotText: /\d/ })
}

/**
 * Alle offenen Bracket-Spiele durchspielen; Seite A gewinnt jeden Satz mit
 * `punkte`:0. `saetzeZumSieg` 2 = Best-of-3 (Standard „Offiziell 2×21").
 */
export async function spieleAlleBracketSpiele(
  page: Page,
  punkte: number,
  saetzeZumSieg: 1 | 2,
): Promise<number> {
  let gespielt = 0
  for (let i = 0; i < 20; i++) {
    const offene = offeneBracketSpiele(page)
    if ((await offene.count()) === 0) break
    await offene.first().click()
    const dialog = ergebnisDialog(page)
    await punkteTippen(dialog, 0, 0, punkte)
    if (saetzeZumSieg === 2) {
      await dialog.getByRole('button', { name: 'Satz hinzufügen' }).click()
      await punkteTippen(dialog, 1, 0, punkte)
    }
    await ergebnisSpeichern(dialog)
    gespielt++
  }
  return gespielt
}

/** Zähler aus der Einstellungen-Datenübersicht (dt/dd-Paare) lesen. */
export function zaehlerWert(page: Page, label: string): Locator {
  return page.locator(`dt:text-is("${label}") + dd`)
}

/**
 * Offene (klickbare, noch ergebnislose) Spiele einer MatchListe innerhalb von
 * `bereich`: enabled-Buttons ohne Satzstand (":") und ohne Beendet-Haken.
 * Feld-Badges („Feld 1") stören nicht — gefiltert wird über ":" statt Ziffern.
 */
export function offeneListenSpiele(bereich: Locator): Locator {
  return bereich
    .locator('button:enabled')
    .filter({ hasText: '–' }) // Namens-Trenner der MatchListe (schließt z. B. „Runde 2 auslosen" aus)
    .filter({ hasNotText: /:|✓/ })
}

/**
 * Alle offenen Spiele in `bereich` mit `punkte`:0 (Best-of-1) für Seite A
 * eintragen — für Gruppenphase, Schweizer Runden, Jeder-gegen-Jeden.
 */
export async function spieleAlleListenSpiele(
  page: Page,
  bereich: Locator,
  punkte: number,
): Promise<number> {
  let gespielt = 0
  for (let i = 0; i < 30; i++) {
    const offene = offeneListenSpiele(bereich)
    if ((await offene.count()) === 0) break
    await offene.first().click()
    const dialog = ergebnisDialog(page)
    await punkteTippen(dialog, 0, 0, punkte)
    await ergebnisSpeichern(dialog)
    gespielt++
  }
  return gespielt
}
