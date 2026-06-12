/**
 * Macht aus dem lokal/-Build eine einzige selbstständige HTML-Datei:
 * Stylesheet, JavaScript und Favicon werden direkt eingebettet.
 * Ergebnis: Badminton-Planer-lokal.html im Projektordner — Doppelklick genügt.
 */
import { readFileSync, writeFileSync, rmSync } from 'node:fs'

const wurzel = new URL('../', import.meta.url)
const lies = (pfad) => readFileSync(new URL(pfad, wurzel), 'utf8')

let html = lies('lokal/index.html')

// Stylesheet(s) einbetten
html = html.replace(
  /<link rel="stylesheet"[^>]*href="\.\/(assets\/[^"]+\.css)"[^>]*>/g,
  (_, pfad) => `<style>${lies(`lokal/${pfad}`)}</style>`,
)

// Modul-Skript(e) einbetten („</script>" im Code unschädlich machen —
// in JS-Strings ist \/ identisch mit /)
html = html.replace(
  /<script type="module"[^>]*src="\.\/(assets\/[^"]+\.js)"[^>]*><\/script>/g,
  (_, pfad) =>
    `<script type="module">${lies(`lokal/${pfad}`).replace(/<\/script/g, '<\\/script')}</script>`,
)

// Vorlade-Links raus, Favicon als Daten-URL rein, App-Icon-Link raus
html = html.replace(/\s*<link rel="modulepreload"[^>]*>/g, '')
const favicon = Buffer.from(lies('lokal/icons/favicon.svg')).toString('base64')
html = html.replace(
  /<link rel="icon"[^>]*>/,
  `<link rel="icon" href="data:image/svg+xml;base64,${favicon}" type="image/svg+xml" />`,
)
html = html.replace(/\s*<link rel="apple-touch-icon"[^>]*>/, '')

if (/(src|href)="\.\/assets\//.test(html)) {
  throw new Error('Es sind noch externe Verweise übrig — Einbettung unvollständig!')
}

writeFileSync(new URL('Badminton-Planer-lokal.html', wurzel), html)
rmSync(new URL('lokal/', wurzel), { recursive: true, force: true })
console.log('Badminton-Planer-lokal.html erzeugt — eine Datei, per Doppelklick nutzbar.')
