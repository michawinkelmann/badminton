import { Link, useParams } from 'react-router-dom'
import { useAppStore } from '../store'
import { istBibliotheksUebung } from '../data/uebungen'
import UebungsFormular from '../components/training/UebungsFormular'

export default function UebungBearbeiten() {
  const { uebungId } = useParams()
  const eigene = useAppStore((s) => s.eigeneUebungen)
  const uebung = eigene.find((u) => u.id === uebungId)

  if (!uebung || (uebungId && istBibliotheksUebung(uebungId))) {
    return (
      <div>
        <h1 className="schrift-display doppellinie text-3xl">Nicht bearbeitbar</h1>
        <p className="mt-5 max-w-2xl text-tinte/80">
          Nur eigene Übungen lassen sich bearbeiten — die mitgelieferte Bibliothek bleibt
          unverändert. Du kannst aber jederzeit eine eigene Variante anlegen.
        </p>
        <Link
          to="/uebungen"
          className="mt-4 inline-flex min-h-11 items-center rounded-md border-2 border-court px-4 text-sm font-semibold text-court hover:bg-linie"
        >
          Zur Bibliothek
        </Link>
      </div>
    )
  }

  return (
    <div>
      <h1 className="schrift-display doppellinie text-3xl">Übung bearbeiten</h1>
      <div className="mt-6">
        <UebungsFormular vorhandene={uebung} />
      </div>
    </div>
  )
}
