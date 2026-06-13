import { Link } from 'react-router-dom'

const saeulen = [
  {
    zu: '/uebungen',
    titel: 'Training planen',
    text: 'Übungsbibliothek, Vorschlagssystem, Einheiten-Builder und Mehrwochen-Programme mit Progression.',
  },
  {
    zu: '/bewegungslehre',
    titel: 'Technik verstehen',
    text: 'Animierte Bewegungsabläufe: Schlagtechnik, Footwork und Taktik — mit Zeitlupe und Phasen-Stepper.',
  },
  {
    zu: '/turniere',
    titel: 'Turnier organisieren',
    text: 'K.o., Gruppen + K.o., Jeder gegen Jeden oder Schweizer System — mit Spielplan, Live-Tabellen und Beamer-Modus.',
  },
]

export default function Start() {
  return (
    <div>
      <h1 className="schrift-display doppellinie text-3xl">Badminton-Planer</h1>
      <p className="mt-5 max-w-2xl text-tinte/80">
        Plane dein Training, mach Fortschritt sichtbar und organisiere komplette
        Turniere — für Schulsport, Verein und eigenes Training. Alles offline,
        alle Daten bleiben auf deinem Gerät.
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {saeulen.map((s) => (
          <Link
            key={s.zu}
            to={s.zu}
            className="group rounded-xl border-2 border-court bg-linie p-5 transition-colors hover:bg-court hover:text-linie"
          >
            <h2 className="schrift-display text-lg">{s.titel}</h2>
            <p className="mt-2 text-sm leading-relaxed text-tinte/75 group-hover:text-linie/85">
              {s.text}
            </p>
          </Link>
        ))}
      </div>
    </div>
  )
}
