# Offene Punkte

*(derzeit keine)*

## E2E-Smoke-Test (Playwright) — ✅ umgesetzt

Die 450+ Vitest-Tests prüfen Engine und Datenlogik; die Playwright-Smoke-Tests
(`e2e/smoke.spec.ts` + `e2e/formate.spec.ts`) klicken zusätzlich die kritischen
Pfade einmal komplett durch:

1. **Turnier komplett:** K.o. mit 9 Namen per Schnelleingabe + Spiel um Platz 3 →
   Spielplan → alle Ergebnisse über den ±/Schnellwahl-Dialog → Endstand/Podium →
   Urkunden-Route rendert 4 Seiten.
2. **Korrektur-Flow:** Beendetes Halbfinale kippen → Bestätigung „Folge-Ergebnisse
   verwerfen" → Finale ist zurückgesetzt und wird mit der neuen Finalistin neu gespielt.
3. **Beamer-Live-Sync:** Zwei Tabs (Bedienung + `/#/beamer/:id`) → Zwischenstand 5:3
   erscheint im Beamer-Tab (storage-Event/Polling), am Ende wechselt er aufs Podium.
4. **Export/Import-Roundtrip:** Beispieldaten → Voll-Export → „Alle Daten löschen" →
   Import derselben Datei → alle neun Zähler in den Einstellungen stimmen wieder.
5. **Training:** Einheit im Builder (3 Übungen) → Druckansicht rendert → Gruppe loggen
   → Kennzahlen/Volumen im Profil ändern sich → Einschätzung speichern → Radar erscheint.
6. **Gruppen + K.o.** (`formate.spec.ts`): 7 Teilnehmer / 2 Gruppen → alle 9 Gruppenspiele
   → „K.o.-Phase starten" mit Bestätigung → Kreuz-Bracket mit 2 offenen Halbfinals.
7. **Schweizer System** (`formate.spec.ts`): 5 Teilnehmer → Runde 1 (2 Spiele + Freilos)
   → „Runde 2 auslosen" → neue Paarungen, Tabelle springt auf Runde 2/3, Reload persistiert.

**Verwendung:**

- Lokal: `npm run test:e2e` (baut und startet `vite preview` auf Port 4173 selbst).
  Einmalig nötig: `npx playwright install chromium`.
- CI: eigener `e2e`-Job in `.github/workflows/deploy.yml`; deployed wird nur,
  wenn Unit-Tests/Build **und** E2E grün sind. Bei Fehlschlag werden
  Playwright-Traces als Artefakt hochgeladen.
- Isolation: Playwright gibt jedem Test einen frischen Browser-Kontext, der
  localStorage startet also automatisch leer. Der PWA-Service-Worker ist in den
  Tests blockiert (`serviceWorkers: 'block'`), damit kein Precache dazwischenfunkt.
- Selektoren laufen über sichtbare deutsche UI-Texte und `aria-label`s (keine Test-IDs).
