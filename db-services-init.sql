-- Inizializzazione della tabella per i servizi

-- Tabella dei servizi
CREATE TABLE IF NOT EXISTS services (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  url VARCHAR(255) NOT NULL,
  logo VARCHAR(255),
  category VARCHAR(50) NOT NULL, -- energy, telecom, spid, postal, shipping, caf
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabella per i servizi preferiti degli affiliati
CREATE TABLE IF NOT EXISTS affiliate_favorite_services (
  id SERIAL PRIMARY KEY,
  affiliate_id INTEGER NOT NULL REFERENCES affiliates(id),
  service_id INTEGER NOT NULL REFERENCES services(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(affiliate_id, service_id)
);

-- Tabella per le note degli affiliati sui servizi
CREATE TABLE IF NOT EXISTS affiliate_service_notes (
  id SERIAL PRIMARY KEY,
  affiliate_id INTEGER NOT NULL REFERENCES affiliates(id),
  service_id INTEGER NOT NULL REFERENCES services(id),
  note TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(affiliate_id, service_id)
);

-- Indici per migliorare le prestazioni
CREATE INDEX IF NOT EXISTS idx_services_category ON services(category);
CREATE INDEX IF NOT EXISTS idx_affiliate_favorite_services_affiliate_id ON affiliate_favorite_services(affiliate_id);
CREATE INDEX IF NOT EXISTS idx_affiliate_service_notes_affiliate_id ON affiliate_service_notes(affiliate_id);

-- Inserimento di dati di esempio
INSERT INTO services (name, description, url, logo, category) VALUES
-- Energia
('ENI', 'Portale per contratti luce e gas', 'https://www.eni.com/it-IT/eni-plenitude.html', '/eni.svg', 'energy'),
('ENEL', 'Gestione contratti energia elettrica e gas', 'https://www.enel.it', '/enel.svg', 'energy'),
('Edison', 'Offerte luce, gas e servizi energetici', 'https://www.edison.it', '/edison.svg', 'energy'),
('Sorgenia', 'Fornitore di energia elettrica e gas naturale', 'https://www.sorgenia.it', '/sorgenia.svg', 'energy'),

-- Telefonia
('TIM', 'Servizi di telefonia fissa e mobile', 'https://www.tim.it', '/tim.svg', 'telecom'),
('Vodafone', 'Offerte mobile, fisso e internet', 'https://www.vodafone.it', '/vodafone.svg', 'telecom'),
('WindTre', 'Gestione contratti telefonia e internet', 'https://www.windtre.it', '/windtre.svg', 'telecom'),
('Fastweb', 'Servizi di connettività e telefonia', 'https://www.fastweb.it', '/fastweb.svg', 'telecom'),

-- SPID
('Namirial SPID', 'Gestione identità digitale SPID', 'https://portal.namirialtsp.com/public', '/namirial.svg', 'spid'),
('Poste ID', 'SPID di Poste Italiane', 'https://posteid.poste.it', '/poste.svg', 'spid'),
('Aruba ID', 'Servizio SPID di Aruba', 'https://id.aruba.it', '/aruba.svg', 'spid'),
('InfoCert ID', 'Identità digitale InfoCert', 'https://identity.infocert.it', '/infocert.svg', 'spid'),

-- Servizi Postali
('Poste Italiane', 'Servizi postali e finanziari', 'https://www.poste.it/prodotti.html', '/poste.svg', 'postal'),
('Nexive', 'Servizi di corrispondenza e pacchi', 'https://www.nexive.it', '/nexive.svg', 'postal'),
('Mail Boxes Etc', 'Servizi di spedizione e imballaggio', 'https://www.mbe.it', '/mbe.svg', 'postal'),

-- Spedizioni
('DHL', 'Spedizioni nazionali e internazionali', 'https://www.dhl.it', '/dhl.svg', 'shipping'),
('BRT', 'Corriere espresso per spedizioni', 'https://www.brt.it', '/brt.svg', 'shipping'),
('GLS', 'Servizi di corriere espresso', 'https://www.gls-italy.com', '/gls.svg', 'shipping'),
('UPS', 'Spedizioni e logistica internazionale', 'https://www.ups.com/it', '/ups.svg', 'shipping'),

-- CAF/Patronato
('CAF ACLI', 'Servizi fiscali e previdenziali', 'https://www.cafacli.it', '/acli.svg', 'caf'),
('CAF CISL', 'Assistenza fiscale e servizi alla persona', 'https://www.cafcisl.it', '/cisl.svg', 'caf'),
('Patronato INAPA', 'Servizi di patronato e assistenza', 'https://www.inapa.it', '/inapa.svg', 'caf');

-- Comando per eseguire questo script:
-- psql -h ep-lingering-surf-a27qov03.eu-central-1.aws.neon.tech -U neondb_owner -d neondb -f db-services-init.sql