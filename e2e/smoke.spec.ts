import { expect, test } from '@playwright/test'
import {
  NEUN_NAMEN,
  VIER_NAMEN,
  bracketSektion,
  dialogNamen,
  ergebnisDialog,
  ergebnisSpeichern,
  geheZu,
  offeneBracketSpiele,
  punkteTippen,
  spieleAlleBracketSpiele,
  turnierAnlegen,
  zaehlerWert,
} from './hilfen'

/**
 * E2E-Smoke-Tests (docs/TODO.md): die fünf kritischen Pfade einmal komplett
 * durchgespielt. Selektoren laufen über sichtbare Texte und aria-Labels.
 */

/* ------------------------------------------------------------------ */
/* 1 · Turnier komplett: K.o. mit 9 Namen bis Podium und Urkunden      */
/* ------------------------------------------------------------------ */
test('Turnier komplett: anlegen, durchspielen, Endstand, Urkunden', async ({ page }) => {
  await turnierAnlegen(page, {
    name: 'E2E-Pokal',
    teilnehmer: NEUN_NAMEN,
    spielUmPlatz3: true, // → Plätze 1–4 → 4 Urkunden
  })

  // 9 Teilnehmer → 16er-Bracket mit 7 Freilosen: genau 1 echtes Erstrundenspiel
  await expect(bracketSektion(page)).toBeVisible()
  await expect(bracketSektion(page).getByText('Freilos').first()).toBeVisible()

  // Erstes Spiel ausführlich über Schnellwahl-Raster und ±-Button eintragen
  await offeneBracketSpiele(page).first().click()
  const dialog = ergebnisDialog(page)
  await dialog.getByRole('button', { name: /Punktzahl direkt wählen/ }).first().click()
  await dialog.getByRole('button', { name: '21', exact: true }).click() // Schnellwahl: A = 21
  await dialog.getByRole('button', { name: /Punkt mehr$/ }).nth(1).click() // ±: B = 1
  await dialog.getByRole('button', { name: 'Satz hinzufügen' }).click()
  await punkteTippen(dialog, 1, 0, 21) // Satz 2 per Direkteingabe
  await ergebnisSpeichern(dialog)

  // Restliche Spiele (Viertel-/Halbfinale, Finale, Platz 3) im Standard 2×21
  const restliche = await spieleAlleBracketSpiele(page, 21, 2)
  expect(restliche).toBe(8) // 9 echte Spiele insgesamt, eines davon schon oben

  // Endstand/Podium: Plätze 1–4 sichtbar
  const endstand = page.locator('section').filter({
    has: page.getByRole('heading', { name: 'Endstand' }),
  })
  await expect(endstand).toBeVisible()
  await expect(endstand.locator('ol > li')).toHaveCount(4)

  // Urkunden-Route rendert 4 Seiten
  await page.getByRole('link', { name: 'Urkunden' }).click()
  await expect(page.getByRole('button', { name: 'Urkunden drucken (4 Seiten)' })).toBeVisible()
  await expect(page.getByRole('heading', { name: 'Urkunde', exact: true })).toHaveCount(4)
})

/* ------------------------------------------------------------------ */
/* 2 · Korrektur-Flow: Folge-Ergebnisse werden verworfen               */
/* ------------------------------------------------------------------ */
test('Korrektur: Ergebnis ändern verwirft Folge-Ergebnisse', async ({ page }) => {
  await turnierAnlegen(page, {
    name: 'E2E-Korrektur',
    teilnehmer: VIER_NAMEN,
    preset: 'Schule 1×15', // Best-of-1 → 3 Spiele
  })

  // Erstes Halbfinale spielen und sich die Beteiligten merken
  await offeneBracketSpiele(page).first().click()
  let dialog = ergebnisDialog(page)
  const [siegerinAlt, siegerinNeu] = await dialogNamen(dialog)
  await punkteTippen(dialog, 0, 0, 15)
  await ergebnisSpeichern(dialog)

  // Zweites Halbfinale und Finale durchspielen → Turnier beendet
  expect(await spieleAlleBracketSpiele(page, 15, 1)).toBe(2)
  await expect(page.getByRole('heading', { name: 'Endstand' })).toBeVisible()

  // Beendetes Halbfinale wieder öffnen (Box enthält beide Namen) und kippen: B gewinnt 15:17
  await bracketSektion(page)
    .locator('button:enabled')
    .filter({ hasText: siegerinAlt })
    .filter({ hasText: siegerinNeu })
    .click()
  dialog = ergebnisDialog(page)
  await punkteTippen(dialog, 0, 1, 17)
  await expect(dialog.getByText(/^Sieg:/)).toContainText(siegerinNeu)
  await dialog.getByRole('button', { name: 'Ergebnis speichern' }).click()

  // Bestätigung „Folge-Ergebnisse verwerfen" erscheint und listet das Finale
  await expect(dialog.getByText('Diese Korrektur verwirft Folge-Ergebnisse:')).toBeVisible()
  await dialog.getByRole('button', { name: 'Korrigieren & Folge-Ergebnisse verwerfen' }).click()
  await expect(dialog).toBeHidden()

  // Finale ist zurückgesetzt: Endstand weg, genau 1 offenes Spiel — mit der neuen Siegerin
  await expect(page.getByRole('heading', { name: 'Endstand' })).toBeHidden()
  await expect(offeneBracketSpiele(page)).toHaveCount(1)
  await expect(offeneBracketSpiele(page).first()).toContainText(siegerinNeu)

  // Neues Finale spielen → Turnier wieder beendet, neue Finalistin im Endstand
  expect(await spieleAlleBracketSpiele(page, 15, 1)).toBe(1)
  const endstand = page.locator('section').filter({
    has: page.getByRole('heading', { name: 'Endstand' }),
  })
  await expect(endstand).toBeVisible()
  await expect(endstand).toContainText(siegerinNeu)
})

