-- Inizializzazione della tabella per i messaggi di contatto

-- Tabella dei messaggi di contatto
CREATE TABLE IF NOT EXISTS contact_messages (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  message TEXT NOT NULL,
  status VARCHAR(20) DEFAULT 'new', -- new, read, replied, archived
  admin_notes TEXT,
  reply_message TEXT,
  reply_date TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indice per migliorare le prestazioni delle query
CREATE INDEX IF NOT EXISTS idx_contact_messages_status ON contact_messages(status);
CREATE INDEX IF NOT EXISTS idx_contact_messages_created_at ON contact_messages(created_at);

-- Inserimento di dati di esempio per test
INSERT INTO contact_messages (name, email, phone, message, status) VALUES
('Marco Bianchi', 'marco.bianchi@example.com', '3331234567', 'Vorrei avere maggiori informazioni sui servizi di spedizione internazionale.', 'new'),
('Laura Verdi', 'laura.verdi@example.com', '3339876543', 'Sono interessata ad aprire un punto VeryPosta nella mia città. Potete contattarmi per un colloquio?', 'read'),
('Giovanni Rossi', 'giovanni.rossi@example.com', '3351122334', 'Ho bisogno di assistenza per un problema con una spedizione recente. Il numero di tracking è VP12345678IT.', 'replied');

-- Comando per eseguire questo script:
-- psql -h ep-lingering-surf-a27qov03.eu-central-1.aws.neon.tech -U neondb_owner -d neondb -f db-contact-init.sql