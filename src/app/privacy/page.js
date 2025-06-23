'use client';

import { FadeIn } from '../components/AnimationProvider';
import MyNav from '../components/MyNav';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <MyNav />
      <FadeIn>
        <div className="max-w-4xl mx-auto px-4 py-12">
          <h1 className="text-3xl font-bold text-[#1d3a6b] mb-8">Informativa sulla Privacy</h1>
          
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-[#1d3a6b] mb-4">1. Introduzione</h2>
            <p className="text-gray-700 mb-4">
              VeryPosta si impegna a proteggere la privacy degli utenti. Questa informativa sulla privacy spiega come raccogliamo, utilizziamo e proteggiamo i dati personali in conformità con il Regolamento Generale sulla Protezione dei Dati (GDPR).
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-[#1d3a6b] mb-4">2. Dati raccolti</h2>
            <p className="text-gray-700 mb-4">Raccogliamo i seguenti tipi di dati personali:</p>
            <ul className="list-disc pl-6 text-gray-700 mb-4">
              <li>Informazioni di contatto (nome, email, telefono)</li>
              <li>Dati di accesso e utilizzo della piattaforma</li>
              <li>Informazioni sul dispositivo e browser utilizzato</li>
              <li>Dati relativi alle preferenze e interazioni con i nostri servizi</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-[#1d3a6b] mb-4">3. Finalità del trattamento</h2>
            <p className="text-gray-700 mb-4">Utilizziamo i dati personali per:</p>
            <ul className="list-disc pl-6 text-gray-700 mb-4">
              <li>Fornire e personalizzare i nostri servizi</li>
              <li>Gestire gli account degli utenti</li>
              <li>Inviare comunicazioni relative ai servizi</li>
              <li>Migliorare la nostra piattaforma</li>
              <li>Rispettare gli obblighi legali</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-[#1d3a6b] mb-4">4. Base giuridica del trattamento</h2>
            <p className="text-gray-700 mb-4">
              Il trattamento dei dati personali si basa su:
            </p>
            <ul className="list-disc pl-6 text-gray-700 mb-4">
              <li>Consenso dell'utente</li>
              <li>Esecuzione di un contratto</li>
              <li>Adempimento di obblighi legali</li>
              <li>Legittimo interesse del titolare</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-[#1d3a6b] mb-4">5. Conservazione dei dati</h2>
            <p className="text-gray-700 mb-4">
              Conserviamo i dati personali per il tempo necessario al raggiungimento delle finalità per cui sono stati raccolti, o per il periodo richiesto dalla legge. Al termine del periodo di conservazione, i dati vengono cancellati o anonimizzati.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-[#1d3a6b] mb-4">6. Diritti degli interessati</h2>
            <p className="text-gray-700 mb-4">Gli utenti hanno diritto di:</p>
            <ul className="list-disc pl-6 text-gray-700 mb-4">
              <li>Accedere ai propri dati personali</li>
              <li>Richiedere la rettifica o la cancellazione dei dati</li>
              <li>Limitare o opporsi al trattamento</li>
              <li>Richiedere la portabilità dei dati</li>
              <li>Revocare il consenso al trattamento</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-[#1d3a6b] mb-4">7. Sicurezza dei dati</h2>
            <p className="text-gray-700 mb-4">
              Adottiamo misure di sicurezza tecniche e organizzative per proteggere i dati personali da accessi non autorizzati, perdita o alterazione. Queste misure vengono regolarmente riviste e aggiornate.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-[#1d3a6b] mb-4">8. Trattamento dati degli affiliati</h2>
            <p className="text-gray-700 mb-4">
              Per gli affiliati VeryPosta, raccogliamo e trattiamo ulteriori dati personali necessari per la gestione del rapporto di franchising:
            </p>
            <ul className="list-disc pl-6 text-gray-700 mb-4">
              <li>Dati anagrafici e fiscali completi</li>
              <li>Informazioni bancarie per pagamenti e transazioni</li>
              <li>Dati relativi alla formazione e alle performance</li>
              <li>Documentazione contrattuale e comunicazioni ufficiali</li>
            </ul>
            <p className="text-gray-700 mb-4">
              Questi dati vengono trattati per la gestione del rapporto contrattuale, l'erogazione dei servizi di supporto, la formazione, e l'adempimento degli obblighi fiscali e legali. I dati degli affiliati sono conservati per tutta la durata del rapporto contrattuale e per il periodo successivo richiesto dalle normative fiscali e legali.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-[#1d3a6b] mb-4">9. Contatti</h2>
            <p className="text-gray-700 mb-4">
              Per esercitare i propri diritti o per qualsiasi domanda sulla privacy, gli utenti possono contattarci all'indirizzo email: privacy@veryposta.it
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-[#1d3a6b] mb-4">10. Modifiche all'informativa</h2>
            <p className="text-gray-700">
              Ci riserviamo il diritto di modificare questa informativa sulla privacy in qualsiasi momento. Le modifiche verranno pubblicate su questa pagina con la data di ultima modifica.
            </p>
          </section>
        </div>
      </FadeIn>
    </div>
  );
}