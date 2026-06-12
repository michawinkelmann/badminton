import { useRegisterSW } from 'virtual:pwa-register/react'

/** Unaufdringlicher Update-Toast (§11): neuer Service Worker → „Neu laden". */
export default function ReloadPrompt() {
  const {
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW()

  if (!needRefresh) return null

  return (
    <div
      role="status"
      className="fixed inset-x-4 bottom-4 z-50 mx-auto flex max-w-md items-center gap-3 rounded-lg border-2 border-court bg-linie p-3 shadow-lg"
    >
      <p className="flex-1 text-sm">Eine neue Version ist verfügbar.</p>
      <button
        type="button"
        onClick={() => updateServiceWorker(true)}
        className="min-h-11 rounded-md bg-court px-4 text-sm font-semibold text-linie hover:bg-court-tief"
      >
        Neu laden
      </button>
      <button
        type="button"
        onClick={() => setNeedRefresh(false)}
        className="min-h-11 rounded-md px-3 text-sm font-semibold text-tinte/70 hover:text-tinte"
      >
        Später
      </button>
    </div>
  )
}
