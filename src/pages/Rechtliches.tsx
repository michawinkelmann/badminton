/** Impressum, Datenschutz und Lizenzen — erreichbar über den Footer. */

function Abschnitt({ id, titel, children }: { id: string; titel: string; children: React.ReactNode }) {
  return (
    <section id={id} className="mt-8 rounded-xl border-2 border-court/25 bg-linie p-5">
      <h2 className="schrift-display doppellinie text-xl">{titel}</h2>
      <div className="mt-4 space-y-3 text-sm leading-relaxed text-tinte/85">{children}</div>
    </section>
  )
}

export default function Rechtliches() {
  return (
    <div className="max-w-3xl">
      <h1 className="schrift-display doppellinie text-3xl">Rechtliches</h1>

      {/* ---------- Impressum ---------- */}
      <Abschnitt id="impressum" titel="Impressum">
        <p className="font-semibold text-tinte">Angaben gemäß § 5 DDG</p>
        <p>
          Dr. Micha Winkelmann
          <br />
          Heckenbergweg 10
          <br />
          29690 Schwarmstedt
        </p>
        <p>
          E-Mail:{' '}
          <a href="mailto:michawinkelmann@gmail.com" className="font-semibold text-court underline-offset-2 hover:underline">
            michawinkelmann@gmail.com
          </a>
        </p>
        <p>
          Verantwortlich für den Inhalt nach § 18 Abs. 2 MStV: Dr. Micha Winkelmann
          (Anschrift wie oben).
        </p>
        <p className="text-tinte/70">
          Dieses Angebot ist ein privates, nicht kommerzielles Projekt für Schule und
          Vereinstraining.
        </p>
      </Abschnitt>

      {/* ---------- Datenschutz ---------- */}
      <Abschnitt id="datenschutz" titel="Datenschutzerklärung">
        <p className="font-semibold text-tinte">Kurzfassung: Deine Daten bleiben bei dir.</p>
        <p>
          Diese App erhebt, speichert und überträgt keine personenbezogenen Daten an den
          Betreiber oder an Dritte. Es gibt keine Benutzerkonten, keine Cookies zu
          Analyse- oder Werbezwecken, keine Tracking- oder Statistik-Tools und keine
          Inhalte, die zur Laufzeit von fremden Servern nachgeladen werden.
        </p>
        <p>
          <span className="font-semibold text-tinte">Lokale Datenhaltung:</span> Alles, was
          du in der App anlegst (Profile, Gruppen, Übungen, Einheiten, Programme,
          Trainings-Logs, Einschätzungen, Turniere), wird ausschließlich lokal in deinem
          Browser gespeichert (localStorage) und verlässt dein Gerät nicht. Du kannst diese
          Daten jederzeit selbst löschen — in der App unter Einstellungen → „Alle Daten
          löschen" oder über die Websitedaten-Funktion deines Browsers. Exporte (JSON-Dateien)
          erstellst und verwaltest du selbst.
        </p>
        <p>
          <span className="font-semibold text-tinte">Hinweis für Lehrkräfte und
          Trainer:innen:</span> Wenn du Profile mit Namen realer Personen anlegst, werden
          auch diese nur lokal auf deinem Gerät gespeichert. Für den verantwortungsvollen
          Umgang damit (z. B. Gerätezugriff, Löschung am Schuljahresende) bist du als
          nutzende Person verantwortlich. Tipp: Kürzel oder Vornamen genügen.
        </p>
        <p>
          <span className="font-semibold text-tinte">Hosting (GitHub Pages):</span> Die App
          wird als statische Website über GitHub Pages bereitgestellt (GitHub, Inc., 88
          Colin P Kelly Jr St, San Francisco, CA 94107, USA). Beim Aufruf der Seite
          verarbeitet GitHub technisch notwendige Verbindungsdaten (insbesondere die
          IP-Adresse) in Server-Logs, um die Seite auszuliefern und die Sicherheit des
          Dienstes zu gewährleisten (Art. 6 Abs. 1 lit. f DSGVO). Auf diese Verarbeitung
          hat der Betreiber keinen Einfluss. Details:{' '}
          <a
            href="https://docs.github.com/de/site-policy/privacy-policies/github-general-privacy-statement"
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-court underline-offset-2 hover:underline"
          >
            GitHub General Privacy Statement
          </a>
          .
        </p>
        <p>
          <span className="font-semibold text-tinte">Offline-Funktion (PWA):</span> Damit die
          App auch ohne Internet funktioniert, legt der Browser die App-Dateien in einem
          lokalen Cache ab (Service Worker). Dabei werden keine personenbezogenen Daten
          verarbeitet.
        </p>
        <p>
          <span className="font-semibold text-tinte">Deine Rechte:</span> Dir stehen die
          Rechte aus Art. 15–21 DSGVO zu (Auskunft, Berichtigung, Löschung, Einschränkung,
          Datenübertragbarkeit, Widerspruch) sowie ein Beschwerderecht bei einer
          Datenschutz-Aufsichtsbehörde. Da der Betreiber selbst keine personenbezogenen
          Daten von dir verarbeitet, richte Anfragen zum Hosting bitte an GitHub; für alle
          übrigen Fragen erreichst du den Betreiber unter der oben genannten E-Mail-Adresse.
        </p>
      </Abschnitt>

      {/* ---------- Lizenzen ---------- */}
      <Abschnitt id="lizenz" titel="Lizenzen">
        <p>
          <span className="font-semibold text-tinte">Eigene Inhalte</span> (Übungstexte,
          Trainingsprogramme, Bewegungsanimationen, Lehrtexte und Grafiken) stehen unter der
          Lizenz{' '}
          <a
            href="https://creativecommons.org/licenses/by-nc-sa/4.0/deed.de"
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-court underline-offset-2 hover:underline"
          >
            CC BY-NC-SA 4.0
          </a>{' '}
          (Namensnennung — nicht kommerziell — Weitergabe unter gleichen Bedingungen). Du
          darfst die Inhalte für nicht kommerzielle Zwecke teilen und bearbeiten, solange du
          „Dr. Micha Winkelmann" als Urheber nennst und Bearbeitungen unter derselben Lizenz
          weitergibst.
        </p>
        <p>
          <span className="font-semibold text-tinte">Website-Code</span> steht unter der
          MIT-Lizenz (© 2026 Dr. Micha Winkelmann). Der vollständige Lizenztext liegt der
          Quellcode-Veröffentlichung bei (Datei <code className="rounded bg-boden px-1">LICENSE</code>):
        </p>
        <pre className="overflow-x-auto rounded-lg bg-boden p-3 text-xs leading-relaxed text-tinte/80">
{`MIT License — Copyright (c) 2026 Dr. Micha Winkelmann

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.`}
        </pre>
        <p>
          <span className="font-semibold text-tinte">Verwendete Open-Source-Software:</span>{' '}
          React (MIT), Vite (MIT), Tailwind CSS (MIT), Zustand (MIT), Zod (MIT), dnd-kit
          (MIT), Recharts (MIT) sowie die Schrift „Archivo" (SIL Open Font License 1.1).
          Vielen Dank an alle Mitwirkenden dieser Projekte.
        </p>
      </Abschnitt>
    </div>
  )
}
