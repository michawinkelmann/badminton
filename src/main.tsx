import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HashRouter } from 'react-router-dom'
import '@fontsource-variable/archivo/index.css'
import './index.css'
import App from './App'

// HashRouter ist Pflicht: BrowserRouter bricht auf GitHub Pages bei Reload/Deeplinks.
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <HashRouter>
      <App />
    </HashRouter>
  </StrictMode>,
)
