"use client";
import { useState, useEffect } from 'react';
import { useSpring, animated } from '@react-spring/web';

export default function ROICalculator({ isOpen, onClose }) {
  // Stati per i valori del calcolatore
  const [initialInvestment, setInitialInvestment] = useState(400);
  const [monthlyExpenses, setMonthlyExpenses] = useState(500);
  const [monthlyRevenue, setMonthlyRevenue] = useState(2000);
  const [servicesMix, setServicesMix] = useState({
    postal: 30,
    shipping: 25,
    energy: 15,
    telecom: 10,
    digital: 20
  });
  const [location, setLocation] = useState('medium'); // small, medium, large
  
  // Stati per i risultati
  const [monthlyProfit, setMonthlyProfit] = useState(0);
  const [annualProfit, setAnnualProfit] = useState(0);
  const [roi, setRoi] = useState(0);
  const [paybackPeriod, setPaybackPeriod] = useState(0);
  
  // Animazione per il modal
  const modalAnimation = useSpring({
    opacity: isOpen ? 1 : 0,
    transform: isOpen ? 'translateY(0)' : 'translateY(-50px)',
    config: { tension: 280, friction: 20 }
  });

  // Calcola i risultati quando cambiano i valori di input
  useEffect(() => {
    // Calcolo del profitto mensile
    const profit = monthlyRevenue - monthlyExpenses;
    setMonthlyProfit(profit);
    
    // Calcolo del profitto annuale
    const annual = profit * 12;
    setAnnualProfit(annual);
    
    // Calcolo del ROI (Return on Investment)
    // ROI = (Guadagno dall'investimento - Costo dell'investimento) / Costo dell'investimento * 100
    const roiValue = ((annual - initialInvestment) / initialInvestment) * 100;
    setRoi(roiValue);
    
    // Calcolo del periodo di recupero (in mesi)
    // Payback Period = Investimento iniziale / Profitto mensile
    const payback = profit > 0 ? initialInvestment / profit : 0;
    setPaybackPeriod(payback);
  }, [initialInvestment, monthlyExpenses, monthlyRevenue]);

  // Gestisce la modifica del mix di servizi
  const handleServiceMixChange = (service, value) => {
    // Assicura che il valore sia un numero tra 0 e 100
    const newValue = Math.max(0, Math.min(100, parseInt(value) || 0));
    
    // Calcola la somma di tutti gli altri servizi escluso quello corrente
    const otherServicesSum = Object.entries(servicesMix)
      .filter(([key]) => key !== service)
      .reduce((sum, [_, val]) => sum + val, 0);
    
    // Assicura che la somma totale non superi 100%
    if (newValue + otherServicesSum > 100) {
      return; // Non permette di superare il 100%
    }
    
    setServicesMix(prev => ({
      ...prev,
      [service]: newValue
    }));
  };

  // Gestisce la selezione della posizione
  const handleLocationChange = (loc) => {
    setLocation(loc);
    
    // Aggiorna le stime in base alla posizione
    switch(loc) {
      case 'small':
        setMonthlyExpenses(300);
        setMonthlyRevenue(1500);
        break;
      case 'medium':
        setMonthlyExpenses(500);
        setMonthlyRevenue(2000);
        break;
      case 'large':
        setMonthlyExpenses(800);
        setMonthlyRevenue(3000);
        break;
    }
  };

  // Formatta i numeri come valuta Euro
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('it-IT', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 overflow-y-auto">
      <animated.div 
        style={modalAnimation} 
        className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto"
      >
        <div className="p-6 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-[#1d3a6b]">
            Calcolatore ROI <span className="text-[#ebd00b]">VeryPosta</span>
          </h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl focus:outline-none"
            aria-label="Chiudi"
          >
            ×
          </button>
        </div>

        <div className="p-6">
          <div className="text-center mb-6">
            <p className="text-gray-600">
              Stima il potenziale ritorno sull'investimento del tuo punto VeryPosta.
              <br />
              <span className="text-sm italic">Nota: questi calcoli sono stime indicative e possono variare in base a diversi fattori.</span>
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Colonna sinistra - Input */}
            <div className="space-y-6">
              <div className="bg-gray-50 p-6 rounded-xl">
                <h3 className="text-lg font-bold text-[#1d3a6b] mb-4">Parametri di base</h3>
                
                {/* Investimento iniziale */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Investimento iniziale (€)
                  </label>
                  <input
                    type="number"
                    min="400"
                    value={initialInvestment}
                    onChange={(e) => setInitialInvestment(Math.max(400, parseInt(e.target.value) || 400))}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#ebd00b]"
                  />
                  <p className="text-xs text-gray-500 mt-1">L'investimento minimo è di €400 + IVA</p>
                </div>
                
                {/* Spese mensili */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Spese mensili stimate (€)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={monthlyExpenses}
                    onChange={(e) => setMonthlyExpenses(Math.max(0, parseInt(e.target.value) || 0))}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#ebd00b]"
                  />
                  <p className="text-xs text-gray-500 mt-1">Include affitto, utenze, personale, ecc.</p>
                </div>
                
                {/* Ricavi mensili */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Ricavi mensili stimati (€)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={monthlyRevenue}
                    onChange={(e) => setMonthlyRevenue(Math.max(0, parseInt(e.target.value) || 0))}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#ebd00b]"
                  />
                </div>
              </div>

              <div className="bg-gray-50 p-6 rounded-xl">
                <h3 className="text-lg font-bold text-[#1d3a6b] mb-4">Posizione del punto</h3>
                <div className="grid grid-cols-3 gap-3">
                  <button
                    className={`p-3 rounded-lg text-center ${location === 'small' ? 'bg-[#ebd00b] text-[#1d3a6b]' : 'bg-white border border-gray-300'}`}
                    onClick={() => handleLocationChange('small')}
                  >
                    <div className="text-xl mb-1">🏠</div>
                    <div className="font-medium">Piccola</div>
                    <div className="text-xs">Città piccola</div>
                  </button>
                  <button
                    className={`p-3 rounded-lg text-center ${location === 'medium' ? 'bg-[#ebd00b] text-[#1d3a6b]' : 'bg-white border border-gray-300'}`}
                    onClick={() => handleLocationChange('medium')}
                  >
                    <div className="text-xl mb-1">🏙️</div>
                    <div className="font-medium">Media</div>
                    <div className="text-xs">Città media</div>
                  </button>
                  <button
                    className={`p-3 rounded-lg text-center ${location === 'large' ? 'bg-[#ebd00b] text-[#1d3a6b]' : 'bg-white border border-gray-300'}`}
                    onClick={() => handleLocationChange('large')}
                  >
                    <div className="text-xl mb-1">🌆</div>
                    <div className="font-medium">Grande</div>
                    <div className="text-xs">Grande città</div>
                  </button>
                </div>
              </div>
            </div>

            {/* Colonna destra - Risultati */}
            <div className="space-y-6">
              <div className="bg-[#1d3a6b] p-6 rounded-xl text-white">
                <h3 className="text-lg font-bold mb-6">Risultati stimati</h3>
                
                <div className="space-y-4">
                  <div className="flex justify-between items-center pb-2 border-b border-blue-400">
                    <span>Profitto mensile:</span>
                    <span className="text-xl font-bold text-[#ebd00b]">
                      {formatCurrency(monthlyProfit)}
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center pb-2 border-b border-blue-400">
                    <span>Profitto annuale:</span>
                    <span className="text-xl font-bold text-[#ebd00b]">
                      {formatCurrency(annualProfit)}
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center pb-2 border-b border-blue-400">
                    <span>ROI (primo anno):</span>
                    <span className="text-xl font-bold text-[#ebd00b]">
                      {roi.toFixed(0)}%
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span>Tempo di recupero:</span>
                    <span className="text-xl font-bold text-[#ebd00b]">
                      {paybackPeriod.toFixed(1)} mesi
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 p-6 rounded-xl">
                <h3 className="text-lg font-bold text-[#1d3a6b] mb-4">Mix di servizi consigliato</h3>
                <div className="space-y-3">
                  {Object.entries(servicesMix).map(([service, percentage]) => {
                    const labels = {
                      postal: "Servizi Postali",
                      shipping: "Spedizioni",
                      energy: "Energia",
                      telecom: "Telefonia",
                      digital: "Servizi Digitali"
                    };
                    
                    return (
                      <div key={service}>
                        <div className="flex justify-between items-center mb-1">
                          <label className="text-sm font-medium">{labels[service]}</label>
                          <span className="text-sm">{percentage}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                          <div 
                            className="bg-[#ebd00b] h-2.5 rounded-full" 
                            style={{ width: `${percentage}%` }}
                          ></div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="text-center">
                <button 
                  onClick={onClose}
                  className="bg-[#ebd00b] text-[#1d3a6b] px-6 py-3 rounded-full font-bold hover:bg-yellow-400 transition"
                >
                  Richiedi una consulenza personalizzata
                </button>
              </div>
            </div>
          </div>
        </div>
      </animated.div>
    </div>
  );
}