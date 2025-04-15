"use client";
import { useState, useEffect, useRef } from 'react';
import { useSpring, animated } from '@react-spring/web';

export default function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  // Animazione per l'apertura/chiusura del chatbot
  const chatAnimation = useSpring({
    opacity: isOpen ? 1 : 0,
    transform: isOpen ? 'translateY(0)' : 'translateY(20px)',
    height: isOpen ? 400 : 0,
    config: { tension: 280, friction: 20 }
  });

  // Animazione per il pulsante
  const buttonAnimation = useSpring({
    transform: isOpen ? 'rotate(0deg)' : 'rotate(0deg)',
    config: { tension: 300, friction: 10 }
  });

  // Risposte predefinite basate su parole chiave
  const botResponses = [
    { keywords: ['ciao', 'salve', 'buongiorno', 'buonasera', 'hey'], response: 'Ciao! Sono l\'assistente virtuale di VeryPosta. Come posso aiutarti oggi?' },
    { keywords: ['franchising', 'affiliazione', 'affiliato', 'aprire', 'punto'], response: 'Il franchising VeryPosta richiede un investimento iniziale contenuto di €400 + IVA. Offriamo formazione completa, supporto costante e accesso a convenzioni nazionali vantaggiose. Vuoi maggiori informazioni?' },
    { keywords: ['costo', 'prezzo', 'investimento', 'quanto', 'spesa'], response: 'L\'investimento iniziale per aprire un punto VeryPosta è di €400 + IVA. Il contratto ha durata triennale con rinnovo automatico. Desideri parlare con un nostro consulente?' },
    { keywords: ['servizi', 'offerta', 'cosa', 'offrite'], response: 'VeryPosta offre numerosi servizi: spedizioni, servizi postali, energia, telefonia, CAF/Patronato, SPID, firme digitali, PEC e molti altri. Quale servizio ti interessa in particolare?' },
    { keywords: ['formazione', 'corso', 'imparare', 'insegnare'], response: 'Offriamo formazione completa per l\'avviamento e corsi sempre aggiornati su aspetti legali, operativi e digitali. La formazione è inclusa nel pacchetto di affiliazione.' },
    { keywords: ['contatto', 'telefono', 'email', 'chiamare', 'parlare'], response: 'Puoi contattarci compilando il modulo nella sezione contatti del sito, oppure scrivendo a info@veryposta.it. Un nostro consulente ti ricontatterà al più presto.' },
    { keywords: ['grazie', 'ok', 'capito', 'grazie mille'], response: 'Grazie a te! Sono qui per qualsiasi altra domanda. 😊' },
    { keywords: ['sede', 'dove', 'città', 'zona', 'regione'], response: 'VeryPosta ha punti affiliati in tutta Italia. Puoi aprire un punto nella tua zona se non è già coperta. Vuoi verificare la disponibilità nella tua città?' },
    { keywords: ['guadagno', 'fatturato', 'ricavo', 'profitto'], response: 'I guadagni dipendono da vari fattori come la posizione, i servizi offerti e l\'impegno. Mediamente, un punto VeryPosta ben avviato può generare un fatturato interessante. Vuoi parlare con un nostro affiliato per avere testimonianze dirette?' },
    { keywords: ['tecnologia', 'software', 'gestionale', 'sistema'], response: 'Forniamo una dashboard gestionale completa e strumenti digitali pronti all\'uso, inclusi nel pacchetto di affiliazione. La nostra tecnologia è facile da usare e costantemente aggiornata.' }
  ];

  // Messaggio di benvenuto all'apertura del chat
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setIsTyping(true);
      setTimeout(() => {
        setMessages([{
          text: 'Ciao! Sono l\'assistente virtuale di VeryPosta. Come posso aiutarti oggi?',
          sender: 'bot'
        }]);
        setIsTyping(false);
      }, 1000);
    }
  }, [isOpen, messages.length]);

  // Auto-scroll ai messaggi più recenti
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    // Aggiungi il messaggio dell'utente
    const userMessage = { text: inputValue, sender: 'user' };
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Simula il tempo di risposta del bot
    setTimeout(() => {
      const botMessage = { text: getBotResponse(inputValue), sender: 'bot' };
      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);
    }, 1000 + Math.random() * 1000);
  };

  // Funzione per ottenere la risposta del bot in base alle parole chiave
  const getBotResponse = (input) => {
    const lowercaseInput = input.toLowerCase();
    
    // Cerca corrispondenze con le parole chiave
    for (const item of botResponses) {
      if (item.keywords.some(keyword => lowercaseInput.includes(keyword))) {
        return item.response;
      }
    }
    
    // Risposta predefinita se non trova corrispondenze
    return 'Grazie per la tua domanda. Per informazioni più dettagliate, ti consiglio di compilare il modulo di contatto o chiamare il nostro servizio clienti. Posso aiutarti con altro?';
  };

  return (
    <div className="fixed bottom-6 right-6 z-40">
      {/* Pulsante del chatbot */}
      <animated.button
        style={buttonAnimation}
        onClick={() => setIsOpen(!isOpen)}
        className="bg-[#ebd00b] text-[#1d3a6b] w-14 h-14 rounded-full flex items-center justify-center shadow-lg hover:bg-yellow-400 transition-colors focus:outline-none"
        aria-label="Assistente virtuale"
      >
        {isOpen ? (
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
          </svg>
        )}
      </animated.button>

      {/* Finestra del chatbot */}
      {isOpen && (
        <animated.div 
          style={chatAnimation} 
          className="bg-white rounded-2xl shadow-xl overflow-hidden absolute bottom-20 right-0 w-80 sm:w-96 flex flex-col"
        >
          {/* Header */}
          <div className="bg-[#1d3a6b] text-white p-4 flex items-center justify-between">
            <div className="flex items-center">
              <div className="text-xl font-bold">
                <span className="text-white">Very</span>
                <span className="text-[#ebd00b]">Posta</span>
                <span className="text-white text-sm ml-2">Assistant</span>
              </div>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              className="text-white hover:text-gray-300 focus:outline-none"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>

          {/* Messaggi */}
          <div className="flex-1 p-4 overflow-y-auto bg-gray-50">
            <div className="space-y-4">
              {messages.map((message, index) => (
                <div 
                  key={index} 
                  className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div 
                    className={`max-w-[80%] rounded-2xl px-4 py-2 ${message.sender === 'user' ? 'bg-[#ebd00b] text-[#1d3a6b]' : 'bg-[#1d3a6b] text-white'}`}
                  >
                    {message.text}
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-gray-200 rounded-2xl px-4 py-2 flex space-x-1">
                    <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </div>

          {/* Input */}
          <form onSubmit={handleSendMessage} className="border-t border-gray-200 p-4 bg-white">
            <div className="flex items-center">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Scrivi un messaggio..."
                className="flex-1 border border-gray-300 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#ebd00b]"
              />
              <button 
                type="submit" 
                className="ml-2 bg-[#ebd00b] text-[#1d3a6b] rounded-full p-2 hover:bg-yellow-400 transition-colors focus:outline-none"
                disabled={!inputValue.trim() || isTyping}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="22" y1="2" x2="11" y2="13"></line>
                  <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                </svg>
              </button>
            </div>
          </form>
        </animated.div>
      )}
    </div>
  );
}