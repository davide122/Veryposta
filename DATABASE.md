# Configurazione Database Neon per VeryPosta

Questo documento descrive come è stata configurata la connessione al database PostgreSQL su Neon per il progetto VeryPosta.

## Struttura Implementata

### 1. Configurazione della Connessione

La connessione al database è configurata nel file `src/app/utils/dbConfig.js` che utilizza il pacchetto `pg` per connettersi a PostgreSQL. Il file fornisce diverse funzioni utili per interagire con il database:

- `query()`: Esegue una query SQL generica
- `getAll()`: Recupera tutti i record da una tabella
- `getById()`: Recupera un record specifico tramite ID
- `insert()`: Inserisce un nuovo record
- `update()`: Aggiorna un record esistente
- `remove()`: Elimina un record

### 2. Variabili d'Ambiente

Le credenziali di connessione sono memorizzate nel file `.env` nella radice del progetto. Questo file contiene:

```
DATABASE_URL=postgres://neondb_owner:password@hostname/neondb?sslmode=require
```

### 3. API per i Post

È stata implementata un'API RESTful completa per gestire i post nel file `src/app/api/posts/route.js` con i seguenti endpoint:

- `GET /api/posts`: Recupera tutti i post
- `GET /api/posts?id=X`: Recupera un post specifico
- `POST /api/posts`: Crea un nuovo post
- `PUT /api/posts?id=X`: Aggiorna un post esistente
- `DELETE /api/posts?id=X`: Elimina un post

### 4. Pagina di Esempio

Una pagina di esempio che mostra i post è disponibile in `src/app/posts/page.js`.

## Inizializzazione del Database

Per inizializzare il database, è stato creato uno script SQL (`db-init.sql`) che crea la tabella `posts` e inserisce alcuni dati di esempio.

Per eseguire lo script:

```bash
psql -h ep-lingering-surf-a27qov03.eu-central-1.aws.neon.tech -U neondb_owner -d neondb -f db-init.sql
```

## Utilizzo

### Esempio di utilizzo in un componente

```javascript
import { getAll, getById, insert } from '@/app/utils/dbConfig';

// Recuperare tutti i post
const posts = await getAll('posts');

// Recuperare un post specifico
const post = await getById('posts', 1);

// Inserire un nuovo post
const newPost = await insert('posts', {
  title: 'Nuovo Post',
  content: 'Contenuto del post',
  author: 'Autore'
});
```

## Pacchetti Necessari

Assicurarsi di installare il pacchetto `pg` per la connessione a PostgreSQL:

```bash
npm install pg
```

## Note sulla Sicurezza

- Il file `.env` contiene informazioni sensibili e non deve essere incluso nel controllo versione
- Aggiungere `.env` al file `.gitignore`
- In produzione, utilizzare le variabili d'ambiente fornite dalla piattaforma di hosting (es. Vercel)