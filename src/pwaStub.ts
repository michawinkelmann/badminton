/**
 * Ersatz für 'virtual:pwa-register/react' in der lokalen Einzeldatei-Version
 * (Badminton-Planer-lokal.html): Dort gibt es keinen Service Worker,
 * der Update-Toast bleibt einfach aus. Wird per Alias in vite.config.lokal.ts
 * eingewechselt — die GitHub-Pages-Version nutzt weiterhin das echte Modul.
 */
export function useRegisterSW() {
  const aus: [boolean, (wert: boolean) => void] = [false, () => {}]
  return {
    needRefresh: aus,
    offlineReady: aus,
    updateServiceWorker: async (_neuLaden?: boolean) => {},
  }
}
