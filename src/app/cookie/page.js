'use client';

import { FadeIn } from '../components/AnimationProvider';
import MyNav from '../components/MyNav';

export default function CookiePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <MyNav />
      <FadeIn>
        <div className="max-w-4xl mx-auto px-4 py-12">
          <h1 className="text-3xl font-bold text-[#1d3a6b] mb-8">Cookie Policy</h1>
          
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-[#1d3a6b] mb-4">1. Cosa sono i cookie</h2>
            <p className="text-gray-700 mb-4">
              I cookie sono piccoli file di testo che i siti web salvano sul dispositivo dell'utente durante la navigazione. Servono a memorizzare informazioni e migliorare l'esperienza di utilizzo del sito.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-[#1d3a6b] mb-4">2. Tipologie di cookie utilizzati</h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-[#1d3a6b] mb-2">Cookie tecnici</h3>
                <p className="text-gray-700">
                  Necessari per il funzionamento del sito. Includono cookie per il login, la gestione della sessione e le preferenze dell'utente.
                </p>
              </div>
              
              <div>
                <h3 className="font-semibold text-[#1d3a6b] mb-2">Cookie analitici</h3>
                <p className="text-gray-700">
                  Utilizzati per raccogliere informazioni statistiche sull'utilizzo del sito, in forma anonima.
                </p>
              </div>
              
              <div>
                <h3 className="font-semibold text-[#1d3a6b] mb-2">Cookie di profilazione</h3>
                <p className="text-gray-700">
                  Utilizzati per tracciare la navigazione dell'utente e creare profili sulle sue preferenze.
                </p>
              </div>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-[#1d3a6b] mb-4">3. Cookie di terze parti</h2>
            <p className="text-gray-700 mb-4">
              Il sito utilizza anche cookie di terze parti per:
            </p>
            <ul className="list-disc pl-6 text-gray-700 mb-4">
              <li>Analisi del traffico (Google Analytics)</li>
              <li>Integrazione con social media</li>
              <li>Visualizzazione di contenuti multimediali</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-[#1d3a6b] mb-4">4. Durata dei cookie</h2>
            <p className="text-gray-700 mb-4">
              I cookie hanno diverse durate:
            </p>
            <ul className="list-disc pl-6 text-gray-700 mb-4">
              <li>Cookie di sessione: vengono eliminati alla chiusura del browser</li>
              <li>Cookie persistenti: rimangono sul dispositivo per un periodo prestabilito</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-[#1d3a6b] mb-4">5. Gestione dei cookie</h2>
            <p className="text-gray-700 mb-4">
              L'utente può gestire le preferenze sui cookie attraverso:
            </p>
            <ul className="list-disc pl-6 text-gray-700 mb-4">
              <li>Le impostazioni del browser</li>
              <li>Il banner dei cookie presente sul sito</li>
              <li>Strumenti di opt-out specifici per i cookie di terze parti</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-[#1d3a6b] mb-4">6. Conseguenze del rifiuto dei cookie</h2>
            <p className="text-gray-700 mb-4">
              Il rifiuto dei cookie tecnici può limitare la possibilità di utilizzare il sito e impedire di accedere ad alcune funzionalità. Il rifiuto dei cookie non tecnici non pregiudica la navigazione.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-[#1d3a6b] mb-4">7. Aggiornamenti della policy</h2>
            <p className="text-gray-700">
              Questa cookie policy può essere aggiornata periodicamente. Consigliamo di consultare regolarmente questa pagina per rimanere informati su eventuali modifiche.
            </p>
          </section>
        </div>
      </FadeIn>
    </div>
  );
}