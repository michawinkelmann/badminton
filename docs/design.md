# Design-Plan (Zwei-Pass, Pass 1)

Verankerung: Halle, Court-Geometrie, Linienführung, Shuttle — nicht Dashboard-Defaults.

## Farb-Tokens

| Token | Wert | Herkunft / Einsatz |
|---|---|---|
| `--color-court` | `#0e6b4a` | Mattengrün (Turniermatte) — Primärfarbe, Header, Buttons |
| `--color-court-tief` | `#0a4a34` | abgedunkelte Matte — Hover, Beamer-Hintergrund |
| `--color-linie` | `#fbfbf6` | Linienweiß — Flächen auf Grün, Karten |
| `--color-boden` | `#eef0ea` | heller Hallenboden — App-Hintergrund |
| `--color-signal` | `#f5c518` | Gelb des Schul-Plastikballs — Akzent, aktive Zustände, Fokus |
| `--color-kork` | `#b4793b` | Naturkork — sparsame Zweitakzente (Badges, Markierungen) |
| `--color-tinte` | `#15241d` | grünstichiges Schwarz — Text |

## Typografie

Eine Variable Font, zwei Stimmen: **Archivo Variable** (self-hosted via Fontsource).
- Display: expanded (font-stretch 125 %), Gewicht 800, Versalien — Anmutung Trikot/Anzeigetafel. Auch für Score-Ziffern (tabular nums).
- Body: normale Breite, 400/600.

## Layout-Charakter

Heller Hallenboden als Grund, Inhalte als weiße „Felder" mit kräftigen Court-grünen Kanten statt grauer Hairlines. Dunkle Court-Flächen für Header/Beamer. Keine Creme-Serifen-Terracotta-, keine Near-Black-Acid-Green-Looks.

## Signatur-Element

**Die Doppellinie** (Seitenlinie des Doppelfelds): Seitentitel tragen eine kurze doppelte Unterstreichung — Court-Grün über Signal-Gelb. Taucht konsistent auf (Titel, aktive Nav-Markierung als Linien-Marker).

## Pflichten (aus §12)

Responsive 360 px → Beamer; Touch-Targets ≥ 44 px; Beamer max. Kontrast; Druck nüchtern/s-w; sichtbarer Tastatur-Fokus (Signal-Gelb); `prefers-reduced-motion`; deutsche UI im Du-Ton, aktive Verben.

## Generik-Check (Pass 2)

Palette aus Matte/Linie/Shuttle statt Tailwind-Defaultblau ✓ · eine charaktervolle Font statt Inter-Einheitsbrei ✓ · Signatur-Element mit Badminton-Bezug ✓ · dunkle/helle Flächenlogik aus der Halle ✓
