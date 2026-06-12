import { useEffect, useRef, type ReactNode } from 'react'

interface Props {
  offen: boolean
  titel: string
  children: ReactNode
  bestaetigenLabel: string // aktives Verb, z. B. „Alles ersetzen"
  destruktiv?: boolean
  onBestaetigen: () => void
  onAbbrechen: () => void
}

/**
 * Bestätigungsdialog für destruktive Aktionen (§15: Löschen, Import-Ersetzen,
 * Spielplan-Neugenerierung immer mit Bestätigung).
 */
export default function BestaetigungsDialog({
  offen,
  titel,
  children,
  bestaetigenLabel,
  destruktiv = false,
  onBestaetigen,
  onAbbrechen,
}: Props) {
  const ref = useRef<HTMLDialogElement>(null)

  useEffect(() => {
    const dialog = ref.current
    if (!dialog) return
    if (offen && !dialog.open) dialog.showModal()
    if (!offen && dialog.open) dialog.close()
  }, [offen])

  return (
    <dialog
      ref={ref}
      onClose={onAbbrechen}
      onCancel={onAbbrechen}
      className="m-auto w-full max-w-md rounded-xl border-2 border-court bg-linie p-0 text-tinte shadow-xl backdrop:bg-tinte/50"
    >
      <div className="p-5">
        <h2 className="schrift-display doppellinie text-lg">{titel}</h2>
        <div className="mt-4 text-sm leading-relaxed">{children}</div>
        <div className="mt-6 flex flex-wrap justify-end gap-3">
          <button
            type="button"
            onClick={onAbbrechen}
            className="min-h-11 rounded-md border-2 border-court px-4 text-sm font-semibold text-court hover:bg-boden"
          >
            Abbrechen
          </button>
          <button
            type="button"
            onClick={onBestaetigen}
            className={`min-h-11 rounded-md px-4 text-sm font-semibold text-linie ${
              destruktiv ? 'bg-red-700 hover:bg-red-800' : 'bg-court hover:bg-court-tief'
            }`}
          >
            {bestaetigenLabel}
          </button>
        </div>
      </div>
    </dialog>
  )
}
