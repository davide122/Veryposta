import { Pool } from 'pg';

/**
 * Configurazione del pool di connessione al database PostgreSQL su Neon
 * Utilizza le variabili d'ambiente per la connessione sicura
 */
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

/**
 * Esegue una query sul database e restituisce i risultati
 * @param {string} text - Query SQL da eseguire
 * @param {Array} params - Parametri per la query (opzionale)
 * @returns {Promise<Object>} - Risultato della query
 */
export async function query(text, params) {
  const client = await pool.connect();
  try {
    const result = await client.query(text, params);
    return result;
  } finally {
    client.release();
  }
}

/**
 * Ottiene tutti i record da una tabella specificata
 * @param {string} table - Nome della tabella
 * @returns {Promise<Array>} - Array di record
 */
export async function getAll(table) {
  const { rows } = await query(`SELECT * FROM ${table}`);
  return rows;
}

/**
 * Ottiene un record specifico da una tabella in base all'ID
 * @param {string} table - Nome della tabella
 * @param {number|string} id - ID del record da ottenere
 * @returns {Promise<Object>} - Record trovato o null
 */
export async function getById(table, id) {
  const { rows } = await query(`SELECT * FROM ${table} WHERE id = $1`, [id]);
  return rows[0] || null;
}

/**
 * Inserisce un nuovo record in una tabella
 * @param {string} table - Nome della tabella
 * @param {Object} data - Dati da inserire
 * @returns {Promise<Object>} - Record inserito
 */
export async function insert(table, data) {
  const keys = Object.keys(data);
  const values = Object.values(data);
  const placeholders = keys.map((_, i) => `$${i + 1}`).join(', ');
  const columns = keys.join(', ');
  
  const { rows } = await query(
    `INSERT INTO ${table} (${columns}) VALUES (${placeholders}) RETURNING *`,
    values
  );
  
  return rows[0];
}

/**
 * Aggiorna un record esistente in una tabella
 * @param {string} table - Nome della tabella
 * @param {number|string} id - ID del record da aggiornare
 * @param {Object} data - Dati da aggiornare
 * @returns {Promise<Object>} - Record aggiornato
 */
export async function update(table, id, data) {
  const keys = Object.keys(data);
  const values = Object.values(data);
  
  const setClause = keys.map((key, i) => `${key} = $${i + 1}`).join(', ');
  
  const { rows } = await query(
    `UPDATE ${table} SET ${setClause} WHERE id = $${keys.length + 1} RETURNING *`,
    [...values, id]
  );
  
  return rows[0];
}

/**
 * Elimina un record da una tabella
 * @param {string} table - Nome della tabella
 * @param {number|string} id - ID del record da eliminare
 * @returns {Promise<boolean>} - true se eliminato con successo
 */
export async function remove(table, id) {
  const result = await query(`DELETE FROM ${table} WHERE id = $1`, [id]);
  return result.rowCount > 0;
}

export default pool;