/* ------------------------------------------------------------------ */
/* 3 · Beamer-Live-Sync über zwei Tabs (storage-Event/Polling)         */
/* ------------------------------------------------------------------ */
test('Beamer-Modus: zweiter Tab zeigt Eingaben live', async ({ page, context }) => {
  const turnierId = await turnierAnlegen(page, {
    name: 'E2E-Beamer',
    teilnehmer: VIER_NAMEN,
    preset: 'Schule 1×15',
  })
  await page.getByRole('button', { name: 'Felder automatisch besetzen' }).click()

  // Zweiter Tab im selben Kontext → geteilter localStorage wie Laptop→Beamer
  const beamer = await context.newPage()
  await beamer.goto(`./#/beamer/${turnierId}`)
  await expect(beamer.getByRole('heading', { name: 'E2E-Beamer' })).toBeVisible()
  await beamer.getByRole('button', { name: 'Rotation an' }).click() // Ansicht festhalten
  const feld1 = beamer.locator('section').filter({ hasText: 'Feld 1' })
  await expect(feld1).toBeVisible()

  // Zwischenstand 5:3 im Bedien-Tab → erscheint im Beamer-Tab (Event oder 3-s-Polling)
  await page.getByRole('button', { name: 'Ergebnis eintragen' }).first().click()
  const dialog = ergebnisDialog(page)
  await punkteTippen(dialog, 0, 0, 5)
  await punkteTippen(dialog, 0, 1, 3)
  await dialog.getByRole('button', { name: 'Zwischenstand speichern' }).click()
  await expect(dialog).toBeHidden()
  await expect(feld1.getByText('5', { exact: true })).toBeVisible()
  await expect(feld1.getByText('3', { exact: true })).toBeVisible()

  // Turnier zu Ende spielen: Feld 1 fertig, Feld 2 fertig, Finale besetzen + fertig
  await page.getByRole('button', { name: 'Ergebnis eintragen' }).first().click()
  await punkteTippen(ergebnisDialog(page), 0, 0, 15) // 15:3
  await ergebnisSpeichern(ergebnisDialog(page))
  await page.getByRole('button', { name: 'Ergebnis eintragen' }).first().click()
  await punkteTippen(ergebnisDialog(page), 0, 0, 15)
  await ergebnisSpeichern(ergebnisDialog(page))
  await page.getByRole('button', { name: 'Felder automatisch besetzen' }).click()
  await page.getByRole('button', { name: 'Ergebnis eintragen' }).first().click()
  await punkteTippen(ergebnisDialog(page), 0, 0, 15)
  await ergebnisSpeichern(ergebnisDialog(page))

  // Beamer wechselt aufs Podium
  await expect(beamer.getByRole('heading', { name: 'Endstand' })).toBeVisible()
  await expect(beamer.getByText('1.', { exact: true })).toBeVisible()
})

