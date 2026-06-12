// Erzeugt PNG-Icons aus public/icons/favicon.svg (PWA-Manifest + Apple-Touch).
import sharp from 'sharp'
import { readFile } from 'node:fs/promises'

const svg = await readFile(new URL('../public/icons/favicon.svg', import.meta.url))
const ziel = new URL('../public/icons/', import.meta.url).pathname

await sharp(svg).resize(192, 192).png().toFile(`${ziel}icon-192.png`)
await sharp(svg).resize(512, 512).png().toFile(`${ziel}icon-512.png`)
await sharp(svg).resize(180, 180).png().toFile(`${ziel}apple-touch-icon.png`)

// Maskable: Motiv verkleinert auf grünem Grund (Safe Zone ~80 %)
const motiv = await sharp(svg).resize(384, 384).png().toBuffer()
await sharp({
  create: { width: 512, height: 512, channels: 4, background: '#0e6b4a' },
})
  .composite([{ input: motiv, left: 64, top: 64 }])
  .png()
  .toFile(`${ziel}icon-maskable-512.png`)

console.log('Icons erzeugt.')
