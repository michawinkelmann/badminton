import { Navigate, Route, Routes } from 'react-router-dom'
import Layout from './components/Layout'
import Start from './pages/Start'
import Uebungen from './pages/Uebungen'
import UebungDetail from './pages/UebungDetail'
import UebungNeu from './pages/UebungNeu'
import UebungBearbeiten from './pages/UebungBearbeiten'
import Einheiten from './pages/Einheiten'
import EinheitenBuilder from './pages/EinheitenBuilder'
import EinheitDruck from './pages/EinheitDruck'
import Programme from './pages/Programme'
import ProgrammDetail from './pages/ProgrammDetail'
import ProgrammEditor from './pages/ProgrammEditor'
import ZuweisungDetail from './pages/ZuweisungDetail'
import Bewegungslehre from './pages/Bewegungslehre'
import AnimationDetail from './pages/AnimationDetail'
import Profile from './pages/Profile'
import ProfilDetail from './pages/ProfilDetail'
import Turniere from './pages/Turniere'
import TurnierNeu from './pages/TurnierNeu'
import TurnierDetail from './pages/TurnierDetail'
import TurnierDruck from './pages/TurnierDruck'
import Einstellungen from './pages/Einstellungen'
import Rechtliches from './pages/Rechtliches'
import Beamer from './pages/Beamer'

export default function App() {
  return (
    <Routes>
      {/* Beamer-Modus läuft ohne App-Shell (eigenes Vollbild-Layout, §10) */}
      <Route path="/beamer/:turnierId" element={<Beamer />} />

      <Route element={<Layout />}>
        <Route index element={<Start />} />
        <Route path="/uebungen" element={<Uebungen />} />
        <Route path="/uebungen/neu" element={<UebungNeu />} />
        <Route path="/uebungen/:uebungId" element={<UebungDetail />} />
        <Route path="/uebungen/:uebungId/bearbeiten" element={<UebungBearbeiten />} />
        <Route path="/einheiten" element={<Einheiten />} />
        <Route path="/einheiten/neu" element={<EinheitenBuilder />} />
        <Route path="/einheiten/:einheitId" element={<EinheitenBuilder />} />
        <Route path="/einheiten/:einheitId/drucken" element={<EinheitDruck />} />
        <Route path="/programme" element={<Programme />} />
        <Route path="/programme/neu" element={<ProgrammEditor />} />
        <Route path="/programme/zuweisungen/:zuweisungId" element={<ZuweisungDetail />} />
        <Route path="/programme/:programmId" element={<ProgrammDetail />} />
        <Route path="/programme/:programmId/bearbeiten" element={<ProgrammEditor />} />
        <Route path="/bewegungslehre" element={<Bewegungslehre />} />
        <Route path="/bewegungslehre/:animationId" element={<AnimationDetail />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/profile/:profilId" element={<ProfilDetail />} />
        <Route path="/turniere" element={<Turniere />} />
        <Route path="/turniere/neu" element={<TurnierNeu />} />
        <Route path="/turniere/:turnierId" element={<TurnierDetail />} />
        <Route path="/turniere/:turnierId/setup" element={<TurnierNeu />} />
        <Route path="/turniere/:turnierId/drucken" element={<TurnierDruck />} />
        <Route path="/einstellungen" element={<Einstellungen />} />
        <Route path="/rechtliches" element={<Rechtliches />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  )
}
