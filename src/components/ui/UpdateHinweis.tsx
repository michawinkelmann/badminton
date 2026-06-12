import { useRegisterSW } from 'virtual:pwa-register/react'

/**
 * Unaufdringlicher Update-Toast (§11): erscheint, wenn der Service Worker
 * eine neue Version geladen hat. In der lokalen Einzeldatei-Version
 * liefert der pwaStub immer false — der Toast bleibt dort aus.
 */
export default function UpdateHinweis() {
  const {
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW()

  if (!needRefresh) return null

  return (
    <div
      role="status"
      className="fixed bottom-4 right-4 z-50 flex flex-wrap items-center gap-3 rounded-xl border-2 border-court bg-linie p-4 shadow-lg print:hidden"
    >
      <p className="text-sm font-semibold">Neue Version verfügbar.</p>
      <button
        type="button"
        onClick={() => void updateServiceWorker(true)}
        className="min-h-11 rounded-md bg-court px-4 text-sm font-semibold text-linie hover:bg-court-tief"
      >
        Neu laden
      </button>
      <button
        type="button"
        onClick={() => setNeedRefresh(false)}
        className="min-h-11 rounded-md px-2 text-sm font-semibold text-tinte/60 hover:text-tinte"
      >
        Später
      </button>
    </div>
  )
}