/* ------------------------------------------------------------------ */
/* 4 · Export/Import-Roundtrip über die Einstellungen                  */
/* ------------------------------------------------------------------ */
test('Export → alles löschen → Import stellt alle Zähler wieder her', async ({ page }) => {
  const labels = [
    'Profile', 'Gruppen', 'Eigene Übungen', 'Einheiten', 'Programme',
    'Zuweisungen', 'Trainings-Logs', 'Einschätzungen', 'Turniere',
  ]

  await geheZu(page, '/einstellungen')
  await page.getByRole('button', { name: 'Beispieldaten laden' }).click()
  await expect(page.getByText(/Beispieldaten geladen/)).toBeVisible()
  await expect(zaehlerWert(page, 'Profile')).not.toHaveText('0')

  // Stand vor dem Export merken
  const vorher: Record<string, string> = {}
  for (const label of labels) vorher[label] = await zaehlerWert(page, label).innerText()
  expect(Number(vorher['Turniere'])).toBeGreaterThan(0)

  // Voll-Export herunterladen
  const downloadEreignis = page.waitForEvent('download')
  await page.getByRole('button', { name: 'Daten exportieren' }).click()
  const download = await downloadEreignis
  expect(download.suggestedFilename()).toMatch(/^badminton-planer-export-.*\.json$/)
  const datei = await download.path()

  // Alles löschen (mit Bestätigungsdialog)
  await page.getByRole('button', { name: /Alle Daten löschen/ }).click()
  await page.getByRole('button', { name: 'Endgültig löschen' }).click()
  for (const label of labels) await expect(zaehlerWert(page, label)).toHaveText('0')

  // Import derselben Datei: Vorschau → „Alles ersetzen" → Zähler stimmen wieder
  await page.locator('input[type="file"]').setInputFiles(datei)
  await expect(page.getByText('Vorschau: Voll-Export')).toBeVisible()
  await page.getByRole('button', { name: 'Alles ersetzen …' }).click()
  await page.getByRole('button', { name: 'Alles ersetzen', exact: true }).click()
  await expect(page.getByText('Import abgeschlossen — alle Daten wurden ersetzt.')).toBeVisible()
  for (const label of labels) {
    await expect(zaehlerWert(page, label)).toHaveText(vorher[label]!)
  }
})

/* ------------------------------------------------------------------ */
/* 5 · Training: Einheit bauen, drucken, Gruppe loggen, Tracking       */
/* ------------------------------------------------------------------ */
test('Training: Einheit → Druck → Gruppen-Log → Volumen & Radar', async ({ page }) => {
  // Einheit im Builder zusammenstellen (3 Übungen per +-Button)
  await geheZu(page, '/einheiten/neu')
  await page.getByLabel('Name der Einheit').fill('E2E-Einheit')
  for (let i = 0; i < 3; i++) {
    await page.getByRole('button', { name: /ans Ende der Einheit anfügen$/ }).nth(i).click()
  }
  await expect(page.getByRole('button', { name: 'Block 3 verschieben' })).toBeVisible()
  await page.getByRole('button', { name: 'Einheit speichern' }).click()
  await expect(page.getByText('Gespeichert.', { exact: true })).toBeVisible()

  // Druckansicht rendert Tabelle mit Gesamtdauer
  await page.getByRole('button', { name: 'Druckansicht' }).click()
  await expect(page.getByRole('heading', { name: 'E2E-Einheit' })).toBeVisible()
  await expect(page.getByRole('cell', { name: 'Gesamt', exact: true })).toBeVisible()
  await expect(page.getByRole('button', { name: 'Drucken', exact: true })).toBeVisible()

  // Druckoption: ausführlicher Anhang (Beschreibungen + Skizzen) zuschaltbar
  await expect(page.getByRole('heading', { name: 'Anhang: Übungen im Detail' })).toBeHidden()
  await page.getByRole('checkbox', { name: 'Ausführliche Beschreibungen anhängen' }).check()
  await expect(page.getByRole('heading', { name: 'Anhang: Übungen im Detail' })).toBeVisible()

  // Zwei Profile als Gruppe anlegen (Schnelleingabe)
  await geheZu(page, '/profile')
  await page.getByText('Schnelleingabe: Namensliste einfügen').click()
  await page.getByLabel('Ein Name pro Zeile').fill('Paul\nQuinn')
  await page.getByLabel(/Direkt als Gruppe anlegen/).fill('E2E-Gruppe')
  await page.getByRole('button', { name: 'Alle anlegen' }).click()
  await expect(page.getByText(/2 Profile angelegt/)).toBeVisible()

  // Einheit für die ganze Gruppe loggen
  await page.getByRole('button', { name: 'Einheit loggen' }).click()
  await page.getByLabel('Welche Einheit wurde absolviert?').selectOption({ label: 'E2E-Einheit' })
  await page.getByRole('button', { name: 'Für alle Mitglieder loggen' }).click()
  await expect(page.getByText('Geloggt für 2 Mitglieder.')).toBeVisible()

  // Profil zeigt Kennzahlen und Trainingsvolumen
  await page.getByRole('link', { name: 'Paul' }).click()
  await expect(page.locator('dt:text-is("Einheiten gesamt") + dd')).toHaveText('1')
  await expect(page.locator('dt:text-is("Minuten gesamt") + dd')).toHaveText(/^[1-9]\d*$/)
  await expect(page.getByText('Noch keine Logs.')).toBeHidden()

  // Selbsteinschätzung speichern → Radar erscheint
  await expect(page.getByText(/Noch keine Einschätzung/)).toBeVisible()
  await page.getByRole('button', { name: 'Einschätzung speichern' }).click()
  await expect(page.getByText('Gespeichert — taucht ab jetzt im Radar auf.')).toBeVisible()
  await expect(page.getByText(/Noch keine Einschätzung/)).toBeHidden()
})
