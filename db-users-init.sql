-- Inizializzazione della tabella per gli utenti (admin e staff)

-- Tabella degli utenti
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  role VARCHAR(20) NOT NULL, -- admin, staff
  department VARCHAR(50),
  permissions JSONB DEFAULT '{}',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indici per migliorare le prestazioni
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);

-- Inserimento di utenti di esempio (password: 'password123' con hash bcrypt)
INSERT INTO users (name, email, password, role, permissions) VALUES
('Admin User', 'admin@example.com', '$2b$10$X7VB5WhPCM4dK5dJLOAXAOH8yeKT3IoQCFqd8mRdQNlxFH4uGbDgC', 'admin', '{"full_access": true}'),
('Staff Member', 'staff@example.com', '$2b$10$X7VB5WhPCM4dK5dJLOAXAOH8yeKT3IoQCFqd8mRdQNlxFH4uGbDgC', 'staff', '{"support_access": true}');

-- Nota: Le password sono hash di esempio (in questo caso tutti 'password123')
-- In produzione, generare hash sicuri per ogni password

-- Comando per eseguire questo script:
-- psql -h ep-lingering-surf-a27qov03.eu-central-1.aws.neon.tech -U neondb_owner -d neondb -f db-users-init.sql