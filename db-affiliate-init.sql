-- Inizializzazione delle tabelle per il sistema di affiliazione VeryPosta

-- Tabella degli affiliati
CREATE TABLE IF NOT EXISTS affiliates (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL UNIQUE,
  phone VARCHAR(20) NOT NULL,
  password VARCHAR(255) NOT NULL,
  address VARCHAR(255),
  city VARCHAR(100),
  postal_code VARCHAR(10),
  tax_id VARCHAR(20),
  status VARCHAR(20) DEFAULT 'pending', -- pending, active, suspended
  commission_rate DECIMAL(5,2) DEFAULT 10.00,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabella delle vendite/servizi degli affiliati
CREATE TABLE IF NOT EXISTS affiliate_sales (
  id SERIAL PRIMARY KEY,
  affiliate_id INTEGER NOT NULL REFERENCES affiliates(id),
  service_type VARCHAR(50) NOT NULL, -- spedizione, energia, SPID, PEC, etc.
  client_name VARCHAR(100) NOT NULL,
  client_email VARCHAR(100),
  client_phone VARCHAR(20),
  amount DECIMAL(10,2) NOT NULL,
  commission DECIMAL(10,2) NOT NULL,
  status VARCHAR(20) DEFAULT 'pending', -- pending, completed, cancelled
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabella dei pagamenti delle commissioni
CREATE TABLE IF NOT EXISTS affiliate_payments (
  id SERIAL PRIMARY KEY,
  affiliate_id INTEGER NOT NULL REFERENCES affiliates(id),
  amount DECIMAL(10,2) NOT NULL,
  payment_date TIMESTAMP NOT NULL,
  payment_method VARCHAR(50) NOT NULL,
  reference_number VARCHAR(100),
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabella delle notifiche per gli affiliati
CREATE TABLE IF NOT EXISTS affiliate_notifications (
  id SERIAL PRIMARY KEY,
  affiliate_id INTEGER NOT NULL REFERENCES affiliates(id),
  title VARCHAR(100) NOT NULL,
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indici per migliorare le prestazioni
CREATE INDEX IF NOT EXISTS idx_affiliate_sales_affiliate_id ON affiliate_sales(affiliate_id);
CREATE INDEX IF NOT EXISTS idx_affiliate_sales_created_at ON affiliate_sales(created_at);
CREATE INDEX IF NOT EXISTS idx_affiliate_payments_affiliate_id ON affiliate_payments(affiliate_id);
CREATE INDEX IF NOT EXISTS idx_affiliate_notifications_affiliate_id ON affiliate_notifications(affiliate_id);

-- Inserimento di dati di esempio per test
INSERT INTO affiliates (name, email, phone, password, address, city, postal_code, status, commission_rate) VALUES
('Mario Rossi', 'mario.rossi@example.com', '3331234567', 'password', 'Via Roma 123', 'Milano', '20100', 'active', 12.50),
('Giulia Bianchi', 'giulia.bianchi@example.com', '3339876543', '$2b$10$X7VB5WhPCM4dK5dJLOAXAOH8yeKT3IoQCFqd8mRdQNlxFH4uGbDgC', 'Via Napoli 45', 'Roma', '00100', 'active', 10.00),
('Luca Verdi', 'luca.verdi@example.com', '3351122334', '$2b$10$X7VB5WhPCM4dK5dJLOAXAOH8yeKT3IoQCFqd8mRdQNlxFH4uGbDgC', 'Corso Italia 78', 'Torino', '10100', 'pending', 10.00);

-- Nota: Le password sono hash di esempio (in questo caso tutti 'password123')
-- In produzione, generare hash sicuri per ogni password

-- Comando per eseguire questo script:
-- psql -h ep-lingering-surf-a27qov03.eu-central-1.aws.neon.tech -U neondb_owner -d neondb -f db-affiliate-init.sql