import { expect, test } from '@playwright/test'
import {
  NEUN_NAMEN,
  bracketSektion,
  geheZu,
  offeneBracketSpiele,
  offeneListenSpiele,
  spieleAlleListenSpiele,
  turnierAnlegen,
} from './hilfen'

/**
 * E2E-Smoke-Tests für die im ersten Durchgang ungetesteten Formate
 * (PROJEKT-REVIEW Befund 13): Gruppen+K.o.-Phasenwechsel und
 * Schweizer-Runden-Auslosung — genau die Pfade, in denen Bug 3 und
 * Risiko 10 steckten.
 */

/* ------------------------------------------------------------------ */
/* 1 · Gruppen + K.o.: 7 Teilnehmer / 2 Gruppen bis „K.o.-Phase starten" */
/* ------------------------------------------------------------------ */
test('Gruppen+K.o.: Gruppenphase durchspielen, K.o.-Phase starten', async ({ page }) => {
  await turnierAnlegen(page, {
    name: 'E2E-Gruppen',
    teilnehmer: NEUN_NAMEN.slice(0, 7), // 7 TN / 2 Gruppen → 4er- und 3er-Gruppe
    format: /Gruppen \+ K\.o\./,
    preset: 'Schule 1×15', // Best-of-1 → schnelle Eingabe
  })

  // Gruppenphase sichtbar: Gruppe A (4er → 6 Spiele) + Gruppe B (3er → 3 Spiele)
  const gruppenphase = page
    .locator('section')
    .filter({ has: page.getByRole('heading', { name: 'Gruppenphase' }) })
  await expect(gruppenphase).toBeVisible()
  await expect(gruppenphase.getByText('Gruppe A', { exact: true })).toBeVisible()
  await expect(gruppenphase.getByText('Gruppe B', { exact: true })).toBeVisible()

  // Vor Abschluss der Gruppen gibt es keinen K.o.-Start-Knopf
  await expect(page.getByRole('button', { name: 'K.o.-Phase starten' })).toBeHidden()

  // Alle 9 Gruppenspiele eintragen (15:0, Seite A gewinnt)
  expect(await spieleAlleListenSpiele(page, gruppenphase, 15)).toBe(9)

  // Phasenwechsel: bestätigen — die Aufsteiger (2 je Gruppe) bilden das Kreuz-Bracket
  await page.getByRole('button', { name: 'K.o.-Phase starten' }).click()
  const bestaetigung = page.getByRole('dialog', { name: 'K.o.-Phase starten?' })
  await expect(bestaetigung).toBeVisible()
  await bestaetigung.getByRole('button', { name: 'K.o.-Phase starten' }).click()

  // K.o.-Phase erscheint mit 2 offenen Halbfinals (A1–B2, B1–A2)
  await expect(page.getByRole('heading', { name: 'K.o.-Phase', exact: true })).toBeVisible()
  const koSektion = page
    .locator('section')
    .filter({ has: page.getByRole('heading', { name: 'K.o.-Phase', exact: true }) })
  await expect(koSektion.locator('button:enabled').filter({ hasNotText: /\d/ })).toHaveCount(2)
})

/* ------------------------------------------------------------------ */
/* 2 · Schweizer System: Runde 1 spielen, Runde 2 auslosen              */
/* ------------------------------------------------------------------ */
test('Schweizer: Runde spielen und nächste Runde auslosen', async ({ page }) => {
  const turnierId = await turnierAnlegen(page, {
    name: 'E2E-Schweizer',
    teilnehmer: NEUN_NAMEN.slice(0, 5), // 5 TN → 2 Spiele + Freilos, 3 Runden (log₂)
    format: /Schweizer System/,
    preset: 'Schule 1×15',
  })

  // Tabelle zeigt Runde 1/3, Runden-Liste enthält Runde 1
  await expect(page.getByRole('heading', { name: /Tabelle/ })).toContainText('Runde 1/3')
  const rundenListe = page
    .locator('section')
    .filter({ has: page.getByRole('heading', { name: 'Runden', exact: true }) })
  await expect(rundenListe.getByText('Runde 1', { exact: true })).toBeVisible()

  // Solange Runde 1 offen ist, gibt es keinen Auslosen-Knopf
  await expect(page.getByRole('button', { name: /auslosen/ })).toBeHidden()

  // Beide Spiele der Runde 1 eintragen (das Freilos ist bereits beendet)
  expect(await spieleAlleListenSpiele(page, rundenListe, 15)).toBe(2)

  // Runde 2 auslosen → neue Paarungen erscheinen, Tabelle springt auf Runde 2/3
  await page.getByRole('button', { name: 'Runde 2 auslosen' }).click()
  await expect(page.getByRole('heading', { name: /Tabelle/ })).toContainText('Runde 2/3')
  await expect(rundenListe.getByText('Runde 2', { exact: true })).toBeVisible()
  await expect(offeneListenSpiele(rundenListe)).toHaveCount(2)

  // Reload: Auslosung ist persistiert (localStorage), keine Doppel-Runde
  await geheZu(page, `/turniere/${turnierId}`)
  await expect(page.getByRole('heading', { name: /Tabelle/ })).toContainText('Runde 2/3')
  await expect(rundenListe.getByText('Runde 2', { exact: true })).toBeVisible()
})
