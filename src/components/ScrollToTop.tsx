import { useLayoutEffect } from 'react'
import { useLocation } from 'react-router-dom'

/**
 * Springt bei jedem Pfadwechsel an den Seitenanfang.
 * Ohne das behält der Router die bisherige Scroll-Position bei — man landet
 * sonst mitten in der neuen Seite (z. B. nach einem Klick aus einer langen Liste).
 * Reagiert nur auf den Pfad (nicht auf Such-/Hash-Änderungen), damit Filter
 * und In-Seiten-Sprünge die Position nicht unnötig zurücksetzen.
 */
export default function ScrollToTop() {
  const { pathname } = useLocation()
  useLayoutEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])
  return null
}
