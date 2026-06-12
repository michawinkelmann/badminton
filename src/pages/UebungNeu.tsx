import UebungsFormular from '../components/training/UebungsFormular'

export default function UebungNeu() {
  return (
    <div>
      <h1 className="schrift-display doppellinie text-3xl">Eigene Übung anlegen</h1>
      <p className="mt-5 max-w-2xl text-sm text-tinte/75">
        Eigene Übungen landen in deiner Bibliothek, sind filterbar wie alle anderen und
        wandern mit in den Export.
      </p>
      <div className="mt-6">
        <UebungsFormular />
      </div>
    </div>
  )
}
