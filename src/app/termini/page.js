'use client';

import { FadeIn } from '../components/AnimationProvider';
import MyNav from '../components/MyNav';

export default function TerminiPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <MyNav />
      <FadeIn>
        <div className="max-w-4xl mx-auto px-4 py-12">
          <h1 className="text-3xl font-bold text-[#1d3a6b] mb-8">Termini e Condizioni d'Uso</h1>
          
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-[#1d3a6b] mb-4">1. Accettazione dei termini</h2>
            <p className="text-gray-700 mb-4">
              Utilizzando i servizi di VeryPosta, l'utente accetta integralmente questi termini e condizioni. Se non si accettano questi termini, si prega di non utilizzare i nostri servizi.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-[#1d3a6b] mb-4">2. Descrizione del servizio</h2>
            <p className="text-gray-700 mb-4">
              VeryPosta fornisce una piattaforma per servizi postali, spedizioni e formazione professionale. Ci riserviamo il diritto di modificare, sospendere o interrompere qualsiasi aspetto del servizio in qualsiasi momento.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-[#1d3a6b] mb-4">3. Registrazione e account</h2>
            <p className="text-gray-700 mb-4">
              Per utilizzare alcuni servizi è necessario registrarsi. L'utente si impegna a:
            </p>
            <ul className="list-disc pl-6 text-gray-700 mb-4">
              <li>Fornire informazioni accurate e complete</li>
              <li>Mantenere riservate le credenziali di accesso</li>
              <li>Aggiornare tempestivamente le informazioni quando necessario</li>
              <li>Essere responsabile di tutte le attività sul proprio account</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-[#1d3a6b] mb-4">4. Utilizzo del servizio</h2>
            <p className="text-gray-700 mb-4">
              L'utente si impegna a utilizzare i servizi in modo lecito e secondo questi termini. È vietato:
            </p>
            <ul className="list-disc pl-6 text-gray-700 mb-4">
              <li>Violare leggi o regolamenti</li>
              <li>Interferire con il funzionamento del servizio</li>
              <li>Accedere non autorizzato ai sistemi</li>
              <li>Diffondere contenuti illeciti o dannosi</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-[#1d3a6b] mb-4">5. Proprietà intellettuale</h2>
            <p className="text-gray-700 mb-4">
              Tutti i contenuti presenti sulla piattaforma sono di proprietà di VeryPosta o dei suoi licenziatari. È vietata la riproduzione non autorizzata di qualsiasi contenuto.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-[#1d3a6b] mb-4">6. Limitazione di responsabilità</h2>
            <p className="text-gray-700 mb-4">
              VeryPosta fornisce i servizi "così come sono" e non garantisce che saranno ininterrotti o privi di errori. Non siamo responsabili per danni diretti o indiretti derivanti dall'utilizzo dei servizi.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-[#1d3a6b] mb-4">7. Pagamenti e rimborsi</h2>
            <p className="text-gray-700 mb-4">
              Per i servizi a pagamento, l'utente si impegna a fornire informazioni di pagamento valide. Le politiche di rimborso sono specificate per ogni servizio.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-[#1d3a6b] mb-4">8. Risoluzione</h2>
            <p className="text-gray-700 mb-4">
              Possiamo sospendere o terminare l'accesso ai servizi in caso di violazione dei termini. L'utente può interrompere l'utilizzo dei servizi in qualsiasi momento.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-[#1d3a6b] mb-4">9. Modifiche ai termini</h2>
            <p className="text-gray-700 mb-4">
              Ci riserviamo il diritto di modificare questi termini in qualsiasi momento. Le modifiche entrano in vigore dopo la pubblicazione sul sito.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-[#1d3a6b] mb-4">10. Contatti</h2>
            <p className="text-gray-700">
              Per domande sui termini e condizioni, contattare: info@veryposta.it
            </p>
          </section>
        </div>
      </FadeIn>
    </div>
  );
}