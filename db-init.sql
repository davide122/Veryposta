-- Inizializzazione del database per VeryPosta

-- Creazione della tabella posts
CREATE TABLE IF NOT EXISTS posts (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  author VARCHAR(100) DEFAULT 'Anonimo',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Inserimento di alcuni post di esempio
INSERT INTO posts (title, content, author, created_at) VALUES
('Benvenuti in VeryPosta', 'Siamo lieti di annunciare il lancio del nostro nuovo sito web. Restate sintonizzati per aggiornamenti e novità!', 'Admin VeryPosta', CURRENT_TIMESTAMP),
('Come aprire un punto VeryPosta', 'Scopri come puoi diventare un affiliato VeryPosta con un investimento minimo e massimo supporto. Contattaci oggi stesso per maggiori informazioni.', 'Team Franchising', CURRENT_TIMESTAMP),
('Nuovi servizi disponibili', 'Abbiamo aggiunto nuovi servizi alla nostra offerta: SPID, firma digitale e consulenza energetica. Visita il punto VeryPosta più vicino per saperne di più.', 'Ufficio Servizi', CURRENT_TIMESTAMP);

-- Creazione di un indice per migliorare le prestazioni delle query
CREATE INDEX IF NOT EXISTS idx_posts_created_at ON posts(created_at);

-- Nota: Eseguire questo script sul database Neon per inizializzare la struttura
-- Comando: psql -h ep-lingering-surf-a27qov03.eu-central-1.aws.neon.tech -U neondb_owner -d neondb -f db-init.sql