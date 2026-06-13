import UpdateHinweis from './ui/UpdateHinweis'
import { Link, NavLink, Outlet } from 'react-router-dom'
import ReloadPrompt from './ReloadPrompt'

const navPunkte: { zu: string; label: string; ende?: boolean }[] = [
  { zu: '/', label: 'Start', ende: true },
  { zu: '/uebungen', label: 'Übungen' },
  { zu: '/einheiten', label: 'Einheiten' },
  { zu: '/programme', label: 'Programme' },
  { zu: '/kalender', label: 'Kalender' },
  { zu: '/bewegungslehre', label: 'Bewegungslehre' },
  { zu: '/regeln', label: 'Regeln' },
  { zu: '/profile', label: 'Profile' },
  { zu: '/turniere', label: 'Turniere' },
  { zu: '/einstellungen', label: 'Einstellungen' },
]

function ShuttleLogo() {
  return (
    <svg viewBox="0 0 512 512" className="h-8 w-8 shrink-0" aria-hidden="true">
      <g stroke="currentColor" strokeWidth="40" strokeLinecap="round">
        <line x1="256" y1="318" x2="256" y2="118" />
        <line x1="234" y1="318" x2="156" y2="136" />
        <line x1="278" y1="318" x2="356" y2="136" />
      </g>
      <rect x="196" y="316" width="120" height="38" rx="19" fill="#f5c518" />
      <circle cx="256" cy="408" r="60" fill="currentColor" />
    </svg>
  )
}

export default function Layout() {
  return (
    <div className="flex min-h-screen flex-col bg-boden text-tinte">
      <header className="bg-court text-linie print:hidden">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-x-6 gap-y-1 px-4 pt-3">
          <NavLink to="/" className="flex items-center gap-2.5 py-1">
            <ShuttleLogo />
            <span className="schrift-display text-lg leading-none">
              Badminton-Planer
            </span>
          </NavLink>
          <nav aria-label="Hauptnavigation" className="-mx-1 flex flex-wrap">
            {navPunkte.map((p) => (
              <NavLink
                key={p.zu}
                to={p.zu}
                end={p.ende}
                className={({ isActive }) =>
                  `flex min-h-11 items-center border-b-4 px-3 text-sm font-semibold transition-colors ${
                    isActive
                      ? 'border-signal text-linie'
                      : 'border-transparent text-linie/75 hover:text-linie'
                  }`
                }
              >
                {p.label}
              </NavLink>
            ))}
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-8">
        <Outlet />
      </main>

      <footer className="mt-auto border-t-2 border-court/20 print:hidden">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-x-4 gap-y-1 px-4 py-4 text-xs text-tinte/60">
          <span>© 2026 Dr. Micha Winkelmann</span>
          <Link to="/rechtliches" className="min-h-9 inline-flex items-center font-semibold text-court underline-offset-2 hover:underline">
            Impressum
          </Link>
          <Link to="/rechtliches" className="min-h-9 inline-flex items-center font-semibold text-court underline-offset-2 hover:underline">
            Datenschutz
          </Link>
          <Link to="/rechtliches" className="min-h-9 inline-flex items-center font-semibold text-court underline-offset-2 hover:underline">
            Lizenz
          </Link>
          <span className="ml-auto">Inhalte: CC BY-NC-SA 4.0 · Code: MIT</span>
        </div>
      </footer>

      <ReloadPrompt />
      <UpdateHinweis />
    </div>
  )
}
