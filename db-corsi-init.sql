-- Inizializzazione tabella per i progressi nei corsi

-- Tabella per tracciare i progressi degli utenti nei corsi
CREATE TABLE IF NOT EXISTS corsi_progresso (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL,
  corso_id INTEGER NOT NULL,
  moduli_completati JSONB DEFAULT '{}',
  data_inizio TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  ultimo_aggiornamento TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  completato BOOLEAN DEFAULT FALSE,
  UNIQUE(user_id, corso_id)
);

-- Indici per migliorare le performance delle query
CREATE INDEX IF NOT EXISTS idx_corsi_progresso_user_id ON corsi_progresso(user_id);
CREATE INDEX IF NOT EXISTS idx_corsi_progresso_corso_id ON corsi_progresso(corso_id);

-- Commenti per documentare la struttura
COMMENT ON TABLE corsi_progresso IS 'Traccia i progressi degli utenti nei corsi di formazione';
COMMENT ON COLUMN corsi_progresso.user_id IS 'ID dell''utente';
COMMENT ON COLUMN corsi_progresso.corso_id IS 'ID del corso';
COMMENT ON COLUMN corsi_progresso.moduli_completati IS 'JSON con i dettagli dei moduli completati e risultati dei quiz';
COMMENT ON COLUMN corsi_progresso.data_inizio IS 'Data di inizio del corso';
COMMENT ON COLUMN corsi_progresso.ultimo_aggiornamento IS 'Data dell''ultimo aggiornamento del progresso';
COMMENT ON COLUMN corsi_progresso.completato IS 'Indica se il corso è stato completato interamente';