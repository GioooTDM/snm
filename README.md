# Documento di Progetto

- **Autore:** Giovanni Colombo
- **Matricola:** 02451A
- **Anno Accademico:** 2022/2023
- **Corso:** Programmazione Web e Mobile

## Indice

1. [Getting Started](#getting-started)
    - [Prerequisites](#prerequisites)
    - [Setup Instructions](#setup-instructions)
    - [.env.example](#envexample)
2. [Presentazione dell'Applicazione](#presentazione-dellapplicazione)
    - [Login / Register](#login--register)
    - [Home](#home)
    - [Search](#search)
    - [Profile](#profile)
    - [Settings](#settings)
    - [Playlist](#playlist)
3. [Organizzazione del Codice](#organizzazione-del-codice)
    - controllers
    - database
    - middlewares
    - public
    - routes
    - services
    - utils
    - views
        - partials
    - server.js
4. [Scelte Implementative e Parti rilevanti di codice](#scelte-implementative-e-parti-rilevanti-di-codice)

## Getting Started

### Prerequisites

- Node.js installed
- MongoDB account
- Spotify Developer account

### Setup Instructions

Follow the steps below to get this application up and running.

1. Clone the Repository: 
```bash
git clone https://github.com/GioooTDM/snm.git
```
2. Navigate to the Directory: 
```bash
cd snm
```
3. Install Dependencies: 
```bash
npm install
```
4. Set Environment Variables:
Create a `.env` file in the root directory and populate it with the necessary keys and values. You can refer to the [`.env.example`](#envexample) file for guidance.
5. Run the Project: 
```bash
npm start
```

### .env.example

```env
# MongoDB Configuration
DB_URI="your_mongodb_uri_here"

# Spotify API Configuration
CLIENT_ID="your_spotify_client_id_here"
CLIENT_SECRET="your_spotify_client_secret_here"

# JWT Secret
JWT_SECRET="your_jwt_secret_here"

#Port
PORT=80
```

## Presentazione dell'Applicazione

### Login / Register

- Controlli effettuati: 
    - Nessun campo deve essere vuoto
    - L'indirizzo Email deve essere univoco
    - Le password devono corrispondere

![Screenshot](./docs/login.png)
![Screenshot](./docs/register.png)

### Home

- Visualizzazione delle canzoni più popolari a livello globale *(con la possibilità di aggiungerle alle proprie playlists)*
- Visualizzazione degli artisti più popolari a livello globale *(con la possibilità di mettere like)*
- Visualizzazione delle ultime canzoni uscite (sia singoli che album)

![Screenshot](./docs/home.png)

### Search

#### Search: Songs

- Ricerca canzoni, con possibilità di mettere like o di aggiungerle alle playlist

![Screenshot](./docs/search_song.png)

#### Search: Albums

- Ricerca album musicali

![Screenshot](./docs/search_album.png)

#### Search: Artists

- Ricerca artisti con possibilità di mettere like; verranno visualizzati nella libreria

![Screenshot](./docs/search_artists.png)

#### Search: Playlists

- Ricerca tra tutte le playilist **pubbliche**. La ricerca si può effettuare per:
    - Nome della playlist
    - Tags della playlist (ogni tags deve iniziare con il carattere #)

![Screenshot](./docs/search_playlist.png)

#### Search: Users

- Ricerca fra tutti gli utenti del social network. La ricerca si può effettuare per:
    - Nome
    - Cognome
    - Nome e Cognome
    - Indirizzo Mail

![Screenshot](./docs/search_user.png)

### Profile

Funzionalità:
- Possibilità di cambiare la propria immagine porfilo
- Visualizzazione delle proprie playlist (sia pubbliche sia private)
- Visualizzazione delle playlist a cui si è messo like
- Possibilità di effettuare il logout


![Screenshot](./docs/personal_profile.png)


### Settings

Funzionalità:
- Modifica Nome / Cognome
- Modifica Indirizzo Mail
- Modifica Password
- Eliminazione Account
- Selezione generi musicali preferiti

![Screenshot](./docs/settings.png)

### Library

- **Liked Songs**: raccolta delle canzoni a cui l'utente ha messo mi piace.
- **Your Playlists**: //
- **Create Playlist**: titolo obbligatorio, descrizione opzionale.
- **Your Artists**: Raccolta degli artisti a cui l'utente ha messo mi piace. Per vedere il cambiamento bisogna riaggiornare la pagina (scelta voluta).

![Screenshot](./docs/library.png)

### Playlist 

- **Prospettiva Prorietario (IMG 1):**
    - Modifica Nome 
    - Modifica Tags
    - Modifica Descrizione
    - Modifica Stato (Pubblico / Privato)
    - Aggiunta e Rimozione Canzoni 
    - Eliminazione Playlist
- **Prospettiva Visitatore (IMG 2):**
    - Like alla Playlist
    - Scorciatoia per aggiungere le canzoni alle proprie playlist

![Screenshot](./docs/playlist_proprietario.png)
![Screenshot](./docs/playlist_visitatore.png)

## Organizzazione del codice

- `controllers`: contiene i controller che gestiscono la logica dell'applicazione. Ogni controller è responsabile per una specifica parte dell'app, come l'autenticazione, la gestione delle pagine, delle playlist, della ricerca e degli utenti.
- `database`: contiene i file che gestiscono la connessione con il database.
- `middlewares`: qui sono presenti tutti i middleware personalizzati utilizzati nel progetto.
- `public`: contiene tutti i file statici come CSS, Immagini e JavaScript front-end. Sono i file che saranno accessibili direttamente dai client.
- `routes`: contiene i file che definiscono le rotte dell'applicazione.
- `services`: contiene i servizi che interagiscono con il database e altre API. Ogni servizio è specializzato in un particolare tipo di operazione, come la gestione delle playlist o delle interazioni con l'API di Spotify.
- `utils`:  contiene utility e helper che possono essere utilizzati in tutto il progetto. Ad esempio, funzioni per effettuare chiamate API o per mappare dati.
- `views`: contiene i file delle view che definiscono la UI dell'applicazione. Utilizza il motore di template EJS per la generazione dinamica del contenuto.
    - `partials`: todo
- `server.js`: file di entry point dell'applicazione. Inizializza il server, configura i middleware, e imposta le rotte.

## Scelte Implementative e Parti rilevanti di codice

### Autenticazione e Autorizzazione (Cookies & JWT)

L'autenticazione è gestita attraverso JSON Web Tokens (JWT). Quando un utente si registra o effettua il login, un token JWT viene generato e inviato al client come cookie HTTP-only. Questo meccanismo aumenta la sicurezza, impedendo l'accesso al token da parte di script client-side. Il token viene poi utilizzato per autenticare le richieste successive dell'utente.

### Middleware isAuthenticated

Il middleware `isAuthenticated` ha il compito di verificare se la richiesta HTTP contiene un JWT valido. Questo viene fatto cercando il token all'interno del cookie denominato `auth_token`. Se il cookie è presente e il JWT è valido, l'ID dell'utente viene estratto dal token e aggiunto all'oggetto `req` come `req.userId`, permettendo ai middleware o ai route handler successivi di utilizzare questa informazione. 
Se il token è invalido o scaduto, reindirizza l'utente all'endpoint `/login`.

### Middleware ownershipVerifier

Il middleware `ownershipVerifier` è progettato per assicurare che solo il legittimo proprietario di una playlist possa modificarla. 

Confronta l'ID del creatore della playlist (`playlist.createdBy`) con l'ID dell'utente autenticato (`req.userId`), impostato dal middleware isAuthenticated.

Se gli ID coincidono, si presume che l'utente sia il legittimo proprietario della playlist, e quindi la richiesta viene inoltrata al middleware o al route handler successivo per ulteriori elaborazioni.

In caso contrario, cioè se gli ID non coincidono, il middleware interrompe immediatamente la richiesta e risponde con uno status HTTP 403 (Vietato). Questa risposta informa il client che l'utente non ha i diritti necessari per modificare la playlist in questione.

### Gestione delle Pagine (EJS e Partials)

Il progetto fa uso di Embedded JavaScript (EJS) come motore di templating per facilitare la creazione di pagine HTML dinamiche. EJS offre un meccanismo flessibile per iniettare dati variabili direttamente nel codice HTML, permettendo così di personalizzare l'interfaccia utente in base al contesto.

Un punto di forza di EJS è la sua capacità di utilizzare i "partials", che sono frammenti di codice HTML riutilizzabili. Questa funzionalità è particolarmente utile per elementi che compaiono in più pagine del sito, come l'header e la barra di navigazione laterale. L'utilizzo dei partials rende il codice più pulito e manutenibile, semplificando anche l'aggiornamento degli elementi comuni su tutte le pagine, poiché le modifiche a un partial si riflettono automaticamente su tutte le pagine che lo includono.

Grazie a questa combinazione di EJS e partials, il progetto raggiunge un alto livello di modularità, facilitando sia lo sviluppo che la manutenzione.

### Ricerca e Debounce

La funzione debounce è utilizzata nella ricerca per limitare il numero di richieste effettuate all'API di Spotify. Questo migliora le prestazioni e riduce il carico sul server.

### Chiamata Spotify API

Il progetto sfrutta le API di Spotify per acquisire dati come tracce musicali, album e artisti. La maggior parte delle chiamate all'API di Spotify sono coordinate tramite il modulo `spotifyService`. Questo modulo, a sua volta, si appoggia su un modulo di utility, `fetchWrapper`, che si occupa della gestione del token di accesso per autenticare le richieste.

#### Gestione del Token di Accesso

Un aspetto critico dell'interazione con le API di Spotify è la scadenza del token di accesso. Ogni token ha una vita limitata e deve essere rinnovato una volta scaduto. Il modulo fetchWrapper si occupa di questa problematica in due modi:

1. **Memorizzazione del Token e della sua Scadenza:** Quando un token viene ottenuto, viene memorizzato insieme al suo timestamp di scadenza. Questo consente di sapere quando il token diventerà inutilizzabile.

```js
let token = null;
let tokenExpiration = null;
```

2. **Verifica della Validità del Token:** Prima di ogni chiamata API, il modulo verifica se il token corrente è ancora valido. Se il token è scaduto o non esiste, ne richiede uno nuovo.

```js
if (!token || Date.now() > tokenExpiration) {
    await fetchToken();
}
```

Grazie a questa architettura, la logica di autenticazione e rinnovo del token è incapsulata all'interno del modulo `fetchWrapper` rendendo il codice più pulito.

### Middleware Personalizzati

Il progetto utilizza vari middleware personalizzati per funzionalità come la verifica dell'ownership delle playlist (ownershipVerifier.js) e il recupero delle informazioni dell'utente (getUserInfo.js).

### Filtraggio dei dati provenienti dalle API

### Database 

Il progetto utilizza MongoDB come database, gestito attraverso il modulo connection.js. Una singola connessione viene riutilizzata in tutto il progetto. Le password degli utenti sono criptate prima di essere memorizzate nel database.

### Salvataggio Immagini nel DB

## Conclusioni e Lavori Futuri